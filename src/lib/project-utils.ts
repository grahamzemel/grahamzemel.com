export type ProjectTag =
  | "Quantum"
  | "AI"
  | "Web"
  | "Game"
  | "App"
  | "Extension"
  | "Website"
  | "Internet"
  | "Python"
  | "Telegram"
  | "Library"
  | "Shell"
  | "Bash"
  | "Automation"
  | "Hackathon"
  | "Crypto"
  | "IFC";

const DEFAULT_TAG_CLASS = "bg-blue-50 text-blue-600";

const TAG_CLASSES: Record<ProjectTag, string> = {
  Quantum: "bg-red-50 text-red-600",
  AI: "bg-orange-50 text-orange-600",
  Web: "bg-lime-50 text-lime-600",
  Game: "bg-pink-50 text-pink-600",
  App: "bg-emerald-50 text-emerald-600",
  Extension: "bg-cyan-50 text-cyan-600",
  Website: "bg-sky-50 text-sky-600",
  Internet: "bg-teal-50 text-teal-600",
  Python: "bg-green-50 text-green-600",
  Telegram: "bg-blue-50 text-blue-600",
  Library: "bg-indigo-50 text-indigo-600",
  Shell: "bg-purple-50 text-purple-600",
  Bash: "bg-red-50 text-red-600",
  Automation: "bg-yellow-50 text-yellow-600",
  Hackathon: "bg-pink-50 text-pink-600",
  Crypto: "bg-blue-50 text-blue-600",
  IFC: "bg-amber-50 text-amber-600",
};

export function getProjectTagClass(tag: string) {
  return TAG_CLASSES[tag as ProjectTag] ?? DEFAULT_TAG_CLASS;
}

export function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
