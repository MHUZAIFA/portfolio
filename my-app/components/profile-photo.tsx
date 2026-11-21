"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Public URL — avoids Turbopack HMR bugs with static `import` of files under `public/`. */
const PROFILE_SRC = "/imgs/huzaifa-profile.jpg";
/** Must match huzaifa-profile.jpg dimensions for stable layout (update if you replace the file). */
const PROFILE_WIDTH = 800;
const PROFILE_HEIGHT = 800;

const unoptimizedInDev = process.env.NODE_ENV === "development";

/** Water simulation resolution (cells across). Low res = cheap, and LINEAR filtering smooths it. */
const GRID = 140;
/** How long waves last (closer to 1 = longer). */
const DAMPING = 0.976;
/** How hard the "finger" pushes the water. */
const FINGER_FORCE = 0.9;
const FINGER_RADIUS = 4; // cells
/** How much the waves bend the photo (in texture units per unit of slope). */
const REFRACTION = 0.2;

const VERT = `
attribute vec2 p;
varying vec2 v;
void main() {
  v = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5); // 0,0 = top-left
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 v;
uniform sampler2D photo;
uniform sampler2D water;
uniform vec2 texel;     // 1 / grid size
uniform float aspect;   // canvas width / height
uniform float refraction;

// object-fit: cover, anchored to the top (square photo)
vec2 cover(vec2 uv) {
  if (aspect < 1.0) return vec2(0.5 + (uv.x - 0.5) * aspect, uv.y);
  return vec2(uv.x, uv.y / aspect);
}

void main() {
  float l = texture2D(water, v - vec2(texel.x, 0.0)).r;
  float r = texture2D(water, v + vec2(texel.x, 0.0)).r;
  float t = texture2D(water, v - vec2(0.0, texel.y)).r;
  float b = texture2D(water, v + vec2(0.0, texel.y)).r;
  vec2 slope = vec2(r - l, b - t);
  // Ignore 8-bit rounding noise so calm water is perfectly flat
  slope = sign(slope) * max(abs(slope) - 2.0 / 255.0, 0.0);

  vec4 c = texture2D(photo, clamp(cover(v + slope * refraction), 0.0, 1.0));

  // Light the water surface: troughs darken slightly and crests catch a highlight,
  // so ripples read as water even over the white background
  vec3 n = normalize(vec3(-slope * 14.0, 1.0));
  vec3 L = normalize(vec3(-0.5, -0.6, 1.0));
  float shade = dot(n, L) - L.z;              // 0 on flat water
  float spec = pow(max(dot(n, L), 0.0), 80.0) - pow(L.z, 80.0);
  gl_FragColor = vec4(c.rgb * (1.0 + clamp(shade, -0.5, 0.5) * 0.22) + max(spec, 0.0) * 0.35, 1.0);
}`;

type ProfilePhotoProps = {
  alt: string;
  className?: string;
  /** Extra classes for the image, e.g. to make the photo cover a taller box. */
  imageClassName?: string;
  /** `sizes` hint for next/image. */
  sizes?: string;
};

/**
 * Profile photo with an interactive water surface: the cursor (or a dragging finger) acts like a
 * fingertip moving through water and leaves ripples that spread, bounce and fade.
 * A small CPU height-field simulation drives a WebGL refraction shader. The regular <Image> stays
 * underneath (SEO, alt text, and the fallback when WebGL or motion is unavailable).
 */
export function ProfilePhoto({
  alt,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 360px",
}: ProfilePhotoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
    if (!gl) return;

    // --- GL setup ---------------------------------------------------------
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const makeTex = (unit: number) => {
      const tex = gl.createTexture()!;
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    };
    const photoTex = makeTex(0);
    const waterTex = makeTex(1);
    gl.uniform1i(gl.getUniformLocation(prog, "photo"), 0);
    gl.uniform1i(gl.getUniformLocation(prog, "water"), 1);
    const uTexel = gl.getUniformLocation(prog, "texel");
    const uAspect = gl.getUniformLocation(prog, "aspect");
    gl.uniform1f(gl.getUniformLocation(prog, "refraction"), REFRACTION);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    // --- Water height field (CPU) -----------------------------------------
    let gw = GRID;
    let gh = GRID;
    let cur = new Float32Array(gw * gh);
    let prev = new Float32Array(gw * gh);
    let bytes = new Uint8Array(gw * gh);

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const aspect = rect.width / rect.height;
      gw = GRID;
      gh = Math.max(16, Math.round(GRID / aspect));
      cur = new Float32Array(gw * gh);
      prev = new Float32Array(gw * gh);
      bytes = new Uint8Array(gw * gh);
      gl.uniform2f(uTexel, 1 / gw, 1 / gh);
      gl.uniform1f(uAspect, aspect);
      draw();
    };

    const step = () => {
      let energy = 0;
      for (let y = 1; y < gh - 1; y++) {
        for (let x = 1; x < gw - 1; x++) {
          const i = y * gw + x;
          const n = ((cur[i - 1] + cur[i + 1] + cur[i - gw] + cur[i + gw]) * 0.5 - prev[i]) * DAMPING;
          prev[i] = n;
          const a = n < 0 ? -n : n;
          if (a > energy) energy = a;
        }
      }
      const tmp = cur;
      cur = prev;
      prev = tmp;
      return energy;
    };

    const draw = () => {
      for (let i = 0; i < bytes.length; i++) {
        const v = 128 + cur[i] * 22; // headroom so crests never clip
        bytes[i] = v < 0 ? 0 : v > 255 ? 255 : v;
      }
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, waterTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gw, gh, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, bytes);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    // Push the water down in a small disc (a fingertip)
    const press = (gx: number, gy: number, force: number) => {
      const r = FINGER_RADIUS;
      for (let y = -r; y <= r; y++) {
        for (let x = -r; x <= r; x++) {
          const px = Math.round(gx + x);
          const py = Math.round(gy + y);
          if (px < 1 || py < 1 || px >= gw - 1 || py >= gh - 1) continue;
          const d = Math.hypot(x, y);
          if (d > r) continue;
          const i = py * gw + px;
          // Cap the depth so fast strokes make waves, not a deep trench
          cur[i] = Math.max(-1.1, cur[i] - force * (0.5 + 0.5 * Math.cos((d / r) * Math.PI)));
        }
      }
    };

    // --- Animation loop: runs only while there are waves --------------------
    let raf = 0;
    let quiet = 0;
    const loop = () => {
      const energy = step();
      draw();
      quiet = energy < 0.03 ? quiet + 1 : 0;
      if (quiet > 30) {
        cur.fill(0);
        prev.fill(0);
        draw();
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      quiet = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // --- Input: drag a "finger" along the cursor path -----------------------
    let last: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const gx = ((e.clientX - rect.left) / rect.width) * gw;
      const gy = ((e.clientY - rect.top) / rect.height) * gh;
      if (last) {
        const dist = Math.hypot(gx - last.x, gy - last.y);
        const steps = Math.max(1, Math.ceil(dist));
        // Faster strokes make bigger waves, capped so it never gets messy
        const force = (FINGER_FORCE * Math.min(1.4, 0.25 + dist / 6)) / steps;
        for (let s = 1; s <= steps; s++) {
          press(last.x + ((gx - last.x) * s) / steps, last.y + ((gy - last.y) * s) / steps, force);
        }
      } else {
        press(gx, gy, FINGER_FORCE * 0.6);
      }
      last = { x: gx, y: gy };
      wake();
    };
    const onLeave = () => {
      last = null;
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointercancel", onLeave);

    // --- Load the photo into a texture, then show the canvas --------------
    let disposed = false;
    const img = new window.Image();
    img.decoding = "async";
    img.src = PROFILE_SRC;
    img.onload = () => {
      if (disposed) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, photoTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      resize();
      setReady(true);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointercancel", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div ref={wrapRef} className={cn("relative select-none overflow-hidden", className)}>
      <Image
        src={PROFILE_SRC}
        alt={alt}
        width={PROFILE_WIDTH}
        height={PROFILE_HEIGHT}
        sizes={sizes}
        className={cn("block h-auto w-full", imageClassName)}
        priority
        unoptimized={unoptimizedInDev}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-[1] h-full w-full transition-opacity duration-300",
          ready ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
