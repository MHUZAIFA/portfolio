import * as THREE from "three";
import { isLand } from "@/lib/land-mask";
import { DETAIL_TILES, isDetailLand } from "@/lib/land-detail";
import { clusterStops, type Cluster, type RouteStop } from "./route";

/**
 * Dotted-earth globe flying a multi-stop route. Stops close together (e.g. Mumbai → Thane → Airoli)
 * form a region: the camera dives in to watch the local hops over a high-res coastline, then pulls
 * back out to the whole globe for long hauls. Vanilla three.js; the React wrapper only mounts it.
 */

export type Airport = { code: string; city: string; lat: number; lon: number };

export type Telemetry = {
  phase: "boarding" | "climb" | "cruise" | "descent" | "layover" | "arrived";
  /** Stop the plane is at or heading to. */
  nextStop: number;
  /** 0..1 across the whole route (by distance). */
  progress: number;
  distanceToNextKm: number;
  altitudeFt: number;
  groundSpeedKt: number;
};

export type FlightSceneOptions = {
  /** Route in order; needs at least two stops to fly. */
  stops: RouteStop[];
  clusters?: Cluster[];
  traffic?: [Airport, Airport][];
  /** Contrail / pulse colour. */
  accent?: number;
  reducedMotion: boolean;
  onTelemetry?: (t: Telemetry) => void;
  /** Font for airport labels (defaults to the container's computed font). */
  labelFont?: string;
};

const EARTH_KM = 6371;
const FOV = 32;
const TAN_HALF = Math.tan(((FOV / 2) * Math.PI) / 180);
const GLOBAL_H = 3.1; // camera height above the surface for the whole-globe view
const BOARDING = 1.0;
const LAYOVER = 0.8;
const ZOOM = 1.8; // dive in / pull back
const ARRIVED_HOLD = 2.5;
const FADE = 1.0;
/** After a manual spin, wait this long without input before following the plane again. */
const IDLE_RESUME_MS = 5000;
const RESUME_BLEND = 1.6; // s to ease from the manual orientation back to auto-follow

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/**
 * Exponential ease-in-out that starts and ends at exactly 0 / 1 with zero velocity.
 * Distance grows geometrically, so a plane leaving a city creeps across the street-level view,
 * then accelerates smoothly to intercontinental speed (and mirrors that on arrival).
 */
const EXPO_K = 10;
const EXPO_A = Math.pow(2, -EXPO_K);
const easeInOutExpo = (t: number): number =>
  t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? (Math.pow(2, EXPO_K * (2 * t - 1)) - EXPO_A) / (2 * (1 - EXPO_A)) : 1 - easeInOutExpo(1 - t);
/** How fast the camera pulls back relative to the distance flown (>1 reaches the globe view sooner). */
const PULLBACK_GAMMA = 1.4;
/** Where the plane sits (fraction of the half-view) when the camera starts pulling back. */
const BOUNDARY = 0.72;

export function latLonToVec3(lat: number, lon: number, r = 1) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

/** Great-circle arc lifted off the surface proportionally to its length. `scale` shrinks the offsets for zoomed-in regions. */
function arcCurve(a: THREE.Vector3, b: THREE.Vector3, liftScale = 0.32, scale = 1) {
  const angle = a.angleTo(b);
  const lift = liftScale * (angle / Math.PI) + (scale < 1 ? angle * 0.12 : 0);
  const pts: THREE.Vector3[] = [];
  const qa = new THREE.Quaternion();
  const qb = new THREE.Quaternion().setFromUnitVectors(a.clone().normalize(), b.clone().normalize());
  const n = 96;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = a.clone().normalize().applyQuaternion(qa.clone().slerp(qb, t));
    const ends = Math.min(1, t / 0.03, (1 - t) / 0.03); // taper the hover offset to 0 at each airport
    pts.push(p.multiplyScalar(1 + 0.004 * scale * (scale < 1 ? 1 : ends) + lift * Math.sin(Math.PI * t)));
  }
  return { curve: new THREE.CatmullRomCurve3(pts), angle };
}

function pointsGeometry(positions: number[], edges?: number[]) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("aRand", new THREE.Float32BufferAttribute(positions.filter((_, i) => i % 3 === 0).map(() => Math.random()), 1));
  // 0 at a tile border → 1 inside; lets the hi-res patch blend into the globe instead of ending in a hard rectangle.
  g.setAttribute("aEdge", new THREE.Float32BufferAttribute(edges ?? positions.filter((_, i) => i % 3 === 0).map(() => 1), 1));
  return g;
}

function buildDots(step: number) {
  const positions: number[] = [];
  for (let lat = -84; lat <= 84; lat += step) {
    const ring = Math.max(1, Math.round((360 * Math.cos((lat * Math.PI) / 180)) / step));
    for (let i = 0; i < ring; i++) {
      const lon = -180 + (i / ring) * 360;
      if (!isLand(lat, lon)) continue;
      const v = latLonToVec3(lat, lon, 1.001);
      positions.push(v.x, v.y, v.z);
    }
  }
  return pointsGeometry(positions);
}

/** Coastline dots for regions we zoom into, at one resolution level. */
function buildDetailDots(level: "detail" | "mid") {
  const positions: number[] = [];
  const edges: number[] = [];
  for (const tile of DETAIL_TILES) {
    if (tile.level !== level) continue;
    for (let r = 0; r < tile.rows; r++) {
      for (let c = 0; c < tile.cols; c++) {
        if (!isDetailLand(tile, r, c)) continue;
        const lat = tile.north - (r + 0.5) * tile.step;
        const lon = tile.west + (c + 0.5) * tile.step;
        const v = latLonToVec3(lat, lon, 1.0002);
        positions.push(v.x, v.y, v.z);
        edges.push(Math.min(r, c, tile.rows - 1 - r, tile.cols - 1 - c) / (Math.min(tile.rows, tile.cols) * 0.5));
      }
    }
  }
  return pointsGeometry(positions, edges);
}

/** Flat outline in the XZ plane (x = span, z = forward), extruded `thickness` downward. */
function planform(points: [number, number][], thickness: number) {
  const shape = new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, z)));
  const g = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  g.rotateX(Math.PI / 2); // shape y → +Z (forward), extrusion → -Y
  return g;
}

/**
 * Boeing 777-300ER-style twinjet (generic white/grey finish, no airline livery). Nose along +Z, up +Y.
 * Proportions follow the real aircraft: long stretched fuselage (≈74 m), 65 m span with raked
 * wingtips and ~31° sweep, two very large GE90 nacelles, tall swept fin.
 */
function buildPlane() {
  const group = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0.38 });
  const grey = new THREE.MeshStandardMaterial({ color: 0xcfd4dc, metalness: 0.35, roughness: 0.45 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1c1f26, metalness: 0.2, roughness: 0.6 });
  const metal = new THREE.MeshStandardMaterial({ color: 0xe6e8ec, metalness: 0.6, roughness: 0.3 });

  // Fuselage: lathed profile (tail → nose), rotated so the axis runs along Z.
  const profile: [number, number][] = [
    [0, -0.0455], [0.0007, -0.0448], [0.0017, -0.0415], [0.0029, -0.0355], [0.0038, -0.028],
    [0.0041, -0.022], [0.0041, 0.031], [0.0039, 0.0365], [0.0034, 0.0405], [0.0025, 0.0435],
    [0.0013, 0.0452], [0, 0.0458],
  ];
  const fuselage = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 28);
  fuselage.rotateX(Math.PI / 2);
  group.add(new THREE.Mesh(fuselage, white));

  // Cockpit windshield band
  const windshield = new THREE.Mesh(new THREE.SphereGeometry(0.0034, 16, 8, -0.9, 1.8, 0.95, 0.38), dark);
  windshield.rotation.x = -Math.PI / 2;
  windshield.position.set(0, 0.0003, 0.0388);
  windshield.scale.set(1, 1, 1.35);
  group.add(windshield);

  // Wing-to-body fairing
  const fairing = new THREE.Mesh(new THREE.SphereGeometry(0.0042, 16, 10), grey);
  fairing.scale.set(1.05, 0.55, 4.2);
  fairing.position.set(0, -0.0024, 0.0005);
  group.add(fairing);

  // Wings: swept, cranked trailing edge, raked tips; slight dihedral.
  const wingPts = (s: number): [number, number][] =>
    [
      [0.002, 0.0115], [0.0405, -0.0145], [0.0442, -0.0205], [0.0447, -0.0228], [0.0395, -0.0198],
      [0.0145, -0.0075], [0.002, -0.0105],
    ].map(([x, z]) => [x * s, z] as [number, number]);
  for (const side of [1, -1]) {
    const g = planform(side > 0 ? wingPts(1) : wingPts(-1).reverse(), 0.0009);
    g.rotateZ(side * 0.1); // dihedral
    const wing = new THREE.Mesh(g, grey);
    wing.position.y = -0.0021;
    group.add(wing);
  }

  // GE90-class engines: huge nacelles slung forward of the wing on pylons.
  for (const side of [1, -1]) {
    const x = side * 0.0138;
    const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.0033, 0.0026, 0.0135, 20, 1, false), metal);
    nacelle.rotation.x = Math.PI / 2;
    nacelle.position.set(x, -0.0058, 0.0095);
    group.add(nacelle);
    const intake = new THREE.Mesh(new THREE.CircleGeometry(0.0028, 20), dark);
    intake.position.set(x, -0.0058, 0.0163);
    group.add(intake);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.0031, 0.00035, 6, 20), grey);
    lip.position.set(x, -0.0058, 0.0162);
    group.add(lip);
    const exhaust = new THREE.Mesh(new THREE.ConeGeometry(0.0016, 0.004, 12), dark);
    exhaust.rotation.x = -Math.PI / 2;
    exhaust.position.set(x, -0.0058, 0.0014);
    group.add(exhaust);
    const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.0007, 0.0028, 0.011), grey);
    pylon.position.set(x, -0.0035, 0.0065);
    group.add(pylon);
  }

  // Horizontal stabilisers
  const stabPts: [number, number][] = [[0.0015, -0.0315], [0.0158, -0.0405], [0.0163, -0.0445], [0.0015, -0.0412]];
  for (const side of [1, -1]) {
    const pts = stabPts.map(([x, z]) => [x * side, z] as [number, number]);
    const g = planform(side > 0 ? pts : pts.reverse(), 0.0006);
    g.rotateZ(side * 0.08);
    const stab = new THREE.Mesh(g, grey);
    stab.position.y = 0.0009;
    group.add(stab);
  }

  // Vertical fin: tall, swept; outline in (z, y), thickness along X.
  const finShape = new THREE.Shape(
    ([[-0.0245, 0.0028], [-0.0388, 0.0188], [-0.0448, 0.0192], [-0.0438, 0.0032]] as [number, number][]).map(
      ([z, y]) => new THREE.Vector2(z, y),
    ),
  );
  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.0007, bevelEnabled: false });
  finGeo.rotateY(-Math.PI / 2); // shape x → +Z
  finGeo.translate(0.00035, 0, 0);
  group.add(new THREE.Mesh(finGeo, white));

  return group;
}

/**
 * Airport tag drawn into the scene (not HTML) so the plane can fly over it: a canvas-texture sprite
 * that always faces the camera at a constant pixel size.
 */
function makeLabel(title: string, years: string, details: string[], font: string) {
  const S = 2; // supersampling for crisp text on retina
  const padX = 8;
  const padY = 6;
  const LINE = 13; // detail line height
  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace';
  const titleFont = `600 ${12 * S}px ${font}`;
  const yearsFont = `${10 * S}px ${mono}`;
  const detailFont = `${10 * S}px ${font}`;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = titleFont;
  const tw = ctx.measureText(title).width;
  ctx.font = yearsFont;
  const yw = ctx.measureText(years).width;
  ctx.font = detailFont;
  const dw = Math.max(0, ...details.map((d) => ctx.measureText(d).width));
  canvas.width = Math.ceil(Math.max(tw + 6 * S + yw, dw) + padX * 2 * S);
  canvas.height = Math.ceil((padY * 2 + 14 + LINE * details.length) * S);

  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = S;
  ctx.beginPath();
  ctx.roundRect(S / 2, S / 2, canvas.width - S, canvas.height - S, 6 * S);
  ctx.fill();
  ctx.stroke();
  ctx.textBaseline = "alphabetic";
  ctx.font = titleFont;
  ctx.fillStyle = "#fff";
  ctx.fillText(title, padX * S, (padY + 11) * S);
  ctx.font = yearsFont;
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.fillText(years, padX * S + tw + 6 * S, (padY + 11) * S);
  ctx.font = detailFont;
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  details.forEach((d, i) => ctx.fillText(d, padX * S, (padY + 24 + LINE * i) * S));

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.generateMipmaps = false;
  map.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map, transparent: true, depthTest: false, depthWrite: false, sizeAttenuation: false, opacity: 0 });
  const sprite = new THREE.Sprite(mat);
  sprite.renderOrder = 10; // above the globe, below the plane
  return { sprite, mat, wPx: canvas.width / S, hPx: canvas.height / S };
}

function makeRing(color: number, inner: number, outer: number, opacity: number) {
  return new THREE.Mesh(
    new THREE.RingGeometry(inner, outer, 48),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false }),
  );
}

/** Rotation that brings `dir` to face the camera (+Z) at `elevation` above centre, keeping north up (no roll). */
function quatFacing(dir: THREE.Vector3, elevation: number) {
  const yaw = Math.atan2(dir.x, dir.z);
  const afterYaw = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -yaw);
  const el = Math.atan2(afterYaw.y, afterYaw.z);
  return new THREE.Quaternion()
    .setFromAxisAngle(new THREE.Vector3(1, 0, 0), el - elevation)
    .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -yaw));
}

type View = { quat: THREE.Quaternion; h: number };

type Segment = { start: number; end: number } & (
  | { kind: "intro"; from: View; to: View }
  | { kind: "board"; stop: number }
  | { kind: "fly"; leg: number }
  | { kind: "layover"; stop: number }
  | { kind: "arrived"; stop: number }
  | { kind: "fade"; stop: number }
);
type SegmentInput = Segment extends infer S ? (S extends Segment ? Omit<S, "start" | "end"> : never) : never;

export function createFlightScene(container: HTMLElement, opts: FlightSceneOptions) {
  const { stops, reducedMotion } = opts;
  const clusters = opts.clusters ?? clusterStops(stops);
  const stopCluster = stops.map((_, i) => clusters.findIndex((c) => c.stops.includes(i)));
  const accent = opts.accent ?? 0xc7d2fe;
  const accentColor = new THREE.Color(accent);
  const isSmall = container.clientWidth < 520;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  container.appendChild(renderer.domElement);
  const pr = renderer.getPixelRatio();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
  camera.position.set(0, 0, 1 + GLOBAL_H);

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(2, 3, 4);
  scene.add(sun);

  const globe = new THREE.Group();
  scene.add(globe);

  // Occluder: hides back-hemisphere dots and gives the planet a body.
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(0.995, 96, 96), new THREE.MeshBasicMaterial({ color: 0x050507 })));

  const dotVertex = /* glsl */ `
    uniform float uSize; uniform float uPixelRatio; uniform float uFixed;
    attribute float aRand; attribute float aEdge;
    varying float vFacing; varying float vRand; varying float vEdge;
    void main() {
      vEdge = aEdge;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vec3 n = normalize(normalMatrix * normalize(position));
      vFacing = dot(n, normalize(-mv.xyz));
      vRand = aRand;
      float s = mix(uSize * (4.0 / -mv.z), uSize, uFixed);
      gl_PointSize = min(s, 3.6) * uPixelRatio;
      gl_Position = projectionMatrix * mv;
    }`;
  const dotFragment = /* glsl */ `
    uniform float uTime; uniform vec3 uColor; uniform float uFade;
    varying float vFacing; varying float vRand; varying float vEdge;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float edge = smoothstep(0.5, 0.25, d);
      float limb = smoothstep(0.0, 0.55, vFacing);
      float twinkle = 0.82 + 0.18 * sin(uTime * 1.3 + vRand * 6.2831);
      gl_FragColor = vec4(uColor, edge * (0.08 + 0.72 * limb) * twinkle * uFade * smoothstep(0.0, 0.45, vEdge));
    }`;
  const dotMaterial = (size: number, fixed: boolean) =>
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: size },
        uFixed: { value: fixed ? 1 : 0 },
        uFade: { value: 1 },
        uPixelRatio: { value: pr },
        uColor: { value: new THREE.Color(0xe5e7eb) },
      },
      vertexShader: dotVertex,
      fragmentShader: dotFragment,
    });

  // Whole-earth dots (fade out when diving in) + high-res regional dots (fade in).
  const dotMat = dotMaterial(isSmall ? 2.1 : 2.4, false);
  globe.add(new THREE.Points(buildDots(isSmall ? 1.7 : 1.15), dotMat));
  const detailMat = dotMaterial(isSmall ? 2.2 : 2.6, true);
  detailMat.uniforms.uFade.value = 0;
  const detailDots = new THREE.Points(buildDetailDots("detail"), detailMat);
  globe.add(detailDots);
  const midMat = dotMaterial(isSmall ? 2.0 : 2.3, true);
  midMat.uniforms.uFade.value = 0;
  const midDots = new THREE.Points(buildDetailDots("mid"), midMat);
  globe.add(midDots);

  // Atmosphere rim
  const atmoMat = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: { uColor: { value: new THREE.Color(0xc4cbe8) }, uFade: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      void main() { vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uFade; varying vec3 vN;
      void main() { float i = pow(max(0.0, 0.6 - dot(vN, vec3(0.0, 0.0, 1.0))), 3.0); gl_FragColor = vec4(uColor, 1.0) * i * 0.8 * uFade; }`,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.12, 64, 64), atmoMat));

  // ---- Views ----------------------------------------------------------------
  const stopVecs = stops.map((s) => latLonToVec3(s.lat, s.lon));
  const clusterViews: (View | null)[] = clusters.map((c) =>
    c.stops.length > 1
      ? {
          quat: quatFacing(latLonToVec3(c.lat, c.lon).normalize(), 0),
          // Frame the region with margin; never closer than ~14 km half-height.
          h: Math.max(c.extentKm * 1.9, 14) / EARTH_KM / TAN_HALF,
        }
      : null,
  );

  // ---- Route legs -----------------------------------------------------------
  const legs = stopVecs.slice(1).map((b, i) => {
    const local = stopCluster[i] === stopCluster[i + 1] && clusterViews[stopCluster[i]] !== null;
    const z = local ? clusterViews[stopCluster[i]]!.h / GLOBAL_H : 1;
    const { curve, angle } = arcCurve(stopVecs[i], b, 0.32, z);

    const planned = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(200)),
      new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.018 * z, gapSize: 0.014 * z, transparent: true, opacity: 0.25 }),
    );
    planned.computeLineDistances();
    globe.add(planned);

    // Contrail: drawn up to the plane, fading toward the tail.
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uHead: { value: 0 }, uFade: { value: 1 }, uAccent: { value: accentColor } },
      vertexShader: /* glsl */ `
        varying float vU;
        void main() { vU = uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uHead; uniform float uFade; uniform vec3 uAccent; varying float vU;
        void main() {
          if (vU > uHead) discard;
          float tail = smoothstep(uHead - 0.45, uHead, vU);
          vec3 col = mix(uAccent, vec3(1.0), tail * 0.7);
          gl_FragColor = vec4(col, (0.35 + 0.65 * tail) * uFade);
        }`,
    });
    globe.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 220, (isSmall ? 0.0048 : 0.0038) * z, 8, false), mat));

    // Long hauls that start/end inside a zoomed region fly out of (into) it with the camera.
    const depView = local ? null : clusterViews[stopCluster[i]];
    const arrView = local ? null : clusterViews[stopCluster[i + 1]];
    const regional = !!(depView || arrView);
    const duration = local ? 2.2 : regional ? 10 : Math.min(7.5, Math.max(2.5, (angle / Math.PI) * 14));
    return { curve, angle, km: angle * EARTH_KM, mat, duration, local, z, depView, arrView, regional };
  });
  const totalKm = legs.reduce((s, l) => s + l.km, 0);

  // Whole-route framing for the global view.
  const focus = new THREE.Vector3();
  if (legs.length) legs.forEach((l) => focus.addScaledVector(l.curve.getPoint(0.5).normalize(), l.angle + 1e-4));
  else stopVecs.forEach((v) => focus.add(v));
  // Globe view follows the plane: `quat` is re-aimed at the plane every frame (smoothed).
  const GLOBAL: View = { quat: quatFacing(focus.normalize(), 0.08), h: GLOBAL_H };
  let followReady = false;
  const viewAtStop = (i: number) => clusterViews[stopCluster[i]] ?? GLOBAL;

  // ---- Timeline -------------------------------------------------------------
  // [dive in] → board → (hop | pull back → long haul → [dive in]) … → arrived → fade → loop
  const segments: Segment[] = [];
  let clock = 0;
  const push = (seg: SegmentInput, dur: number) => {
    segments.push({ ...seg, start: clock, end: clock + dur } as Segment);
    clock += dur;
  };
  if (stops.length && viewAtStop(0) !== GLOBAL) push({ kind: "intro", from: GLOBAL, to: viewAtStop(0) }, ZOOM);
  push({ kind: "board", stop: 0 }, BOARDING);
  legs.forEach((leg, i) => {
    push({ kind: "fly", leg: i }, leg.duration);
    if (i < legs.length - 1) push({ kind: "layover", stop: i + 1 }, LAYOVER);
  });
  push({ kind: "arrived", stop: stops.length - 1 }, ARRIVED_HOLD);
  push({ kind: "fade", stop: stops.length - 1 }, FADE);
  // Ended zoomed into a region? Pull back out so the loop can dive into the first region again.
  if (viewAtStop(stops.length - 1) !== GLOBAL) push({ kind: "intro", from: viewAtStop(stops.length - 1), to: GLOBAL }, ZOOM);
  const cycle = clock;
  const arrivalTimes = stops.map((_, i) => {
    if (i === 0) return segments.find((s) => s.kind === "board")!.start + 0.1;
    return segments.find((s) => s.kind === "fly" && s.leg === i - 1)!.end - 0.1;
  });
  const lastView = viewAtStop(stops.length - 1);

  // Background traffic: faint arcs with a light pip running along each.
  const traffic = (opts.traffic ?? []).map(([a, b], i) => {
    const { curve } = arcCurve(latLonToVec3(a.lat, a.lon), latLonToVec3(b.lat, b.lon), 0.26);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(120)),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08, depthWrite: false }),
    );
    globe.add(line);
    const pip = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }));
    globe.add(pip);
    return { curve, pip, line, offset: (i * 0.37) % 1, speed: 0.045 + ((i * 7) % 5) * 0.008 };
  });

  // Airports (scaled per frame so they keep their on-screen size at any zoom).
  const markers = stopVecs.map((v) => {
    const normal = v.clone().normalize();
    const group = new THREE.Group();
    group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    const pulse = makeRing(accent, 0.02, 0.026, 0);
    group.add(makeRing(0xffffff, 0, 0.011, 1), makeRing(0xffffff, 0.016, 0.019, 0.7), pulse);
    globe.add(group);
    return { normal, group, pulse };
  });

  const plane = buildPlane();
  // Draw the plane after the labels so it flies over them (transparent pass + higher render order).
  plane.traverse((o) => {
    o.renderOrder = 20;
    const m = (o as THREE.Mesh).material as THREE.Material | undefined;
    if (m) m.transparent = true;
  });
  globe.add(plane);

  // Airport labels: one per stop (close-ups), one per multi-stop region (globe view). Fixed beside
  // their marker — they only flip to the left if they'd run off the right edge.
  const font = opts.labelFont ?? getComputedStyle(container).fontFamily;
  const labelSprites = [
    ...stops.map((s, i) => ({
      ...makeLabel(s.city, s.years, s.companies.map((c, j) => `${c} · ${s.roles[j]?.join(" → ") ?? ""}`), font),
      anchor: stopVecs[i].clone().normalize(),
      show: (mode: "local" | "global") => mode === "local" || clusters[stopCluster[i]].stops.length === 1,
      flip: false,
    })),
    ...clusters
      .filter((c) => c.stops.length > 1)
      .map((c) => {
        const members = c.stops.map((i) => stops[i]);
        const years = `${members[0].years.split("–")[0]}–${members[members.length - 1].years.split("–")[1]}`;
        return {
          ...makeLabel(c.name, years, [members.map((m) => m.city).join(" · ")], font),
          anchor: latLonToVec3(c.lat, c.lon).normalize(),
          show: (mode: "local" | "global") => mode === "global",
          flip: false,
        };
      }),
  ];
  labelSprites.forEach((l) => globe.add(l.sprite));

  // ---- Manual spin ----------------------------------------------------------
  // Dragging takes over the globe's orientation; after IDLE_RESUME_MS without input it eases back
  // to following the plane.
  const manual = {
    dragging: false,
    quat: null as THREE.Quaternion | null, // orientation while under manual control
    lastInput: 0,
    resumeFrom: null as THREE.Quaternion | null,
    resumeStart: 0,
    x: 0,
    y: 0,
    vx: 0, // fling momentum (rad/frame)
    vy: 0,
    zoom: 1,
  };
  const el = renderer.domElement;
  el.style.cursor = "grab";
  el.style.touchAction = "pan-y";
  const spin = (dx: number, dy: number) => {
    if (!manual.quat) return;
    const k = manual.zoom; // slower when zoomed into a region
    const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx * k);
    const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy * k);
    manual.quat.premultiply(qy).premultiply(qx).normalize();
  };
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return; // keep touch scrolling native
    manual.dragging = true;
    manual.quat = globe.quaternion.clone();
    manual.resumeFrom = null;
    manual.vx = manual.vy = 0;
    manual.lastInput = performance.now();
    manual.x = e.clientX;
    manual.y = e.clientY;
    el.style.cursor = "grabbing";
    el.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!manual.dragging) return;
    const dx = (e.clientX - manual.x) * 0.006;
    const dy = (e.clientY - manual.y) * 0.006;
    manual.x = e.clientX;
    manual.y = e.clientY;
    manual.vx = dx;
    manual.vy = dy;
    manual.lastInput = performance.now();
    spin(dx, dy);
  };
  const onUp = () => {
    manual.dragging = false;
    manual.lastInput = performance.now();
    el.style.cursor = "grab";
  };
  el.addEventListener("pointerdown", onDown);
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", onUp);
  el.addEventListener("pointercancel", onUp);

  // ---- Sizing ---------------------------------------------------------------
  let width = 1;
  let height = 1;
  const resize = () => {
    width = Math.max(1, container.clientWidth);
    height = Math.max(1, container.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // sizeAttenuation=false sprites are sized in view-height units at distance 1.
    for (const l of labelSprites) l.sprite.scale.set((l.wPx / height) * 2 * TAN_HALF, (l.hPx / height) * 2 * TAN_HALF, 1);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // ---- Loop -----------------------------------------------------------------
  const pos = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const up = new THREE.Vector3();
  const right = new THREE.Vector3();
  const basis = new THREE.Matrix4();
  const camDir = new THREE.Vector3();
  const world = new THREE.Vector3();
  const viewQuat = new THREE.Quaternion();
  const planeDir = new THREE.Vector3();
  let lastFrame = performance.now();
  let raf: number | null = null;
  let running = false;
  const t0 = performance.now();
  let lastTelemetry = 0;
  // Reduced motion: a still frame mid-way through the longest leg.
  const longest = legs.reduce((best, l, i) => (l.km > legs[best].km ? i : best), 0);
  const stillT = legs.length ? segments.find((s) => s.kind === "fly" && s.leg === longest)!.start + legs[longest].duration * 0.55 : 0;

  const blend = (a: View, b: View, e: number): View => ({
    quat: viewQuat.copy(a.quat).slerp(b.quat, e),
    h: Math.exp(Math.log(a.h) + (Math.log(b.h) - Math.log(a.h)) * e),
  });

  const project = (v: THREE.Vector3) => {
    world.copy(v).applyQuaternion(globe.quaternion);
    if (world.dot(camDir) < 0.15 * (camera.position.z > 2 ? 1 : 0)) return null;
    const p = world.project(camera);
    if (p.z > 1 || Math.abs(p.x) > 1.05 || Math.abs(p.y) > 1.05) return null;
    return { x: (p.x * 0.5 + 0.5) * width, y: (-p.y * 0.5 + 0.5) * height };
  };

  const frame = (now: number) => {
    raf = null;
    // rAF timestamps can precede t0 on the first frame; never let time go negative.
    const elapsed = reducedMotion ? stillT : Math.max(0, (now - t0) / 1000);
    const t = reducedMotion ? stillT : elapsed % cycle;
    const seg = segments.find((s) => t >= s.start && t < s.end) ?? segments[segments.length - 1];
    const local = (t - seg.start) / (seg.end - seg.start);
    const dt = Math.min(0.1, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;

    // Plane pose along the route (needed first: the globe view follows it)
    const flyLeg = seg.kind === "fly" ? legs[seg.leg] : null;
    const legProgress = flyLeg ? (flyLeg.regional ? easeInOutExpo(local) : easeInOutSine(local)) : 0;
    let planeScale = 1;
    let poseLeg = 0;
    let poseP = 1e-6;
    if (seg.kind === "intro") planeScale = 0;
    else if (seg.kind === "board") planeScale = smoothstep(0, 0.6, local * BOARDING);
    else if (seg.kind === "fly") {
      poseLeg = seg.leg;
      poseP = Math.min(1 - 1e-6, Math.max(1e-6, legProgress));
    } else if (seg.stop > 0) {
      poseLeg = seg.stop - 1;
      poseP = 1 - 1e-6;
      if (seg.kind === "arrived") planeScale = 1 - smoothstep(0, 0.5, t - seg.start);
      if (seg.kind === "fade") planeScale = 0;
    }
    if (legs.length) {
      const curve = legs[poseLeg].curve;
      curve.getPoint(poseP, pos);
      curve.getTangent(poseP, tangent).normalize();
      // Auto-rotate: keep the plane near the centre of the globe view (smoothed so it glides).
      planeDir.copy(pos).normalize();
      const target = quatFacing(planeDir, 0);
      if (!followReady || reducedMotion) {
        GLOBAL.quat.copy(target);
        followReady = true;
      } else {
        GLOBAL.quat.slerp(target, 1 - Math.exp(-dt * 2.2));
      }
    }

    // Camera view for this moment
    let view: View;
    if (seg.kind === "intro") view = blend(seg.from, seg.to, easeInOutCubic(local));
    else if (flyLeg && flyLeg.regional) {
      // Camera height tracks the distance from the region the plane is leaving (or entering):
      // the plane flies to the edge of the close-up, then the globe opens out around it.
      const flown = flyLeg.km * legProgress;
      const heightFor = (v: View | null, km: number) => {
        if (!v) return { h: GLOBAL_H, k: 1 };
        const edgeKm = v.h * TAN_HALF * EARTH_KM * BOUNDARY;
        const h = km <= edgeKm ? v.h : Math.min(GLOBAL_H, v.h * Math.pow(km / edgeKm, PULLBACK_GAMMA));
        return { h, k: Math.log(h / v.h) / Math.log(GLOBAL_H / v.h) }; // k: 0 = close-up, 1 = globe
      };
      const dep = heightFor(flyLeg.depView, flown);
      const arr = heightFor(flyLeg.arrView, flyLeg.km - flown);
      const near = dep.h <= arr.h ? { v: flyLeg.depView, ...dep } : { v: flyLeg.arrView, ...arr };
      view = near.v ? { quat: viewQuat.copy(near.v.quat).slerp(GLOBAL.quat, easeInOutSine(near.k)), h: near.h } : GLOBAL;
    } else if (seg.kind === "fly") view = flyLeg!.local ? viewAtStop(seg.leg) : GLOBAL;
    else if (seg.kind === "board" || seg.kind === "layover") view = viewAtStop(seg.stop);
    else view = lastView;
    const z = view.h / GLOBAL_H; // 1 = whole globe, ≪1 = zoomed into a region

    camera.position.set(0, 0, 1 + view.h);
    camera.near = Math.max(0.0002, view.h * 0.3);
    camera.far = 2 + view.h;
    camera.updateProjectionMatrix();
    camDir.copy(camera.position).normalize();

    // Orientation: auto-follow, or the user's manual spin; resume auto after IDLE_RESUME_MS idle.
    manual.zoom = Math.max(0.02, z);
    if (manual.quat) {
      if (!manual.dragging && (Math.abs(manual.vx) > 1e-5 || Math.abs(manual.vy) > 1e-5)) {
        spin(manual.vx, manual.vy); // fling momentum
        manual.vx *= 0.92;
        manual.vy *= 0.92;
      }
      if (!manual.dragging && !manual.resumeFrom && now - manual.lastInput > IDLE_RESUME_MS) {
        manual.resumeFrom = manual.quat.clone();
        manual.resumeStart = now;
      }
      if (manual.resumeFrom) {
        const r = Math.min(1, (now - manual.resumeStart) / 1000 / RESUME_BLEND);
        globe.quaternion.copy(manual.resumeFrom).slerp(view.quat, easeInOutCubic(r));
        if (r >= 1) {
          manual.quat = null;
          manual.resumeFrom = null;
        }
      } else {
        globe.quaternion.copy(manual.quat);
      }
    } else {
      globe.quaternion.copy(view.quat);
    }

    // Layer fades by zoom
    // Three resolutions cross-fade as the camera height changes: street → regional → whole earth.
    const globalVis = smoothstep(0.07, 0.16, z);
    dotMat.uniforms.uFade.value = globalVis;
    detailMat.uniforms.uFade.value = 1 - smoothstep(0.007, 0.017, z);
    midMat.uniforms.uFade.value = smoothstep(0.0055, 0.013, z) * (1 - smoothstep(0.09, 0.2, z));
    detailDots.visible = detailMat.uniforms.uFade.value > 0.001;
    midDots.visible = midMat.uniforms.uFade.value > 0.001;
    midMat.uniforms.uTime.value = elapsed;
    atmoMat.uniforms.uFade.value = smoothstep(0.1, 0.5, z);
    dotMat.uniforms.uTime.value = elapsed;
    detailMat.uniforms.uTime.value = elapsed;
    for (const tr of traffic) {
      (tr.line.material as THREE.LineBasicMaterial).opacity = 0.08 * globalVis;
      const u = Math.min(1, Math.max(0, (elapsed * tr.speed + tr.offset) % 1));
      tr.curve.getPoint(u, tr.pip.position);
      (tr.pip.material as THREE.MeshBasicMaterial).opacity = Math.sin(Math.PI * u) * 0.7 * globalVis;
      tr.pip.scale.setScalar(Math.max(z, 0.001));
    }

    // Contrails: finished legs full, current leg up to the plane, future legs hidden.
    const fade = seg.kind === "fade" ? 1 - smoothstep(0, 1, local) : seg.kind === "intro" ? 0 : 1;
    const flyingLeg = seg.kind === "fly" ? seg.leg : -1;
    const legsDone =
      seg.kind === "fly" ? seg.leg : seg.kind === "board" || seg.kind === "intro" ? 0 : seg.stop;
    legs.forEach((l, i) => {
      l.mat.uniforms.uHead.value = i < legsDone ? 1 : i === flyingLeg ? legProgress : 0;
      // Global contrails are too thick to show while zoomed into a region.
      l.mat.uniforms.uFade.value = fade * (l.local ? 1 : smoothstep(0.4, 0.8, z));
    });

    if (legs.length) {
      up.copy(pos).normalize();
      right.crossVectors(up, tangent).normalize();
      up.crossVectors(tangent, right).normalize();
      basis.makeBasis(right, up, tangent);
      plane.quaternion.setFromRotationMatrix(basis);
      plane.position.copy(pos).addScaledVector(up, 0.012 * z);
    }
    plane.scale.setScalar(0.78 * z * Math.max(0.001, planeScale));
    plane.visible = legs.length > 0 && planeScale > 0.01;

    // Airports: constant on-screen size; pulse as the plane departs the first stop / reaches each next one.
    markers.forEach((m, i) => {
      m.group.position.copy(m.normal).multiplyScalar(1 + 0.003 * z);
      m.group.scale.setScalar(z);
      const k = (t - arrivalTimes[i]) / 1.6;
      const mat = m.pulse.material as THREE.MeshBasicMaterial;
      if (reducedMotion || k < 0 || k > 1) {
        mat.opacity = 0;
        return;
      }
      m.pulse.scale.setScalar(1 + k * 3.2);
      mat.opacity = 0.85 * (1 - k);
    });

    // Labels: individual stops in a close-up, one per region on the globe view. They fade in/out
    // but never move relative to their marker (except flipping left at the right edge).
    const mode = z < 0.1 ? "local" : "global";
    for (const l of labelSprites) {
      const p = l.show(mode) ? project(l.anchor) : null;
      l.mat.opacity += ((p ? 1 : 0) - l.mat.opacity) * Math.min(1, dt * 8);
      l.sprite.visible = l.mat.opacity > 0.01;
      if (p) {
        if (!l.flip && p.x + 12 + l.wPx > width - 2) l.flip = true;
        else if (l.flip && p.x + 12 + l.wPx < width - 40) l.flip = false;
      }
      l.sprite.center.set(l.flip ? 1 + 12 / l.wPx : -12 / l.wPx, 0.5);
      l.sprite.position.copy(l.anchor).multiplyScalar(1 + 0.003 * z);
    }

    renderer.render(scene, camera);

    // Telemetry ~8 Hz
    if (opts.onTelemetry && legs.length && now - lastTelemetry > 120) {
      lastTelemetry = now;
      const flown =
        legs.slice(0, poseLeg).reduce((s, l) => s + l.km, 0) +
        (seg.kind === "fly" ? legs[poseLeg].km * legProgress : poseP > 0.5 ? legs[poseLeg].km : 0);
      let phase: Telemetry["phase"] = "boarding";
      let nextStop = 0;
      let alt = 0;
      let gs = 0;
      let toNext = 0;
      if (seg.kind === "fly") {
        nextStop = seg.leg + 1;
        const p = local; // time through the leg drives climb/cruise/descent
        const legKm = legs[seg.leg].km;
        // Short hops never reach full cruise altitude or speed.
        const ceiling = Math.min(37000, 6000 + legKm * 150);
        const vmax = Math.min(490, 220 + legKm * 4);
        alt = Math.round((ceiling * smoothstep(0, 0.15, p) * (1 - smoothstep(0.85, 1, p))) / 100) * 100;
        gs = Math.round(140 + (vmax - 140) * smoothstep(0, 0.12, p) * (1 - 0.6 * smoothstep(0.88, 1, p)));
        toNext = Math.round(legKm * (1 - legProgress));
        phase = p < 0.15 ? "climb" : p > 0.85 ? "descent" : "cruise";
      } else if (seg.kind === "layover") {
        phase = "layover";
        nextStop = seg.stop;
      } else if (seg.kind === "arrived" || seg.kind === "fade" || (seg.kind === "intro" && seg.to === GLOBAL)) {
        phase = "arrived";
        nextStop = stops.length - 1;
      } else {
        // intro / board
        nextStop = Math.min(stops.length - 1, 1);
        toNext = Math.round(legs[0].km);
      }
      opts.onTelemetry({ phase, nextStop, progress: totalKm ? flown / totalKm : 1, distanceToNextKm: toNext, altitudeFt: alt, groundSpeedKt: gs });
    }

    if (running) raf = requestAnimationFrame(frame);
  };

  return {
    start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    },
    dispose() {
      this.stop();
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
      el.remove();
    },
  };
}
