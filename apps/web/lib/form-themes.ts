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
    id: "none",
    name: "None",
    description: "Platform default minimalist theme using forest green, black, and white",
    previewGradient: "linear-gradient(135deg, #1A3D2B 0%, #FFFFFF 100%)",
    accentColor: "#1A3D2B",
    page: "min-h-screen bg-[#F9F8F4] py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200",
    title: "text-4xl font-extrabold tracking-tight text-[#0F0F0E]",
    subtitle: "text-[#6B6860] text-lg",
    fieldCard: "space-y-3 mb-6 p-6 bg-white rounded-xl border border-[#D4CFC6] shadow-sm hover:border-[#1A3D2B] transition-all duration-200",
    label: "text-[#0F0F0E] font-semibold text-base",
    input: "bg-white border-[#D4CFC6] text-[#0F0F0E] placeholder:text-[#6B6860]/40 focus:border-[#1A3D2B] focus:ring-[#1A3D2B]/10 rounded-lg transition-all",
    button: "bg-[#1A3D2B] hover:bg-[#25573d] text-white font-semibold shadow-sm hover:shadow-md transition-all rounded-lg border-0 px-4 py-2",
    emailCard: "bg-white border border-[#D4CFC6] shadow-sm rounded-xl p-8",
    footer: "text-[#6B6860]/60 text-sm",
    emailBadge: "bg-white border border-[#D4CFC6] text-[#1A3D2B] rounded-full px-4 py-1.5 text-sm",
  },
  {
    id: "doodle",
    name: "Doodle",
    description: "A playful, hand-drawn sketchbook theme in black and white",
    previewGradient: "linear-gradient(135deg, #111111 0%, #F5F2EB 100%)",
    accentColor: "#111111",
    page: "min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 selection:bg-zinc-300 relative overflow-hidden",
    title: "text-4xl font-black tracking-tight text-[#111111] uppercase font-mono",
    subtitle: "text-[#333333] text-lg font-medium tracking-wide",
    fieldCard: "space-y-4 mb-6 p-8 bg-white rounded-[24px_12px_24px_16px] border-[3px] border-[#111111] shadow-[5px_5px_0px_0px_#111111] hover:shadow-[7px_7px_0px_0px_#111111] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all duration-200 relative overflow-hidden",
    label: "text-[#111111] font-black text-lg tracking-tight uppercase font-mono",
    input: "bg-white border-[2.5px] border-[#111111] text-[#111111] placeholder:text-gray-400 focus:border-[#111111] focus:ring-0 focus:shadow-[3px_3px_0px_0px_#111111] rounded-[12px_8px_12px_10px] transition-all py-3 font-medium text-base",
    button: "bg-[#111111] hover:bg-white hover:text-[#111111] text-white font-bold border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_#888888] hover:shadow-[2px_2px_0px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none rounded-[16px_8px_20px_12px] transition-all px-6 py-3 text-base",
    emailCard: "bg-white border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_#111111] rounded-[24px_16px_24px_20px] p-8 relative overflow-hidden",
    footer: "text-[#111111]/70 font-semibold text-sm font-mono tracking-wider",
    emailBadge: "bg-white border-[2px] border-[#111111] text-[#111111] font-bold rounded-full px-4 py-1.5 text-sm shadow-[2px_2px_0px_0px_#111111]",
  },
  {
    id: "death-note",
    name: "Death Note",
    description: "An eerie, dark gothic theme based on the cursed notebook rules page",
    previewGradient: "linear-gradient(135deg, #000000 0%, #333333 100%)",
    accentColor: "#ffffff",
    page: "min-h-screen bg-[#080808] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-white selection:text-black relative overflow-hidden",
    title: "text-4xl font-normal text-white text-center uppercase tracking-[0.2em] font-gothic",
    subtitle: "text-gray-400 text-center text-sm font-normal tracking-[0.1em] font-death-rules lowercase",
    fieldCard: "space-y-4 mb-6 p-8 bg-transparent rounded-none border-[1px] border-white/40 relative overflow-hidden hover:border-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] font-death-rules leading-relaxed",
    label: "text-white font-bold text-lg tracking-[0.1em] uppercase font-gothic",
    input: "bg-transparent border-[1.5px] border-white/40 text-white placeholder:text-white/20 focus:border-white focus:ring-0 focus:shadow-[0_0_10px_rgba(255,255,255,0.2)] rounded-none transition-all py-3 font-death-rules text-base",
    button: "bg-white hover:bg-transparent hover:text-white text-black font-bold border-[2px] border-white rounded-none shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all px-8 py-3.5 tracking-[0.25em] text-xs uppercase font-death-rules",
    emailCard: "bg-transparent border-[1px] border-white/40 rounded-none p-8 relative overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.02)] font-death-rules",
    footer: "text-white/50 text-xs font-normal tracking-[0.2em] uppercase text-center font-death-rules",
    emailBadge: "bg-transparent border-[1px] border-white/40 text-white rounded-none px-4 py-1.5 text-xs font-mono tracking-wider shadow-[0_0_5px_rgba(255,255,255,0.055)]",
  },
  {
    id: "forest",
    name: "Forest",
    description: "A lush, organic jungle experience with tropical plants, canopy trees, and earth tones",
    previewGradient: "linear-gradient(135deg, #1b3b22 0%, #2c5b37 100%)",
    accentColor: "#1b3b22",
    page: "min-h-screen bg-[#F4EEDD] text-[#1B3B22] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#C3D7C7] relative overflow-hidden transition-colors duration-200",
    title: "text-4xl font-extrabold tracking-tight text-[#1B3B22] text-center font-serif",
    subtitle: "text-[#4E6B53] text-center text-lg font-medium font-sans mt-2",
    fieldCard: "space-y-4 mb-6 p-8 bg-white/90 backdrop-blur-sm rounded-[32px] border-[2.5px] border-[#C3D7C7] shadow-[0_12px_24px_rgba(27,59,34,0.03)] hover:shadow-[0_16px_32px_rgba(27,59,34,0.06)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden font-sans",
    label: "text-[#1B3B22] font-extrabold text-base tracking-tight font-sans",
    input: "bg-white/90 border-[1.5px] border-[#C3D7C7] text-[#1B3B22] placeholder-[#7CA283] focus:border-[#4B8057] focus:ring-1 focus:ring-[#4B8057] rounded-xl transition-all py-3 px-4 font-sans text-base shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]",
    button: "bg-[#1B3B22] hover:bg-[#2C5B37] text-white font-bold rounded-full shadow-[0_4px_12px_rgba(27,59,34,0.15)] hover:shadow-[0_6px_16px_rgba(27,59,34,0.25)] transition-all px-8 py-3.5 tracking-wider text-sm uppercase font-sans border-0",
    emailCard: "bg-white/90 backdrop-blur-sm border-[2.5px] border-[#C3D7C7] rounded-[32px] p-8 relative overflow-hidden shadow-[0_12px_24px_rgba(27,59,34,0.03)] font-sans",
    footer: "text-[#4E6B53]/70 text-xs font-semibold tracking-wider text-center font-sans",
    emailBadge: "bg-[#E8F1EC] border-[1.5px] border-[#C3D7C7] text-[#1B3B22] font-semibold rounded-full px-4 py-1.5 text-xs shadow-sm",
  },
  {
    id: "custom",
    name: "Custom Branding",
    description: "Your workspace logo, colors, and custom styles",
    previewGradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    accentColor: "#3b82f6",
    page: "min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200",
    title: "text-4xl font-extrabold tracking-tight",
    subtitle: "text-lg opacity-80",
    fieldCard: "space-y-3 mb-6 p-6 rounded-xl border shadow-sm transition-all duration-200",
    label: "font-semibold text-base",
    input: "rounded-lg transition-all",
    button: "font-semibold shadow-sm hover:shadow-md transition-all rounded-lg border-0 px-4 py-2",
    emailCard: "shadow-sm rounded-xl p-8",
    footer: "text-sm opacity-60",
    emailBadge: "rounded-full px-4 py-1.5 text-sm",
  },
];

export const DEFAULT_THEME_ID = "none";

export function getThemeById(id?: string | null): FormTheme {
  return FORM_THEMES.find((t) => t.id === id) ?? FORM_THEMES[0]!;
}
