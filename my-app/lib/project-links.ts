/**
 * External links per project, shown in the projects terminal (`cat <id>`).
 * Mirrors liveUrl / githubUrl / otherLinks in app/projects/[id]/page.tsx (placeholder URLs left out).
 */
export type ProjectLink = { label: string; url: string };

export const PROJECT_LINKS: Record<string, ProjectLink[]> = {
  "flight-deck-theme": [
    { label: "github", url: "https://github.com/MHUZAIFA/aircanada_vscode_theme" },
    { label: "marketplace", url: "https://marketplace.visualstudio.com/items?itemName=MHuzaifa.air-canada-flight-deck-theme" },
  ],
  "git101-hackdecouverte": [
    { label: "live", url: "https://git101-hackdecouverte2026.vercel.app/" },
    { label: "github", url: "https://github.com/MHUZAIFA/git101_hackdecouverte_2026" },
  ],
  "nlmeans-denoising": [{ label: "github", url: "https://github.com/MHUZAIFA/COMP-6771-image-processing" }],
  "pure-black-theme": [
    { label: "github", url: "https://github.com/MHUZAIFA/pure-black-theme" },
    { label: "marketplace", url: "https://marketplace.visualstudio.com/items?itemName=MHuzaifa.mhuzaifa-pure-black-theme" },
  ],
  "bpmn-studio": [
    { label: "live", url: "https://bpmn-studio.vercel.app" },
    { label: "github", url: "https://github.com/MHUZAIFA/bpmn-studio" },
  ],
  doable: [{ label: "github", url: "https://github.com/MHUZAIFA/Doable" }],
  "ai-bots": [{ label: "github", url: "https://github.com/MHUZAIFA/COMP-6721-Applied-AI" }],
  metricstics: [{ label: "github", url: "https://github.com/MHUZAIFA/METRICSTICS" }],
  mytasks: [
    { label: "live", url: "https://ha-todo.web.app" },
    { label: "github", url: "https://github.com/MHUZAIFA/MyTasks" },
  ],
  snkrs: [
    { label: "live", url: "https://mhuzaifa.github.io/snkrs/" },
    { label: "github", url: "https://github.com/MHUZAIFA/snkrs" },
  ],
};
