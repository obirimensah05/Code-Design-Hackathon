/* global React, window */
// Langdock practice panel — slides in from the right, lets user try the exercise inline.

const { useState: useStateL, useEffect: useEffectL, useRef: useRefL } = React;

// ---- Starter prompt library: picked by tool + loose title match ----
const LANGDOCK_MODELS = [
  { id: "gpt-4o",        name: "GPT-4o",        maker: "OpenAI",    toolId: "chatgpt",    color: "#10A37F", mark: "GP" },
  { id: "claude-sonnet", name: "Claude Sonnet", maker: "Anthropic", toolId: "claude",     color: "#D97757", mark: "CL" },
  { id: "claude-opus",   name: "Claude Opus",   maker: "Anthropic", toolId: "claude",     color: "#B8593D", mark: "CL" },
  { id: "gemini-pro",    name: "Gemini Pro",    maker: "Google",    toolId: "gemini",     color: "#4285F4", mark: "GM" },
  { id: "mistral-large", name: "Mistral Large", maker: "Mistral",   toolId: "mistral",    color: "#FA520F", mark: "MS" },
  { id: "perplexity",    name: "Perplexity",    maker: "Perplexity",toolId: "perplexity", color: "#20B8CD", mark: "PX" },
  { id: "llama-3",       name: "Llama 3 70B",   maker: "Meta",      toolId: "llama",      color: "#0866FF", mark: "LM" },
];

function modelForTool(toolId) {
  return LANGDOCK_MODELS.find(m => m.toolId === toolId) || LANGDOCK_MODELS[0];
}

function starterPromptFor(video) {
  const D = window.PV_DATA;
  const tool = D.tool(video.toolId);
  const t = video.title.toLowerCase();
  // Pattern match
  if (t.includes("5 prompts") || t.includes("first prompts")) {
    return `I'm learning ${tool.name}. Give me 5 example prompts for a beginner, each with: the prompt, what it does, and why it works. Focus on useful everyday tasks.`;
  }
  if (t.includes("mistakes") || t.includes("common")) {
    return `What are the 5 most common mistakes beginners make with ${tool.name}, and what should I do instead? Give a concrete before/after example for each.`;
  }
  if (t.includes("pattern library") || t.includes("better prompts")) {
    return `Teach me 3 reusable prompt patterns for ${tool.name} that work for structured tasks (analysis, writing, planning). Show the pattern, then an example filled in.`;
  }
  if (t.includes("workflow") || t.includes("daily")) {
    return `Help me design a ${tool.name} workflow for my role. Ask me 3 questions first, then propose a daily routine with specific prompts I can copy.`;
  }
  if (t.includes("case study") || t.includes("real-world")) {
    return `Walk me through how a ${tool.name} power user would tackle this marketing brief: "Launch a product update to 12k existing users, budget $0, 5 days." Be specific about each step.`;
  }
  if (t.includes("setup") || t.includes("setting up") || t.includes("getting started")) {
    return `I just signed up for ${tool.name}. What should I do in the first 10 minutes to set it up well? Give a checklist, then a single starter prompt I can try.`;
  }
  if (t.includes("power-user") || t.includes("techniques")) {
    return `I'm past beginner at ${tool.name}. Give me 5 power-user techniques I probably haven't discovered, each with the exact prompt or action I'd use.`;
  }
  if (t.includes("api") || t.includes("automating")) {
    return `Show me how to call ${tool.name} from a Node.js script. Include auth setup, a working example, and error handling. Assume I'm a mid-level dev.`;
  }
  if (t.includes("plain english") || t.includes("explained")) {
    return `Explain ${tool.name} in plain English. What is it, what's it good at, what's it bad at, and what's the single thing a first-time user should know?`;
  }
  if (t.includes("mental model")) {
    return `Give me a mental model for when to use ${tool.name} vs other AI tools. Use concrete examples from everyday work.`;
  }
  if (t.includes("prompt") && tool.cat === "Image") {
    return `I want to create a product hero image using ${tool.name}. Walk me through a prompt structure (subject, style, lighting, composition) and give 3 variations I can try.`;
  }
  // Fallback
  return `I'm learning from a tutorial called "${video.title}". Help me practice the concept — ask me what I'm trying to build, then give me 3 prompts to try on ${tool.name}, each with a brief note on what it demonstrates.`;
}

// ---- Mock Langdock reply (claude-completion could be wired here) ----
function mockReplyFor(prompt, modelName) {
  // Pretend to stream a realistic reply
  const openings = [
    `Good question. Let's get you practicing.`,
    `Happy to help you learn this hands-on.`,
    `Great — this is a solid starting point.`,
  ];
  const body = `Here are three prompts you can try right now, in order:

**1. Warm-up.** Ask: "Summarize the pros and cons of your approach in one paragraph." This calibrates the assistant's reasoning style.

**2. Depth.** Follow up with: "Now critique that summary — what did you miss?" This surfaces blind spots.

**3. Apply.** Finally: "Rewrite this for my role [paste role here] in 5 bullet points." This locks it to your context.

Try #1 first. When the reply comes back, paste it and I'll suggest what to ask next.`;
  return openings[Math.floor(Math.random() * openings.length)] + "\n\n" + body;
}

// ---- Component ----
function LangdockPanel({ open, video, onClose, onComplete }) {
  const availableModels = LANGDOCK_MODELS;
  const [modelId, setModelId] = useStateL(() => (video ? modelForTool(video.toolId).id : availableModels[0].id));
  const [input, setInput] = useStateL(() => (video ? starterPromptFor(video) : ""));
  const [msgs, setMsgs] = useStateL([]);
  const [streaming, setStreaming] = useStateL(false);
  const [streamText, setStreamText] = useStateL("");
  const [sent, setSent] = useStateL(false);
  const scrollRef = useRefL(null);

  // Reset when video changes
  useEffectL(() => {
    if (!video) return;
    setInput(starterPromptFor(video));
    setMsgs([]);
    setSent(false);
    setStreamText("");
    setStreaming(false);
    setModelId(modelForTool(video.toolId).id);
  }, [video?.id]);

  useEffectL(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, streamText]);

  // Close on escape
  useEffectL(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  if (!video) return null;
  const D = window.PV_DATA;
  const tool = D.tool(video.toolId);
  const starter = starterPromptFor(video);

  const model = availableModels.find(m => m.id === modelId) || availableModels[0];

  const send = () => {
    if (!input.trim() || streaming) return;
    const userMsg = { role: "user", text: input.trim() };
    setMsgs(m => [...m, userMsg]);
    setInput("");
    setStreaming(true);
    setSent(true);

    const full = mockReplyFor(userMsg.text, model.name);
    let i = 0;
    setStreamText("");
    const tick = () => {
      i += 3 + Math.floor(Math.random() * 4);
      const chunk = full.slice(0, i);
      setStreamText(chunk);
      if (i < full.length) {
        setTimeout(tick, 14);
      } else {
        setMsgs(m => [...m, { role: "assistant", text: full, model: model.name }]);
        setStreamText("");
        setStreaming(false);
        onComplete && onComplete(video);
      }
    };
    setTimeout(tick, 160);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); }
  };

  return (
    <>
      <div className={`ld-backdrop ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`ld-panel ${open ? "open" : ""}`} aria-hidden={!open}>
        {/* Practicing banner */}
        <div className="ld-context">
          <div className="ld-context-left">
            <div className="ld-context-eyebrow mono">PRACTICING</div>
            <div className="ld-context-title">{video.title}</div>
          </div>
          <button className="ld-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Langdock chrome */}
        <div className="ld-chrome">
          <div className="ld-logo">
            <div className="ld-logo-mark">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <div className="ld-logo-name">Langdock</div>
              <div className="ld-logo-sub mono">chat · your company workspace</div>
            </div>
          </div>
          <div className="ld-model-picker">
            <label className="ld-model-label mono">MODEL</label>
            <select className="ld-model-select" value={modelId} onChange={(e) => setModelId(e.target.value)} disabled={streaming}>
              {availableModels.map(m => (
                <option key={m.id} value={m.id}>{m.name} · {m.maker}</option>
              ))}
            </select>
            <div className="ld-model-swatch" style={{background: model.color}}>{model.mark}</div>
          </div>
        </div>

        {/* Conversation */}
        <div className="ld-convo" ref={scrollRef}>
          {msgs.length === 0 && !streaming && (
            <div className="ld-empty">
              <div className="ld-empty-badge mono">STARTER PROMPT</div>
              <div className="ld-empty-copy">
                We drafted a prompt to kick things off — edit it, or send as-is. Your message will run on <b>{model.name}</b> inside your Langdock workspace.
              </div>
              <div className="ld-empty-tips">
                <div className="ld-tip">⌘ + Enter to send</div>
                <div className="ld-tip">Switch models above</div>
                <div className="ld-tip">+15 pts on completion</div>
              </div>
            </div>
          )}

          {msgs.map((m, i) => (
            <div key={i} className={`ld-msg ld-${m.role}`}>
              <div className="ld-msg-head">
                {m.role === "user" ? (
                  <>
                    <div className="ld-avatar ld-user-avatar">JR</div>
                    <div className="ld-msg-name">You</div>
                  </>
                ) : (
                  <>
                    <div className="ld-avatar" style={{background: model.color}}>{model.mark}</div>
                    <div className="ld-msg-name">{m.model || model.name}</div>
                    <div className="ld-msg-via mono">via Langdock</div>
                  </>
                )}
              </div>
              <div className="ld-msg-body">{m.text}</div>
            </div>
          ))}

          {streaming && (
            <div className="ld-msg ld-assistant">
              <div className="ld-msg-head">
                <div className="ld-avatar" style={{background: model.color}}>{model.mark}</div>
                <div className="ld-msg-name">{model.name}</div>
                <div className="ld-msg-via mono">via Langdock · thinking</div>
              </div>
              <div className="ld-msg-body">
                {streamText}
                <span className="ld-caret" />
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="ld-composer">
          <textarea
            className="ld-input"
            placeholder={sent ? "Follow up…" : "Your prompt…"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={sent ? 2 : 4}
            disabled={streaming}
          />
          <div className="ld-composer-row">
            <div className="ld-composer-hint mono">
              Running on <b>{model.name}</b> · your Langdock usage
            </div>
            <button className="ld-send" onClick={send} disabled={streaming || !input.trim()}>
              {streaming ? "Running…" : <>Send <span className="mono ld-kbd">⌘↵</span></>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

window.LangdockPanel = LangdockPanel;
window.LANGDOCK_MODELS = LANGDOCK_MODELS;
window.starterPromptFor = starterPromptFor;
window.modelForTool = modelForTool;
