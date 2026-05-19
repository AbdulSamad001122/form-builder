/**
 * Form Themes — 3 pre-built visual themes for public forms.
 * The `id` matches the value stored in formsTable.theme column.
 */

export interface FormTheme {
  id: string;
  name: string;
  description: string;
  /** Gradient used in the dashboard card preview */
  previewGradient: string;
  /** dot color shown on the preview swatch */
  accentColor: string;
  /** Full CSS classes applied to the public form page root */
  page: string;
  /** Classes for the form title */
  title: string;
  /** Classes for the form subtitle/description */
  subtitle: string;
  /** Classes for each field card wrapper */
  fieldCard: string;
  /** Classes for field labels */
  label: string;
  /** Classes for input/textarea/select elements */
  input: string;
  /** Classes for the submit button */
  button: string;
  /** Classes for the email gate card */
  emailCard: string;
  /** Classes for the "Powered by" footer */
  footer: string;
  /** Classes for the email badge pill */
  emailBadge: string;
}

export const FORM_THEMES: FormTheme[] = [
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep space purple with neon accents",
    previewGradient: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    accentColor: "#a855f7",
    page: "min-h-screen bg-[#0f0c29] bg-[radial-gradient(ellipse_at_top,_#302b63_0%,_#0f0c29_70%)] py-12 px-4 sm:px-6 lg:px-8 font-sans",
    title: "text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]",
    subtitle: "text-purple-300/80 text-lg",
    fieldCard: "space-y-3 mb-6 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 shadow-[0_4px_30px_rgba(168,85,247,0.1)] hover:border-purple-500/40 transition-colors",
    label: "text-purple-100 font-medium text-base",
    input: "bg-white/8 border-purple-500/30 text-white placeholder:text-purple-300/40 focus:border-purple-400 focus:ring-purple-400/20 rounded-lg",
    button: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all border-0 rounded-xl",
    emailCard: "bg-white/5 backdrop-blur-sm border border-purple-500/20 shadow-[0_4px_30px_rgba(168,85,247,0.1)] rounded-2xl",
    footer: "text-purple-400/60 text-sm",
    emailBadge: "bg-white/10 border border-purple-500/30 text-purple-200 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm",
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm amber & rose gradient energy",
    previewGradient: "linear-gradient(135deg, #ff6b35, #f7c59f, #e75480)",
    accentColor: "#f97316",
    page: "min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 dark:from-orange-950 dark:via-rose-950 dark:to-amber-950 py-12 px-4 sm:px-6 lg:px-8 font-sans",
    title: "text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 via-rose-500 to-amber-500 bg-clip-text text-transparent",
    subtitle: "text-rose-600/70 dark:text-rose-300/70 text-lg",
    fieldCard: "space-y-3 mb-6 p-6 bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-orange-200 dark:border-orange-500/20 shadow-sm hover:shadow-orange-100 dark:hover:shadow-orange-500/10 hover:border-orange-300 dark:hover:border-orange-400/40 transition-all",
    label: "text-rose-900 dark:text-rose-100 font-medium text-base",
    input: "bg-white dark:bg-white/8 border-orange-200 dark:border-orange-500/30 text-gray-900 dark:text-white placeholder:text-rose-300 focus:border-orange-400 focus:ring-orange-200 rounded-lg",
    button: "bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-semibold shadow-md hover:shadow-orange-300/50 transition-all border-0 rounded-xl",
    emailCard: "bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-orange-200 dark:border-orange-500/20 shadow-sm rounded-2xl",
    footer: "text-rose-400/60 text-sm",
    emailBadge: "bg-white/80 dark:bg-white/10 border border-orange-200 dark:border-orange-500/30 text-rose-700 dark:text-rose-200 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool teal glassmorphism, calm & clean",
    previewGradient: "linear-gradient(135deg, #0575e6, #021b79, #06beb6)",
    accentColor: "#06b6d4",
    page: "min-h-screen bg-[#020c1b] bg-[radial-gradient(ellipse_at_bottom_right,_#164e63_0%,_#020c1b_60%)] py-12 px-4 sm:px-6 lg:px-8 font-sans",
    title: "text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent drop-shadow-lg",
    subtitle: "text-cyan-300/70 text-lg",
    fieldCard: "space-y-3 mb-6 p-6 bg-cyan-950/40 backdrop-blur-md rounded-2xl border border-cyan-400/20 shadow-[0_4px_30px_rgba(6,182,212,0.08)] hover:border-cyan-400/40 transition-colors",
    label: "text-cyan-100 font-medium text-base",
    input: "bg-cyan-950/60 border-cyan-500/30 text-white placeholder:text-cyan-400/40 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-lg",
    button: "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-semibold shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all border-0 rounded-xl",
    emailCard: "bg-cyan-950/40 backdrop-blur-md border border-cyan-400/20 shadow-[0_4px_30px_rgba(6,182,212,0.08)] rounded-2xl",
    footer: "text-cyan-400/50 text-sm",
    emailBadge: "bg-cyan-950/60 border border-cyan-500/30 text-cyan-200 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm",
  },
];

export const DEFAULT_THEME_ID = "midnight";

export function getThemeById(id?: string | null): FormTheme {
  return FORM_THEMES.find((t) => t.id === id) ?? FORM_THEMES[0]!;
}
