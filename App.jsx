import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN SYSTEM — Bioterra Nexus
   Aesthetic: Luxury Agri-Tech — deep forest greens, warm ivory,
   gold accents. Clean editorial layout with refined micro-details.
═══════════════════════════════════════════════════════════════ */
const C = {
  bg: "#080f08",
  surface: "#0e180e",
  card: "#132013",
  cardHov: "#182818",
  border: "#1e381e",
  borderLight: "#2a4a2a",
  accent: "#4caf50",
  accentDark: "#2e7d32",
  accentGlow: "#4caf5030",
  gold: "#c9a84c",
  goldDim: "#c9a84c20",
  red: "#d32f2f",
  redDim: "#d32f2f20",
  blue: "#1976d2",
  blueDim: "#1976d220",
  text: "#e8f5e9",
  textMid: "#a5c8a5",
  muted: "#5a7a5a",
  ivory: "#f5f0e8",
};

const FONT_DISPLAY = "'Georgia', 'Times New Roman', serif";
const FONT_BODY = "'Segoe UI', 'Helvetica Neue', sans-serif";

// Durées d'incubation en jours
const INCUBATION = {
  golliaths: 21,
  dindons: 28,
  cailles: 18,
  canards: 28,
  pintades: 26,
};

const ESPECES_CONFIG = {
  golliaths:  { label: "Poulets Goliath", emoji: "🐓", color: "#f9a825", incubation: 21 },
  dindons:    { label: "Dindons",          emoji: "🦃", color: "#bf8040" , incubation: 28 },
  cailles:    { label: "Cailles",          emoji: "🐦", color: "#7cb342" , incubation: 18 },
  canards:    { label: "Canards",          emoji: "🦆", color: "#0288d1" , incubation: 28 },
  pintades:   { label: "Pintades",         emoji: "🐔", color: "#8e6bbf" , incubation: 26 },
};

/* ══ AUTH ══ */
const USERS = [
  { id: 1, login: "admin", password: "bioterra2025", role: "Administrateur", nom: "Gestionnaire Principal" },
  { id: 2, login: "eleveur", password: "ferme123", role: "Éleveur", nom: "Responsable Élevage" },
];

/* ══ HELPERS ══ */
const today = () => new Date().toISOString().split("T")[0];
const fmt = (n) => Number(n || 0).toLocaleString("fr-FR");
const fmtDate = (d) => d ? new Date(d + "T12:00:00").toLocaleDateString("fr-FR") : "—";
const addDays = (dateStr, days) => {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};
const diffDays = (d1, d2) => {
  const a = new Date(d1), b = new Date(d2);
  return Math.round((b - a) / 86400000);
};

function useLS(key, init) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(v)); }, [key, v]);
  return [v, setV];
}

/* ══ UI PRIMITIVES ══ */
const css = (obj) => Object.entries(obj).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';');

function Card({ children, style, hover }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        background: h ? C.cardHov : C.card,
        border: `1px solid ${h ? C.borderLight : C.border}`,
        borderRadius: 14, padding: 20,
        transition: "background .2s, border-color .2s",
        ...style
      }}>{children}</div>
  );
}

function Btn({ children, onClick, variant = "primary", small, full, disabled, style }) {
  const [h, setH] = useState(false);
  const bg = {
    primary: h ? C.accentDark : "#2e7d32",
    danger: h ? "#b71c1c" : C.red,
    ghost: h ? C.border : "transparent",
    gold: h ? "#a07828" : "#7a5820",
    secondary: h ? C.borderLight : C.surface,
  }[variant];
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: bg, color: C.text, border: `1px solid ${C.borderLight}`,
        borderRadius: 9, padding: small ? "5px 14px" : "10px 20px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? .5 : 1,
        fontSize: small ? 12 : 14, fontFamily: FONT_BODY,
        fontWeight: 600, letterSpacing: ".3px",
        transition: "background .15s",
        width: full ? "100%" : undefined,
        ...style
      }}>{children}</button>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, required, note }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 0 }}>
      <span style={{ color: C.textMid, fontSize: 11, fontWeight: 600, letterSpacing: ".6px", textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: C.gold }}> *</span>}
      </span>
      <input
        type={type} value={value ?? ""} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9,
          padding: "9px 13px", color: C.text, fontSize: 14, fontFamily: FONT_BODY,
          outline: "none", width: "100%", boxSizing: "border-box",
          transition: "border-color .15s",
        }}
        onFocus={e => e.target.style.borderColor = C.accent}
        onBlur={e => e.target.style.borderColor = C.border}
      />
      {note && <span style={{ color: C.muted, fontSize: 11 }}>{note}</span>}
    </label>
  );
}

function Sel({ label, value, onChange, options, required }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 0 }}>
      <span style={{ color: C.textMid, fontSize: 11, fontWeight: 600, letterSpacing: ".6px", textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: C.gold }}> *</span>}
      </span>
      <select value={value ?? ""} onChange={e => onChange(e.target.value)} style={{
        background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9,
        padding: "9px 13px", color: C.text, fontSize: 14, fontFamily: FONT_BODY,
        cursor: "pointer", outline: "none",
      }}>
        <option value="">— Choisir —</option>
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </label>
  );
}

function Badge({ children, color, small }) {
  return (
    <span style={{
      background: color + "25", color, border: `1px solid ${color}50`,
      borderRadius: 6, padding: small ? "1px 7px" : "3px 9px",
      fontSize: small ? 10 : 12, fontWeight: 700, whiteSpace: "nowrap"
    }}>{children}</span>
  );
}

function Modal({ title, subtitle, onClose, children, wide }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000b", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: C.card, border: `1px solid ${C.borderLight}`,
        borderRadius: 18, padding: 30, width: "100%",
        maxWidth: wide ? 700 : 580, maxHeight: "92vh", overflowY: "auto",
        boxShadow: `0 24px 80px #000a`,
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <h3 style={{ margin: 0, color: C.text, fontFamily: FONT_DISPLAY, fontSize: 20 }}>{title}</h3>
            {subtitle && <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 12 }}>{subtitle}</p>}
          </div>
          <Btn variant="ghost" small onClick={onClose} style={{ borderRadius: 8, padding: "4px 10px" }}>✕</Btn>
        </div>
        {children}
      </div>
    </div>
  );
}

function Row({ children, gap = 12 }) {
  return <div style={{ display: "flex", gap, flexWrap: "wrap" }}>{children}</div>;
}

function SectionTitle({ children, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <h4 style={{ margin: 0, color: C.text, fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600 }}>{children}</h4>
      {action}
    </div>
  );
}

function StatCard({ icon, value, label, color, sub }) {
  return (
    <Card style={{ padding: "16px 18px", flex: 1, minWidth: 120 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: (color || C.accent) + "20",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0,
        }}>{icon}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: color || C.text, lineHeight: 1.1 }}>{value}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 3, textTransform: "uppercase", letterSpacing: ".5px" }}>{label}</div>
          {sub && <div style={{ fontSize: 12, color: C.textMid, marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
    </Card>
  );
}

function Table({ cols, rows, onDelete, emptyMsg }) {
  if (!rows?.length) return (
    <div style={{ textAlign: "center", padding: "32px 16px", color: C.muted, fontSize: 13 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
      {emptyMsg || "Aucune entrée enregistrée"}
    </div>
  );
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: C.surface }}>
            {cols.map(c => (
              <th key={c.key} style={{
                padding: "10px 14px", color: C.muted, textAlign: "left",
                fontWeight: 700, fontSize: 11, letterSpacing: ".6px", textTransform: "uppercase",
                borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap"
              }}>{c.label}</th>
            ))}
            {onDelete && <th style={{ width: 40, borderBottom: `1px solid ${C.border}` }}></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || i} style={{
              borderBottom: `1px solid ${C.border}20`,
              background: i % 2 === 0 ? "transparent" : C.surface + "60",
              transition: "background .1s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = C.accentGlow}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "transparent" : C.surface + "60"}
            >
              {cols.map(c => (
                <td key={c.key} style={{ padding: "9px 14px", color: C.text, verticalAlign: "middle" }}>
                  {c.render ? c.render(r[c.key], r) : (r[c.key] ?? "—")}
                </td>
              ))}
              {onDelete && (
                <td style={{ padding: "6px 8px", textAlign: "center" }}>
                  <button onClick={() => onDelete(i)} style={{
                    background: C.redDim, border: `1px solid ${C.red}40`, borderRadius: 6,
                    color: C.red, cursor: "pointer", padding: "3px 8px", fontSize: 12,
                  }}>🗑</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 20,
      borderBottom: `1px solid ${C.border}`, paddingBottom: 0,
    }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)} style={{
          background: "transparent",
          color: active === t.key ? C.accent : C.muted,
          border: "none", borderBottom: active === t.key ? `2px solid ${C.accent}` : "2px solid transparent",
          padding: "10px 16px", cursor: "pointer", fontSize: 13, fontFamily: FONT_BODY,
          fontWeight: active === t.key ? 700 : 400,
          transition: "color .15s", whiteSpace: "nowrap", marginBottom: -1,
        }}>{t.icon && <span style={{ marginRight: 6 }}>{t.icon}</span>}{t.label}</button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ÉCRAN DE CONNEXION
═══════════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.login === login && u.password === password);
      if (user) { onLogin(user); }
      else { setError("Identifiant ou mot de passe incorrect."); }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT_BODY, padding: 16,
      backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 0%, ${C.accentGlow}, transparent)`,
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: `linear-gradient(135deg, ${C.accentDark}, #1b5e20)`,
            border: `2px solid ${C.borderLight}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, margin: "0 auto 16px",
            boxShadow: `0 8px 32px ${C.accentGlow}`,
          }}>🌱</div>
          <h1 style={{
            margin: 0, fontFamily: FONT_DISPLAY, fontSize: 28,
            color: C.text, fontWeight: 400, letterSpacing: "1px",
          }}>Bioterra Nexus</h1>
          <p style={{ margin: "6px 0 0", color: C.muted, fontSize: 13, letterSpacing: ".5px" }}>
            SYSTÈME DE GESTION D'ÉLEVAGE
          </p>
        </div>

        {/* Carte de connexion */}
        <Card style={{ padding: "32px 28px" }}>
          <h3 style={{ margin: "0 0 24px", color: C.textMid, fontSize: 13, fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase" }}>
            Connexion
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Identifiant" value={login} onChange={setLogin} placeholder="Votre identifiant" required />

            <div style={{ position: "relative" }}>
              <Input
                label="Mot de passe" value={password}
                onChange={setPassword} type={showPwd ? "text" : "password"}
                placeholder="••••••••" required
              />
              <button onClick={() => setShowPwd(p => !p)} style={{
                position: "absolute", right: 12, bottom: 10,
                background: "none", border: "none", color: C.muted,
                cursor: "pointer", fontSize: 16,
              }}>{showPwd ? "🙈" : "👁"}</button>
            </div>

            {error && (
              <div style={{
                background: C.redDim, border: `1px solid ${C.red}40`,
                borderRadius: 8, padding: "10px 14px", color: C.red, fontSize: 13,
              }}>⚠ {error}</div>
            )}

            <Btn onClick={handleSubmit} full disabled={loading || !login || !password}
              style={{ marginTop: 8, padding: "13px", fontSize: 15, letterSpacing: ".5px" }}>
              {loading ? "Connexion en cours…" : "Se connecter"}
            </Btn>
          </div>

        </Card>

        <p style={{ textAlign: "center", color: C.muted, fontSize: 11, marginTop: 20, letterSpacing: ".3px" }}>
          © 2025 Bioterra Nexus · Tous droits réservés
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODULE LAPINS — Saillies liées aux mises-bas
═══════════════════════════════════════════════════════════════ */
function ModuleLapins({ data, setData, addRecord, deleteRecord }) {
  const [tab, setTab] = useState("sujets");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const add = async (s, e) => {
    setSaving(true);
    try { await addRecord(s, e); setModal(null); setForm({}); }
    finally { setSaving(false); }
  };
  const del = async (s, i) => { await deleteRecord(s, i); };

  const sujetsActifs = (data.sujets || []).filter(s => s.statut === "Actif");
  const femelles = sujetsActifs.filter(s => s.sexe === "F");
  const males = sujetsActifs.filter(s => s.sexe === "M");
  const sailliesOuvertes = (data.saillies || []).filter(s => !s.miseBas);

  const tabs = [
    { key: "sujets", label: "Sujets", icon: "🐇" },
    { key: "saillies", label: "Saillies", icon: "🔗" },
    { key: "mises_bas", label: "Mises-bas", icon: "🐣" },
    { key: "traitements", label: "Traitements", icon: "💉" },
    { key: "ventes", label: "Ventes", icon: "💰" },
    { key: "deces", label: "Décès", icon: "📋" },
    { key: "provende", label: "Provende", icon: "🌾" },
  ];

  // Lier une mise-bas à une saillie
  const marquerMiseBas = async (saillieId, mbData) => {
    setSaving(true);
    try {
      await addRecord("mises_bas", { ...mbData, saillieId });
      setModal(null); setForm({});
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon="🐇" value={sujetsActifs.length} label="Sujets actifs" color={C.accent} />
        <StatCard icon="♂" value={males.length} label="Mâles" color={C.blue} />
        <StatCard icon="♀" value={femelles.length} label="Femelles" color="#e91e8c" />
        <StatCard icon="🤰" value={sailliesOuvertes.length} label="Saillies en attente" color={C.gold} />
      </div>

      <Card>
        <Tabs tabs={tabs} active={tab} onChange={setTab} />

        {/* SUJETS */}
        {tab === "sujets" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({}); setModal("sujet"); }}>+ Nouveau sujet</Btn>}>
            Registre des sujets
          </SectionTitle>
          <Table
            cols={[
              { key: "code", label: "Matricule" },
              { key: "race", label: "Race" },
              { key: "sexe", label: "Sexe", render: v => <Badge color={v === "M" ? C.blue : "#e91e8c"}>{v === "M" ? "♂ Mâle" : "♀ Femelle"}</Badge> },
              { key: "dateNaiss", label: "Naissance", render: fmtDate },
              { key: "poids", label: "Poids (kg)" },
              { key: "statut", label: "Statut", render: v => <Badge color={v === "Actif" ? C.accent : C.red}>{v}</Badge> },
              { key: "notes", label: "Notes" },
            ]}
            rows={data.sujets || []} onDelete={i => del("sujets", i)}
          />
        </>}

        {/* SAILLIES */}
        {tab === "saillies" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("saillie"); }}>+ Enregistrer saillie</Btn>}>
            Registre des saillies
          </SectionTitle>
          <Table
            cols={[
              { key: "date", label: "Date saillie", render: fmtDate },
              { key: "femelle", label: "Femelle" },
              { key: "male", label: "Mâle" },
              { key: "datePrevue", label: "Mise-bas prévue", render: v => <span style={{ color: C.gold }}>{fmtDate(v)}</span> },
              { key: "miseBas", label: "Mise-bas", render: v => v
                ? <Badge color={C.accent}>✔ {fmtDate(v.date)}</Badge>
                : <Badge color={C.gold}>En attente</Badge> },
            ]}
            rows={data.saillies || []} onDelete={i => del("saillies", i)}
            emptyMsg="Aucune saillie enregistrée"
          />
        </>}

        {/* MISES BAS */}
        {tab === "mises_bas" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("mise_bas"); }}>+ Enregistrer mise-bas</Btn>}>
            Registre des mises-bas
          </SectionTitle>
          <Table
            cols={[
              { key: "date", label: "Date mise-bas", render: fmtDate },
              { key: "saillieRef", label: "Saillie liée", render: (v, r) => {
                const s = (data.saillies || []).find(s => s.id === r.saillieId);
                return s ? <span style={{ color: C.textMid, fontSize: 12 }}>Saillie du {fmtDate(s.date)} — {s.femelle}</span> : <Badge color={C.muted}>Non liée</Badge>;
              }},
              { key: "nbNes", label: "Nés" },
              { key: "nbVivants", label: "Vivants", render: v => <span style={{ color: C.accent, fontWeight: 700 }}>{v}</span> },
              { key: "nbMorts", label: "Morts-nés", render: v => v > 0 ? <span style={{ color: C.red }}>{v}</span> : "0" },
              { key: "notes", label: "Notes" },
            ]}
            rows={data.mises_bas || []} onDelete={i => del("mises_bas", i)}
          />
        </>}

        {/* TRAITEMENTS */}
        {tab === "traitements" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("traitement"); }}>+ Traitement</Btn>}>
            Registre des traitements vétérinaires
          </SectionTitle>
          <Table
            cols={[
              { key: "date", label: "Date", render: fmtDate },
              { key: "sujet", label: "Sujet / Lot" },
              { key: "produit", label: "Produit" },
              { key: "dose", label: "Dose" },
              { key: "voie", label: "Voie" },
              { key: "motif", label: "Motif" },
              { key: "effectue", label: "Par" },
            ]}
            rows={data.traitements || []} onDelete={i => del("traitements", i)}
          />
        </>}

        {/* VENTES */}
        {tab === "ventes" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("vente"); }}>+ Vente</Btn>}>
            Registre des ventes
          </SectionTitle>
          <Table
            cols={[
              { key: "date", label: "Date", render: fmtDate },
              { key: "qte", label: "Qté" },
              { key: "poids", label: "Poids (kg)" },
              { key: "prixKg", label: "Prix/kg (FCFA)", render: v => fmt(v) },
              { key: "_total", label: "Total (FCFA)", render: (_, r) => <strong style={{ color: C.gold }}>{fmt((r.poids || 0) * (r.prixKg || 0))}</strong> },
              { key: "acheteur", label: "Acheteur" },
            ]}
            rows={data.ventes || []} onDelete={i => del("ventes", i)}
          />
        </>}

        {/* DECES */}
        {tab === "deces" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("deces"); }}>+ Décès</Btn>}>
            Registre des décès
          </SectionTitle>
          <Table
            cols={[
              { key: "date", label: "Date", render: fmtDate },
              { key: "sujet", label: "Sujet" },
              { key: "cause", label: "Cause présumée" },
              { key: "age", label: "Âge" },
              { key: "notes", label: "Notes" },
            ]}
            rows={data.deces || []} onDelete={i => del("deces", i)}
          />
        </>}

        {/* PROVENDE */}
        {tab === "provende" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("provende"); }}>+ Achat</Btn>}>
            Registre de la provende
          </SectionTitle>
          <Table
            cols={[
              { key: "date", label: "Date", render: fmtDate },
              { key: "type", label: "Type aliment" },
              { key: "qte", label: "Quantité (kg)" },
              { key: "prix", label: "Prix (FCFA)", render: v => fmt(v) },
              { key: "fournisseur", label: "Fournisseur" },
            ]}
            rows={data.provende || []} onDelete={i => del("provende", i)}
          />
        </>}
      </Card>

      {/* ── MODALES ── */}
      {modal === "sujet" && (
        <Modal title="Nouveau sujet lapin" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row><Input label="Matricule *" value={form.code} onChange={f("code")} required /><Input label="Race" value={form.race} onChange={f("race")} /></Row>
            <Row>
              <Sel label="Sexe *" value={form.sexe} onChange={f("sexe")} required options={[{ value: "M", label: "♂ Mâle" }, { value: "F", label: "♀ Femelle" }]} />
              <Input label="Date de naissance" value={form.dateNaiss} onChange={f("dateNaiss")} type="date" />
            </Row>
            <Row><Input label="Poids (kg)" value={form.poids} onChange={f("poids")} type="number" />
              <Sel label="Statut" value={form.statut || "Actif"} onChange={f("statut")} options={["Actif", "Vendu", "Décédé", "Réformé"]} />
            </Row>
            <Input label="Notes" value={form.notes} onChange={f("notes")} />
            <Btn full onClick={() => add("sujets", { ...form, statut: form.statut || "Actif" })}>Enregistrer</Btn>
          </div>
        </Modal>
      )}

      {modal === "saillie" && (
        <Modal title="Enregistrer une saillie" subtitle="La saillie sera liée à la mise-bas ultérieure" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Date de saillie *" value={form.date || today()} onChange={f("date")} type="date" required />
            <Row>
              <Sel label="Femelle *" value={form.femelle} onChange={v => {
                f("femelle")(v);
                // Calcul mise-bas prévue 31 jours
                const d = form.date || today();
                f("datePrevue")(addDays(d, 31));
              }} required options={femelles.map(s => ({ value: s.code, label: `${s.code} — ${s.race || ""}` }))} />
              <Sel label="Mâle *" value={form.male} onChange={f("male")} required options={males.map(s => ({ value: s.code, label: `${s.code} — ${s.race || ""}` }))} />
            </Row>
            <Input label="Date mise-bas prévue (≈31 jours)" value={form.datePrevue} onChange={f("datePrevue")} type="date" note="Calculée automatiquement, modifiable" />
            <Input label="Notes" value={form.notes} onChange={f("notes")} />
            <Btn full onClick={() => add("saillies", { ...form, miseBas: null })}>Enregistrer la saillie</Btn>
          </div>
        </Modal>
      )}

      {modal === "mise_bas" && (
        <Modal title="Enregistrer une mise-bas" subtitle="Vous pouvez lier cette mise-bas à une saillie existante" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Date de mise-bas *" value={form.date || today()} onChange={f("date")} type="date" required />
            <Sel label="Lier à une saillie (optionnel)" value={form.saillieId} onChange={f("saillieId")}
              options={(data.saillies || []).map(s => ({ value: s.id, label: `${fmtDate(s.date)} — ${s.femelle} × ${s.male}` }))}
            />
            <Row>
              <Input label="Nés total *" value={form.nbNes} onChange={v => { f("nbNes")(v); f("nbVivants")(v); }} type="number" required />
              <Input label="Vivants" value={form.nbVivants} onChange={f("nbVivants")} type="number" />
            </Row>
            <Input label="Morts-nés" value={form.nbMorts} onChange={f("nbMorts")} type="number" />
            <Input label="Notes" value={form.notes} onChange={f("notes")} />
            <Btn full onClick={() => {
              if (form.saillieId) {
                marquerMiseBas(Number(form.saillieId), form);
              } else {
                add("mises_bas", form);
              }
            }}>Enregistrer la mise-bas</Btn>
          </div>
        </Modal>
      )}

      {modal === "traitement" && (
        <Modal title="Traitement vétérinaire" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row><Input label="Date *" value={form.date} onChange={f("date")} type="date" required /><Input label="Sujet / Lot" value={form.sujet} onChange={f("sujet")} /></Row>
            <Row><Input label="Produit *" value={form.produit} onChange={f("produit")} required /><Input label="Dose" value={form.dose} onChange={f("dose")} /></Row>
            <Row>
              <Sel label="Voie d'administration" value={form.voie} onChange={f("voie")} options={["Orale", "Injectable", "Cutanée", "Autre"]} />
              <Input label="Effectué par" value={form.effectue} onChange={f("effectue")} />
            </Row>
            <Input label="Motif / Diagnostic" value={form.motif} onChange={f("motif")} />
            <Btn full onClick={() => add("traitements", form)}>Enregistrer</Btn>
          </div>
        </Modal>
      )}

      {modal === "vente" && (
        <Modal title="Vente de lapins" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row><Input label="Date *" value={form.date} onChange={f("date")} type="date" required /><Input label="Quantité" value={form.qte} onChange={f("qte")} type="number" /></Row>
            <Row><Input label="Poids total (kg)" value={form.poids} onChange={f("poids")} type="number" /><Input label="Prix / kg (FCFA)" value={form.prixKg} onChange={f("prixKg")} type="number" /></Row>
            <Input label="Acheteur" value={form.acheteur} onChange={f("acheteur")} />
            <Btn full onClick={() => add("ventes", form)}>Enregistrer</Btn>
          </div>
        </Modal>
      )}

      {modal === "deces" && (
        <Modal title="Enregistrer un décès" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row><Input label="Date *" value={form.date} onChange={f("date")} type="date" required /><Input label="Matricule sujet" value={form.sujet} onChange={f("sujet")} /></Row>
            <Row><Input label="Cause présumée" value={form.cause} onChange={f("cause")} /><Input label="Âge estimé" value={form.age} onChange={f("age")} /></Row>
            <Input label="Notes" value={form.notes} onChange={f("notes")} />
            <Btn full onClick={() => add("deces", form)}>Enregistrer</Btn>
          </div>
        </Modal>
      )}

      {modal === "provende" && (
        <Modal title="Achat de provende / aliment" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row><Input label="Date *" value={form.date} onChange={f("date")} type="date" required /><Input label="Type d'aliment" value={form.type} onChange={f("type")} /></Row>
            <Row><Input label="Quantité (kg)" value={form.qte} onChange={f("qte")} type="number" /><Input label="Prix total (FCFA)" value={form.prix} onChange={f("prix")} type="number" /></Row>
            <Input label="Fournisseur" value={form.fournisseur} onChange={f("fournisseur")} />
            <Btn full onClick={() => add("provende", form)}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODULE VOLAILLE (Goliath, Dindon, Caille, Canard, Pintade)
   Cycle : Géniteurs → Œufs → Couvaison → Éclosion (poussins) → Lots d'engraissement → Ventes
═══════════════════════════════════════════════════════════════ */
function ModuleVolaille({ espece, config, data, setData, addRecord, deleteRecord }) {
  const [tab, setTab] = useState("geniteurs");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const add = async (s, e) => { setSaving(true); try { await addRecord(s, e); setModal(null); setForm({}); } finally { setSaving(false); } };
  const del = async (s, i) => { await deleteRecord(s, i); };

  const totalGeniteurs = (data.geniteurs || []).filter(g => g.statut === "Actif").length;
  const totalOeufs = (data.couvee || []).reduce((s, c) => s + Number(c.nbOeufs || 0), 0);
  const totalEclos = (data.couvee || []).reduce((s, c) => s + Number(c.nbEclos || 0), 0);
  const totalLots = (data.lots || []).reduce((s, l) => s + Number(l.effectif || 0), 0);
  const totalDeces = (data.deces || []).reduce((s, d) => s + Number(d.nb || 0), 0);
  const totalVendus = (data.ventes || []).reduce((s, v) => s + Number(v.qte || 0), 0);
  const revenus = (data.ventes || []).reduce((s, v) => s + (Number(v.poids || 0) * Number(v.prixKg || 0)), 0);

  const tabs = [
    { key: "geniteurs", label: "Géniteurs", icon: "🥚" },
    { key: "couvee", label: `Œufs & Éclosions (${config.incubation}j)`, icon: "🔆" },
    { key: "lots", label: "Lots d'engraissement", icon: "🐥" },
    { key: "deces", label: "Décès", icon: "📋" },
    { key: "ventes", label: "Ventes", icon: "💰" },
    { key: "traitements", label: "Traitements", icon: "💉" },
    { key: "provende", label: "Provende", icon: "🌾" },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon="🔆" value={totalGeniteurs} label="Géniteurs actifs" color={config.color} />
        <StatCard icon="🥚" value={fmt(totalOeufs)} label="Œufs mis en couv." color={C.gold} />
        <StatCard icon="🐥" value={fmt(totalEclos)} label="Total éclos" color={C.accent}
          sub={totalOeufs > 0 ? `Taux : ${Math.round(totalEclos / totalOeufs * 100)}%` : null} />
        <StatCard icon="📦" value={fmt(totalLots - totalDeces - totalVendus)} label="Stock actuel" color={config.color} />
        <StatCard icon="💰" value={fmt(revenus) + " F"} label="Revenus ventes" color={C.gold} />
      </div>

      <Card>
        <Tabs tabs={tabs} active={tab} onChange={setTab} />

        {/* GÉNITEURS */}
        {tab === "geniteurs" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({}); setModal("geniteur"); }}>+ Géniteur</Btn>}>
            Reproducteurs {config.emoji}
          </SectionTitle>
          <Table
            cols={[
              { key: "code", label: "Identifiant" },
              { key: "sexe", label: "Sexe", render: v => <Badge color={v === "M" ? C.blue : "#e91e8c"}>{v === "M" ? "♂" : "♀"}</Badge> },
              { key: "race", label: "Lignée / Race" },
              { key: "dateEntree", label: "Entrée", render: fmtDate },
              { key: "statut", label: "Statut", render: v => <Badge color={v === "Actif" ? C.accent : C.red}>{v}</Badge> },
            ]}
            rows={data.geniteurs || []} onDelete={i => del("geniteurs", i)}
          />
        </>}

        {/* COUVÉE */}
        {tab === "couvee" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ dateMise: today(), nbOeufs: "" }); setModal("couvee"); }}>+ Mise en couvaison</Btn>}>
            Suivi des vagues d'œufs — Incubation : <span style={{ color: config.color }}>{config.incubation} jours</span>
          </SectionTitle>
          <Table
            cols={[
              { key: "ref", label: "Référence" },
              { key: "dateMise", label: "Mise en couv.", render: fmtDate },
              { key: "nbOeufs", label: "Œufs déposés" },
              { key: "dateEclos", label: "Éclosion prévue", render: v => <span style={{ color: C.gold }}>{fmtDate(v)}</span> },
              { key: "dateEclosReelle", label: "Éclosion réelle", render: fmtDate },
              { key: "nbEclos", label: "Éclos (poussins)", render: v => v != null ? <span style={{ color: C.accent, fontWeight: 700 }}>{v}</span> : <Badge color={C.gold}>En attente</Badge> },
              { key: "taux", label: "Taux", render: (_, r) => r.nbOeufs && r.nbEclos != null
                ? <Badge color={r.nbEclos / r.nbOeufs > .6 ? C.accent : C.red}>{Math.round(r.nbEclos / r.nbOeufs * 100)}%</Badge>
                : "—" },
            ]}
            rows={data.couvee || []} onDelete={i => del("couvee", i)}
            emptyMsg="Aucune vague d'œufs enregistrée"
          />
          {/* Bouton pour enregistrer l'éclosion d'une vague en attente */}
          {(data.couvee || []).some(c => c.nbEclos == null) && (
            <div style={{ marginTop: 12 }}>
              <p style={{ color: C.textMid, fontSize: 13, margin: "0 0 8px" }}>Vagues en attente d'éclosion :</p>
              {(data.couvee || []).filter(c => c.nbEclos == null).map((c, i) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ color: C.text, fontSize: 13 }}>{c.ref} — {c.nbOeufs} œufs — Prévue le {fmtDate(c.dateEclos)}</span>
                  <Btn small variant="gold" onClick={() => { setForm({ couveeId: c.id, dateEclosReelle: today() }); setModal("eclosion"); }}>
                    Enregistrer l'éclosion
                  </Btn>
                </div>
              ))}
            </div>
          )}
        </>}

        {/* LOTS D'ENGRAISSEMENT */}
        {tab === "lots" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({}); setModal("lot"); }}>+ Nouveau lot</Btn>}>
            Lots d'engraissement — Tri par gabarit
          </SectionTitle>
          <p style={{ color: C.muted, fontSize: 12, margin: "-8px 0 16px" }}>
            Les poussins éclos sont répartis en lots selon leur gabarit pour un suivi précis.
          </p>
          <Table
            cols={[
              { key: "nom", label: "Nom du lot" },
              { key: "couveeRef", label: "Vague d'origine" },
              { key: "dateEntree", label: "Date entrée", render: fmtDate },
              { key: "effectif", label: "Effectif initial" },
              { key: "gabarit", label: "Gabarit", render: v => <Badge color={v === "Grand" ? C.gold : v === "Moyen" ? C.accent : C.blue}>{v}</Badge> },
              { key: "poidsMoy", label: "Poids moy. (kg)" },
              { key: "age", label: "Âge (sem.)" },
            ]}
            rows={data.lots || []} onDelete={i => del("lots", i)}
          />
        </>}

        {/* DÉCÈS */}
        {tab === "deces" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("deces"); }}>+ Décès</Btn>}>
            Registre des décès
          </SectionTitle>
          <Table
            cols={[
              { key: "date", label: "Date", render: fmtDate },
              { key: "lot", label: "Lot" },
              { key: "nb", label: "Nombre", render: v => <span style={{ color: C.red, fontWeight: 700 }}>{v}</span> },
              { key: "cause", label: "Cause présumée" },
              { key: "notes", label: "Notes" },
            ]}
            rows={data.deces || []} onDelete={i => del("deces", i)}
          />
        </>}

        {/* VENTES */}
        {tab === "ventes" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("vente"); }}>+ Vente</Btn>}>
            Registre des ventes
          </SectionTitle>
          <Table
            cols={[
              { key: "date", label: "Date", render: fmtDate },
              { key: "lot", label: "Lot" },
              { key: "qte", label: "Quantité" },
              { key: "poids", label: "Poids total (kg)" },
              { key: "prixKg", label: "Prix/kg (FCFA)", render: v => fmt(v) },
              { key: "_total", label: "Total FCFA", render: (_, r) => <strong style={{ color: C.gold }}>{fmt((r.poids || 0) * (r.prixKg || 0))}</strong> },
              { key: "acheteur", label: "Acheteur" },
            ]}
            rows={data.ventes || []} onDelete={i => del("ventes", i)}
          />
        </>}

        {/* TRAITEMENTS */}
        {tab === "traitements" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("traitement"); }}>+ Traitement</Btn>}>
            Registre des traitements
          </SectionTitle>
          <Table
            cols={[
              { key: "date", label: "Date", render: fmtDate },
              { key: "lot", label: "Lot" },
              { key: "produit", label: "Produit" },
              { key: "dose", label: "Dose" },
              { key: "motif", label: "Motif" },
            ]}
            rows={data.traitements || []} onDelete={i => del("traitements", i)}
          />
        </>}

        {/* PROVENDE */}
        {tab === "provende" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("provende"); }}>+ Achat</Btn>}>
            Registre de la provende
          </SectionTitle>
          <Table
            cols={[
              { key: "date", label: "Date", render: fmtDate },
              { key: "type", label: "Type aliment" },
              { key: "qte", label: "Quantité (kg)" },
              { key: "prix", label: "Prix (FCFA)", render: v => fmt(v) },
              { key: "fournisseur", label: "Fournisseur" },
            ]}
            rows={data.provende || []} onDelete={i => del("provende", i)}
          />
        </>}
      </Card>

      {/* ── MODALES ── */}
      {modal === "geniteur" && (
        <Modal title="Nouveau géniteur" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row>
              <Input label="Identifiant *" value={form.code} onChange={f("code")} required />
              <Sel label="Sexe *" value={form.sexe} onChange={f("sexe")} required options={[{ value: "M", label: "♂ Mâle" }, { value: "F", label: "♀ Femelle" }]} />
            </Row>
            <Row>
              <Input label="Lignée / Race" value={form.race} onChange={f("race")} />
              <Input label="Date d'entrée" value={form.dateEntree || today()} onChange={f("dateEntree")} type="date" />
            </Row>
            <Sel label="Statut" value={form.statut || "Actif"} onChange={f("statut")} options={["Actif", "Réformé", "Décédé"]} />
            <Btn full onClick={() => add("geniteurs", { ...form, statut: form.statut || "Actif" })}>Enregistrer</Btn>
          </div>
        </Modal>
      )}

      {modal === "couvee" && (
        <Modal title="Mise en couvaison" subtitle={`Durée d'incubation : ${config.incubation} jours`} onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row>
              <Input label="Référence vague *" value={form.ref} onChange={f("ref")} required placeholder="ex: V2025-01" />
              <Input label="Date de mise en couvaison *" value={form.dateMise || today()} onChange={v => {
                f("dateMise")(v); f("dateEclos")(addDays(v, config.incubation));
              }} type="date" required />
            </Row>
            <Row>
              <Input label="Nombre d'œufs déposés *" value={form.nbOeufs} onChange={f("nbOeufs")} type="number" required />
              <Input label="Éclosion prévue (auto)" value={form.dateEclos} onChange={f("dateEclos")} type="date"
                note={`Calculée : ${config.incubation} jours après mise`} />
            </Row>
            <Input label="Notes" value={form.notes} onChange={f("notes")} />
            <Btn full onClick={() => add("couvee", { ...form, nbEclos: null })}>Enregistrer la vague</Btn>
          </div>
        </Modal>
      )}

      {modal === "eclosion" && (
        <Modal title="Résultat d'éclosion" subtitle="Saisissez les résultats de la vague" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Date d'éclosion réelle *" value={form.dateEclosReelle || today()} onChange={f("dateEclosReelle")} type="date" required />
            <Input label="Nombre de poussins éclos *" value={form.nbEclos} onChange={f("nbEclos")} type="number" required />
            <Input label="Notes / Observations" value={form.notes} onChange={f("notes")} />
            <Btn full disabled={saving} onClick={async () => {
              setSaving(true);
              try {
                // Trouver la vague concernée et mettre à jour son enregistrement
                const couvee = (data.couvee || []).find(c => c.id === form.couveeId);
                if (couvee?._rowId) {
                  await supa.updateRecord(couvee._rowId, { ...couvee, nbEclos: Number(form.nbEclos), dateEclosReelle: form.dateEclosReelle, notesEclos: form.notes });
                }
                await setData({});
                setModal(null); setForm({});
              } finally { setSaving(false); }
            }}>{saving ? "Enregistrement…" : "Valider l'éclosion"}</Btn>
          </div>
        </Modal>
      )}

      {modal === "lot" && (
        <Modal title="Nouveau lot d'engraissement" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row>
              <Input label="Nom du lot *" value={form.nom} onChange={f("nom")} required placeholder="ex: LOT-A01" />
              <Input label="Date d'entrée" value={form.dateEntree || today()} onChange={f("dateEntree")} type="date" />
            </Row>
            <Row>
              <Input label="Effectif *" value={form.effectif} onChange={f("effectif")} type="number" required />
              <Sel label="Vague d'origine" value={form.couveeRef} onChange={f("couveeRef")}
                options={(data.couvee || []).filter(c => c.nbEclos > 0).map(c => ({ value: c.ref, label: `${c.ref} — ${c.nbEclos} éclos` }))} />
            </Row>
            <Row>
              <Sel label="Gabarit" value={form.gabarit || "Moyen"} onChange={f("gabarit")} options={["Grand", "Moyen", "Petit"]} />
              <Input label="Poids moyen (kg)" value={form.poidsMoy} onChange={f("poidsMoy")} type="number" />
            </Row>
            <Input label="Âge (semaines)" value={form.age} onChange={f("age")} type="number" />
            <Btn full onClick={() => add("lots", { ...form, gabarit: form.gabarit || "Moyen" })}>Créer le lot</Btn>
          </div>
        </Modal>
      )}

      {modal === "deces" && (
        <Modal title="Enregistrer des décès" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row>
              <Input label="Date *" value={form.date} onChange={f("date")} type="date" required />
              <Sel label="Lot" value={form.lot} onChange={f("lot")} options={(data.lots || []).map(l => ({ value: l.nom, label: l.nom }))} />
            </Row>
            <Row>
              <Input label="Nombre *" value={form.nb} onChange={f("nb")} type="number" required />
              <Input label="Cause présumée" value={form.cause} onChange={f("cause")} />
            </Row>
            <Input label="Notes" value={form.notes} onChange={f("notes")} />
            <Btn full onClick={() => add("deces", form)}>Enregistrer</Btn>
          </div>
        </Modal>
      )}

      {modal === "vente" && (
        <Modal title="Enregistrer une vente" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row>
              <Input label="Date *" value={form.date} onChange={f("date")} type="date" required />
              <Sel label="Lot" value={form.lot} onChange={f("lot")} options={(data.lots || []).map(l => ({ value: l.nom, label: l.nom }))} />
            </Row>
            <Row>
              <Input label="Quantité vendue *" value={form.qte} onChange={f("qte")} type="number" required />
              <Input label="Poids total (kg)" value={form.poids} onChange={f("poids")} type="number" />
            </Row>
            <Row>
              <Input label="Prix / kg (FCFA)" value={form.prixKg} onChange={f("prixKg")} type="number" />
              <Input label="Acheteur" value={form.acheteur} onChange={f("acheteur")} />
            </Row>
            {form.poids && form.prixKg && (
              <div style={{ background: C.goldDim, border: `1px solid ${C.gold}40`, borderRadius: 8, padding: 12, textAlign: "center" }}>
                <span style={{ color: C.gold, fontWeight: 700 }}>Total estimé : {fmt(form.poids * form.prixKg)} FCFA</span>
              </div>
            )}
            <Btn full onClick={() => add("ventes", form)}>Enregistrer la vente</Btn>
          </div>
        </Modal>
      )}

      {modal === "traitement" && (
        <Modal title="Traitement vétérinaire" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row>
              <Input label="Date *" value={form.date} onChange={f("date")} type="date" required />
              <Sel label="Lot" value={form.lot} onChange={f("lot")} options={(data.lots || []).map(l => ({ value: l.nom, label: l.nom }))} />
            </Row>
            <Row><Input label="Produit" value={form.produit} onChange={f("produit")} /><Input label="Dose" value={form.dose} onChange={f("dose")} /></Row>
            <Input label="Motif" value={form.motif} onChange={f("motif")} />
            <Btn full onClick={() => add("traitements", form)}>Enregistrer</Btn>
          </div>
        </Modal>
      )}

      {modal === "provende" && (
        <Modal title="Achat provende" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row><Input label="Date *" value={form.date} onChange={f("date")} type="date" required /><Input label="Type aliment" value={form.type} onChange={f("type")} /></Row>
            <Row><Input label="Quantité (kg)" value={form.qte} onChange={f("qte")} type="number" /><Input label="Prix (FCFA)" value={form.prix} onChange={f("prix")} type="number" /></Row>
            <Input label="Fournisseur" value={form.fournisseur} onChange={f("fournisseur")} />
            <Btn full onClick={() => add("provende", form)}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODULE GRANDS ANIMAUX (Moutons, Bœufs)
═══════════════════════════════════════════════════════════════ */
function ModuleGrandAnimal({ label, data, setData, addRecord, deleteRecord }) {
  const [tab, setTab] = useState("sujets");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const add = async (s, e) => { setSaving(true); try { await addRecord(s, e); setModal(null); setForm({}); } finally { setSaving(false); } };
  const del = async (s, i) => { await deleteRecord(s, i); };

  const tabs = [
    { key: "sujets", label: "Sujets", icon: "🐾" },
    { key: "traitements", label: "Traitements", icon: "💉" },
    { key: "ventes", label: "Ventes", icon: "💰" },
    { key: "deces", label: "Décès", icon: "📋" },
    { key: "alimentation", label: "Alimentation", icon: "🌾" },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon="🐾" value={(data.sujets || []).filter(s => s.statut === "Actif").length} label="Sujets actifs" color={C.accent} />
        <StatCard icon="💰" value={fmt((data.ventes || []).reduce((s, v) => s + Number(v.prix || 0), 0)) + " F"} label="Revenus ventes" color={C.gold} />
      </div>
      <Card>
        <Tabs tabs={tabs} active={tab} onChange={setTab} />

        {tab === "sujets" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({}); setModal("sujet"); }}>+ Sujet</Btn>}>Registre des sujets</SectionTitle>
          <Table
            cols={[
              { key: "code", label: "Code / Nom" },
              { key: "sexe", label: "Sexe", render: v => <Badge color={v === "M" ? C.blue : "#e91e8c"}>{v === "M" ? "♂ Mâle" : "♀ Femelle"}</Badge> },
              { key: "race", label: "Race" },
              { key: "dateEntree", label: "Entrée", render: fmtDate },
              { key: "poids", label: "Poids (kg)" },
              { key: "statut", label: "Statut", render: v => <Badge color={v === "Actif" ? C.accent : C.red}>{v}</Badge> },
            ]}
            rows={data.sujets || []} onDelete={i => del("sujets", i)}
          />
        </>}

        {tab === "traitements" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("traitement"); }}>+ Traitement</Btn>}>Traitements vétérinaires</SectionTitle>
          <Table cols={[
            { key: "date", label: "Date", render: fmtDate },
            { key: "sujet", label: "Sujet" },
            { key: "produit", label: "Produit" },
            { key: "dose", label: "Dose" },
            { key: "motif", label: "Motif" },
          ]} rows={data.traitements || []} onDelete={i => del("traitements", i)} />
        </>}

        {tab === "ventes" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("vente"); }}>+ Vente</Btn>}>Ventes</SectionTitle>
          <Table cols={[
            { key: "date", label: "Date", render: fmtDate },
            { key: "sujet", label: "Sujet" },
            { key: "poids", label: "Poids (kg)" },
            { key: "prix", label: "Prix (FCFA)", render: v => <strong style={{ color: C.gold }}>{fmt(v)}</strong> },
            { key: "acheteur", label: "Acheteur" },
          ]} rows={data.ventes || []} onDelete={i => del("ventes", i)} />
        </>}

        {tab === "deces" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("deces"); }}>+ Décès</Btn>}>Décès</SectionTitle>
          <Table cols={[
            { key: "date", label: "Date", render: fmtDate },
            { key: "sujet", label: "Sujet" },
            { key: "cause", label: "Cause" },
            { key: "notes", label: "Notes" },
          ]} rows={data.deces || []} onDelete={i => del("deces", i)} />
        </>}

        {tab === "alimentation" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("alim"); }}>+ Entrée</Btn>}>Alimentation</SectionTitle>
          <Table cols={[
            { key: "date", label: "Date", render: fmtDate },
            { key: "type", label: "Type" },
            { key: "qte", label: "Quantité (kg)" },
            { key: "prix", label: "Prix (FCFA)", render: v => fmt(v) },
          ]} rows={data.alimentation || []} onDelete={i => del("alimentation", i)} />
        </>}
      </Card>

      {modal === "sujet" && (
        <Modal title={`Nouveau sujet — ${label}`} onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row>
              <Input label="Code / Nom *" value={form.code} onChange={f("code")} required />
              <Sel label="Sexe" value={form.sexe || "M"} onChange={f("sexe")} options={[{ value: "M", label: "♂ Mâle" }, { value: "F", label: "♀ Femelle" }]} />
            </Row>
            <Row>
              <Input label="Race" value={form.race} onChange={f("race")} />
              <Input label="Date d'entrée" value={form.dateEntree || today()} onChange={f("dateEntree")} type="date" />
            </Row>
            <Row>
              <Input label="Poids (kg)" value={form.poids} onChange={f("poids")} type="number" />
              <Sel label="Statut" value={form.statut || "Actif"} onChange={f("statut")} options={["Actif", "Vendu", "Décédé"]} />
            </Row>
            <Btn full onClick={() => add("sujets", { ...form, sexe: form.sexe || "M", statut: form.statut || "Actif" })}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
      {modal === "traitement" && (
        <Modal title="Traitement" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row><Input label="Date" value={form.date} onChange={f("date")} type="date" /><Input label="Sujet" value={form.sujet} onChange={f("sujet")} /></Row>
            <Row><Input label="Produit" value={form.produit} onChange={f("produit")} /><Input label="Dose" value={form.dose} onChange={f("dose")} /></Row>
            <Input label="Motif" value={form.motif} onChange={f("motif")} />
            <Btn full onClick={() => add("traitements", form)}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
      {modal === "vente" && (
        <Modal title="Vente" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row><Input label="Date" value={form.date} onChange={f("date")} type="date" /><Input label="Sujet" value={form.sujet} onChange={f("sujet")} /></Row>
            <Row><Input label="Poids (kg)" value={form.poids} onChange={f("poids")} type="number" /><Input label="Prix (FCFA)" value={form.prix} onChange={f("prix")} type="number" /></Row>
            <Input label="Acheteur" value={form.acheteur} onChange={f("acheteur")} />
            <Btn full onClick={() => add("ventes", form)}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
      {modal === "deces" && (
        <Modal title="Décès" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row><Input label="Date" value={form.date} onChange={f("date")} type="date" /><Input label="Sujet" value={form.sujet} onChange={f("sujet")} /></Row>
            <Input label="Cause" value={form.cause} onChange={f("cause")} />
            <Btn full onClick={() => add("deces", form)}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
      {modal === "alim" && (
        <Modal title="Alimentation" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row><Input label="Date" value={form.date} onChange={f("date")} type="date" /><Input label="Type" value={form.type} onChange={f("type")} /></Row>
            <Row><Input label="Quantité (kg)" value={form.qte} onChange={f("qte")} type="number" /><Input label="Prix (FCFA)" value={form.prix} onChange={f("prix")} type="number" /></Row>
            <Btn full onClick={() => add("alimentation", form)}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODULE MARAÎCHAGE
═══════════════════════════════════════════════════════════════ */
function ModuleMaraichage({ data, setData, addRecord, deleteRecord }) {
  const [tab, setTab] = useState("cultures");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const add = async (s, e) => { setSaving(true); try { await addRecord(s, e); setModal(null); setForm({}); } finally { setSaving(false); } };
  const del = async (s, i) => { await deleteRecord(s, i); };

  const tabs = [
    { key: "cultures", label: "Cultures", icon: "🌱" },
    { key: "recoltes", label: "Récoltes", icon: "🧺" },
    { key: "ventes", label: "Ventes", icon: "💰" },
    { key: "intrants", label: "Intrants", icon: "🧴" },
    { key: "traitements", label: "Traitements", icon: "💉" },
  ];

  const reventes = (data.ventes || []).reduce((s, v) => s + (Number(v.qte || 0) * Number(v.prixUnit || 0)), 0);
  const totalRec = (data.recoltes || []).reduce((s, r) => s + Number(r.qte || 0), 0);
  const totalInt = (data.intrants || []).reduce((s, i) => s + Number(i.prix || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon="🌱" value={(data.cultures || []).filter(c => c.statut === "En cours").length} label="Parcelles actives" color={C.accent} />
        <StatCard icon="🧺" value={fmt(totalRec) + " kg"} label="Total récoltes" color={C.gold} />
        <StatCard icon="💰" value={fmt(reventes) + " F"} label="Revenus" color={C.blue} />
        <StatCard icon="🧴" value={fmt(totalInt) + " F"} label="Charges intrants" color={C.red} />
      </div>
      <Card>
        <Tabs tabs={tabs} active={tab} onChange={setTab} />

        {tab === "cultures" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ statut: "En cours" }); setModal("culture"); }}>+ Culture</Btn>}>Parcelles & Cultures</SectionTitle>
          <Table cols={[
            { key: "culture", label: "Culture" },
            { key: "parcelle", label: "Parcelle" },
            { key: "surface", label: "Surface (m²)" },
            { key: "dateSemis", label: "Semis", render: fmtDate },
            { key: "dateRecolte", label: "Récolte prévue", render: v => <span style={{ color: C.gold }}>{fmtDate(v)}</span> },
            { key: "statut", label: "Statut", render: v => <Badge color={v === "En cours" ? C.accent : v === "Récolté" ? C.gold : C.red}>{v}</Badge> },
          ]} rows={data.cultures || []} onDelete={i => del("cultures", i)} />
        </>}

        {tab === "recoltes" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("recolte"); }}>+ Récolte</Btn>}>Récoltes</SectionTitle>
          <Table cols={[
            { key: "date", label: "Date", render: fmtDate },
            { key: "culture", label: "Culture" },
            { key: "parcelle", label: "Parcelle" },
            { key: "qte", label: "Quantité (kg)" },
            { key: "qualite", label: "Qualité", render: v => <Badge color={v === "Bonne" ? C.accent : v === "Moyenne" ? C.gold : C.red}>{v}</Badge> },
          ]} rows={data.recoltes || []} onDelete={i => del("recoltes", i)} />
        </>}

        {tab === "ventes" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("vente"); }}>+ Vente</Btn>}>Ventes</SectionTitle>
          <Table cols={[
            { key: "date", label: "Date", render: fmtDate },
            { key: "culture", label: "Produit" },
            { key: "qte", label: "Qté (kg)" },
            { key: "prixUnit", label: "Prix/kg (FCFA)", render: v => fmt(v) },
            { key: "_t", label: "Total FCFA", render: (_, r) => <strong style={{ color: C.gold }}>{fmt((r.qte || 0) * (r.prixUnit || 0))}</strong> },
            { key: "client", label: "Client" },
          ]} rows={data.ventes || []} onDelete={i => del("ventes", i)} />
        </>}

        {tab === "intrants" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("intrant"); }}>+ Intrant</Btn>}>Achats d'intrants</SectionTitle>
          <Table cols={[
            { key: "date", label: "Date", render: fmtDate },
            { key: "type", label: "Type" },
            { key: "produit", label: "Produit" },
            { key: "qte", label: "Quantité" },
            { key: "prix", label: "Prix (FCFA)", render: v => fmt(v) },
          ]} rows={data.intrants || []} onDelete={i => del("intrants", i)} />
        </>}

        {tab === "traitements" && <>
          <SectionTitle action={<Btn small onClick={() => { setForm({ date: today() }); setModal("traitement"); }}>+ Traitement</Btn>}>Traitements phytosanitaires</SectionTitle>
          <Table cols={[
            { key: "date", label: "Date", render: fmtDate },
            { key: "parcelle", label: "Parcelle" },
            { key: "produit", label: "Produit" },
            { key: "dose", label: "Dose" },
            { key: "motif", label: "Motif" },
          ]} rows={data.traitements || []} onDelete={i => del("traitements", i)} />
        </>}
      </Card>

      {modal === "culture" && <Modal title="Nouvelle culture" onClose={() => setModal(null)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Row><Input label="Culture *" value={form.culture} onChange={f("culture")} required /><Input label="Parcelle" value={form.parcelle} onChange={f("parcelle")} /></Row>
          <Row><Input label="Surface (m²)" value={form.surface} onChange={f("surface")} type="number" /><Input label="Date semis" value={form.dateSemis || today()} onChange={f("dateSemis")} type="date" /></Row>
          <Row><Input label="Récolte prévue" value={form.dateRecolte} onChange={f("dateRecolte")} type="date" />
            <Sel label="Statut" value={form.statut || "En cours"} onChange={f("statut")} options={["En cours", "Récolté", "Perdu"]} /></Row>
          <Btn full onClick={() => add("cultures", { ...form, statut: form.statut || "En cours" })}>Enregistrer</Btn>
        </div>
      </Modal>}

      {modal === "recolte" && <Modal title="Enregistrer une récolte" onClose={() => setModal(null)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Row><Input label="Date" value={form.date} onChange={f("date")} type="date" /><Input label="Culture" value={form.culture} onChange={f("culture")} /></Row>
          <Row><Input label="Parcelle" value={form.parcelle} onChange={f("parcelle")} /><Input label="Quantité (kg)" value={form.qte} onChange={f("qte")} type="number" /></Row>
          <Sel label="Qualité" value={form.qualite || "Bonne"} onChange={f("qualite")} options={["Bonne", "Moyenne", "Mauvaise"]} />
          <Btn full onClick={() => add("recoltes", { ...form, qualite: form.qualite || "Bonne" })}>Enregistrer</Btn>
        </div>
      </Modal>}

      {modal === "vente" && <Modal title="Vente maraîchage" onClose={() => setModal(null)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Row><Input label="Date" value={form.date} onChange={f("date")} type="date" /><Input label="Produit" value={form.culture} onChange={f("culture")} /></Row>
          <Row><Input label="Quantité (kg)" value={form.qte} onChange={f("qte")} type="number" /><Input label="Prix/kg (FCFA)" value={form.prixUnit} onChange={f("prixUnit")} type="number" /></Row>
          <Input label="Client" value={form.client} onChange={f("client")} />
          <Btn full onClick={() => add("ventes", form)}>Enregistrer</Btn>
        </div>
      </Modal>}

      {modal === "intrant" && <Modal title="Achat intrant" onClose={() => setModal(null)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Row><Input label="Date" value={form.date} onChange={f("date")} type="date" />
            <Sel label="Type" value={form.type || "Engrais"} onChange={f("type")} options={["Engrais", "Semences", "Pesticide", "Fongicide", "Herbicide", "Autre"]} /></Row>
          <Row><Input label="Produit" value={form.produit} onChange={f("produit")} /><Input label="Quantité" value={form.qte} onChange={f("qte")} /></Row>
          <Input label="Prix (FCFA)" value={form.prix} onChange={f("prix")} type="number" />
          <Btn full onClick={() => add("intrants", { ...form, type: form.type || "Engrais" })}>Enregistrer</Btn>
        </div>
      </Modal>}

      {modal === "traitement" && <Modal title="Traitement phytosanitaire" onClose={() => setModal(null)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Row><Input label="Date" value={form.date} onChange={f("date")} type="date" /><Input label="Parcelle" value={form.parcelle} onChange={f("parcelle")} /></Row>
          <Row><Input label="Produit" value={form.produit} onChange={f("produit")} /><Input label="Dose" value={form.dose} onChange={f("dose")} /></Row>
          <Input label="Motif" value={form.motif} onChange={f("motif")} />
          <Btn full onClick={() => add("traitements", form)}>Enregistrer</Btn>
        </div>
      </Modal>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUPABASE CLIENT
═══════════════════════════════════════════════════════════════ */
const SUPA_URL = "https://znlbmixtafhsemmkmnsv.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubGJtaXh0YWZoc2VtbWttbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MDc5MzMsImV4cCI6MjA5MzM4MzkzM30.ukBZYgJl5twovhYxO2EG3EJcbu568kFSDauTsCzADdk";

const supa = {
  async req(path, opts = {}) {
    const r = await fetch(`${SUPA_URL}/rest/v1${path}`, {
      headers: {
        "apikey": SUPA_KEY,
        "Authorization": `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
        "Prefer": opts.prefer || "return=representation",
        ...opts.headers,
      },
      ...opts,
    });
    if (!r.ok) { const e = await r.text(); throw new Error(e); }
    const text = await r.text();
    return text ? JSON.parse(text) : null;
  },

  // Auth
  async login(login, password) {
    const rows = await this.req(`/users?login=eq.${encodeURIComponent(login)}&password=eq.${encodeURIComponent(password)}&select=id,login,nom,role`);
    return rows?.[0] || null;
  },

  // Modules data
  async getModule(module) {
    const rows = await this.req(`/ferme_data?module=eq.${module}&select=section,data,id`);
    const result = {};
    for (const row of (rows || [])) {
      if (!result[row.section]) result[row.section] = [];
      result[row.section].push({ ...row.data, _rowId: row.id });
    }
    return result;
  },

  async addRecord(module, section, data) {
    const rows = await this.req(`/ferme_data`, {
      method: "POST",
      body: JSON.stringify({ module, section, data }),
    });
    return rows?.[0];
  },

  async deleteRecord(rowId) {
    await this.req(`/ferme_data?id=eq.${rowId}`, { method: "DELETE", prefer: "return=minimal" });
  },

  async updateRecord(rowId, data) {
    await this.req(`/ferme_data?id=eq.${rowId}`, {
      method: "PATCH",
      body: JSON.stringify({ data }),
    });
  },

  // Salaires
  async getSalaires() {
    const rows = await this.req(`/salaires?select=*&limit=1`);
    return rows?.[0] || { ouvrier_maraichage: 0, ouvrier_lapins: 0, ouvrier_volailles: 0 };
  },
  async saveSalaires(s) {
    const existing = await this.req(`/salaires?select=id&limit=1`);
    if (existing?.[0]) {
      await this.req(`/salaires?id=eq.${existing[0].id}`, { method: "PATCH", body: JSON.stringify(s) });
    } else {
      await this.req(`/salaires`, { method: "POST", body: JSON.stringify(s) });
    }
  },

  // Paiements salaires
  async getPaiements() {
    return await this.req(`/paiements_salaires?select=*&order=created_at.desc`) || [];
  },
  async addPaiement(p) {
    return await this.req(`/paiements_salaires`, { method: "POST", body: JSON.stringify({
      ouvrier: p.ouvrier, montant: Number(p.montant), mois: p.mois,
      date_paiement: p.date, notes: p.notes,
    })});
  },
  async deletePaiement(id) {
    await this.req(`/paiements_salaires?id=eq.${id}`, { method: "DELETE", prefer: "return=minimal" });
  },
};

/* ═══════════════════════════════════════════════════════════════
   HOOK useModule — charge et synchronise un module depuis Supabase
═══════════════════════════════════════════════════════════════ */
function useModule(moduleName) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const d = await supa.getModule(moduleName);
      setData(d);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [moduleName]);

  useEffect(() => { load(); }, [load]);

  const addRecord = useCallback(async (section, entry) => {
    const { id: _, _rowId: __, ...clean } = entry;
    const row = await supa.addRecord(moduleName, section, { ...clean, id: Date.now() });
    setData(prev => ({
      ...prev,
      [section]: [{ ...clean, id: Date.now(), _rowId: row?.id }, ...(prev[section] || [])],
    }));
  }, [moduleName]);

  const deleteRecord = useCallback(async (section, idx) => {
    const record = data[section]?.[idx];
    if (record?._rowId) await supa.deleteRecord(record._rowId);
    setData(prev => ({ ...prev, [section]: (prev[section] || []).filter((_, i) => i !== idx) }));
  }, [data, moduleName]);

  // Compatibilité avec l'ancienne interface setData
  const setDataCompat = useCallback((updater) => {
    if (typeof updater === "function") {
      setData(prev => updater(prev));
    } else {
      setData(updater);
    }
  }, []);

  return { data, setData: setDataCompat, addRecord, deleteRecord, loading, reload: load };
}

/* ═══════════════════════════════════════════════════════════════
   CALCUL RENTABILITÉ
═══════════════════════════════════════════════════════════════ */
const VOLAILLES_KEYS = ["golliaths", "dindons", "cailles", "canards", "pintades"];

function calcRentabilite(allData, salaires) {
  const rev = (k, d) => {
    if (k === "maraichage") return (d.ventes || []).reduce((s, v) => s + Number(v.qte || 0) * Number(v.prixUnit || 0), 0);
    if (k === "moutons" || k === "boeufs") return (d.ventes || []).reduce((s, v) => s + Number(v.prix || 0), 0);
    return (d.ventes || []).reduce((s, v) => s + Number(v.poids || 0) * Number(v.prixKg || 0), 0);
  };
  const charges = (k, d) => {
    if (k === "moutons" || k === "boeufs") return (d.alimentation || []).reduce((s, p) => s + Number(p.prix || 0), 0);
    if (k === "maraichage") return (d.provende || []).reduce((s, p) => s + Number(p.prix || 0), 0) + (d.intrants || []).reduce((s, p) => s + Number(p.prix || 0), 0);
    return (d.provende || []).reduce((s, p) => s + Number(p.prix || 0), 0);
  };
  const sal = {
    maraichage: Number(salaires?.ouvrier_maraichage || 0),
    lapins: Number(salaires?.ouvrier_lapins || 0),
    volailles: Number(salaires?.ouvrier_volailles || 0),
  };
  const salPart = (k) => {
    if (k === "maraichage") return sal.maraichage;
    if (k === "lapins") return sal.lapins;
    if (VOLAILLES_KEYS.includes(k)) return sal.volailles / VOLAILLES_KEYS.length;
    return 0;
  };
  return Object.keys(allData).map(k => {
    const d = allData[k] || {};
    const revenu = rev(k, d);
    const chargesDir = charges(k, d);
    const salaire = salPart(k);
    const totalCharges = chargesDir + salaire;
    return { k, revenu, chargesDir, salaire, totalCharges, marge: revenu - totalCharges };
  });
}

/* ═══════════════════════════════════════════════════════════════
   MODULE META
═══════════════════════════════════════════════════════════════ */
const MODULE_META = {
  lapins:     { label: "Lapins",          icon: "🐇", color: "#c9a87c", groupe: "Élevage" },
  golliaths:  { label: "Poulets Goliath", icon: "🐓", color: "#f9a825", groupe: "Volailles" },
  dindons:    { label: "Dindons",         icon: "🦃", color: "#bf8040", groupe: "Volailles" },
  cailles:    { label: "Cailles",         icon: "🐦", color: "#7cb342", groupe: "Volailles" },
  canards:    { label: "Canards",         icon: "🦆", color: "#0288d1", groupe: "Volailles" },
  pintades:   { label: "Pintades",        icon: "🐔", color: "#8e6bbf", groupe: "Volailles" },
  moutons:    { label: "Moutons",         icon: "🐑", color: "#d4c9b0", groupe: "Bétail" },
  boeufs:     { label: "Bœufs",           icon: "🐄", color: "#a07850", groupe: "Bétail" },
  maraichage: { label: "Maraîchage",      icon: "🌿", color: "#4caf50", groupe: "Végétal" },
};

/* ═══════════════════════════════════════════════════════════════
   LOADING SPINNER
═══════════════════════════════════════════════════════════════ */
function Spinner({ label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, gap: 16 }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        border: `3px solid ${C.border}`,
        borderTop: `3px solid ${C.accent}`,
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ color: C.muted, fontSize: 13 }}>{label || "Chargement…"}</span>
    </div>
  );
}

function ErrorBanner({ msg, onRetry }) {
  return (
    <div style={{ background: C.redDim, border: `1px solid ${C.red}40`, borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <span style={{ color: C.red, fontSize: 13 }}>⚠ Erreur de connexion : {msg}</span>
      {onRetry && <Btn small variant="danger" onClick={onRetry}>Réessayer</Btn>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODULE SALAIRES — version Supabase
═══════════════════════════════════════════════════════════════ */
function ModuleSalaires({ salaires, setSalaires }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const [hist, setHist] = useState([]);
  const [loadingHist, setLoadingHist] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supa.getPaiements().then(rows => { setHist(rows); setLoadingHist(false); });
  }, []);

  const addHist = async (e) => {
    setSaving(true);
    try {
      await supa.addPaiement(e);
      const rows = await supa.getPaiements();
      setHist(rows);
      setModal(null); setForm({});
    } finally { setSaving(false); }
  };

  const delHist = async (id) => {
    await supa.deletePaiement(id);
    setHist(p => p.filter(h => h.id !== id));
  };

  const OUVRIERS = [
    { key: "ouvrier_maraichage", nom: "Ouvrier Maraîchage", icon: "🌿", modules: ["Maraîchage"], color: C.accent },
    { key: "ouvrier_lapins",     nom: "Ouvrier Lapins",     icon: "🐇", modules: ["Lapins"], color: "#c9a87c" },
    { key: "ouvrier_volailles",  nom: "Ouvrier Volailles",  icon: "🐓", modules: ["Goliath","Dindons","Cailles","Canards","Pintades"], color: "#f9a825" },
  ];

  const totalMensuel = OUVRIERS.reduce((s, o) => s + Number(salaires[o.key] || 0), 0);
  const totalPaye = hist.reduce((s, h) => s + Number(h.montant || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon="👷" value={fmt(totalMensuel) + " F"} label="Masse salariale / mois" color={C.gold} />
        <StatCard icon="💸" value={fmt(totalPaye) + " F"} label="Total paiements effectués" color={C.blue} />
      </div>

      <Card style={{ marginBottom: 16 }}>
        <SectionTitle action={<Btn small onClick={() => { setForm({ ...salaires }); setModal("edit"); }}>✏ Modifier les salaires</Btn>}>
          Fiche des ouvriers
        </SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
          {OUVRIERS.map(o => (
            <div key={o.key} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: o.color + "20", border: `1px solid ${o.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{o.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{o.nom}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{o.modules.join(" · ")}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                <span style={{ color: C.muted, fontSize: 12 }}>Salaire mensuel</span>
                <span style={{ color: o.color, fontWeight: 700, fontSize: 20 }}>{fmt(salaires[o.key] || 0)} <span style={{ fontSize: 11 }}>FCFA</span></span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle action={<Btn small onClick={() => { setForm({ date: today(), mois: new Date().toISOString().slice(0,7) }); setModal("paiement"); }}>+ Enregistrer paiement</Btn>}>
          Historique des paiements
        </SectionTitle>
        {loadingHist ? <Spinner label="Chargement des paiements…" /> : (
          <Table
            cols={[
              { key: "date_paiement", label: "Date", render: fmtDate },
              { key: "ouvrier", label: "Ouvrier", render: v => { const o = OUVRIERS.find(o => o.key === v); return o ? <span>{o.icon} {o.nom}</span> : v; }},
              { key: "mois", label: "Période" },
              { key: "montant", label: "Montant (FCFA)", render: v => <strong style={{ color: C.gold }}>{fmt(v)}</strong> },
              { key: "notes", label: "Notes" },
            ]}
            rows={hist} onDelete={i => delHist(hist[i].id)}
            emptyMsg="Aucun paiement enregistré"
          />
        )}
      </Card>

      {modal === "edit" && (
        <Modal title="Modifier les salaires mensuels" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.textMid }}>
              Le salaire de l'Ouvrier Volailles est divisé en 5 parts égales entre les espèces volailles.
            </div>
            {OUVRIERS.map(o => (
              <div key={o.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{o.icon}</span>
                <Input label={`${o.nom} (FCFA/mois)`} value={form[o.key] || ""} onChange={f(o.key)} type="number" />
              </div>
            ))}
            <Btn full disabled={saving} onClick={async () => {
              setSaving(true);
              try { await supa.saveSalaires(form); setSalaires({ ...salaires, ...form }); setModal(null); }
              finally { setSaving(false); }
            }}>{saving ? "Enregistrement…" : "Enregistrer"}</Btn>
          </div>
        </Modal>
      )}

      {modal === "paiement" && (
        <Modal title="Enregistrer un paiement" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Row>
              <Input label="Date de paiement" value={form.date} onChange={f("date")} type="date" />
              <Input label="Période (mois)" value={form.mois} onChange={f("mois")} type="month" />
            </Row>
            <Sel label="Ouvrier *" value={form.ouvrier} onChange={v => { f("ouvrier")(v); f("montant")(salaires[v] || ""); }} required
              options={OUVRIERS.map(o => ({ value: o.key, label: o.icon + " " + o.nom }))} />
            <Input label="Montant versé (FCFA)" value={form.montant} onChange={f("montant")} type="number" />
            <Input label="Notes" value={form.notes} onChange={f("notes")} />
            <Btn full disabled={saving} onClick={() => addHist(form)}>{saving ? "Enregistrement…" : "Enregistrer"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODULE RENTABILITÉ
═══════════════════════════════════════════════════════════════ */
function ModuleRentabilite({ allData, salaires }) {
  const stats = calcRentabilite(allData, salaires);
  const totalRev   = stats.reduce((s, r) => s + r.revenu, 0);
  const totalCh    = stats.reduce((s, r) => s + r.totalCharges, 0);
  const totalMarge = totalRev - totalCh;
  const actives    = stats.filter(r => r.revenu > 0 || r.totalCharges > 0);
  const maxVal     = Math.max(...actives.map(r => Math.max(r.revenu, r.totalCharges)), 1);

  return (
    <div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon="💰" value={fmt(totalRev) + " F"} label="Revenus totaux" color={C.accent} />
        <StatCard icon="📦" value={fmt(Math.round(totalCh)) + " F"} label="Charges totales (salaires inclus)" color={C.red} />
        <StatCard icon="📊"
          value={(totalMarge >= 0 ? "+" : "") + fmt(Math.round(totalMarge)) + " F"}
          label="Résultat net global"
          color={totalMarge >= 0 ? C.accent : C.red}
          sub={totalRev > 0 ? `Marge nette : ${Math.round(totalMarge / totalRev * 100)}%` : "Aucune vente enregistrée"}
        />
      </div>

      <Card style={{ marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 20px", fontFamily: FONT_DISPLAY, color: C.text, fontSize: 17 }}>Analyse de rentabilité par activité</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 700 }}>
            <thead>
              <tr style={{ background: C.surface }}>
                {["Activité","Revenus","Provende/Intrants","Salaire imputé","Total charges","Résultat net","Marge %"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", color: C.muted, textAlign: h === "Activité" ? "left" : "right", fontWeight: 700, fontSize: 10, letterSpacing: ".6px", textTransform: "uppercase", borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.map(({ k, revenu, chargesDir, salaire, totalCharges, marge }, i) => {
                const m = MODULE_META[k]; if (!m) return null;
                const mp = revenu > 0 ? Math.round(marge / revenu * 100) : null;
                const pos = marge >= 0;
                return (
                  <tr key={k} style={{ borderBottom: `1px solid ${C.border}20`, background: i % 2 === 0 ? "transparent" : C.surface + "50" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.accentGlow}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "transparent" : C.surface + "50"}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 20 }}>{m.icon}</span>
                        <div><div style={{ color: C.text, fontWeight: 600 }}>{m.label}</div><div style={{ color: C.muted, fontSize: 10 }}>{m.groupe}</div></div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right", color: C.accent, fontWeight: 600 }}>{fmt(revenu)}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", color: C.textMid }}>{fmt(chargesDir)}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", color: C.gold }}>{salaire > 0 ? fmt(Math.round(salaire)) : <span style={{ color: C.muted }}>—</span>}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", color: C.red }}>{fmt(Math.round(totalCharges))}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <span style={{ display: "inline-block", background: (pos ? C.accent : C.red) + "18", color: pos ? C.accent : C.red, fontWeight: 700, borderRadius: 6, padding: "3px 10px" }}>{pos ? "+" : ""}{fmt(Math.round(marge))}</span>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      {mp !== null ? <Badge color={mp >= 30 ? C.accent : mp >= 0 ? C.gold : C.red}>{mp}%</Badge> : <span style={{ color: C.muted }}>—</span>}
                    </td>
                  </tr>
                );
              })}
              <tr style={{ background: C.surface, borderTop: `2px solid ${C.borderLight}` }}>
                <td style={{ padding: "13px 14px", color: C.text, fontWeight: 800 }}>TOTAL FERME</td>
                <td style={{ padding: "13px 14px", textAlign: "right", color: C.accent, fontWeight: 800 }}>{fmt(totalRev)}</td>
                <td style={{ padding: "13px 14px", textAlign: "right", color: C.textMid, fontWeight: 700 }}>{fmt(stats.reduce((s, r) => s + r.chargesDir, 0))}</td>
                <td style={{ padding: "13px 14px", textAlign: "right", color: C.gold, fontWeight: 700 }}>{fmt(Math.round(stats.reduce((s, r) => s + r.salaire, 0)))}</td>
                <td style={{ padding: "13px 14px", textAlign: "right", color: C.red, fontWeight: 800 }}>{fmt(Math.round(totalCh))}</td>
                <td style={{ padding: "13px 14px", textAlign: "right" }}>
                  <span style={{ display: "inline-block", background: (totalMarge >= 0 ? C.accent : C.red) + "25", color: totalMarge >= 0 ? C.accent : C.red, fontWeight: 800, fontSize: 14, borderRadius: 7, padding: "4px 12px" }}>{totalMarge >= 0 ? "+" : ""}{fmt(Math.round(totalMarge))}</span>
                </td>
                <td style={{ padding: "13px 14px", textAlign: "right" }}>
                  {totalRev > 0 && <Badge color={totalMarge >= 0 ? C.accent : C.red}>{Math.round(totalMarge / totalRev * 100)}%</Badge>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h4 style={{ margin: "0 0 6px", fontFamily: FONT_DISPLAY, color: C.text, fontSize: 16 }}>Revenus vs Charges par activité</h4>
        <p style={{ margin: "0 0 20px", color: C.muted, fontSize: 12 }}>Barre colorée = revenus · Trait rouge = seuil des charges totales</p>
        {actives.length === 0 && <p style={{ color: C.muted, textAlign: "center", padding: 24 }}>Aucune donnée financière enregistrée.</p>}
        {actives.map(({ k, revenu, totalCharges, marge }) => {
          const m = MODULE_META[k]; if (!m) return null;
          const pos = marge >= 0;
          return (
            <div key={k} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7, flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{m.icon} {m.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: C.textMid }}>Rev: <strong>{fmt(revenu)}</strong></span>
                  <span style={{ fontSize: 11, color: C.muted }}>Ch: <strong>{fmt(Math.round(totalCharges))}</strong></span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: pos ? C.accent : C.red, background: (pos ? C.accent : C.red) + "18", padding: "2px 9px", borderRadius: 6 }}>{pos ? "+" : ""}{fmt(Math.round(marge))} F</span>
                </div>
              </div>
              <div style={{ position: "relative", height: 12, background: C.surface, borderRadius: 8 }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${revenu / maxVal * 100}%`, background: m.color + "70", borderRadius: 8, transition: "width .6s ease" }} />
                {totalCharges > 0 && <div style={{ position: "absolute", top: 0, bottom: 0, left: `calc(${Math.min(totalCharges / maxVal * 100, 99)}% - 1px)`, width: 3, background: C.red, borderRadius: 2 }} />}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════════ */
function Dashboard({ allData, salaires }) {
  const stats    = calcRentabilite(allData, salaires);
  const totalRev = stats.reduce((s, r) => s + r.revenu, 0);
  const totalCh  = stats.reduce((s, r) => s + r.totalCharges, 0);
  const marge    = totalRev - totalCh;
  const espRevs  = stats.filter(r => r.revenu > 0).sort((a, b) => b.revenu - a.revenu).map(r => ({ ...r, ...(MODULE_META[r.k] || {}) }));

  const alertes = [];
  Object.entries(ESPECES_CONFIG).forEach(([k, cfg]) => {
    (allData[k]?.couvee || []).filter(c => c.nbEclos == null && c.dateEclos).forEach(c => {
      const diff = diffDays(today(), c.dateEclos);
      if (diff >= 0 && diff <= 3) alertes.push({ msg: `Éclosion ${cfg.emoji} ${cfg.label} — vague "${c.ref}" dans ${diff}j`, color: C.gold });
      else if (diff < 0 && diff >= -3) alertes.push({ msg: `Éclosion ${cfg.emoji} ${cfg.label} — vague "${c.ref}" en retard de ${-diff}j !`, color: C.red });
    });
  });
  (allData.lapins?.saillies || []).filter(s => !s.miseBas && s.datePrevue && diffDays(today(), s.datePrevue) >= 0 && diffDays(today(), s.datePrevue) <= 3)
    .forEach(s => alertes.push({ msg: `🐇 Mise-bas prévue le ${fmtDate(s.datePrevue)} — ${s.femelle}`, color: C.gold }));

  return (
    <div>
      {alertes.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ margin: "0 0 10px", color: C.text, fontSize: 14, fontWeight: 700 }}>🔔 Alertes</h4>
          {alertes.map((a, i) => (
            <div key={i} style={{ background: a.color + "15", border: `1px solid ${a.color}40`, borderLeft: `3px solid ${a.color}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8, color: a.color, fontSize: 13 }}>{a.msg}</div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon="💰" value={fmt(totalRev) + " F"} label="Revenus totaux" color={C.accent} />
        <StatCard icon="📦" value={fmt(Math.round(totalCh)) + " F"} label="Charges + salaires" color={C.red} />
        <StatCard icon="📈" value={(marge >= 0 ? "+" : "") + fmt(Math.round(marge)) + " F"} label="Résultat net"
          color={marge >= 0 ? C.accent : C.red}
          sub={totalRev > 0 ? `Marge : ${Math.round(marge / totalRev * 100)}%` : null} />
      </div>

      {espRevs.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <h4 style={{ margin: "0 0 18px", fontFamily: FONT_DISPLAY, color: C.text, fontSize: 16 }}>Revenus & résultats nets par activité</h4>
          {espRevs.map(({ k, revenu, marge: mg, icon, label, color }) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontSize: 13, color: C.text }}>{icon} {label}</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: C.textMid }}>{fmt(revenu)} F</span>
                  <Badge color={mg >= 0 ? C.accent : C.red} small>{mg >= 0 ? "+" : ""}{fmt(Math.round(mg))} F</Badge>
                </div>
              </div>
              <div style={{ background: C.surface, borderRadius: 6, height: 6 }}>
                <div style={{ background: color, width: `${totalRev > 0 ? (revenu / totalRev * 100) : 0}%`, height: "100%", borderRadius: 6, transition: "width .5s" }} />
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card>
        <h4 style={{ margin: "0 0 16px", fontFamily: FONT_DISPLAY, color: C.text, fontSize: 16 }}>Aperçu des effectifs</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 }}>
          {[
            { k: "lapins", icon: "🐇", label: "Lapins", count: (allData.lapins?.sujets || []).filter(s => s.statut === "Actif").length, unit: "actifs" },
            ...Object.entries(ESPECES_CONFIG).map(([k, cfg]) => ({
              k, icon: cfg.emoji, label: cfg.label, color: cfg.color,
              count: Math.max(0,
                (allData[k]?.lots   || []).reduce((s, l) => s + Number(l.effectif || 0), 0) -
                (allData[k]?.deces  || []).reduce((s, d) => s + Number(d.nb || 0), 0) -
                (allData[k]?.ventes || []).reduce((s, v) => s + Number(v.qte || 0), 0)
              ), unit: "en stock",
            })),
            { k: "moutons",    icon: "🐑", label: "Moutons",    count: (allData.moutons?.sujets    || []).filter(s => s.statut === "Actif").length, unit: "actifs" },
            { k: "boeufs",     icon: "🐄", label: "Bœufs",      count: (allData.boeufs?.sujets     || []).filter(s => s.statut === "Actif").length, unit: "actifs" },
            { k: "maraichage", icon: "🌿", label: "Maraîchage", count: (allData.maraichage?.cultures || []).filter(c => c.statut === "En cours").length, unit: "parcelles" },
          ].map(e => (
            <div key={e.k} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>{e.icon}</span>
              <div>
                <div style={{ fontWeight: 600, color: C.textMid, fontSize: 11, textTransform: "uppercase", letterSpacing: ".4px" }}>{e.label}</div>
                <div style={{ color: e.color || C.accent, fontSize: 20, fontWeight: 700 }}>{fmt(e.count)}</div>
                <div style={{ color: C.muted, fontSize: 10 }}>{e.unit}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOTTOM NAV MOBILE
═══════════════════════════════════════════════════════════════ */
function BottomNav({ section, setSection }) {
  const items = [
    { key: "dashboard",   icon: "📊", label: "Accueil" },
    { key: "lapins",      icon: "🐇", label: "Lapins" },
    { key: "golliaths",   icon: "🐓", label: "Goliath" },
    { key: "maraichage",  icon: "🌿", label: "Maraîch." },
    { key: "rentabilite", icon: "📈", label: "Résultats" },
    { key: "more",        icon: "☰",  label: "Plus" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: C.surface, borderTop: `1px solid ${C.border}`,
      display: "flex", alignItems: "stretch",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      {items.map(it => {
        const active = section === it.key;
        return (
          <button key={it.key} onClick={() => setSection(it.key)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "10px 4px 8px", background: "none", border: "none",
            color: active ? C.accent : C.muted, cursor: "pointer",
            borderTop: active ? `2px solid ${C.accent}` : "2px solid transparent",
            transition: "color .15s",
          }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{it.icon}</span>
            <span style={{ fontSize: 9, marginTop: 3, fontFamily: FONT_BODY, fontWeight: active ? 700 : 400, letterSpacing: ".3px" }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DRAWER MOBILE "Plus"
═══════════════════════════════════════════════════════════════ */
function MobileDrawer({ open, onClose, section, setSection, user, onLogout }) {
  const items = [
    { key: "dindons",     icon: "🦃", label: "Dindons" },
    { key: "cailles",     icon: "🐦", label: "Cailles" },
    { key: "canards",     icon: "🦆", label: "Canards" },
    { key: "pintades",    icon: "🐔", label: "Pintades" },
    { key: "moutons",     icon: "🐑", label: "Moutons" },
    { key: "boeufs",      icon: "🐄", label: "Bœufs" },
    { key: "salaires",    icon: "👷", label: "Salaires" },
  ];
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "#0008" }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: C.card, borderRadius: "20px 20px 0 0",
        border: `1px solid ${C.border}`,
        padding: "20px 16px 32px",
        paddingBottom: "calc(32px + env(safe-area-inset-bottom, 0px))",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 20px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "0 4px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
          <div>
            <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{user?.nom}</div>
            <div style={{ color: C.muted, fontSize: 11 }}>{user?.role}</div>
          </div>
          <button onClick={onLogout} style={{ marginLeft: "auto", background: C.redDim, border: `1px solid ${C.red}40`, borderRadius: 8, color: C.red, cursor: "pointer", padding: "6px 12px", fontSize: 12, fontFamily: FONT_BODY }}>Déconnexion</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {items.map(it => (
            <button key={it.key} onClick={() => { setSection(it.key); onClose(); }} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: section === it.key ? C.accentGlow : C.surface,
              border: `1px solid ${section === it.key ? C.accentDark : C.border}`,
              borderRadius: 12, padding: "12px 14px", cursor: "pointer",
              color: section === it.key ? C.text : C.muted, fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500,
            }}>
              <span style={{ fontSize: 20 }}>{it.icon}</span>{it.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APPLICATION PRINCIPALE
═══════════════════════════════════════════════════════════════ */
export default function BioterraApp() {
  const [user,       setUser]       = useLS("btn_user_v2", null);
  const [section,    setSection]    = useState("dashboard");
  const [sideOpen,   setSideOpen]   = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [salaires,   setSalaires]   = useState({ ouvrier_maraichage: 0, ouvrier_lapins: 0, ouvrier_volailles: 0 });
  const [isMobile,   setIsMobile]   = useState(window.innerWidth < 768);
  const [globalLoad, setGlobalLoad] = useState(false);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // Charger salaires depuis Supabase
  useEffect(() => {
    if (user) supa.getSalaires().then(setSalaires).catch(() => {});
  }, [user]);

  // Un hook par module
  const lapins    = useModule("lapins");
  const golliaths = useModule("golliaths");
  const dindons   = useModule("dindons");
  const cailles   = useModule("cailles");
  const canards   = useModule("canards");
  const pintades  = useModule("pintades");
  const moutons   = useModule("moutons");
  const boeufs    = useModule("boeufs");
  const maraichage= useModule("maraichage");

  const allData = {
    lapins: lapins.data, golliaths: golliaths.data, dindons: dindons.data,
    cailles: cailles.data, canards: canards.data, pintades: pintades.data,
    moutons: moutons.data, boeufs: boeufs.data, maraichage: maraichage.data,
  };

  const moduleMap = { lapins, golliaths, dindons, cailles, canards, pintades, moutons, boeufs, maraichage };

  // Wrapper setData compatible pour les sous-modules
  const makeSetData = (mod) => async (updaterOrObj) => {
    // On recharge simplement depuis Supabase après chaque action
    await mod.reload();
  };

  if (!user) return <LoginScreen onLogin={async (u) => {
    setGlobalLoad(true);
    setUser(u);
    setGlobalLoad(false);
  }} />;

  const handleSectionChange = (s) => {
    if (s === "more") { setDrawerOpen(true); return; }
    setSection(s);
    setDrawerOpen(false);
  };

  const nav = [
    { key: "dashboard",   label: "Tableau de bord",  icon: "📊" },
    { key: "sep1",        label: "ÉLEVAGE",           cat: "sep" },
    { key: "lapins",      label: "Lapins",            icon: "🐇" },
    { key: "golliaths",   label: "Poulets Goliath",   icon: "🐓" },
    { key: "dindons",     label: "Dindons",           icon: "🦃" },
    { key: "cailles",     label: "Cailles",           icon: "🐦" },
    { key: "canards",     label: "Canards",           icon: "🦆" },
    { key: "pintades",    label: "Pintades",          icon: "🐔" },
    { key: "sep2",        label: "BÉTAIL",            cat: "sep" },
    { key: "moutons",     label: "Moutons",           icon: "🐑" },
    { key: "boeufs",      label: "Bœufs",             icon: "🐄" },
    { key: "sep3",        label: "VÉGÉTAL",           cat: "sep" },
    { key: "maraichage",  label: "Maraîchage",        icon: "🌿" },
    { key: "sep4",        label: "GESTION",           cat: "sep" },
    { key: "salaires",    label: "Salaires",          icon: "👷" },
    { key: "rentabilite", label: "Rentabilité",       icon: "📈" },
  ];

  const current = nav.find(n => n.key === section);

  const renderContent = () => {
    const mod = moduleMap[section];
    if (section === "dashboard")   return <Dashboard allData={allData} salaires={salaires} />;
    if (section === "salaires")    return <ModuleSalaires salaires={salaires} setSalaires={async (s) => { setSalaires(s); await supa.saveSalaires(s); }} />;
    if (section === "rentabilite") return <ModuleRentabilite allData={allData} salaires={salaires} />;
    if (section === "lapins")      return mod.loading ? <Spinner label="Chargement lapins…" /> : <ModuleLapins data={lapins.data} setData={async () => { await lapins.reload(); }} addRecord={(s,e) => lapins.addRecord(s,e).then(() => lapins.reload())} deleteRecord={(s,i) => lapins.deleteRecord(s,i)} />;
    if (ESPECES_CONFIG[section])   return mod?.loading ? <Spinner /> : <ModuleVolaille espece={section} config={ESPECES_CONFIG[section]} data={mod.data} setData={async () => { await mod.reload(); }} addRecord={(s,e) => mod.addRecord(s,e).then(() => mod.reload())} deleteRecord={(s,i) => mod.deleteRecord(s,i)} />;
    if (section === "moutons" || section === "boeufs") return mod?.loading ? <Spinner /> : <ModuleGrandAnimal label={section === "moutons" ? "Moutons" : "Bœufs"} data={mod.data} setData={async () => mod.reload()} addRecord={(s,e) => mod.addRecord(s,e).then(() => mod.reload())} deleteRecord={(s,i) => mod.deleteRecord(s,i)} />;
    if (section === "maraichage")  return mod.loading ? <Spinner /> : <ModuleMaraichage data={maraichage.data} setData={async () => maraichage.reload()} addRecord={(s,e) => maraichage.addRecord(s,e).then(() => maraichage.reload())} deleteRecord={(s,i) => maraichage.deleteRecord(s,i)} />;
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: FONT_BODY, display: "flex" }}>
      {/* SIDEBAR — desktop uniquement */}
      {!isMobile && (
        <aside style={{
          width: sideOpen ? 230 : 60, background: C.surface, borderRight: `1px solid ${C.border}`,
          transition: "width .25s ease", display: "flex", flexDirection: "column",
          flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto", overflowX: "hidden",
        }}>
          <div style={{ padding: sideOpen ? "20px 18px 16px" : "20px 10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: `linear-gradient(135deg, ${C.accentDark}, #1b5e20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: `0 4px 12px ${C.accentGlow}` }}>🌱</div>
            {sideOpen && <div style={{ overflow: "hidden" }}><div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: C.text, whiteSpace: "nowrap", fontWeight: 600 }}>Bioterra</div><div style={{ fontSize: 10, color: C.muted, letterSpacing: ".8px", textTransform: "uppercase" }}>Nexus</div></div>}
            <button onClick={() => setSideOpen(p => !p)} style={{ marginLeft: "auto", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, padding: 4, flexShrink: 0 }}>{sideOpen ? "◀" : "▶"}</button>
          </div>
          <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
            {nav.map(n => {
              if (n.cat === "sep") return sideOpen ? <div key={n.key} style={{ padding: "14px 10px 5px", color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>{n.label}</div> : <div key={n.key} style={{ height: 12 }} />;
              const active = section === n.key;
              return (
                <button key={n.key} onClick={() => setSection(n.key)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: sideOpen ? 10 : 0, justifyContent: sideOpen ? "flex-start" : "center",
                  background: active ? C.accentGlow : "transparent", border: `1px solid ${active ? C.accentDark : "transparent"}`,
                  borderRadius: 9, padding: sideOpen ? "9px 10px" : "9px", cursor: "pointer", color: active ? C.text : C.muted,
                  fontSize: 13, fontFamily: FONT_BODY, textAlign: "left", marginBottom: 3, transition: "all .15s", whiteSpace: "nowrap",
                }}
                  onMouseEnter={e => !active && (e.currentTarget.style.background = C.border)}
                  onMouseLeave={e => !active && (e.currentTarget.style.background = "transparent")}>
                  <span style={{ fontSize: 17, flexShrink: 0 }}>{n.icon}</span>
                  {sideOpen && <span style={{ fontWeight: active ? 600 : 400 }}>{n.label}</span>}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}` }}>
            {sideOpen ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>👤</div>
                <div style={{ overflow: "hidden", flex: 1 }}>
                  <div style={{ fontSize: 12, color: C.text, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.nom}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{user.role}</div>
                </div>
                <button onClick={() => setUser(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }} title="Déconnexion">⏏</button>
              </div>
            ) : (
              <button onClick={() => setUser(null)} style={{ width: "100%", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18 }} title="Déconnexion">⏏</button>
            )}
          </div>
        </aside>
      )}

      {/* MAIN */}
      <main style={{
        flex: 1, padding: isMobile ? "16px 14px" : "24px 24px",
        paddingBottom: isMobile ? "calc(72px + env(safe-area-inset-bottom, 0px))" : "24px",
        overflowX: "hidden", minWidth: 0,
      }}>
        {/* HEADER MOBILE */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${C.accentDark}, #1b5e20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌱</div>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: C.text, fontWeight: 600 }}>Bioterra Nexus</div>
                <div style={{ fontSize: 11, color: C.muted }}>{current?.icon} {current?.label}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: C.accentDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>👤</div>
            </div>
          </div>
        )}

        {/* HEADER DESKTOP */}
        {!isMobile && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 22, color: C.text, fontWeight: 400 }}>{current?.icon} {current?.label}</h2>
              <p style={{ margin: "5px 0 0", color: C.muted, fontSize: 12 }}>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, padding: "6px 14px", fontSize: 12, color: C.textMid }}>🌱 Bioterra Nexus</div>
            </div>
          </div>
        )}

        {renderContent()}
      </main>

      {/* BOTTOM NAV MOBILE */}
      {isMobile && <BottomNav section={section} setSection={handleSectionChange} />}
      {isMobile && <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} section={section} setSection={handleSectionChange} user={user} onLogout={() => setUser(null)} />}
    </div>
  );
}
