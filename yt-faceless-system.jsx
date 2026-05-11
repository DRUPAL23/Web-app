import { useState, useEffect, useRef } from "react";

const MODULES = [
  { id: "niche", icon: "🎯", label: "Niche & Strategy", color: "#FF4D00" },
  { id: "script", icon: "✍️", label: "Script Generator", color: "#00D4FF" },
  { id: "voiceover", icon: "🎙️", label: "Voiceover", color: "#A855F7" },
  { id: "visuals", icon: "🎬", label: "Visual Prompts", color: "#F59E0B" },
  { id: "thumbnail", icon: "🖼️", label: "Thumbnail Brief", color: "#10B981" },
  { id: "seo", icon: "📈", label: "SEO & Metadata", color: "#EC4899" },
  { id: "schedule", icon: "📅", label: "Upload Schedule", color: "#6366F1" },
];

const NICHE_EXAMPLES = [
  "Dark history facts", "Luxury lifestyle", "True crime mysteries",
  "Finance & investing", "Space exploration", "AI & tech news",
  "Ancient civilizations", "Motivational stories"
];

function TypingText({ text, speed = 18, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  useEffect(() => {
    setDisplayed("");
    idx.current = 0;
    if (!text) return;
    const interval = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current++;
      } else {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}<span className="cursor">▌</span></span>;
}

function ModuleCard({ mod, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ "--accent": mod.color }}
      className={`module-card ${active ? "active" : ""}`}
    >
      <span className="mod-icon">{mod.icon}</span>
      <span className="mod-label">{mod.label}</span>
      <span className="mod-arrow">→</span>
    </button>
  );
}

function LoadingDots() {
  return (
    <span className="loading-dots">
      <span /><span /><span />
    </span>
  );
}

async function callClaude(systemPrompt, userPrompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Error generating content.";
}

// ─── Module Panels ───────────────────────────────────────────────────────────

function NichePanel({ niche, setNiche }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [typed, setTyped] = useState(false);

  const analyze = async () => {
    if (!niche) return;
    setLoading(true);
    setResult("");
    setTyped(false);
    const txt = await callClaude(
      "You are a YouTube faceless channel strategist. Be concise, punchy, practical. Use bullet points with emojis.",
      `Analyze this niche for a faceless YouTube channel: "${niche}"\n\nProvide:\n• Competition level (Low/Med/High)\n• Monetization potential\n• Content pillars (3-4 topics)\n• Target audience\n• Growth timeline estimate\n• One killer hook strategy`
    );
    setResult(txt);
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2 className="panel-title">🎯 Niche & Channel Strategy</h2>
      <p className="panel-sub">Find your profitable corner of YouTube</p>
      <div className="input-row">
        <input
          className="main-input"
          placeholder="e.g. 'Dark history facts' or 'Finance for Gen Z'…"
          value={niche}
          onChange={e => setNiche(e.target.value)}
          onKeyDown={e => e.key === "Enter" && analyze()}
        />
        <button className="run-btn" onClick={analyze} disabled={loading || !niche}>
          {loading ? <LoadingDots /> : "Analyze →"}
        </button>
      </div>
      <div className="pill-row">
        {NICHE_EXAMPLES.map(n => (
          <button key={n} className="pill" onClick={() => setNiche(n)}>{n}</button>
        ))}
      </div>
      {result && (
        <div className="result-box">
          {!typed
            ? <TypingText text={result} onDone={() => setTyped(true)} />
            : result}
        </div>
      )}
    </div>
  );
}

function ScriptPanel({ niche }) {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("5-7 min");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [typed, setTyped] = useState(false);

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    setResult("");
    setTyped(false);
    const txt = await callClaude(
      "You are a viral YouTube scriptwriter for faceless channels. Write punchy, hook-driven scripts with strong retention tactics.",
      `Write a ${length} faceless YouTube video script for a ${niche || "general"} channel.\nTopic: "${topic}"\n\nInclude:\n- HOOK (first 15 seconds, pattern interrupt)\n- INTRO teaser\n- 3-4 main segments with timestamps\n- CTA placement\n- Outro\n\nKeep it engaging. No fluff.`
    );
    setResult(txt);
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2 className="panel-title">✍️ Script Generator</h2>
      <p className="panel-sub">Hook-driven scripts built for retention</p>
      <div className="input-row">
        <input
          className="main-input"
          placeholder="Video topic / title idea…"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === "Enter" && generate()}
        />
        <select className="select-input" value={length} onChange={e => setLength(e.target.value)}>
          <option>2-3 min</option>
          <option>5-7 min</option>
          <option>10-12 min</option>
          <option>15-20 min</option>
        </select>
        <button className="run-btn" onClick={generate} disabled={loading || !topic}>
          {loading ? <LoadingDots /> : "Generate →"}
        </button>
      </div>
      {result && (
        <div className="result-box">
          {!typed ? <TypingText text={result} onDone={() => setTyped(true)} /> : result}
        </div>
      )}
    </div>
  );
}

function VoiceoverPanel({ niche }) {
  const [style, setStyle] = useState("authoritative narrator");
  const [excerpt, setExcerpt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [typed, setTyped] = useState(false);

  const STYLES = ["authoritative narrator", "conversational friend", "mysterious storyteller", "energetic hype", "calm educational", "dramatic thriller"];

  const generate = async () => {
    if (!excerpt) return;
    setLoading(true);
    setResult("");
    setTyped(false);
    const txt = await callClaude(
      "You are a voiceover director for YouTube. Provide specific direction with pacing notes, emphasis markers, and delivery tips.",
      `Optimize this script excerpt for a "${style}" voiceover style on a ${niche || "general"} channel:\n\n"${excerpt}"\n\nProvide:\n- Rewritten version with [PAUSE], [EMPHASIZE], [SLOW DOWN] markers\n- Pacing notes\n- Emotion direction\n- AI voice tool recommendation (ElevenLabs, Murf, etc.) with specific voice type`
    );
    setResult(txt);
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2 className="panel-title">🎙️ Voiceover Director</h2>
      <p className="panel-sub">Perfect delivery notes for AI voice tools</p>
      <div className="style-row">
        {STYLES.map(s => (
          <button key={s} className={`style-pill ${style === s ? "active-pill" : ""}`} onClick={() => setStyle(s)}>{s}</button>
        ))}
      </div>
      <div className="input-row" style={{ marginTop: "1rem" }}>
        <textarea
          className="main-input textarea"
          placeholder="Paste your script excerpt here…"
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          rows={4}
        />
      </div>
      <button className="run-btn full-btn" onClick={generate} disabled={loading || !excerpt}>
        {loading ? <LoadingDots /> : "Get Voice Direction →"}
      </button>
      {result && (
        <div className="result-box">
          {!typed ? <TypingText text={result} onDone={() => setTyped(true)} /> : result}
        </div>
      )}
    </div>
  );
}

function VisualsPanel({ niche }) {
  const [concept, setConcept] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [typed, setTyped] = useState(false);

  const VSTYLES = ["cinematic", "minimalist", "dark dramatic", "neon futuristic", "documentary", "illustrated"];

  const generate = async () => {
    if (!concept) return;
    setLoading(true);
    setResult("");
    setTyped(false);
    const txt = await callClaude(
      "You are a visual director for faceless YouTube channels. Generate specific, usable prompts for AI image/video tools.",
      `Generate B-roll visual prompts for a faceless YouTube video.\nChannel niche: ${niche || "general"}\nVideo concept: "${concept}"\nVisual style: ${style}\n\nProvide:\n- 5 specific Midjourney/DALL-E prompts for key scenes\n- Stock footage search terms (Pexels, Pixabay)\n- Color grading direction (LUT suggestions)\n- Transition style recommendations\n- On-screen text overlay suggestions`
    );
    setResult(txt);
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2 className="panel-title">🎬 Visual Prompts</h2>
      <p className="panel-sub">AI image prompts + B-roll direction</p>
      <div className="style-row">
        {VSTYLES.map(s => (
          <button key={s} className={`style-pill ${style === s ? "active-pill" : ""}`} onClick={() => setStyle(s)}>{s}</button>
        ))}
      </div>
      <div className="input-row" style={{ marginTop: "1rem" }}>
        <input
          className="main-input"
          placeholder="Video concept or scene description…"
          value={concept}
          onChange={e => setConcept(e.target.value)}
          onKeyDown={e => e.key === "Enter" && generate()}
        />
        <button className="run-btn" onClick={generate} disabled={loading || !concept}>
          {loading ? <LoadingDots /> : "Generate →"}
        </button>
      </div>
      {result && (
        <div className="result-box">
          {!typed ? <TypingText text={result} onDone={() => setTyped(true)} /> : result}
        </div>
      )}
    </div>
  );
}

function ThumbnailPanel({ niche }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [typed, setTyped] = useState(false);

  const generate = async () => {
    if (!title) return;
    setLoading(true);
    setResult("");
    setTyped(false);
    const txt = await callClaude(
      "You are a YouTube thumbnail designer and CTR optimizer. Be specific and tactical.",
      `Design a high-CTR thumbnail brief for this video:\nChannel niche: ${niche || "general"}\nVideo title: "${title}"\n\nProvide:\n- 3 thumbnail concept options (describe visually)\n- Text overlay copy (max 4 words each)\n- Color psychology recommendation\n- Composition layout (rule of thirds, focal point)\n- Emotion/expression direction\n- Font style suggestion\n- Canva template search keywords`
    );
    setResult(txt);
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2 className="panel-title">🖼️ Thumbnail Brief</h2>
      <p className="panel-sub">CTR-optimized thumbnail design direction</p>
      <div className="input-row">
        <input
          className="main-input"
          placeholder="Video title…"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === "Enter" && generate()}
        />
        <button className="run-btn" onClick={generate} disabled={loading || !title}>
          {loading ? <LoadingDots /> : "Design →"}
        </button>
      </div>
      {result && (
        <div className="result-box">
          {!typed ? <TypingText text={result} onDone={() => setTyped(true)} /> : result}
        </div>
      )}
    </div>
  );
}

function SEOPanel({ niche }) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [typed, setTyped] = useState(false);

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    setResult("");
    setTyped(false);
    const txt = await callClaude(
      "You are a YouTube SEO specialist. Provide actionable, specific metadata that maximizes discoverability.",
      `Generate full YouTube SEO package for:\nChannel niche: ${niche || "general"}\nVideo topic: "${topic}"\n\nProvide:\n- 3 title options (with power words, numbers, curiosity gap)\n- Description (first 3 lines hook, then keyword-rich body, CTA, timestamps placeholder)\n- 20 tags (mix of broad + long-tail)\n- 5 hashtags\n- Cards/end-screen strategy\n- Suggested upload day/time`
    );
    setResult(txt);
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2 className="panel-title">📈 SEO & Metadata</h2>
      <p className="panel-sub">Titles, descriptions, tags that rank</p>
      <div className="input-row">
        <input
          className="main-input"
          placeholder="Video topic…"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === "Enter" && generate()}
        />
        <button className="run-btn" onClick={generate} disabled={loading || !topic}>
          {loading ? <LoadingDots /> : "Optimize →"}
        </button>
      </div>
      {result && (
        <div className="result-box">
          {!typed ? <TypingText text={result} onDone={() => setTyped(true)} /> : result}
        </div>
      )}
    </div>
  );
}

function SchedulePanel({ niche }) {
  const [goal, setGoal] = useState("1 video/week");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [typed, setTyped] = useState(false);

  const GOALS = ["1 video/week", "2 videos/week", "3 videos/week", "Daily Shorts", "Mixed strategy"];

  const generate = async () => {
    setLoading(true);
    setResult("");
    setTyped(false);
    const txt = await callClaude(
      "You are a YouTube channel growth strategist. Create practical, time-blocked content calendars.",
      `Create a 4-week content calendar for a faceless YouTube channel.\nNiche: ${niche || "general"}\nPosting goal: ${goal}\n\nProvide:\n- Week-by-week topic plan (specific video ideas)\n- Production workflow timeline per video\n- Batch recording strategy\n- Best upload days/times for the niche\n- Milestone targets (views, subs) per week\n- Content repurposing tips (Shorts, clips)`
    );
    setResult(txt);
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2 className="panel-title">📅 Upload Schedule</h2>
      <p className="panel-sub">4-week content calendar & workflow</p>
      <div className="style-row">
        {GOALS.map(g => (
          <button key={g} className={`style-pill ${goal === g ? "active-pill" : ""}`} onClick={() => setGoal(g)}>{g}</button>
        ))}
      </div>
      <button className="run-btn full-btn" style={{ marginTop: "1rem" }} onClick={generate} disabled={loading}>
        {loading ? <LoadingDots /> : "Build Calendar →"}
      </button>
      {result && (
        <div className="result-box">
          {!typed ? <TypingText text={result} onDone={() => setTyped(true)} /> : result}
        </div>
      )}
    </div>
  );
}

const PANELS = {
  niche: NichePanel,
  script: ScriptPanel,
  voiceover: VoiceoverPanel,
  visuals: VisualsPanel,
  thumbnail: ThumbnailPanel,
  seo: SEOPanel,
  schedule: SchedulePanel,
};

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("niche");
  const [niche, setNiche] = useState("");
  const ActivePanel = PANELS[active];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080A0F;
          color: #E8E8F0;
          font-family: 'Syne', sans-serif;
          min-height: 100vh;
        }

        .app {
          display: grid;
          grid-template-columns: 260px 1fr;
          min-height: 100vh;
        }

        /* SIDEBAR */
        .sidebar {
          background: #0D0F18;
          border-right: 1px solid #1C1F2E;
          padding: 2rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0 0.25rem 1.5rem;
          border-bottom: 1px solid #1C1F2E;
          margin-bottom: 0.5rem;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #FF4D00, #FF2D78);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .logo-text {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .logo-sub {
          font-size: 0.65rem;
          color: #555870;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.05em;
        }

        .module-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 0.9rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          color: #7A7D94;
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.15s ease;
          text-align: left;
          width: 100%;
        }

        .module-card:hover {
          background: #14162099;
          color: #C8C8D8;
          border-color: #1C1F2E;
        }

        .module-card.active {
          background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, transparent), color-mix(in srgb, var(--accent) 6%, transparent));
          border-color: color-mix(in srgb, var(--accent) 35%, transparent);
          color: #fff;
        }

        .mod-icon { font-size: 1.1rem; flex-shrink: 0; }
        .mod-label { flex: 1; }
        .mod-arrow { opacity: 0; font-size: 0.75rem; transition: opacity 0.15s; }
        .module-card.active .mod-arrow,
        .module-card:hover .mod-arrow { opacity: 1; }

        .niche-tag {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid #1C1F2E;
          font-size: 0.7rem;
          color: #3A3D54;
          font-family: 'JetBrains Mono', monospace;
        }

        .niche-value {
          color: #FF4D00;
          font-weight: 500;
          margin-top: 0.2rem;
          word-break: break-word;
        }

        /* MAIN */
        .main {
          padding: 2.5rem 3rem;
          max-width: 860px;
        }

        .panel-title {
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 0.4rem;
        }

        .panel-sub {
          color: #555870;
          font-size: 0.88rem;
          margin-bottom: 1.5rem;
        }

        .input-row {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .main-input {
          flex: 1;
          background: #0D0F18;
          border: 1px solid #1C1F2E;
          border-radius: 10px;
          padding: 0.7rem 1rem;
          color: #E8E8F0;
          font-family: 'Syne', sans-serif;
          font-size: 0.88rem;
          outline: none;
          transition: border-color 0.15s;
        }

        .main-input:focus { border-color: #FF4D00; }
        .main-input::placeholder { color: #3A3D54; }

        .textarea {
          resize: vertical;
          min-height: 90px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
          line-height: 1.6;
        }

        .select-input {
          background: #0D0F18;
          border: 1px solid #1C1F2E;
          border-radius: 10px;
          padding: 0.7rem 0.85rem;
          color: #E8E8F0;
          font-family: 'Syne', sans-serif;
          font-size: 0.82rem;
          outline: none;
          cursor: pointer;
          flex-shrink: 0;
        }

        .run-btn {
          background: #FF4D00;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.7rem 1.2rem;
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
          flex-shrink: 0;
        }

        .run-btn:hover:not(:disabled) { background: #FF3000; transform: translateY(-1px); }
        .run-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .full-btn { width: 100%; }

        .pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.75rem;
        }

        .pill {
          background: #0D0F18;
          border: 1px solid #1C1F2E;
          border-radius: 20px;
          padding: 0.3rem 0.75rem;
          color: #6A6D84;
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.15s;
        }

        .pill:hover { border-color: #FF4D00; color: #FF4D00; }

        .style-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .style-pill {
          background: #0D0F18;
          border: 1px solid #1C1F2E;
          border-radius: 8px;
          padding: 0.35rem 0.85rem;
          color: #6A6D84;
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }

        .style-pill:hover { border-color: #444760; color: #C8C8D8; }

        .style-pill.active-pill {
          background: #FF4D00;
          border-color: #FF4D00;
          color: #fff;
        }

        .result-box {
          margin-top: 1.5rem;
          background: #0D0F18;
          border: 1px solid #1C1F2E;
          border-left: 3px solid #FF4D00;
          border-radius: 10px;
          padding: 1.25rem 1.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          line-height: 1.75;
          color: #C8C8D8;
          white-space: pre-wrap;
          max-height: 520px;
          overflow-y: auto;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        .cursor {
          display: inline-block;
          animation: blink 0.8s steps(1) infinite;
          color: #FF4D00;
          margin-left: 1px;
        }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .loading-dots {
          display: inline-flex;
          gap: 4px;
          align-items: center;
        }

        .loading-dots span {
          width: 5px;
          height: 5px;
          background: white;
          border-radius: 50%;
          animation: dot-pulse 1.2s ease-in-out infinite;
        }

        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dot-pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        .panel { animation: slideIn 0.2s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      <div className="app">
        <nav className="sidebar">
          <div className="logo">
            <div className="logo-icon">▶</div>
            <div>
              <div className="logo-text">FacelessAI</div>
              <div className="logo-sub">CHANNEL SYSTEM</div>
            </div>
          </div>

          {MODULES.map(mod => (
            <ModuleCard
              key={mod.id}
              mod={mod}
              active={active === mod.id}
              onClick={() => setActive(mod.id)}
            />
          ))}

          <div className="niche-tag">
            ACTIVE NICHE
            <div className="niche-value">{niche || "not set"}</div>
          </div>
        </nav>

        <main className="main">
          <ActivePanel niche={niche} setNiche={active === "niche" ? setNiche : undefined} />
        </main>
      </div>
    </>
  );
}
