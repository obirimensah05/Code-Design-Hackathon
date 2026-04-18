'use client';

/* global window */
// All data + helpers. Exposes globals via window.

const TOOLS = [
  { id: "chatgpt", name: "ChatGPT", cat: "LLM", maker: "OpenAI", mark: "GP", videos: 142, learners: 8420, color: "#10A37F", desc: "Conversational AI for writing, analysis, coding & research." },
  { id: "claude", name: "Claude", cat: "LLM", maker: "Anthropic", mark: "CL", videos: 96, learners: 5612, color: "#D97757", desc: "Long-context reasoning, coding, and document analysis." },
  { id: "gemini", name: "Gemini", cat: "LLM", maker: "Google", mark: "GM", videos: 71, learners: 3980, color: "#4285F4", desc: "Multimodal AI integrated with Google Workspace." },
  { id: "perplexity", name: "Perplexity", cat: "LLM", maker: "Perplexity", mark: "PX", videos: 54, learners: 2901, color: "#20B8CD", desc: "AI answer engine with cited sources." },
  { id: "midjourney", name: "Midjourney", cat: "Image", maker: "Midjourney", mark: "MJ", videos: 188, learners: 11250, color: "#000000", desc: "Aesthetic image generation via Discord & web." },
  { id: "dalle", name: "DALL·E 3", cat: "Image", maker: "OpenAI", mark: "DE", videos: 62, learners: 4120, color: "#7A4FCC", desc: "Prompt-driven photorealistic image generation." },
  { id: "firefly", name: "Adobe Firefly", cat: "Image", maker: "Adobe", mark: "FF", videos: 44, learners: 2104, color: "#D8004A", desc: "Commercial-safe image gen integrated with Creative Cloud." },
  { id: "stablediffusion", name: "Stable Diffusion", cat: "Image", maker: "Stability", mark: "SD", videos: 89, learners: 3640, color: "#7B1FA2", desc: "Open-source image diffusion you can run locally." },
  { id: "cursor", name: "Cursor", cat: "Code", maker: "Anysphere", mark: "CR", videos: 121, learners: 7130, color: "#000000", desc: "AI-first IDE for fast, agentic codebase editing." },
  { id: "copilot", name: "GitHub Copilot", cat: "Code", maker: "GitHub", mark: "GH", videos: 98, learners: 6810, color: "#171515", desc: "AI pair programmer in your editor & terminal." },
  { id: "replit", name: "Replit AI", cat: "Code", maker: "Replit", mark: "RP", videos: 41, learners: 1820, color: "#F26207", desc: "AI assist + agent in the Replit cloud IDE." },
  { id: "v0", name: "v0", cat: "Code", maker: "Vercel", mark: "V0", videos: 36, learners: 2210, color: "#000000", desc: "Generate React + Tailwind UI from prompts." },
  { id: "figma_ai", name: "Figma AI", cat: "Design", maker: "Figma", mark: "FG", videos: 28, learners: 1560, color: "#F24E1E", desc: "Make features, image edits, autoname & rewrite." },
  { id: "framer", name: "Framer AI", cat: "Design", maker: "Framer", mark: "FR", videos: 19, learners: 980, color: "#0055FF", desc: "Generate full sites with AI on Framer canvas." },
  { id: "synthesia", name: "Synthesia", cat: "Video", maker: "Synthesia", mark: "SY", videos: 33, learners: 1840, color: "#FF4F40", desc: "Generate avatar videos in 140+ languages." },
  { id: "runway", name: "Runway", cat: "Video", maker: "Runway", mark: "RW", videos: 47, learners: 2360, color: "#000000", desc: "Gen-3 text-to-video, video-to-video, motion brush." },
  { id: "descript", name: "Descript", cat: "Video", maker: "Descript", mark: "DS", videos: 25, learners: 1410, color: "#1E88E5", desc: "Edit video & audio by editing text." },
  { id: "elevenlabs", name: "ElevenLabs", cat: "Audio", maker: "ElevenLabs", mark: "EL", videos: 38, learners: 2110, color: "#000000", desc: "Voice cloning, dubbing, and TTS." },
  { id: "udio", name: "Udio", cat: "Audio", maker: "Udio", mark: "UD", videos: 17, learners: 740, color: "#1E1E1E", desc: "Generate songs from text prompts." },
  { id: "notion_ai", name: "Notion AI", cat: "Productivity", maker: "Notion", mark: "NA", videos: 52, learners: 3290, color: "#000000", desc: "AI inside your Notion workspace." },
  { id: "jasper", name: "Jasper", cat: "Marketing", maker: "Jasper", mark: "JA", videos: 31, learners: 1620, color: "#11A37F", desc: "Brand-consistent marketing copy at scale." },
  { id: "copyai", name: "Copy.ai", cat: "Marketing", maker: "Copy.ai", mark: "CA", videos: 22, learners: 1080, color: "#0077FF", desc: "GTM workflows powered by AI." },
  { id: "huggingface", name: "Hugging Face", cat: "ML", maker: "Hugging Face", mark: "HF", videos: 44, learners: 2410, color: "#FFD21E", desc: "Open-source ML models, datasets & spaces." },
  { id: "llama", name: "Llama", cat: "LLM", maker: "Meta", mark: "LM", videos: 28, learners: 1320, color: "#0866FF", desc: "Open-weight LLMs you can self-host." },
  { id: "mistral", name: "Mistral", cat: "LLM", maker: "Mistral AI", mark: "MS", videos: 19, learners: 940, color: "#FA520F", desc: "Efficient European open-weight models." },
];

const FIELDS = [
  { id: "marketing", name: "Marketing", icon: "📣" },
  { id: "dev", name: "Software Development", icon: "⌘" },
  { id: "design", name: "Design & Creative", icon: "✦" },
  { id: "sales", name: "Sales", icon: "→" },
  { id: "hr", name: "HR & People Ops", icon: "◎" },
  { id: "ops", name: "Operations", icon: "▣" },
  { id: "legal", name: "Legal", icon: "§" },
  { id: "education", name: "Education", icon: "✎" },
  { id: "healthcare", name: "Healthcare", icon: "✚" },
  { id: "finance", name: "Finance", icon: "$" },
  { id: "biz", name: "Business / Founder", icon: "▲" },
  { id: "other", name: "Other", icon: "•" },
];

const LEVELS = [
  { id: "beginner", name: "Beginner", hours: "0–10 hrs", videos: 8, desc: "What it is, how to sign up, first prompts, common mistakes." },
  { id: "intermediate", name: "Intermediate", hours: "10–30 hrs", videos: 10, desc: "Advanced features, workflows, integrations, time-saving tricks." },
  { id: "advanced", name: "Advanced", hours: "30–60 hrs", videos: 9, desc: "Expert techniques, custom workflows, API usage, optimization." },
  { id: "expert", name: "Expert", hours: "60+ hrs", videos: 7, desc: "Mastery — building with the tool, teaching, contributing." },
];

const GOALS = [
  "Save time on daily tasks",
  "Learn a new tool",
  "Improve creativity",
  "Build skills for my career",
  "Stay competitive",
  "Teach others",
];

// --- Creators ---
const CREATORS = [
  { id: "sarah", name: "Sarah Chen", role: "Senior Marketing Manager", company: "Notion", initials: "SC", verified: true, field: "marketing" },
  { id: "marcus", name: "Marcus Wei", role: "Staff Engineer", company: "Vercel", initials: "MW", verified: true, field: "dev" },
  { id: "priya", name: "Priya Iyer", role: "Product Designer", company: "Linear", initials: "PI", verified: true, field: "design" },
  { id: "tom", name: "Tom Bergström", role: "Growth Lead", company: "Loom", initials: "TB", verified: false, field: "marketing" },
  { id: "naomi", name: "Naomi Park", role: "ML Researcher", company: "Hugging Face", initials: "NP", verified: true, field: "dev" },
  { id: "diego", name: "Diego Alvarez", role: "Creative Director", company: "Stripe", initials: "DA", verified: true, field: "design" },
  { id: "emma", name: "Emma Wilson", role: "Content Strategist", company: "Webflow", initials: "EW", verified: false, field: "marketing" },
  { id: "michael", name: "Michael Torres", role: "Sales Engineer", company: "Snowflake", initials: "MT", verified: false, field: "sales" },
  { id: "lisa", name: "Lisa Martinez", role: "Brand Designer", company: "Figma", initials: "LM", verified: true, field: "design" },
  { id: "david", name: "David Lee", role: "Founder", company: "Indie", initials: "DL", verified: false, field: "biz" },
  { id: "anna", name: "Anna Park", role: "Marketing Lead", company: "Retool", initials: "AP", verified: true, field: "marketing" },
  { id: "chris", name: "Chris Kim", role: "Senior Developer", company: "Shopify", initials: "CK", verified: false, field: "dev" },
  { id: "sophie", name: "Sophie Bauer", role: "UX Researcher", company: "Atlassian", initials: "SB", verified: true, field: "design" },
  { id: "james", name: "James Wu", role: "Data Scientist", company: "Databricks", initials: "JW", verified: false, field: "dev" },
];

// --- Videos: generate plausible titles from tool + level ---
const TITLE_BANK = {
  beginner: [
    "Getting started with %T in 7 minutes",
    "Your first %T project, end-to-end",
    "5 prompts every %T beginner should know",
    "Setting up %T the right way",
    "Common %T mistakes (and how to fix them)",
    "%T explained in plain English",
  ],
  intermediate: [
    "Building a daily %T workflow that saves 4 hours/week",
    "%T x %F: a real-world case study",
    "When to reach for %T (and when not to)",
    "Underrated %T features no one talks about",
    "Connecting %T to your existing stack",
    "Better prompts: a %T pattern library",
  ],
  advanced: [
    "Power-user %T: 12 techniques in 20 minutes",
    "Automating %T with the API",
    "Custom %T workflows for production",
    "Optimizing %T cost & latency at scale",
    "Building tools on top of %T",
    "%T for senior practitioners",
  ],
  expert: [
    "Inside the build: shipping a %T product",
    "Teaching %T: my framework",
    "%T research → practice",
    "What I'd do differently with %T after 2 years",
    "The %T mental model",
  ],
};

function seed(n) { let s = (n * 2654435761) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xFFFFFFFF; }; }

function makeVideos() {
  const out = [];
  let id = 1;
  TOOLS.forEach((tool, ti) => {
    LEVELS.forEach((lvl, li) => {
      const r = seed(ti * 100 + li);
      const titles = TITLE_BANK[lvl.id];
      const count = 4 + Math.floor(r() * 4);
      for (let i = 0; i < count; i++) {
        const tplIdx = Math.floor(r() * titles.length);
        const tpl = titles[tplIdx];
        const fieldName = FIELDS[Math.floor(r() * FIELDS.length)].name.split(" ")[0];
        const title = tpl.replace("%T", tool.name).replace("%F", fieldName);
        const creator = CREATORS[Math.floor(r() * CREATORS.length)];
        const mins = 4 + Math.floor(r() * 12);
        const secs = Math.floor(r() * 60);
        const views = 200 + Math.floor(r() * 28000);
        const rating = (3.6 + r() * 1.35);
        const completion = 60 + Math.floor(r() * 35);
        out.push({
          id: id++,
          toolId: tool.id,
          level: lvl.id,
          title,
          creatorId: creator.id,
          duration: `${mins}:${String(secs).padStart(2, "0")}`,
          views,
          rating: Math.round(rating * 10) / 10,
          completion,
          field: FIELDS[Math.floor(r() * FIELDS.length)].id,
        });
      }
    });
  });
  return out;
}

const VIDEOS = makeVideos();

// --- Leaderboard data ---
const LB_NAMES = [
  { name: "Sarah Chen", role: "Marketing Mgr · Notion", initials: "SC", field: "marketing", level: "intermediate" },
  { name: "Marcus Wei", role: "Staff Eng · Vercel", initials: "MW", field: "dev", level: "advanced" },
  { name: "Emma Wilson", role: "Content · Webflow", initials: "EW", field: "marketing", level: "intermediate" },
  { name: "Michael Torres", role: "SE · Snowflake", initials: "MT", field: "sales", level: "intermediate" },
  { name: "Lisa Martinez", role: "Brand · Figma", initials: "LM", field: "design", level: "advanced" },
  { name: "David Lee", role: "Founder · Indie", initials: "DL", field: "biz", level: "beginner" },
  { name: "Anna Park", role: "Marketing · Retool", initials: "AP", field: "marketing", level: "intermediate" },
  { name: "Chris Kim", role: "Senior Dev · Shopify", initials: "CK", field: "dev", level: "advanced" },
  { name: "Sophie Bauer", role: "UXR · Atlassian", initials: "SB", field: "design", level: "intermediate" },
  { name: "James Wu", role: "Data Sci · Databricks", initials: "JW", field: "dev", level: "intermediate" },
  { name: "Naomi Park", role: "ML Researcher · HF", initials: "NP", field: "dev", level: "expert" },
  { name: "Diego Alvarez", role: "CD · Stripe", initials: "DA", field: "design", level: "advanced" },
];

function makeLeaderboard(field, level, youName = "Jordan Reed", youRole = "Marketing Manager") {
  const r = seed(field.length * 17 + level.length * 13);
  const pool = LB_NAMES.filter(n => true).map(n => ({...n, pts: 120 + Math.floor(r() * 260), videos: 4 + Math.floor(r() * 22)}));
  pool.push({ name: youName, role: youRole, initials: "JR", isYou: true, pts: 340, videos: 12, field, level });
  pool.sort((a, b) => b.pts - a.pts);
  return pool.slice(0, 11);
}


export const PV_DATA = {
  TOOLS, FIELDS, LEVELS, GOALS, CREATORS, VIDEOS, makeLeaderboard,
  byTool: (id) => VIDEOS.filter(v => v.toolId === id),
  byLevel: (toolId, level) => VIDEOS.filter(v => v.toolId === toolId && v.level === level),
  creator: (id) => CREATORS.find(c => c.id === id),
  tool: (id) => TOOLS.find(t => t.id === id),
  video: (id) => VIDEOS.find(v => v.id === id),
  fmtViews: (n) => n >= 1000 ? `${(n/1000).toFixed(n>=10000?0:1)}k` : `${n}`,
};
