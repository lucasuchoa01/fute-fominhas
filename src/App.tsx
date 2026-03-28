import { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBlXvCW5rrdTbgTSxMt5lIgs80eH4RAWvE",
  authDomain: "fominhas-league.firebaseapp.com",
  projectId: "fominhas-league",
  storageBucket: "fominhas-league.firebasestorage.app",
  messagingSenderId: "259341849200",
  appId: "1:259341849200:web:0ab82248835a6daa57dab5"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// ============ CONSTANTS ============

const TEAMS_CFG = {
  vermelho: {
    label: 'Diabos Vermelhos',
    color: '#ef4444',
    dim: '#450a0a',
    emoji: '👹',
  },
  azul: { label: 'Azulões', color: '#3b82f6', dim: '#1e3a8a', emoji: '💎' },
  amarelo: { label: 'Canarinhos', color: '#eab308', dim: '#422006', emoji: '🐤' },
  verde: { label: 'Máquina Verde', color: '#22c55e', dim: '#052e16', emoji: '🦖' },
};

const RANK_COLOR = {
  A: '#f59e0b',
  B: '#f97316',
  C: '#3b82f6',
  D: '#6b7280',
  E: '#374151',
};
const RANK_VAL = { A: 5, B: 4, C: 3, D: 2, E: 1 };
const TEAM_SIZE = 5;

const INITIAL_PLAYERS = [
  {
    id: 1,
    name: 'Marcelinho',
    tipo: 'mensalista',
    ranking: 'A',
    ata: 88,
    def: 60,
    vel: 85,
    dri: 91,
    fis: 91,
    pas: 91,
    overall: 90,
    goals: 65,
    champ: 9,
    vice: 2,
    pres: 20,
    paid: false,
  },
  {
    id: 2,
    name: 'Uchoa',
    tipo: 'mensalista',
    ranking: 'A',
    ata: 84,
    def: 75,
    vel: 80,
    dri: 71,
    fis: 71,
    pas: 71,
    overall: 78,
    goals: 74,
    champ: 7,
    vice: 4,
    pres: 17,
    paid: false,
  },
  {
    id: 3,
    name: 'BBB',
    tipo: 'mensalista',
    ranking: 'C',
    ata: 65,
    def: 72,
    vel: 55,
    dri: 69,
    fis: 69,
    pas: 69,
    overall: 70,
    goals: 23,
    champ: 7,
    vice: 3,
    pres: 20,
    paid: false,
  },
  {
    id: 4,
    name: 'Dih',
    tipo: 'mensalista',
    ranking: 'D',
    ata: 60,
    def: 75,
    vel: 55,
    dri: 70,
    fis: 70,
    pas: 70,
    overall: 71,
    goals: 28,
    champ: 7,
    vice: 2,
    pres: 15,
    paid: false,
  },
  {
    id: 5,
    name: 'Jere',
    tipo: 'mensalista',
    ranking: 'C',
    ata: 70,
    def: 70,
    vel: 65,
    dri: 78,
    fis: 78,
    pas: 78,
    overall: 76,
    goals: 28,
    champ: 6,
    vice: 1,
    pres: 17,
    paid: false,
  },
  {
    id: 6,
    name: 'RAJ',
    tipo: 'mensalista',
    ranking: 'E',
    ata: 65,
    def: 45,
    vel: 40,
    dri: 50,
    fis: 50,
    pas: 50,
    overall: 54,
    goals: 36,
    champ: 4,
    vice: 6,
    pres: 20,
    paid: false,
  },
  {
    id: 7,
    name: 'Rada',
    tipo: 'mensalista',
    ranking: 'B',
    ata: 83,
    def: 72,
    vel: 90,
    dri: 74,
    fis: 74,
    pas: 74,
    overall: 80,
    goals: 21,
    champ: 4,
    vice: 1,
    pres: 11,
    paid: false,
  },
  {
    id: 8,
    name: 'Moche',
    tipo: 'mensalista',
    ranking: 'B',
    ata: 70,
    def: 69,
    vel: 62,
    dri: 69,
    fis: 69,
    pas: 69,
    overall: 69,
    goals: 54,
    champ: 3,
    vice: 6,
    pres: 20,
    paid: false,
  },
  {
    id: 9,
    name: 'Rafinha',
    tipo: 'mensalista',
    ranking: 'A',
    ata: 85,
    def: 65,
    vel: 80,
    dri: 72,
    fis: 72,
    pas: 72,
    overall: 77,
    goals: 48,
    champ: 3,
    vice: 3,
    pres: 11,
    paid: false,
  },
  {
    id: 10,
    name: 'Mbapeso',
    tipo: 'mensalista',
    ranking: 'E',
    ata: 48,
    def: 62,
    vel: 40,
    dri: 49,
    fis: 49,
    pas: 49,
    overall: 52,
    goals: 10,
    champ: 3,
    vice: 1,
    pres: 9,
    paid: false,
  },
  {
    id: 11,
    name: 'Cabeça',
    tipo: 'mensalista',
    ranking: 'C',
    ata: 72,
    def: 72,
    vel: 79,
    dri: 75,
    fis: 75,
    pas: 75,
    overall: 76,
    goals: 32,
    champ: 2,
    vice: 9,
    pres: 17,
    paid: false,
  },
  {
    id: 12,
    name: 'Gui Rasta',
    tipo: 'mensalista',
    ranking: 'C',
    ata: 65,
    def: 65,
    vel: 62,
    dri: 61,
    fis: 61,
    pas: 61,
    overall: 63,
    goals: 14,
    champ: 3,
    vice: 0,
    pres: 8,
    paid: false,
  },
  {
    id: 13,
    name: 'Teka',
    tipo: 'mensalista',
    ranking: 'C',
    ata: 75,
    def: 62,
    vel: 78,
    dri: 75,
    fis: 75,
    pas: 75,
    overall: 76,
    goals: 19,
    champ: 2,
    vice: 3,
    pres: 12,
    paid: false,
  },
  {
    id: 14,
    name: 'Gordinho',
    tipo: 'mensalista',
    ranking: 'B',
    ata: 78,
    def: 77,
    vel: 71,
    dri: 71,
    fis: 71,
    pas: 71,
    overall: 74,
    goals: 8,
    champ: 2,
    vice: 2,
    pres: 11,
    paid: false,
  },
  {
    id: 15,
    name: 'Zida',
    tipo: 'mensalista',
    ranking: 'D',
    ata: 60,
    def: 85,
    vel: 60,
    dri: 65,
    fis: 65,
    pas: 65,
    overall: 70,
    goals: 19,
    champ: 1,
    vice: 4,
    pres: 14,
    paid: false,
  },
  {
    id: 16,
    name: 'Kariri',
    tipo: 'mensalista',
    ranking: 'E',
    ata: 55,
    def: 55,
    vel: 55,
    dri: 55,
    fis: 55,
    pas: 55,
    overall: 55,
    goals: 8,
    champ: 3,
    vice: 0,
    pres: 6,
    paid: false,
  },
  {
    id: 17,
    name: 'Tulio',
    tipo: 'mensalista',
    ranking: 'E',
    ata: 52,
    def: 55,
    vel: 48,
    dri: 45,
    fis: 45,
    pas: 45,
    overall: 50,
    goals: 11,
    champ: 0,
    vice: 4,
    pres: 8,
    paid: false,
  },
];

const INIT_ROUNDS = [
  {
    id: 1,
    pairs: [
      { tA: 'vermelho', tB: 'azul', sA: '', sB: '' },
      { tA: 'amarelo', tB: 'verde', sA: '', sB: '' },
    ],
  },
  {
    id: 2,
    pairs: [
      { tA: 'vermelho', tB: 'amarelo', sA: '', sB: '' },
      { tA: 'azul', tB: 'verde', sA: '', sB: '' },
    ],
  },
  {
    id: 3,
    pairs: [
      { tA: 'vermelho', tB: 'verde', sA: '', sB: '' },
      { tA: 'azul', tB: 'amarelo', sA: '', sB: '' },
    ],
  },
  {
    id: 4,
    pairs: [
      { tA: 'azul', tB: 'vermelho', sA: '', sB: '' },
      { tA: 'verde', tB: 'amarelo', sA: '', sB: '' },
    ],
  },
  {
    id: 5,
    pairs: [
      { tA: 'amarelo', tB: 'vermelho', sA: '', sB: '' },
      { tA: 'verde', tB: 'azul', sA: '', sB: '' },
    ],
  },
  {
    id: 6,
    pairs: [
      { tA: 'verde', tB: 'vermelho', sA: '', sB: '' },
      { tA: 'amarelo', tB: 'azul', sA: '', sB: '' },
    ],
  },
];

const INIT_FINAL = { tA: 'vermelho', tB: 'azul', sA: '', sB: '' };

// ============ UTILS ============

function suggestRanking(ata, def, vel, fis, dri, pas, overall?) {
  const ref = overall ?? Math.round([ata, def, vel, fis, dri, pas].sort((a, b) => b - a).slice(0, 4).reduce((s, v) => s + v, 0) / 4);
  if (ref >= 90) return 'A';
  if (ref >= 80) return 'B';
  if (ref >= 70) return 'C';
  if (ref >= 60) return 'D';
  return 'E';
}

function normalizeName(name = '') {
  return name.trim().toLowerCase();
}

function top4Avg(p) {
  const vals = [p.ata, p.def, p.vel, p.fis ?? p.dri, p.dri, p.pas ?? p.dri]
    .sort((a, b) => b - a).slice(0, 4);
  return Math.round(vals.reduce((s, v) => s + v, 0) / 4);
}

function avgOverall(p) {
  if (p.overall != null && !isNaN(p.overall)) return p.overall;
  const ata = p.ata || 65;
  const def = p.def || 65;
  const vel = p.vel || 65;
  const fis = p.fis || p.dri || 65;
  const dri = p.dri || 65;
  const pas = p.pas || p.dri || 65;
  const vals = [ata, def, vel, fis, dri, pas].sort((a, b) => b - a).slice(0, 4);
  return Math.round(vals.reduce((s, v) => s + v, 0) / 4);
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickBestTeamKey(teams, player) {
  const withSpace = Object.keys(teams).filter(
    (key) => teams[key].filter((p) => !p.isPending).length < TEAM_SIZE
  );
  const shuffled = shuffleArray(withSpace);
  shuffled.sort((a, b) => {
    const realA = teams[a].filter((p) => !p.isPending);
    const realB = teams[b].filter((p) => !p.isPending);
    const countDiff = realA.length - realB.length;
    if (countDiff !== 0) return countDiff;
    const scoreA = realA.reduce((sum, p) => sum + avgOverall(p), 0);
    const scoreB = realB.reduce((sum, p) => sum + avgOverall(p), 0);
    return scoreA - scoreB;
  });
  return shuffled[0];
}

function pendingRankFromAvg(avg) {
  if (avg >= 82) return 'A';
  if (avg >= 72) return 'B';
  if (avg >= 62) return 'C';
  if (avg >= 52) return 'D';
  return 'E';
}

function fillPendingSlots(teams, basePlayers) {
  const keys = Object.keys(teams);
  const overallAvg = basePlayers.length
    ? Math.round(
        basePlayers.reduce((sum, p) => sum + avgOverall(p), 0) /
          basePlayers.length
      )
    : 65;

  let pendingIndex = 1;

  while (keys.some((key) => teams[key].length < TEAM_SIZE)) {
    const ordered = [...keys].sort((a, b) => {
      const countDiff = teams[a].length - teams[b].length;
      if (countDiff !== 0) return countDiff;
      const scoreA = teams[a].reduce(
        (sum, p) => sum + (p.pendingAvg ?? avgOverall(p)),
        0
      );
      const scoreB = teams[b].reduce(
        (sum, p) => sum + (p.pendingAvg ?? avgOverall(p)),
        0
      );
      return scoreA - scoreB;
    });

    const teamKey = ordered[0];
    const currentScore = teams[teamKey].reduce(
      (sum, p) => sum + (p.pendingAvg ?? avgOverall(p)),
      0
    );
    const vacanciesLeft = TEAM_SIZE - teams[teamKey].length;
    const desiredAvg = Math.max(
      45,
      Math.min(
        90,
        Math.round((overallAvg * TEAM_SIZE - currentScore) / vacanciesLeft)
      )
    );
    const rank = pendingRankFromAvg(desiredAvg);

    teams[teamKey].push({
      id: `pending-${teamKey}-${pendingIndex++}`,
      name: 'Pendente',
      ranking: rank,
      ata: desiredAvg,
      def: desiredAvg,
      vel: desiredAvg,
      fis: desiredAvg,
      dri: desiredAvg,
      pas: desiredAvg,
      overall: desiredAvg,
      pendingAvg: desiredAvg,
      isPending: true,
      tipo: 'pendente',
    });
  }

  return teams;
}

function drawTeams(active) {
  const realPlayers = active.slice(0, TEAM_SIZE * 4);
  const keys = ['vermelho', 'azul', 'amarelo', 'verde'];
  const teams = { vermelho: [], azul: [], amarelo: [], verde: [] };
  const randomized = shuffleArray(realPlayers).sort((a, b) => {
    return (RANK_VAL[b.ranking] || 0) - (RANK_VAL[a.ranking] || 0);
  });

  randomized.forEach((player) => {
    const teamKey = pickBestTeamKey(teams, player);
    teams[teamKey].push(player);
  });

  return fillPendingSlots(teams, realPlayers);
}

function getNextGameDate() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(22, 0, 0, 0);

  if (now.getDay() === 1 && now < next) {
    return next;
  }

  const diff = (8 - now.getDay()) % 7 || 7;
  next.setDate(now.getDate() + diff);
  next.setHours(22, 0, 0, 0);
  return next;
}

function initials(name) {
  return name.trim().split(' ')[0].slice(0, 3).toUpperCase();
}

function calcStandings(rounds) {
  const pts = { vermelho: 0, azul: 0, amarelo: 0, verde: 0 };
  const gf = { vermelho: 0, azul: 0, amarelo: 0, verde: 0 };
  const gc = { vermelho: 0, azul: 0, amarelo: 0, verde: 0 };
  rounds.forEach((r) =>
    r.pairs.forEach((p) => {
      const a = parseInt(p.sA),
        b = parseInt(p.sB);
      if (isNaN(a) || isNaN(b)) return;
      gf[p.tA] += a;
      gc[p.tA] += b;
      gf[p.tB] += b;
      gc[p.tB] += a;
      if (a > b) {
        pts[p.tA] += 3;
      } else if (a < b) {
        pts[p.tB] += 3;
      } else {
        pts[p.tA] += 1;
        pts[p.tB] += 1;
      }
    })
  );
  return Object.keys(pts)
    .map((t) => ({
      team: t,
      pts: pts[t],
      gf: gf[t],
      gc: gc[t],
      sg: gf[t] - gc[t],
    }))
    .sort((a, b) => b.pts - a.pts || b.sg - a.sg);
}

// ============ STYLES ============
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Barlow',sans-serif;background:#080808;color:#f0f0f0;overflow:hidden;height:100vh;height:100dvh}
.app{display:flex;flex-direction:column;height:100vh;height:100dvh;max-width:480px;margin:0 auto;background:#0a0a0a;position:relative}
.hdr{background:linear-gradient(135deg,#0f0f0f,#1a1a1a);border-bottom:1px solid #222;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.hdr-title{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;background:linear-gradient(90deg,#4ade80,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hdr-sub{font-size:10px;color:#444;letter-spacing:1px;text-transform:uppercase}
.content{flex:1;overflow-y:auto;padding:16px;padding-bottom:80px}
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:#0f0f0f;border-top:1px solid #1f1f1f;display:flex;z-index:100}
.ntab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 1px 6px;background:none;border:none;cursor:pointer;color:#444;transition:color .2s;font-family:'Barlow',sans-serif}
.ntab.on{color:#4ade80}
.nico{font-size:16px}
.nlbl{font-size:8px;font-weight:700;letter-spacing:.2px;margin-top:2px}
.stitle{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;color:#4ade80;margin-bottom:12px}
.card{background:#141414;border:1px solid #222;border-radius:12px;padding:16px;margin-bottom:12px}
.btn{background:linear-gradient(135deg,#16a34a,#4ade80);color:#000;border:none;padding:12px 24px;border-radius:10px;font-family:'Barlow',sans-serif;font-weight:700;font-size:14px;cursor:pointer;width:100%;letter-spacing:1px;text-transform:uppercase;transition:opacity .15s}
.btn:hover{opacity:.88}
.btn2{background:#161616;color:#4ade80;border:1px solid #2a5a2a;padding:9px 16px;border-radius:9px;font-family:'Barlow',sans-serif;font-weight:700;font-size:12px;cursor:pointer;letter-spacing:.5px;transition:background .2s;white-space:nowrap}
.btn2:hover{background:#0d1f0d}
.sco{width:46px;height:46px;background:#1a1a1a;border:2px solid #333;border-radius:8px;color:#fff;font-family:'Bebas Neue',sans-serif;font-size:26px;text-align:center;outline:none;transition:border-color .2s;touch-action:manipulation}
.sco:focus{border-color:#4ade80}
.inp{width:100%;background:#0d0d0d;border:1px solid #2a2a2a;border-radius:8px;padding:10px 12px;color:#fff;font-family:'Barlow',sans-serif;font-size:14px;outline:none;margin-bottom:10px}
.inp:focus{border-color:#4ade80}
.sel{width:100%;background:#0d0d0d;border:1px solid #2a2a2a;border-radius:8px;padding:10px 12px;color:#fff;font-family:'Barlow',sans-serif;font-size:14px;outline:none;margin-bottom:10px;appearance:none}
.lbl{font-size:10px;color:#555;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;display:block}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:200;padding:16px}
.modal{background:#141414;border:1px solid #2a2a2a;border-radius:16px;padding:22px;width:100%;max-width:360px;max-height:85vh;overflow-y:auto}
.admbadge{background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;letter-spacing:.5px}
input[type=number]{-moz-appearance:textfield}
input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
.tog{width:44px;height:24px;border-radius:12px;border:none;cursor:pointer;position:relative;transition:background .3s;flex-shrink:0}
.tog::after{content:'';position:absolute;width:18px;height:18px;border-radius:9px;background:#fff;top:3px;transition:left .25s}
.tog.on{background:#16a34a}.tog.on::after{left:23px}
.tog.off{background:#2a2a2a}.tog.off::after{left:3px}
.tog:disabled{cursor:not-allowed;opacity:.5}
`;

// ── COUNTDOWN (isolated to avoid re-rendering the whole app every second) ──
function Countdown() {
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = getNextGameDate() - new Date();
      if (diff <= 0) {
        setCd({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setCd({
        d: Math.floor(diff / 864e5),
        h: Math.floor((diff % 864e5) / 36e5),
        m: Math.floor((diff % 36e5) / 6e4),
        s: Math.floor((diff % 6e4) / 1e3),
      });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
      {[
        { n: String(cd.d).padStart(2, '0'), l: 'DIAS' },
        { n: String(cd.h).padStart(2, '0'), l: 'HORAS' },
        { n: String(cd.m).padStart(2, '0'), l: 'MIN' },
        { n: String(cd.s).padStart(2, '0'), l: 'SEG' },
      ].map(({ n, l }, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 34,
              lineHeight: 1,
              color: '#4ade80',
            }}
          >
            {n}
          </span>
          <span
            style={{
              fontSize: 9,
              color: '#4a7a4a',
              letterSpacing: 1,
              marginTop: 2,
            }}
          >
            {l}
          </span>
        </div>
      ))}
    </div>
  );
}

function AddPlayerModal({
  show,
  newP,
  setNewP,
  setShowAdd,
  players,
  updatePlayers,
  onAdded,
  title = 'NOVO JOGADOR',
}) {
  const nameRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const id = setTimeout(() => nameRef.current?.focus(), 0);
    return () => clearTimeout(id);
  }, [show]);

  if (!show) return null;

  const set = (k, v) => setNewP((prev) => ({ ...prev, [k]: v }));
  const suggested = suggestRanking(newP.ata, newP.def, newP.vel, newP.fis ?? newP.dri, newP.dri, newP.pas ?? newP.dri, newP.overall);
  const avg = Math.round((newP.ata + newP.def + newP.vel + (newP.fis ?? newP.dri) + newP.dri + (newP.pas ?? newP.dri)) / 6);
  const rankChanged = newP.ranking !== suggested;

  return (
    <div className="overlay" onClick={() => setShowAdd(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 22,
            color: '#4ade80',
            marginBottom: 16,
          }}
        >
          {title}
        </div>
        <label className="lbl">TIPO</label>
        <select
          className="sel"
          value={newP.tipo}
          onChange={(e) => set('tipo', e.target.value)}
        >
          <option value="mensalista">👥 Mensalista</option>
          <option value="avulso">🎟️ Avulso</option>
        </select>
        <label className="lbl">NOME</label>
        <input
          ref={nameRef}
          autoFocus
          className="inp"
          placeholder="Nome"
          value={newP.name}
          onChange={(e) => set('name', e.target.value)}
        />
        <div
          style={{
            background: '#0a0a0a',
            border: '1px solid #1f1f1f',
            borderRadius: 10,
            padding: 12,
            marginBottom: 10,
          }}
        >
          <label className="lbl" style={{ marginBottom: 10, display: 'block' }}>
            ATRIBUTOS
          </label>
          {[
            ['ATA', 'ata'],
            ['DEF', 'def'],
            ['VEL', 'vel'],
            ['FIS', 'fis'],
            ['DRI', 'dri'],
            ['PAS', 'pas'],
          ].map(([l, k]) => (
            <div
              key={k}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: '#555',
                  fontWeight: 700,
                  width: 28,
                  flexShrink: 0,
                }}
              >
                {l}
              </span>
              <input
                type="range"
                min="1"
                max="99"
                value={newP[k]}
                onChange={(e) => set(k, parseInt(e.target.value))}
                style={{ flex: 1, accentColor: RANK_COLOR[suggested] }}
              />
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                type="text"
                className="inp"
                style={{
                  width: 52,
                  marginBottom: 0,
                  textAlign: 'center',
                  padding: '6px 4px',
                  fontSize: 13,
                }}
                value={newP[k]}
                onChange={(e) =>
                  set(
                    k,
                    Math.max(
                      1,
                      Math.min(
                        99,
                        parseInt(String(e.target.value).replace(/\D/g, '')) || 1
                      )
                    )
                  )
                }
              />
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 8,
              borderTop: '1px solid #1f1f1f',
              marginTop: 4,
            }}
          >
            <span style={{ fontSize: 11, color: '#444' }}>Média geral</span>
            <span
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 18,
                color: RANK_COLOR[suggested],
              }}
            >
              {avg}
            </span>
          </div>
        </div>
        {/* Overall editável */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <label className="lbl" style={{ margin: 0 }}>OVERALL</label>
            <button
              type="button"
              onClick={() => {
                const vals = [newP.ata, newP.def, newP.vel, newP.fis ?? newP.dri, newP.dri, newP.pas ?? newP.dri]
                  .sort((a, b) => b - a).slice(0, 4);
                set('overall', Math.round(vals.reduce((s, v) => s + v, 0) / 4));
              }}
              style={{ background: 'none', border: '1px solid #2a5a2a', borderRadius: 6, padding: '2px 10px', fontSize: 10, color: '#4ade80', cursor: 'pointer', fontWeight: 700 }}
            >AUTO</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="range" min="1" max="99" value={newP.overall ?? 65}
              onChange={(e) => set('overall', parseInt(e.target.value))}
              style={{ flex: 1, accentColor: RANK_COLOR[suggested] }} />
            <input inputMode="numeric" pattern="[0-9]*" type="text" className="inp"
              style={{ width: 52, marginBottom: 0, textAlign: 'center', padding: '6px 4px', fontSize: 13 }}
              value={newP.overall ?? 65}
              onChange={(e) => set('overall', Math.max(1, Math.min(99, parseInt(String(e.target.value).replace(/\D/g,'')) || 1)))} />
          </div>
        </div>
        <label className="lbl">RANKING</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {['A', 'B', 'C', 'D', 'E'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => set('ranking', r)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 8,
                border: `2px solid ${
                  newP.ranking === r ? RANK_COLOR[r] : '#1f1f1f'
                }`,
                background:
                  newP.ranking === r ? RANK_COLOR[r] + '22' : '#0d0d0d',
                color: newP.ranking === r ? RANK_COLOR[r] : '#333',
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 20,
                cursor: 'pointer',
                fontWeight: 900,
                position: 'relative',
                transition: 'all .15s',
              }}
            >
              {r}
              {suggested === r && (
                <span
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -4,
                    background: '#4ade80',
                    color: '#000',
                    fontSize: 8,
                    fontWeight: 900,
                    padding: '1px 4px',
                    borderRadius: 4,
                  }}
                >
                  AUTO
                </span>
              )}
            </button>
          ))}
        </div>
        {rankChanged && (
          <div
            style={{
              background: '#1a1200',
              border: '1px solid #3a2a00',
              borderRadius: 8,
              padding: '8px 12px',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 12, color: '#6b5000' }}>
              Sugestão pela média:{' '}
              <strong style={{ color: RANK_COLOR[suggested] }}>
                {suggested}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => set('ranking', suggested)}
              style={{
                background: 'none',
                border: '1px solid #3a2a00',
                borderRadius: 6,
                padding: '3px 10px',
                fontSize: 11,
                color: '#f59e0b',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Usar
            </button>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            type="button"
            className="btn2"
            style={{ flex: 1, padding: 10 }}
            onClick={() => setShowAdd(false)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn"
            style={{ flex: 1 }}
            onClick={() => {
              if (!newP.name.trim()) return;
              const nextId = players.length
                ? Math.max(...players.map((p) => p.id)) + 1
                : 1;
              const p = {
                ...newP,
                id: nextId,
                goals: 0,
                champ: 0,
                vice: 0,
                pres: 0,
                paid: false,
              };
              const updatedPlayers = [...players, p];
              updatePlayers(updatedPlayers);
              onAdded?.(p);
              setShowAdd(false);
              setNewP({
                name: '',
                tipo: 'mensalista',
                ranking: 'C',
                ata: 65,
                def: 65,
                vel: 65,
                fis: 65,
                dri: 65,
                pas: 65,
                overall: 65,
              });
            }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
function ModalEdit({ editP, setEditP, setShowEdt, players, updatePlayers }) {
  if (!editP) return null;
  const set = (k, v) => setEditP((prev) => ({ ...prev, [k]: v }));
  const suggested = suggestRanking(editP.ata, editP.def, editP.vel, editP.fis ?? editP.dri, editP.dri, editP.pas ?? editP.dri, editP.overall);
  const avg = Math.round((editP.ata + editP.def + editP.vel + (editP.fis ?? editP.dri) + editP.dri + (editP.pas ?? editP.dri)) / 6);
  const rankChanged = editP.ranking !== suggested;
  return (
    <div className="overlay" onClick={() => setShowEdt(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 22,
            color: '#4ade80',
            marginBottom: 16,
          }}
        >
          EDITAR JOGADOR
        </div>
        <label className="lbl">TIPO</label>
        <select
          className="sel"
          value={editP.tipo || 'mensalista'}
          onChange={(e) => set('tipo', e.target.value)}
        >
          <option value="mensalista">👥 Mensalista</option>
          <option value="avulso">🎟️ Avulso</option>
        </select>

        {/* Card Photo Upload */}
        <label className="lbl">CARD DO JOGADOR</label>
        <div style={{ marginBottom: 10 }}>
          {editP.cardUrl ? (
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <img src={editP.cardUrl} alt="card" style={{ width: '100%', borderRadius: 10, maxHeight: 200, objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => set('cardUrl', '')}
                style={{ position: 'absolute', top: 6, right: 6, background: '#1a0a0a', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 6, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}
              >
                ✕ Remover
              </button>
            </div>
          ) : (
            <div style={{ background: '#0d0d0d', border: '1px dashed #2a2a2a', borderRadius: 10, padding: 16, textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🃏</div>
              <div style={{ fontSize: 12, color: '#444' }}>Nenhum card enviado</div>
            </div>
          )}
          <label style={{ display: 'block', background: '#161616', border: '1px solid #2a5a2a', borderRadius: 9, padding: '9px 16px', textAlign: 'center', color: '#4ade80', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5 }}>
            📤 {editP.cardUrl ? 'TROCAR CARD' : 'ENVIAR CARD'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const storageRef = ref(storage, `cards/${editP.id}_${Date.now()}`);
                  await uploadBytes(storageRef, file);
                  const url = await getDownloadURL(storageRef);
                  set('cardUrl', url);
                } catch (err) {
                  alert('Erro ao fazer upload: ' + err.message);
                }
              }}
            />
          </label>
        </div>
        {[
          ['Nome', 'name', 'text'],
          ['Gols', 'goals', 'number'],
          ['Campeão', 'champ', 'number'],
          ['Vice', 'vice', 'number'],
          ['Presenças', 'pres', 'number'],
        ].map(([l, k, t]) => (
          <div key={k}>
            <label className="lbl">{l}</label>
            <input
              type={t}
              className="inp"
              value={editP[k]}
              onChange={(e) =>
                set(
                  k,
                  t === 'number'
                    ? parseInt(e.target.value) || 0
                    : e.target.value
                )
              }
            />
          </div>
        ))}

        {/* Atributos */}
        <div
          style={{
            background: '#0a0a0a',
            border: '1px solid #1f1f1f',
            borderRadius: 10,
            padding: 12,
            marginBottom: 10,
          }}
        >
          <label className="lbl" style={{ marginBottom: 10, display: 'block' }}>
            ATRIBUTOS
          </label>
          {[
            ['ATA', 'ata'],
            ['DEF', 'def'],
            ['VEL', 'vel'],
            ['FIS', 'fis'],
            ['DRI', 'dri'],
            ['PAS', 'pas'],
          ].map(([l, k]) => (
            <div
              key={k}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: '#555',
                  fontWeight: 700,
                  width: 28,
                  flexShrink: 0,
                }}
              >
                {l}
              </span>
              <input
                type="range"
                min="1"
                max="99"
                value={editP[k]}
                onChange={(e) => set(k, parseInt(e.target.value))}
                style={{ flex: 1, accentColor: RANK_COLOR[suggested] }}
              />
              <input
                type="number"
                min="1"
                max="99"
                className="inp"
                style={{
                  width: 52,
                  marginBottom: 0,
                  textAlign: 'center',
                  padding: '6px 4px',
                  fontSize: 13,
                }}
                value={editP[k]}
                onChange={(e) => set(k, parseInt(e.target.value) || 1)}
              />
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 8,
              borderTop: '1px solid #1f1f1f',
              marginTop: 4,
            }}
          >
            <span style={{ fontSize: 11, color: '#444' }}>Média geral</span>
            <span
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 18,
                color: RANK_COLOR[suggested],
              }}
            >
              {avg}
            </span>
          </div>
        </div>

        {/* Overall editável */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <label className="lbl" style={{ margin: 0 }}>OVERALL</label>
            <button
              type="button"
              onClick={() => {
                const vals = [editP.ata, editP.def, editP.vel, editP.fis ?? editP.dri, editP.dri, editP.pas ?? editP.dri]
                  .sort((a, b) => b - a).slice(0, 4);
                set('overall', Math.round(vals.reduce((s, v) => s + v, 0) / 4));
              }}
              style={{ background: 'none', border: '1px solid #2a5a2a', borderRadius: 6, padding: '2px 10px', fontSize: 10, color: '#4ade80', cursor: 'pointer', fontWeight: 700 }}
            >AUTO</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="range" min="1" max="99" value={editP.overall ?? top4Avg(editP)}
              onChange={(e) => set('overall', parseInt(e.target.value))}
              style={{ flex: 1, accentColor: RANK_COLOR[suggested] }} />
            <input inputMode="numeric" pattern="[0-9]*" type="text" className="inp"
              style={{ width: 52, marginBottom: 0, textAlign: 'center', padding: '6px 4px', fontSize: 13 }}
              value={editP.overall ?? top4Avg(editP)}
              onChange={(e) => set('overall', Math.max(1, Math.min(99, parseInt(String(e.target.value).replace(/\D/g,'')) || 1)))} />
          </div>
        </div>
        {/* Ranking com sugestão */}
        <label className="lbl">RANKING</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {['A', 'B', 'C', 'D', 'E'].map((r) => (
            <button
              key={r}
              onClick={() => set('ranking', r)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 8,
                border: `2px solid ${
                  editP.ranking === r ? RANK_COLOR[r] : '#1f1f1f'
                }`,
                background:
                  editP.ranking === r ? RANK_COLOR[r] + '22' : '#0d0d0d',
                color: editP.ranking === r ? RANK_COLOR[r] : '#333',
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 20,
                cursor: 'pointer',
                fontWeight: 900,
                position: 'relative',
                transition: 'all .15s',
              }}
            >
              {r}
              {suggested === r && (
                <span
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -4,
                    background: '#4ade80',
                    color: '#000',
                    fontSize: 8,
                    fontWeight: 900,
                    padding: '1px 4px',
                    borderRadius: 4,
                  }}
                >
                  AUTO
                </span>
              )}
            </button>
          ))}
        </div>
        {rankChanged && (
          <div
            style={{
              background: '#1a1200',
              border: '1px solid #3a2a00',
              borderRadius: 8,
              padding: '8px 12px',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 12, color: '#6b5000' }}>
              Sugestão pela média:{' '}
              <strong style={{ color: RANK_COLOR[suggested] }}>
                {suggested}
              </strong>
            </span>
            <button
              onClick={() => set('ranking', suggested)}
              style={{
                background: 'none',
                border: '1px solid #3a2a00',
                borderRadius: 6,
                padding: '3px 10px',
                fontSize: 11,
                color: '#f59e0b',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Usar
            </button>
          </div>
        )}

        {/* Tags */}
        <div style={{ marginBottom: 10 }}>
          <label className="lbl">TAGS</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {(editP.tags || []).map((tag: string, i: number) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#1a1a2e', border: '1px solid #2a2a5a', borderRadius: 20, padding: '3px 10px', fontSize: 12, color: '#818cf8', fontWeight: 600 }}>
                {tag}
                <button onClick={() => set('tags', (editP.tags || []).filter((_: string, j: number) => j !== i))}
                  style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 2 }}>×</button>
              </span>
            ))}
            {(editP.tags || []).length === 0 && <span style={{ fontSize: 12, color: '#333', fontStyle: 'italic' }}>Nenhuma tag</span>}
          </div>
          <input
            className="inp"
            style={{ marginBottom: 0 }}
            placeholder="Digite e pressione Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val && !(editP.tags || []).includes(val)) {
                  set('tags', [...(editP.tags || []), val]);
                }
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            className="btn2"
            style={{ flex: 1, padding: 10 }}
            onClick={() => setShowEdt(false)}
          >
            Cancelar
          </button>
          <button
            className="btn"
            style={{ flex: 1 }}
            onClick={() => {
              updatePlayers(
                players.map((p) => (p.id === editP.id ? editP : p))
              );
              setShowEdt(false);
            }}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('inicio');
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [drawn, setDrawn] = useState(null);
  const [active, setActive] = useState(INITIAL_PLAYERS.map((p) => p.id));
  const [rounds, setRounds] = useState(INIT_ROUNDS);
  const [finale, setFinale] = useState(INIT_FINAL);
  const [scorers, setScorers] = useState({}); // { playerId: count }
  const [coletes, setColetes] = useState({}); // { playerId: { washed: bool, date: string } }
  const [isAdmin, setIsAdmin] = useState(false);
  const [pwdVal, setPwdVal] = useState('');
  const [pwdErr, setPwdErr] = useState('');
  const [showAdm, setShowAdm] = useState(false);
  const [editP, setEditP] = useState(null);
  const [showEdt, setShowEdt] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newP, setNewP] = useState({
    name: '',
    tipo: 'mensalista',
    ranking: 'C',
    ata: 65,
    def: 65,
    vel: 65,
    fis: 65,
    dri: 65,
    pas: 65,
    overall: 65,
  });
  const [addPlayerConfig, setAddPlayerConfig] = useState({
    title: 'NOVO JOGADOR',
    onAdded: null,
  });
  const [lista, setLista] = useState({
    date: new Date().toISOString().split('T')[0],
    slots: [],
    ausentes: [],
  });
  const [copied, setCopied] = useState(false);
  // States lifted to avoid reset on countdown re-render
  const [avulsoName, setAvulsoName] = useState('');
  const avulsoRef = useRef(null);
  const ausenteMotivoRef = useRef(null);
  const [ausenteInput, setAusenteInput] = useState({ id: '', motivo: '' });
  const [showAusAdd, setShowAusAdd] = useState(false);
  const [confirmDesfazer, setConfirmDesfazer] = useState(false);
  const [lastResetAt, setLastResetAt] = useState('');
  const [caixaSubTab, setCaixaSubTab] = useState('pagamentos');
  const [appliedMatch, setAppliedMatch] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [champTeamPhoto, setChampTeamPhoto] = useState<string | null>(null);
  const [cardModal, setCardModal] = useState(null);

  // Load storage
  useEffect(() => {
    (async () => {
      try {
        const ref = doc(db, 'app', 'state');
        const snap = await getDoc(ref);
        if (!snap.exists()) return;
        const data = snap.data();
        const load = (k) => {
          try { const v = data[k]; return v ? JSON.parse(v) : null; } catch (e) { return null; }
        };
        const pl = load('fm_players');
        if (pl) setPlayers(pl);
        const dr = load('fm_drawn');
        if (dr) setDrawn(dr);
        const ac = load('fm_active');
        if (ac) setActive(ac);
        const ro = load('fm_rounds');
        if (ro) setRounds(ro);
        const fi = load('fm_finale');
        if (fi) setFinale(fi);
        const sc = load('fm_scorers');
        if (sc) setScorers(sc);
        const co = load('fm_coletes');
        if (co) setColetes(co);
        const li = load('fm_lista');
        if (li) setLista(li);
        const lr = load('fm_lastReset');
        if (lr) setLastResetAt(lr);
        const cm = load('fm_appliedMatch');
        if (cm) setAppliedMatch(cm);
        const ctp = data['fm_champTeamPhoto'];
        if (ctp) setChampTeamPhoto(ctp);
        const cs = load('fm_caixaSubTab');
        if (cs) setCaixaSubTab(cs);
        const mh = load('fm_matchHistory');
        if (mh) {
          // Dedup by date, keep first occurrence (most recent save)
          const seen = new Set();
          const deduped = mh.filter(h => {
            if (seen.has(h.date)) return false;
            seen.add(h.date);
            return true;
          });
          setMatchHistory(deduped);
          if (deduped.length !== mh.length) save('fm_matchHistory', deduped);
        }
      } catch (e) { console.error('Erro Firestore:', e); }
    })();
  }, []);

  const save = async (k, v) => {
    const raw = JSON.stringify(v);
    try {
      const ref = doc(db, 'app', 'state');
      await setDoc(ref, { [k]: raw }, { merge: true });
    } catch (e) { console.error('Erro ao salvar:', e); }
  };

  // Helpers
  const updatePlayers = (v) => {
    setPlayers(v);
    save('fm_players', v);
  };
  const updateRounds = (v) => {
    setRounds(v);
    save('fm_rounds', v);
  };
  const updateFinale = (v) => {
    setFinale(v);
    save('fm_finale', v);
  };
  const updateActive = (v) => {
    setActive(v);
    save('fm_active', v);
  };
  const updateDrawn = (v) => {
    setDrawn(v);
    save('fm_drawn', v);
  };
  const updateScorers = (v) => {
    setScorers(v);
    save('fm_scorers', v);
  };
  const updateColetes = (v) => {
    setColetes(v);
    save('fm_coletes', v);
  };
  const updateLista = (v) => {
    setLista(v);
    save('fm_lista', v);
  };

  const openAddPlayerModal = ({
    name = '',
    tipo = 'mensalista',
    title = 'NOVO JOGADOR',
    onAdded = null,
  } = {}) => {
    setNewP({
      name,
      tipo,
      ranking: 'C',
      ata: 65,
      def: 65,
      vel: 65,
      fis: 65,
      dri: 65,
      pas: 65,
      overall: 65,
    });
    setAddPlayerConfig({ title, onAdded });
    setShowAdd(true);
  };

  const addPlayerToLista = (player) => {
    setLista((prev) => {
      if (prev.slots.length >= 20) return prev;
      if (
        prev.slots.find(
          (s) => normalizeName(s.name) === normalizeName(player.name)
        )
      )
        return prev;
      const next = { ...prev, slots: [...prev.slots, { name: player.name }] };
      save('fm_lista', next);
      return next;
    });
  };

  useEffect(() => {
    const checkReset = async () => {
      const now = new Date();
      if (now.getDay() !== 1 || now.getHours() < 22) return;
      const key = now.toISOString().slice(0, 13);
      if (lastResetAt === key) return;
      const freshLista = {
        date: now.toISOString().split('T')[0],
        slots: [],
        ausentes: [],
      };
      setDrawn(null);
      setRounds(INIT_ROUNDS);
      setFinale(INIT_FINAL);
      setScorers({});
      setLista(freshLista);
      setLastResetAt(key);
      await save('fm_drawn', null);
      await save('fm_rounds', INIT_ROUNDS);
      await save('fm_finale', INIT_FINAL);
      await save('fm_scorers', {});
      await save('fm_lista', freshLista);
      await save('fm_lastReset', key);
      await save('fm_appliedMatch', null);
      setAppliedMatch(null);
    };
    checkReset();
    const iv = setInterval(checkReset, 60000);
    return () => clearInterval(iv);
  }, [lastResetAt]);

  const paidCount = players.filter((p) => p.paid).length;

  const liderTabela = (() => {
    const mensalistas = players.filter((p) => (p.tipo || 'mensalista') === 'mensalista');
    if (!mensalistas.length) return null;
    const sorted = [...mensalistas].sort((a, b) => b.champ - a.champ || b.vice - a.vice || b.goals - a.goals || b.pres - a.pres);
    return sorted[0];
  })();

  const bolaMurcha = (() => {
    const maxPres = Math.max(...players.filter(p => (p.tipo || 'mensalista') === 'mensalista').map(p => p.pres), 1);
    const elegiveis = players.filter((p) =>
      (p.tipo || 'mensalista') === 'mensalista' &&
      p.pres >= maxPres * 0.5
    );
    if (!elegiveis.length) return null;
    // Pior da tabela: menos títulos, menos vice, menos gols (mesmo critério da tabela invertido)
    const sorted = [...elegiveis].sort((a, b) =>
      a.champ - b.champ || a.vice - b.vice || a.goals - b.goals || a.pres - b.pres
    );
    return sorted[0];
  })();

  const bolaDeOuro = (() => {
    const mensalistas = players.filter(p => (p.tipo || 'mensalista') === 'mensalista');
    if (!mensalistas.length) return null;
    const sorted = [...mensalistas].sort((a, b) => b.goals - a.goals);
    return sorted[0]?.goals > 0 ? sorted[0] : null;
  })();

  const currentChampionTeam = (() => {
    const a = parseInt(finale.sA, 10);
    const b = parseInt(finale.sB, 10);
    if (isNaN(a) || isNaN(b) || !drawn) return null;
    if (a === b) return null;
    return a > b ? finale.tA : finale.tB;
  })();

  const currentTopScorer = (() => {
    const listed = players.filter((p) =>
      lista.slots.some((s) => normalizeName(s.name) === normalizeName(p.name))
    );
    if (!listed.length) return null;
    const sorted = [...listed].sort(
      (a, b) => (scorers[b.id] || 0) - (scorers[a.id] || 0)
    );
    const first = sorted[0];
    if (!first || !(scorers[first.id] > 0)) return null;
    const tied = sorted.filter(
      (p) => (scorers[p.id] || 0) === (scorers[first.id] || 0)
    );
    return {
      name: tied.map((p) => p.name).join(' / '),
      goals: scorers[first.id] || 0,
      cardUrl: tied.length === 1 ? (first.cardUrl || null) : null,
    };
  })();

  const saveMatchResults = () => {
    const finalA = parseInt(finale.sA, 10);
    const finalB = parseInt(finale.sB, 10);
    if (!drawn) {
      alert('Faça o sorteio antes de salvar a partida.');
      return;
    }
    if (isNaN(finalA) || isNaN(finalB)) {
      alert('Preencha o placar da final antes de salvar.');
      return;
    }
    if (finale.tA === finale.tB) {
      alert('Escolha times diferentes na final.');
      return;
    }

    const presentIds = players
      .filter((p) =>
        lista.slots.some((s) => normalizeName(s.name) === normalizeName(p.name))
      )
      .map((p) => p.id);

    const champTeam =
      finalA > finalB ? finale.tA : finalA < finalB ? finale.tB : null;
    const viceTeam =
      finalA > finalB ? finale.tB : finalA < finalB ? finale.tA : null;
    const champIds = champTeam
      ? (drawn[champTeam] || []).filter((p) => !p.isPending).map((p) => p.id)
      : [];
    const viceIds = viceTeam
      ? (drawn[viceTeam] || []).filter((p) => !p.isPending).map((p) => p.id)
      : [];

    const normalizedGoals = Object.fromEntries(
      Object.entries(scorers)
        .map(([pid, goals]) => [Number(pid), Number(goals) || 0])
        .filter(([, goals]) => goals > 0)
    );

    const previous = appliedMatch || null;
    const updated = players.map((player) => {
      let next = { ...player };

      if (previous) {
        next.goals -= previous.goals?.[player.id] || 0;
        next.pres -= previous.presentIds?.includes(player.id) ? 1 : 0;
        next.champ -= previous.champIds?.includes(player.id) ? 1 : 0;
        next.vice -= previous.viceIds?.includes(player.id) ? 1 : 0;
      }

      next.goals += normalizedGoals[player.id] || 0;
      next.pres += presentIds.includes(player.id) ? 1 : 0;
      next.champ += champIds.includes(player.id) ? 1 : 0;
      next.vice += viceIds.includes(player.id) ? 1 : 0;

      next.goals = Math.max(0, next.goals);
      next.pres = Math.max(0, next.pres);
      next.champ = Math.max(0, next.champ);
      next.vice = Math.max(0, next.vice);
      return next;
    });

    const snapshot = {
      goals: normalizedGoals,
      presentIds,
      champIds,
      viceIds,
      savedAt: new Date().toISOString(),
    };
    updatePlayers(updated);
    setAppliedMatch(snapshot);
    save('fm_appliedMatch', snapshot);

    // Save to history
    const topScorer = (() => {
      const entries = Object.entries(normalizedGoals);
      if (!entries.length) return null;
      const [topId, topGoals] = entries.sort((a,b) => b[1]-a[1])[0];
      const p = players.find(pl => pl.id === Number(topId));
      return p ? { name: p.name, goals: topGoals } : null;
    })();
    const champPlayers = champIds.map(id => players.find(p => p.id === id)?.name).filter(Boolean);
    const entry = {
      id: Date.now(),
      date: lista.date,
      champTeam,
      champPlayers,
      topScorer,
      finalScore: { tA: finale.tA, sA: finale.sA, tB: finale.tB, sB: finale.sB },
      rounds: rounds.map(r => ({ id: r.id, pairs: r.pairs.map(p => ({ ...p })) })),
    };
    // Se já existe entrada com a mesma data, atualiza; senão adiciona nova
    const existingIndex = matchHistory.findIndex(h => h.date === entry.date);
    let newHistory;
    if (existingIndex >= 0) {
      newHistory = matchHistory.map((h, i) => i === existingIndex ? { ...entry, id: h.id } : h);
    } else {
      newHistory = [entry, ...matchHistory].slice(0, 52);
    }
    setMatchHistory(newHistory);
    save('fm_matchHistory', newHistory);

    alert('Partida salva e tabela atualizada.');
  };

  const resetSemana = async () => {
    const hoje = new Date().getDay();
    if (hoje !== 6) {
      alert('A nova semana só pode ser iniciada no Sábado! 📅');
      return;
    }
    if (!confirm('Zerar a semana?\n\nLista, sorteio e placares serao apagados.\nA Tabela Geral NAO sera afetada.')) return;
    const freshLista = { date: new Date().toISOString().split('T')[0], slots: [], ausentes: [] };
    setDrawn(null); setRounds(INIT_ROUNDS); setFinale(INIT_FINAL);
    setScorers({}); setLista(freshLista); setAppliedMatch(null); setChampTeamPhoto(null);
    await save('fm_drawn', null); await save('fm_rounds', INIT_ROUNDS);
    await save('fm_finale', INIT_FINAL); await save('fm_scorers', {});
    await save('fm_lista', freshLista); await save('fm_appliedMatch', null);
    const ref2 = doc(db, 'app', 'state'); await setDoc(ref2, { fm_champTeamPhoto: null }, { merge: true });
  };

  const preserveContentScroll = (updater) => {
    const el = scrollRef.current;
    const top = el?.scrollTop || 0;
    updater();
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = top;
    });
  };

  // ── INICIO ──────────────────────────────────────────────────────────────────
  const exportTimes = async () => {
    if (!drawn) return;

    const CARD_W = 100, CARD_H = 136, GAP = 8, PAD = 16;
    const HEADER_H = 70, TEAM_LABEL_H = 36, TEAM_PAD = 14, NAME_H = 20;
    const teamKeys = Object.keys(TEAMS_CFG);
    const totalW = PAD * 2 + 5 * CARD_W + 4 * GAP;
    const totalH = HEADER_H + teamKeys.length * (TEAM_LABEL_H + CARD_H + NAME_H + TEAM_PAD * 2 + GAP) + PAD;

    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = totalW * scale;
    canvas.height = totalH * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);

    const RANK_COLORS: Record<string, string> = { A: '#f59e0b', B: '#f97316', C: '#3b82f6', D: '#6b7280', E: '#374151' };

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, totalW, totalH);

    // Header
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, totalW, HEADER_H);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 13px Arial';
    ctx.fillText('FOMINHAS LEAGUE', totalW / 2, 28);
    ctx.font = 'bold 20px Arial';
    ctx.fillText('TIMES DA SEMANA', totalW / 2, 54);

    const drawDefaultCard = (p: any, x: number, y: number) => {
      const fp = players.find((pl: any) => pl.id === p.id) || p;
      const rc = RANK_COLORS[fp.ranking] || '#555';
      const avg = fp.overall ?? avgOverall(fp);
      const firstName = fp.isPending ? '?' : fp.name.trim().split(' ')[0].toUpperCase();
      const fontSize = Math.min(18, Math.max(9, Math.floor(80 / (firstName.length * 0.6))));

      ctx.fillStyle = '#1c1c1c';
      ctx.beginPath(); ctx.roundRect(x, y, CARD_W, CARD_H, 8); ctx.fill();
      ctx.strokeStyle = rc; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x, y, CARD_W, CARD_H, 8); ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = rc; ctx.font = 'bold 11px Arial';
      ctx.fillText(String(avg), x + CARD_W / 2, y + 18);

      ctx.fillStyle = '#fff'; ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillText(firstName, x + CARD_W / 2, y + CARD_H / 2 + 6);

      ctx.fillStyle = rc;
      ctx.beginPath(); ctx.roundRect(x + CARD_W / 2 - 12, y + CARD_H - 22, 24, 16, 4); ctx.fill();
      ctx.fillStyle = '#000'; ctx.font = 'bold 10px Arial';
      ctx.fillText(fp.ranking, x + CARD_W / 2, y + CARD_H - 11);
    };

    const loadImage = (url: string): Promise<HTMLImageElement | null> =>
      fetch(url)
        .then(r => r.blob())
        .then(blob => new Promise<HTMLImageElement>((res, rej) => {
          const img = new Image();
          const u = URL.createObjectURL(blob);
          img.onload = () => { URL.revokeObjectURL(u); res(img); };
          img.onerror = () => { URL.revokeObjectURL(u); rej(); };
          img.src = u;
        }))
        .catch(() => null);

    let teamY = HEADER_H + GAP;

    for (const key of teamKeys) {
      const cfg = TEAMS_CFG[key];
      const teamPlayers = drawn[key] || [];
      const blockH = TEAM_LABEL_H + CARD_H + NAME_H + TEAM_PAD;

      ctx.fillStyle = cfg.color + '22';
      ctx.beginPath(); ctx.roundRect(PAD, teamY, totalW - PAD * 2, blockH, 10); ctx.fill();
      ctx.strokeStyle = cfg.color + '55'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(PAD, teamY, totalW - PAD * 2, blockH, 10); ctx.stroke();

      ctx.font = 'bold 15px Arial'; ctx.fillStyle = cfg.color; ctx.textAlign = 'left';
      ctx.fillText(cfg.emoji + ' ' + cfg.label.toUpperCase(), PAD + 12, teamY + 26);

      const cardsY = teamY + TEAM_LABEL_H;

      await Promise.all(teamPlayers.map(async (p: any, i: number) => {
        const fp = players.find((pl: any) => pl.id === p.id) || p;
        const cx = PAD + i * (CARD_W + GAP);
        const cardUrl = fp.cardUrl || p.cardUrl;

        if (cardUrl) {
          const img = await loadImage(cardUrl);
          if (img) {
            ctx.save();
            ctx.beginPath(); ctx.roundRect(cx, cardsY, CARD_W, CARD_H, 8); ctx.clip();
            ctx.drawImage(img, cx, cardsY, CARD_W, CARD_H);
            ctx.restore();
          } else {
            drawDefaultCard(p, cx, cardsY);
          }
        } else {
          drawDefaultCard(p, cx, cardsY);
        }

        // Name below card
        const name = fp.isPending ? 'Pendente' : fp.name.trim().split(' ')[0];
        ctx.fillStyle = fp.isPending ? '#555' : cfg.color;
        ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center';
        ctx.fillText(name, cx + CARD_W / 2, cardsY + CARD_H + 14);
      }));

      teamY += blockH + GAP;
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'times-fominhas-' + new Date().toISOString().slice(0, 10) + '.png';
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, 'image/png');
  };

  const TabInicio = () => (
    <div>
      {/* Countdown Hero */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          borderRadius: 16,
          marginBottom: 16,
          overflow: 'hidden',
          border: '1px solid #2d5a2d',
          background: 'linear-gradient(135deg,#0a1f0a,#162e16)',
        }}
      >
        {/* Logo */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/fominhas-league.firebasestorage.app/o/ChatGPT%20Image%2028%20de%20mar.%20de%202026%2C%2012_49_00.png?alt=media&token=af95c5c4-8e3a-4c12-88ab-632241979db7"
          alt="Logo"
          style={{ width: 120, height: 120, objectFit: 'contain', flexShrink: 0, margin: '6px 0 6px 6px' }}
        />
        {/* Countdown */}
        <div style={{ flex: 1, textAlign: 'center', paddingRight: 10 }}>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 11,
              letterSpacing: 3,
              color: '#4ade80',
              marginBottom: 8,
              whiteSpace: 'nowrap',
            }}
          >
            ⚽ PRÓXIMO JOGO — SEGUNDA 22H
          </div>
          <Countdown />
        </div>
      </div>

      {/* Foto do time campeão - banner full width */}
      {currentChampionTeam && (
        <div
          className="card"
          style={{
            padding: 0,
            overflow: 'hidden',
            marginBottom: 10,
            position: 'relative',
            background: TEAMS_CFG[currentChampionTeam].color + '14',
            border: `1px solid ${TEAMS_CFG[currentChampionTeam].color}44`,
          }}
        >
          {champTeamPhoto ? (
            <div style={{ position: 'relative' }}>
              <img
                src={champTeamPhoto}
                alt="Time Campeão"
                style={{ width: '100%', maxHeight: 220, objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                padding: '24px 14px 12px',
              }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: TEAMS_CFG[currentChampionTeam].color, letterSpacing: 2 }}>
                  🏆 {TEAMS_CFG[currentChampionTeam].label.toUpperCase()}
                </div>
                <div style={{ fontSize: 10, color: '#aaa', letterSpacing: 1, marginBottom: 4 }}>CAMPEÃO DA SEMANA</div>
                {drawn && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(drawn[currentChampionTeam] || []).filter(p => !p.isPending).map(p => (
                      <span key={p.id} style={{ fontSize: 9, fontWeight: 700, color: TEAMS_CFG[currentChampionTeam].color, background: 'rgba(0,0,0,0.5)', border: `1px solid ${TEAMS_CFG[currentChampionTeam].color}66`, borderRadius: 4, padding: '1px 5px' }}>
                        {p.name.trim().split(' ')[0]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    const ref2 = doc(db, 'app', 'state');
                    setChampTeamPhoto(null);
                    setDoc(ref2, { fm_champTeamPhoto: null }, { merge: true });
                  }}
                  style={{ position: 'absolute', top: 8, right: 8, background: '#1a0a0a', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 6, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}
                >✕</button>
              )}
            </div>
          ) : (
            <div style={{ padding: 14 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: TEAMS_CFG[currentChampionTeam].color, letterSpacing: 2, marginBottom: 4 }}>
                🏆 {TEAMS_CFG[currentChampionTeam].label.toUpperCase()}
              </div>
              <div style={{ fontSize: 10, color: '#555', letterSpacing: 1, marginBottom: 10 }}>CAMPEÃO DA SEMANA</div>
              {drawn && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: isAdmin ? 12 : 0 }}>
                  {(drawn[currentChampionTeam] || []).filter(p => !p.isPending).map(p => (
                    <span key={p.id} style={{ fontSize: 9, fontWeight: 700, color: TEAMS_CFG[currentChampionTeam].color, background: TEAMS_CFG[currentChampionTeam].color + '1a', border: `1px solid ${TEAMS_CFG[currentChampionTeam].color}33`, borderRadius: 4, padding: '1px 5px' }}>
                      {p.name}
                    </span>
                  ))}
                </div>
              )}
              {isAdmin && (
                <label style={{ display: 'block', background: '#161616', border: '1px solid #2a5a2a', borderRadius: 9, padding: '9px 16px', textAlign: 'center', color: '#4ade80', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5 }}>
                  📸 ENVIAR FOTO DO TIME
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const storageRef = ref(storage, `champ_photos/${Date.now()}`);
                      await uploadBytes(storageRef, file);
                      const url = await getDownloadURL(storageRef);
                      setChampTeamPhoto(url);
                      const ref2 = doc(db, 'app', 'state');
                      await setDoc(ref2, { fm_champTeamPhoto: url }, { merge: true });
                    } catch (err: any) { alert('Erro: ' + err.message); }
                  }} />
                </label>
              )}
            </div>
          )}
          {champTeamPhoto && isAdmin && (
            <div style={{ padding: '10px 14px' }}>
              <label style={{ display: 'block', background: '#161616', border: '1px solid #2a5a2a', borderRadius: 9, padding: '8px 16px', textAlign: 'center', color: '#4ade80', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                🔄 TROCAR FOTO
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const storageRef = ref(storage, `champ_photos/${Date.now()}`);
                    await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(storageRef);
                    setChampTeamPhoto(url);
                    const ref2 = doc(db, 'app', 'state');
                    await setDoc(ref2, { fm_champTeamPhoto: url }, { merge: true });
                  } catch (err: any) { alert('Erro: ' + err.message); }
                }} />
              </label>
            </div>
          )}
        </div>
      )}

      {/* Quick stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginBottom: 16,
        }}
      >
        {/* Card Pikinha da Noite */}
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          {currentTopScorer?.cardUrl ? (
            <img
              src={currentTopScorer.cardUrl}
              alt={currentTopScorer.name}
              onClick={() => setCardModal(players.find(p => normalizeName(p.name) === normalizeName(currentTopScorer.name)))}
              style={{ width: '100%', maxHeight: 160, objectFit: 'contain', objectPosition: 'top', borderRadius: 8, cursor: 'pointer', marginBottom: 6 }}
            />
          ) : (
            <div style={{ fontSize: 22 }}>⚽</div>
          )}
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: currentTopScorer && currentTopScorer.name.length > 10 ? 16 : 24, color: '#4ade80', margin: '4px 0', lineHeight: 1.1 }}>
            {currentTopScorer ? currentTopScorer.name : '—'}
          </div>
          {currentTopScorer && <div style={{ fontSize: 11, color: '#4ade80', fontWeight: 700, marginBottom: 2 }}>{currentTopScorer.goals} gols</div>}
          <div style={{ fontSize: 10, color: '#555', letterSpacing: 1 }}>PIKINHA DA NOITE</div>
        </div>

        {/* Card Líder da Tabela */}
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          {liderTabela?.cardUrl ? (
            <img src={liderTabela.cardUrl} alt={liderTabela.name}
              onClick={() => setCardModal(liderTabela)}
              style={{ width: '100%', maxHeight: 160, objectFit: 'contain', objectPosition: 'top', borderRadius: 8, cursor: 'pointer', marginBottom: 6 }} />
          ) : (
            <div style={{ fontSize: 22 }}>🥇</div>
          )}
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: liderTabela && liderTabela.name.length > 10 ? 16 : 24, color: '#f59e0b', margin: '4px 0', lineHeight: 1.1 }}>
            {liderTabela ? liderTabela.name : '—'}
          </div>
          {liderTabela && (
            <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, marginBottom: 2 }}>
              {liderTabela.champ} 🏆 · {liderTabela.goals} ⚽
            </div>
          )}
          <div style={{ fontSize: 10, color: '#555', letterSpacing: 1 }}>LÍDER DA TABELA</div>
        </div>

        {/* Card Bola Murcha */}
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          {bolaMurcha?.cardUrl ? (
            <img src={bolaMurcha.cardUrl} alt={bolaMurcha.name}
              onClick={() => setCardModal(bolaMurcha)}
              style={{ width: '100%', maxHeight: 160, objectFit: 'contain', objectPosition: 'top', borderRadius: 8, cursor: 'pointer', marginBottom: 6 }} />
          ) : (
            <div style={{ fontSize: 22 }}>😵</div>
          )}
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: bolaMurcha && bolaMurcha.name.length > 10 ? 16 : 24, color: '#ef4444', margin: '4px 0', lineHeight: 1.1 }}>
            {bolaMurcha ? bolaMurcha.name : '—'}
          </div>
          {bolaMurcha && (
            <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, marginBottom: 2 }}>
              {bolaMurcha.champ} 🏆 · {bolaMurcha.pres} ✅
            </div>
          )}
          <div style={{ fontSize: 10, color: '#555', letterSpacing: 1 }}>BOLA MURCHA</div>
        </div>

        {/* Card Bola de Ouro */}
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          {bolaDeOuro?.cardUrl ? (
            <img src={bolaDeOuro.cardUrl} alt={bolaDeOuro.name}
              onClick={() => setCardModal(bolaDeOuro)}
              style={{ width: '100%', maxHeight: 160, objectFit: 'contain', objectPosition: 'top', borderRadius: 8, cursor: 'pointer', marginBottom: 6 }} />
          ) : (
            <div style={{ fontSize: 22 }}>🎯</div>
          )}
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: bolaDeOuro && bolaDeOuro.name.length > 10 ? 16 : 24, color: '#fbbf24', margin: '4px 0', lineHeight: 1.1 }}>
            {bolaDeOuro ? bolaDeOuro.name : '—'}
          </div>
          {bolaDeOuro && (
            <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, marginBottom: 2 }}>
              {bolaDeOuro.goals} ⚽ no total
            </div>
          )}
          <div style={{ fontSize: 10, color: '#555', letterSpacing: 1 }}>BOLA DE OURO</div>
        </div>
      </div>

      {drawn && (
        <div id="times-semana-export" style={{ background: '#0a0a0a', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="stitle" style={{ margin: 0 }}>Times da Semana</div>
        <button
          onClick={exportTimes}
          style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 8, padding: '6px 12px', color: '#4ade80', fontSize: 11, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", fontWeight: 700 }}
        >
          📸 EXPORTAR
        </button>
      </div>
          {Object.entries(TEAMS_CFG).map(
            ([k, cfg]) =>
              drawn[k] && (
                <div
                  key={k}
                  style={{
                    background: cfg.color + '14',
                    border: `1px solid ${cfg.color}44`,
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 18,
                      color: cfg.color,
                      letterSpacing: 2,
                      marginBottom: 10,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{cfg.emoji} TIME {cfg.label.toUpperCase()}</span>
                    <span style={{ fontSize: 14, opacity: 0.85 }}>
                      {Math.round(
                        drawn[k].reduce((s, p) => {
                          const fp = players.find(pl => pl.id === p.id) || p;
                          return s + (fp.overall ?? p.pendingAvg ?? avgOverall(fp));
                        }, 0) / drawn[k].length
                      )} OVR
                    </span>
                  </div>
                  <div data-scroll-row="1" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                    {drawn[k].map((p) => {
                      const fullPlayer = players.find((pl) => pl.id === p.id);
                      const cardUrl = fullPlayer?.cardUrl || p.cardUrl;
                      const avg = fullPlayer?.overall ?? p.overall ?? p.pendingAvg ?? avgOverall(fullPlayer || p);
                      const hasCard = !!cardUrl;
                      return (
                        <div
                          key={p.id}
                          onClick={() => hasCard && setCardModal(fullPlayer || p)}
                          style={{
                            flexShrink: 0,
                            width: 72,
                            cursor: hasCard ? 'pointer' : 'default',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          {/* Card image or default */}
                          <div style={{ position: 'relative', width: 72, height: 100 }}>
                            {hasCard ? (
                              <img
                                src={cardUrl}
                                alt={p.name}
                                style={{
                                  width: 72,
                                  height: 100,
                                  objectFit: 'cover',
                                  objectPosition: 'top',
                                  borderRadius: 8,
                                  border: `2px solid ${cfg.color}88`,
                                  display: 'block',
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 72,
                                  height: 100,
                                  background: 'linear-gradient(160deg,#1c1c1c,#252525)',
                                  border: `2px solid ${RANK_COLOR[p.ranking]}`,
                                  borderRadius: 8,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 2,
                                }}
                              >
                                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, color: RANK_COLOR[p.ranking] }}>{avg}</span>
                                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: '#eee', lineHeight: 1 }}>{p.isPending ? '?' : initials(p.name)}</span>
                                <span style={{ background: RANK_COLOR[p.ranking], color: '#000', fontSize: 9, fontWeight: 900, padding: '1px 6px', borderRadius: 4, marginTop: 2 }}>{p.ranking}</span>
                              </div>
                            )}
                          </div>
                          {/* Name below card */}
                          <span style={{ fontSize: 10, fontWeight: 700, color: p.isPending ? '#555' : cfg.color, textAlign: 'center', lineHeight: 1.2, maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.isPending ? 'Pendente' : p.name.split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );

  // ── JOGADORES ───────────────────────────────────────────────────────────────
  const TabJogadores = () => {
    const mensalistas = players.filter(
      (p) => (p.tipo || 'mensalista') === 'mensalista'
    );
    const avulsos = players.filter((p) => p.tipo === 'avulso');

    const PlayerCard = ({ p }) => {
      const avg = p.overall ?? avgOverall(p);
      const isMens = (p.tipo || 'mensalista') === 'mensalista';
      return (
        <div
          key={p.id}
          style={{
            background: '#141414',
            border: '1px solid #222',
            borderRadius: 12,
            padding: 12,
            marginBottom: 8,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {p.cardUrl ? (
              <img
                src={p.cardUrl}
                alt={p.name}
                onClick={() => setCardModal(p)}
                style={{ width: 52, height: 72, objectFit: 'cover', objectPosition: 'top', borderRadius: 8, cursor: 'pointer', border: `2px solid ${RANK_COLOR[p.ranking]}` }}
              />
            ) : (
            <div
              style={{
                width: 52,
                height: 60,
                background: `linear-gradient(160deg,#1c1c1c,#252525)`,
                border: `2px solid ${RANK_COLOR[p.ranking]}`,
                borderRadius: '10px 10px 10px 10px',
                clipPath: 'polygon(0 0,100% 0,100% 78%,50% 100%,0 78%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, color: RANK_COLOR[p.ranking], lineHeight: 1 }}>
                {avg}
              </span>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: '#eee', lineHeight: 1 }}>
                {initials(p.name)}
              </span>
            </div>
            )}
            <div
              style={{
                position: 'absolute',
                bottom: -5,
                left: '50%',
                transform: 'translateX(-50%)',
                background: RANK_COLOR[p.ranking],
                color: '#000',
                fontSize: 9,
                fontWeight: 900,
                padding: '1px 5px',
                borderRadius: 4,
                whiteSpace: 'nowrap',
              }}
            >
              {p.ranking}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{ fontWeight: 700, fontSize: 15, cursor: p.cardUrl ? 'pointer' : 'default', textDecoration: p.cardUrl ? 'underline dotted #555' : 'none' }}
                  onClick={() => p.cardUrl && setCardModal(p)}
                >
                  {p.name}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 5,
                    background: isMens ? '#0d2010' : '#1a1000',
                    color: isMens ? '#4ade80' : '#f59e0b',
                    border: `1px solid ${isMens ? '#1a4a1a' : '#3a2a00'}`,
                  }}
                >
                  {isMens ? 'MENSAL' : 'AVULSO'}
                </span>
              </div>
              {isAdmin && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => {
                      setEditP({ ...p });
                      setShowEdt(true);
                    }}
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      color: '#666',
                      borderRadius: 6,
                      padding: '3px 7px',
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => {
                      if (!confirm(`Excluir ${p.name}?`)) return;
                      const updated = players.filter((pl) => pl.id !== p.id);
                      updatePlayers(updated);
                    }}
                    style={{
                      background: '#1a0a0a',
                      border: '1px solid #3a1a1a',
                      color: '#ef4444',
                      borderRadius: 6,
                      padding: '3px 7px',
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                ['ATA', p.ata],
                ['DEF', p.def],
                ['VEL', p.vel],
                ['FIS', p.fis ?? p.dri],
                ['DRI', p.dri],
                ['PAS', p.pas ?? p.dri],
              ].map(([l, v]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: '#555',
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >
                    {l}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 16,
                      color: '#ccc',
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: '#555', fontWeight: 700 }}>
                    ⚽GOL
                  </div>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 16,
                      color: '#4ade80',
                    }}
                  >
                    {p.goals}
                  </div>
                </div>
                {isMens && (
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{ fontSize: 9, color: '#555', fontWeight: 700 }}
                    >
                      🏆CAM
                    </div>
                    <div
                      style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: 16,
                        color: '#f59e0b',
                      }}
                    >
                      {p.champ}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Tags */}
            {(p.tags || []).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                {(p.tags || []).map((tag: string, i: number) => (
                  <span key={i} style={{ background: '#1a1a2e', border: '1px solid #2a2a5a', borderRadius: 20, padding: '2px 9px', fontSize: 10, color: '#818cf8', fontWeight: 700 }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <div className="stitle" style={{ margin: 0 }}>
            ELENCO ({players.length})
          </div>
          {isAdmin && (
            <button
              className="btn2"
              onClick={() =>
                openAddPlayerModal({
                  tipo: 'mensalista',
                  title: 'NOVO JOGADOR',
                })
              }
            >
              + NOVO
            </button>
          )}
        </div>

        {/* Mensalistas */}
        <div
          style={{
            fontSize: 10,
            color: '#4ade80',
            fontWeight: 700,
            letterSpacing: 1,
            marginBottom: 8,
            padding: '5px 10px',
            background: '#0d1f0d',
            borderRadius: 6,
            display: 'inline-block',
          }}
        >
          👥 MENSALISTAS ({mensalistas.length})
        </div>
        {mensalistas.map((p) => (
          <PlayerCard key={p.id} p={p} />
        ))}

        {/* Avulsos */}
        {avulsos.length > 0 && (
          <>
            <div
              style={{
                fontSize: 10,
                color: '#f59e0b',
                fontWeight: 700,
                letterSpacing: 1,
                margin: '12px 0 8px',
                padding: '5px 10px',
                background: '#1a1000',
                borderRadius: 6,
                display: 'inline-block',
              }}
            >
              🎟️ AVULSOS CADASTRADOS ({avulsos.length})
            </div>
            {avulsos.map((p) => (
              <PlayerCard key={p.id} p={p} />
            ))}
          </>
        )}
        {avulsos.length === 0 && isAdmin && (
          <div
            style={{
              fontSize: 12,
              color: '#333',
              textAlign: 'center',
              padding: '16px 0',
              borderTop: '1px solid #1a1a1a',
              marginTop: 8,
            }}
          >
            Nenhum avulso cadastrado — clique em + NOVO para adicionar
          </div>
        )}
      </div>
    );
  };

  // ── SORTEIO ─────────────────────────────────────────────────────────────────
  const TabSorteio = () => {
    // Jogadores da lista da semana que têm cadastro (com ranking/atributos)
    const naLista = lista.slots
      .map((s) =>
        players.find((p) => normalizeName(p.name) === normalizeName(s.name))
      )
      .filter(Boolean);

    const doShuffle = () => {
      if (naLista.length < 4) {
        alert('Adicione pelo menos 4 jogadores na Lista antes de sortear!');
        return;
      }
      const t = drawTeams(naLista);
      updateDrawn(t);
      setConfirmDesfazer(false);
    };

    const doDesfazer = () => {
      updateDrawn(null);
      setConfirmDesfazer(false);
    };

    const removeFromTeam = (teamKey, playerId) => {
      if (!isAdmin || !drawn) return;
      const allRealPlayers = Object.values(drawn)
        .flat()
        .filter((p) => !p.isPending && p.id !== playerId);
      updateDrawn(drawTeams(allRealPlayers));
    };

    const [movePlayer, setMovePlayer] = useState(null);

    const movePlayerBetweenTeams = (playerId, fromTeam, toTeam) => {
      if (!drawn || fromTeam === toTeam) return;
      const player = drawn[fromTeam]?.find(p => p.id === playerId);
      if (!player) return;
      const newDrawn = {};
      Object.keys(TEAMS_CFG).forEach(tk => {
        newDrawn[tk] = (drawn[tk] || []).filter(p => !p.isPending && p.id !== playerId);
      });
      if (toTeam) newDrawn[toTeam] = [...newDrawn[toTeam], player];
      const allReal = Object.values(newDrawn).flat();
      const balanced = fillPendingSlots(newDrawn, allReal);
      updateDrawn(balanced);
      setMovePlayer(null);
    };

    return (
      <div>
        <div className="stitle">SORTEIO</div>
        <div className="card">
          <div style={{ fontSize: 13, color: '#777', marginBottom: 12 }}>
            Na lista esta semana:{' '}
            <span style={{ color: '#4ade80', fontWeight: 700 }}>
              {naLista.length}
            </span>
            {lista.slots.length - naLista.length > 0 && (
              <span style={{ color: '#555' }}>
                {' '}
                (+{lista.slots.length - naLista.length} avulsos sem ranking)
              </span>
            )}
            <div style={{ fontSize: 11, color: '#333', marginTop: 4 }}>
              Configure a lista na aba 📋 Lista
            </div>
          </div>
          <div
            style={{
              background: '#0a140a',
              border: '1px solid #1a3a1a',
              borderRadius: 10,
              padding: 12,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: '#4ade80',
                fontWeight: 700,
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              ALGORITMO ALEATÓRIO + EQUILIBRADO
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
              Os jogadores são embaralhados, distribuídos para equilibrar os
              times e cada time fica com no máximo 5 vagas. Se faltar gente,
              aparece um jogador pendente com ranking sugerido.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {['A', 'B', 'C', 'D', 'E'].map((r) => {
                const cnt = naLista.filter((p) => p.ranking === r).length;
                return (
                  cnt > 0 && (
                    <span
                      key={r}
                      style={{
                        background: RANK_COLOR[r] + '1a',
                        border: `1px solid ${RANK_COLOR[r]}44`,
                        color: RANK_COLOR[r],
                        borderRadius: 6,
                        padding: '3px 9px',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {r}: {cnt}
                    </span>
                  )
                );
              })}
              {naLista.length === 0 && (
                <span style={{ fontSize: 12, color: '#333' }}>
                  Nenhum jogador na lista ainda
                </span>
              )}
            </div>
          </div>

          {/* Botões principais */}
          {isAdmin && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" style={{ flex: 1 }} onClick={doShuffle}>
              {drawn ? '🔀 REFAZER' : '🎲 SORTEAR TIMES'}
            </button>
            {drawn && !confirmDesfazer && (
              <button
                onClick={() => setConfirmDesfazer(true)}
                style={{
                  background: '#1a0a0a',
                  border: '1px solid #3a1a1a',
                  color: '#ef4444',
                  borderRadius: 10,
                  padding: '12px 16px',
                  fontFamily: "'Barlow',sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  flexShrink: 0,
                  letterSpacing: 0.5,
                }}
              >
                ✕ DESFAZER
              </button>
            )}
          </div>
          )}

          {/* Confirmação desfazer */}
          {confirmDesfazer && (
            <div
              style={{
                marginTop: 12,
                background: '#1a0808',
                border: '1px solid #3a1a1a',
                borderRadius: 10,
                padding: 12,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: '#ef4444',
                  fontWeight: 700,
                  marginBottom: 10,
                  textAlign: 'center',
                }}
              >
                Apagar o sorteio atual?
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setConfirmDesfazer(false)}
                  style={{
                    flex: 1,
                    background: '#141414',
                    border: '1px solid #2a2a2a',
                    color: '#888',
                    borderRadius: 8,
                    padding: '9px',
                    fontFamily: "'Barlow',sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={doDesfazer}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg,#7f1d1d,#ef4444)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '9px',
                    fontFamily: "'Barlow',sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Sim, desfazer
                </button>
              </div>
            </div>
          )}
        </div>

        {drawn &&
          Object.entries(TEAMS_CFG).map(
            ([k, cfg]) =>
              drawn[k] && (
                <div
                  key={k}
                  style={{
                    background: cfg.color + '10',
                    border: `1px solid ${cfg.color}44`,
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: 20,
                        color: cfg.color,
                        letterSpacing: 2,
                      }}
                    >
                      {cfg.emoji} {cfg.label.toUpperCase()}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: cfg.color + '88',
                        fontWeight: 700,
                      }}
                    >
                      {drawn[k].filter((p) => !p.isPending).length}/{TEAM_SIZE}{' '}
                      jogadores
                    </span>
                  </div>
                  {drawn[k].map((p, i) => {
                    const fullP = players.find(pl => pl.id === p.id) || p;
                    const avg = fullP.overall != null && !isNaN(fullP.overall)
                      ? fullP.overall
                      : (p.pendingAvg ?? avgOverall(fullP));
                    return (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 0',
                          borderBottom:
                            i < drawn[k].length - 1
                              ? `1px solid ${cfg.color}1a`
                              : 'none',
                          opacity: p.isPending ? 0.78 : 1,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: 6,
                              background: RANK_COLOR[p.ranking] + '1a',
                              border: `1px solid ${RANK_COLOR[p.ranking]}55`,
                              color: RANK_COLOR[p.ranking],
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 11,
                              fontWeight: 900,
                            }}
                          >
                            {p.ranking}
                          </span>
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: 14,
                              color: p.isPending ? '#9ca3af' : '#fff',
                            }}
                          >
                            {p.name}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <span style={{ color: '#555', fontSize: 12 }}>
                            {p.isPending ? 'sug.' : 'overall'} {avg}
                          </span>
                          {isAdmin && !p.isPending && (
                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              {movePlayer?.playerId === p.id ? (
                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                  {Object.entries(TEAMS_CFG).filter(([tk]) => tk !== k).map(([tk, tc]) => (
                                    <button key={tk} onClick={() => movePlayerBetweenTeams(p.id, k, tk)}
                                      style={{ background: tc.color + '22', border: `1px solid ${tc.color}66`, color: tc.color, borderRadius: 6, padding: '2px 7px', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>
                                      {tc.emoji}
                                    </button>
                                  ))}
                                  <button onClick={() => setMovePlayer(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 13, padding: '2px 4px' }}>✕</button>
                                </div>
                              ) : (
                                <>
                                  <button onClick={() => setMovePlayer({ playerId: p.id, fromTeam: k })} title="Mover para outro time"
                                    style={{ background: '#1a1a2e', border: '1px solid #2a2a5a', color: '#818cf8', borderRadius: 6, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, padding: 0 }}>
                                    ⇄
                                  </button>
                                  <button onClick={() => removeFromTeam(k, p.id)} title="Remover do time"
                                    style={{ background: '#1a0a0a', border: '1px solid #2a1212', color: '#555', borderRadius: 6, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}>
                                    ✕
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div
                    style={{
                      marginTop: 10,
                      paddingTop: 8,
                      borderTop: `1px solid ${cfg.color}2a`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: '#555' }}>Média geral do time</span>
                    <span style={{ color: cfg.color, fontWeight: 700 }}>
                      {drawn[k].length > 0
                        ? Math.round(
                            drawn[k].reduce(
                              (s, p) => {
                                const fp = players.find(pl => pl.id === p.id) || p;
                                return s + (p.pendingAvg ?? avgOverall(fp));
                              },
                              0
                            ) / drawn[k].length
                          )
                        : '—'}
                    </span>
                  </div>
                </div>
              )
          )}
      </div>
    );
  };

  // ── HISTORY ENTRY ────────────────────────────────────────────────────────────
  const HistoryEntry = ({ h }) => {
    const [open, setOpen] = useState(false);
    const fmtDate = (iso) => {
      if (!iso) return '';
      const [y, m, d] = iso.split('-');
      return `${d}/${m}/${y.slice(2)}`;
    };
    const cfg = h.champTeam ? TEAMS_CFG[h.champTeam] : null;
    return (
      <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{ width: '100%', background: 'none', border: 'none', padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#555', fontWeight: 700 }}>📅 {fmtDate(h.date)}</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {cfg && <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{cfg.emoji} {cfg.label}</span>}
              {h.finalScore && <span style={{ fontSize: 11, color: '#777' }}>{TEAMS_CFG[h.finalScore.tA]?.emoji} {h.finalScore.sA} × {h.finalScore.sB} {TEAMS_CFG[h.finalScore.tB]?.emoji}</span>}
              {h.topScorer && <span style={{ fontSize: 11, color: '#4ade80' }}>⚽ {h.topScorer.name} ({h.topScorer.goals})</span>}
            </div>
          </div>
          <span style={{ color: '#444', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
        </button>
        {open && (
          <div style={{ borderTop: '1px solid #222', padding: '10px 14px' }}>
            {h.champPlayers?.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: '#555', letterSpacing: 1, marginBottom: 4 }}>🏆 CAMPEÕES</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {h.champPlayers.map((n, i) => (
                    <span key={i} style={{ fontSize: 11, color: cfg?.color || '#4ade80', background: (cfg?.color || '#4ade80') + '1a', border: `1px solid ${(cfg?.color || '#4ade80')}33`, borderRadius: 4, padding: '1px 6px' }}>{n}</span>
                  ))}
                </div>
              </div>
            )}
            {h.rounds?.map(r => (
              <div key={r.id} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 9, color: '#444', letterSpacing: 1, marginBottom: 3 }}>RODADA {r.id}</div>
                {r.pairs.map((p, pi) => {
                  const cA = TEAMS_CFG[p.tA], cB = TEAMS_CFG[p.tB];
                  if (!cA || !cB) return null;
                  return (
                    <div key={pi} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 11, color: cA.color, fontWeight: 700 }}>{cA.emoji} {cA.label}</span>
                      <span style={{ fontSize: 13, fontFamily: "'Bebas Neue',sans-serif", color: '#ccc' }}>{p.sA !== '' ? p.sA : '-'} × {p.sB !== '' ? p.sB : '-'}</span>
                      <span style={{ fontSize: 11, color: cB.color, fontWeight: 700 }}>{cB.label} {cB.emoji}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── PARTIDA ──────────────────────────────────────────────────────────────────
  const TabPartida = () => {
    const standings = calcStandings(rounds);
    const listedPlayers = players.filter((p) =>
      lista.slots.some((s) => normalizeName(s.name) === normalizeName(p.name))
    );
    const setRoundScore = (roundIndex, pairIndex, side, rawValue) => {
      const value = String(rawValue).replace(/\D/g, '').slice(0, 2);
      preserveContentScroll(() => {
        const nw = rounds.map((rr, rri) =>
          rri !== roundIndex
            ? rr
            : {
                ...rr,
                pairs: rr.pairs.map((pp, ppi) =>
                  ppi !== pairIndex ? pp : { ...pp, [side]: value }
                ),
              }
        );
        updateRounds(nw);
      });
    };
    const setFinalScore = (side, rawValue) => {
      const value = String(rawValue).replace(/\D/g, '').slice(0, 2);
      preserveContentScroll(() => {
        updateFinale({ ...finale, [side]: value });
      });
    };
    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <div className="stitle" style={{ margin: 0 }}>
            FOMINHAS LEAGUE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {appliedMatch && (
              <span
                style={{
                  fontSize: 10,
                  color: '#22c55e',
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                SALVO
              </span>
            )}
            {isAdmin && (
              <span
                style={{
                  fontSize: 10,
                  color: '#4ade80',
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                MODO ADMIN
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            fontSize: 10,
            color: '#444',
            letterSpacing: 1,
            marginBottom: 12,
            background: '#141414',
            padding: '6px 12px',
            borderRadius: 6,
          }}
        >
          FASE DE GRUPOS
        </div>

        {rounds.map((r, ri) => (
          <div
            key={r.id}
            className="card"
            style={{ marginBottom: 8, padding: 12 }}
          >
            <div
              style={{
                fontSize: 11,
                color: '#555',
                fontWeight: 700,
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              RODADA {r.id}
            </div>
            {r.pairs.map((pair, pi) => {
              const cA = TEAMS_CFG[pair.tA],
                cB = TEAMS_CFG[pair.tB];
              return (
                <div
                  key={pi}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    gap: 8,
                    padding: pi > 0 ? '10px 0 0' : '0 0 0',
                    borderTop: pi > 0 ? '1px solid #1a1a1a' : 'none',
                  }}
                >
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{ color: cA.color, fontWeight: 700, fontSize: 13 }}
                    >
                      {cA.emoji} {cA.label}
                    </span>
                  </div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                  >
                    {isAdmin ? (
                      <>
                        <input
                          inputMode="numeric"
                          pattern="[0-9]*"
                          type="text"
                          className="sco"
                          value={pair.sA ?? ''}
                          style={{ borderColor: cA.color + '66' }}
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) =>
                            setRoundScore(ri, pi, 'sA', e.target.value)
                          }
                        />
                        <span
                          style={{
                            color: '#333',
                            fontFamily: "'Bebas Neue',sans-serif",
                            fontSize: 18,
                          }}
                        >
                          ×
                        </span>
                        <input
                          inputMode="numeric"
                          pattern="[0-9]*"
                          type="text"
                          className="sco"
                          value={pair.sB ?? ''}
                          style={{ borderColor: cB.color + '66' }}
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) =>
                            setRoundScore(ri, pi, 'sB', e.target.value)
                          }
                        />
                      </>
                    ) : (
                      <>
                        <span
                          style={{
                            fontFamily: "'Bebas Neue',sans-serif",
                            fontSize: 30,
                            color: cA.color,
                          }}
                        >
                          {pair.sA !== '' ? pair.sA : '-'}
                        </span>
                        <span style={{ color: '#333', fontSize: 16 }}>×</span>
                        <span
                          style={{
                            fontFamily: "'Bebas Neue',sans-serif",
                            fontSize: 30,
                            color: cB.color,
                          }}
                        >
                          {pair.sB !== '' ? pair.sB : '-'}
                        </span>
                      </>
                    )}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <span
                      style={{ color: cB.color, fontWeight: 700, fontSize: 13 }}
                    >
                      {cB.emoji} {cB.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Classificação */}
        <div
          style={{
            fontSize: 10,
            color: '#444',
            letterSpacing: 1,
            margin: '8px 0 10px',
            background: '#141414',
            padding: '6px 12px',
            borderRadius: 6,
          }}
        >
          CLASSIFICAÇÃO
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table
            style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}
          >
            <thead>
              <tr>
                {['#', 'TIME', 'PTS', 'GF', 'GC', 'SG'].map((h) => (
                  <th
                    key={h}
                    style={{
                      background: '#1a1a1a',
                      padding: '8px 6px',
                      textAlign: 'center',
                      fontSize: 9,
                      color: '#555',
                      letterSpacing: 1,
                      fontWeight: 700,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {standings.map((s, i) => {
                const cfg = TEAMS_CFG[s.team];
                return (
                  <tr key={s.team}>
                    <td
                      style={{
                        padding: '9px 6px',
                        textAlign: 'center',
                        color:
                          i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#555',
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </td>
                    <td style={{ padding: '9px 6px', textAlign: 'center' }}>
                      <span
                        style={{
                          color: cfg.color,
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      >
                        {cfg.emoji} {cfg.label}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '9px 6px',
                        textAlign: 'center',
                        color: '#f0f0f0',
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      {s.pts}
                    </td>
                    <td
                      style={{
                        padding: '9px 6px',
                        textAlign: 'center',
                        color: '#4ade80',
                      }}
                    >
                      {s.gf}
                    </td>
                    <td
                      style={{
                        padding: '9px 6px',
                        textAlign: 'center',
                        color: '#ef4444',
                      }}
                    >
                      {s.gc}
                    </td>
                    <td
                      style={{
                        padding: '9px 6px',
                        textAlign: 'center',
                        color:
                          s.sg > 0 ? '#4ade80' : s.sg < 0 ? '#ef4444' : '#555',
                        fontWeight: 700,
                      }}
                    >
                      {s.sg > 0 ? '+' : ''}
                      {s.sg}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Final */}
        <div
          style={{
            background: 'linear-gradient(135deg,#1a1200,#2a1e00)',
            border: '1px solid #f59e0b33',
            borderRadius: 12,
            padding: 16,
            marginTop: 8,
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 15,
              color: '#f59e0b',
              letterSpacing: 2,
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            🏆 GRANDE FINAL
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ textAlign: 'right' }}>
              {isAdmin ? (
                <select
                  className="sel"
                  style={{ marginBottom: 0, textAlign: 'center' }}
                  value={finale.tA}
                  onChange={(e) =>
                    preserveContentScroll(() =>
                      updateFinale({ ...finale, tA: e.target.value })
                    )
                  }
                >
                  {Object.entries(TEAMS_CFG).map(([k, c]) => (
                    <option key={k} value={k}>
                      {c.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  style={{
                    color: TEAMS_CFG[finale.tA]?.color,
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {TEAMS_CFG[finale.tA]?.emoji} {TEAMS_CFG[finale.tA]?.label}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {isAdmin ? (
                <>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    type="text"
                    className="sco"
                    value={finale.sA ?? ''}
                    style={{ borderColor: '#f59e0b55' }}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={(e) => setFinalScore('sA', e.target.value)}
                  />
                  <span
                    style={{
                      color: '#444',
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 18,
                    }}
                  >
                    ×
                  </span>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    type="text"
                    className="sco"
                    value={finale.sB ?? ''}
                    style={{ borderColor: '#f59e0b55' }}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={(e) => setFinalScore('sB', e.target.value)}
                  />
                </>
              ) : (
                <>
                  <span
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 30,
                      color: '#f59e0b',
                    }}
                  >
                    {finale.sA !== '' ? finale.sA : '-'}
                  </span>
                  <span style={{ color: '#333', fontSize: 16 }}>×</span>
                  <span
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 30,
                      color: '#f59e0b',
                    }}
                  >
                    {finale.sB !== '' ? finale.sB : '-'}
                  </span>
                </>
              )}
            </div>
            <div style={{ textAlign: 'left' }}>
              {isAdmin ? (
                <select
                  className="sel"
                  style={{ marginBottom: 0 }}
                  value={finale.tB}
                  onChange={(e) =>
                    preserveContentScroll(() =>
                      updateFinale({ ...finale, tB: e.target.value })
                    )
                  }
                >
                  {Object.entries(TEAMS_CFG).map(([k, c]) => (
                    <option key={k} value={k}>
                      {c.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  style={{
                    color: TEAMS_CFG[finale.tB]?.color,
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {TEAMS_CFG[finale.tB]?.emoji} {TEAMS_CFG[finale.tB]?.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Salvar + Nova Semana */}
        {isAdmin && (
          <div style={{ margin: '16px 0 4px' }}>
            <button
              className="btn"
              style={{ background: appliedMatch ? 'linear-gradient(135deg,#064e3b,#059669)' : 'linear-gradient(135deg,#7c2d12,#ea580c)', marginBottom: 6 }}
              onClick={saveMatchResults}
            >
              {appliedMatch ? '✅ PARTIDA SALVA — ATUALIZAR' : '💾 SALVAR PARTIDA E ATUALIZAR TABELA'}
            </button>
            {appliedMatch && (
              <div style={{ fontSize: 11, color: '#059669', textAlign: 'center', marginBottom: 6 }}>
                Salvo em {new Date(appliedMatch.savedAt).toLocaleString('pt-BR')}
              </div>
            )}
            <button
              onClick={resetSemana}
              style={{ width: '100%', background: 'none', border: '1px solid #3a1a1a', borderRadius: 10, color: '#ef4444', padding: '10px', fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer', letterSpacing: 0.5 }}
            >
              🔄 NOVA SEMANA (zerar lista, sorteio e placares)
            </button>
          </div>
        )}

        {/* Histórico */}
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setShowHistory(h => !h)}
            style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: 10, color: '#888', padding: '10px', fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span>📋 HISTÓRICO DE PARTIDAS {matchHistory.length > 0 ? `(${matchHistory.length})` : ''}</span>
            <span>{showHistory ? '▲' : '▼'}</span>
          </button>
          {showHistory && (
            <div style={{ marginTop: 8 }}>
              {matchHistory.length === 0 ? (
                <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 10, padding: '16px', textAlign: 'center', fontSize: 13, color: '#444', fontStyle: 'italic' }}>
                  Nenhuma partida salva ainda.
                </div>
              ) : (
                matchHistory.map((h) => (
                  <HistoryEntry key={h.id} h={h} />
                ))
              )}
            </div>
          )}
        </div>

        {/* Artilharia */}
        <div
          style={{
            fontSize: 13,
            color: '#aaa',
            letterSpacing: 1,
            fontWeight: 700,
            margin: '14px 0 10px',
            background: '#141414',
            padding: '8px 14px',
            borderRadius: 6,
          }}
        >
          ⚽ PIKINHA DA NOITE
        </div>
        {drawn ? (
          Object.entries(TEAMS_CFG).map(([teamKey, cfg]) => {
            const teamPlayers = (drawn[teamKey] || [])
              .filter((p) => !p.isPending)
              .map((tp) => listedPlayers.find((lp) => lp.id === tp.id))
              .filter(Boolean);
            if (!teamPlayers.length) return null;
            const ordered = [...teamPlayers].sort(
              (a, b) =>
                (scorers[b.id] || 0) - (scorers[a.id] || 0) ||
                a.name.localeCompare(b.name)
            );
            return (
              <div
                key={teamKey}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  borderColor: cfg.color + '33',
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderBottom: '1px solid #1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: cfg.color + '0f',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 18,
                      letterSpacing: 1.5,
                      color: cfg.color,
                    }}
                  >
                    {cfg.emoji} {cfg.label.toUpperCase()}
                  </span>
                  <span
                    style={{ fontSize: 11, color: cfg.color, fontWeight: 700 }}
                  >
                    {ordered.length} jogadores
                  </span>
                </div>
                {ordered.map((p, i) => {
                  const g = scorers[p.id] || 0;
                  return (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderBottom:
                          i < ordered.length - 1 ? '1px solid #1a1a1a' : 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            color: g > 0 ? '#4ade80' : '#333',
                            fontFamily: "'Bebas Neue',sans-serif",
                            fontSize: 20,
                            width: 24,
                            textAlign: 'center',
                          }}
                        >
                          {g > 0 ? g : '—'}
                        </span>
                        {g > 0 && <span style={{ fontSize: 10, color: '#2d5a2d' }}>⚽</span>}
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: g > 0 ? 700 : 400,
                            color: g > 0 ? '#f0f0f0' : '#555',
                          }}
                        >
                          {p.name}
                        </span>
                      </div>
                      {isAdmin && (
                        <div
                          style={{
                            display: 'flex',
                            gap: 6,
                            alignItems: 'center',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              preserveContentScroll(() => {
                                if (g > 0) {
                                  const nw = { ...scorers, [p.id]: g - 1 };
                                  updateScorers(nw);
                                }
                              });
                            }}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              background: '#1a1a1a',
                              border: '1px solid #2a2a2a',
                              color: '#888',
                              fontSize: 16,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            −
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              preserveContentScroll(() => {
                                const nw = { ...scorers, [p.id]: g + 1 };
                                updateScorers(nw);
                              });
                            }}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              background: '#1a3a1a',
                              border: '1px solid #2d5a2d',
                              color: '#4ade80',
                              fontSize: 16,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {listedPlayers
              .sort(
                (a, b) =>
                  (scorers[b.id] || 0) - (scorers[a.id] || 0) ||
                  a.name.localeCompare(b.name)
              )
              .map((p, i, arr) => {
                const g = scorers[p.id] || 0;
                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderBottom:
                        i < arr.length - 1 ? '1px solid #1a1a1a' : 'none',
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                    >
                      <span
                        style={{
                          color: g > 0 ? '#4ade80' : '#333',
                          fontFamily: "'Bebas Neue',sans-serif",
                          fontSize: 20,
                          width: 24,
                          textAlign: 'center',
                        }}
                      >
                        {g > 0 ? g : '—'}
                      </span>
                      {g > 0 && <span style={{ fontSize: 10, color: '#2d5a2d' }}>⚽</span>}
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: g > 0 ? 700 : 400,
                          color: g > 0 ? '#f0f0f0' : '#555',
                        }}
                      >
                        {p.name}
                      </span>
                    </div>
                    {isAdmin && (
                      <div
                        style={{
                          display: 'flex',
                          gap: 6,
                          alignItems: 'center',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            preserveContentScroll(() => {
                              if (g > 0) {
                                const nw = { ...scorers, [p.id]: g - 1 };
                                updateScorers(nw);
                              }
                            });
                          }}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: '#1a1a1a',
                            border: '1px solid #2a2a2a',
                            color: '#888',
                            fontSize: 16,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          −
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            preserveContentScroll(() => {
                              const nw = { ...scorers, [p.id]: g + 1 };
                              updateScorers(nw);
                            });
                          }}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: '#1a3a1a',
                            border: '1px solid #2d5a2d',
                            color: '#4ade80',
                            fontSize: 16,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  };

  // ── TABELA ───────────────────────────────────────────────────────────────────
  const TabTabela = () => {
    const sorted = [...players]
      .filter((p) => (p.tipo || 'mensalista') === 'mensalista')
      .sort(
        (a, b) => b.champ - a.champ || b.vice - a.vice || b.goals - a.goals || b.pres - a.pres
      );

    const downloadImage = () => {
      const scale = 2;
      const W = 440, rowH = 44, headerH = 52, titleH = 56, footerH = 32;
      const totalH = titleH + headerH + rowH * sorted.length + footerH;
      const canvas = document.createElement('canvas');
      canvas.width = W * scale; canvas.height = totalH * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, W, totalH);
      ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W, titleH);
      ctx.font = 'bold 11px Arial'; ctx.fillStyle = '#4ade80'; ctx.textAlign = 'center';
      ctx.fillText('FOMINHAS LEAGUE', W / 2, 22);
      ctx.font = 'bold 18px Arial'; ctx.fillText('TABELA GERAL', W / 2, 44);
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, titleH, W, headerH);
      ctx.font = 'bold 10px Arial'; ctx.fillStyle = '#555';
      [{ l:'#', x:28, c:'center' },{ l:'NOME', x:80, c:'left' },{ l:'🏆', x:257, c:'center' },{ l:'🥈', x:307, c:'center' },{ l:'⚽', x:357, c:'center' },{ l:'✅', x:407, c:'center' }]
        .forEach(col => { ctx.textAlign = col.c; ctx.fillText(col.l, col.x, titleH + headerH/2 + 4); });
      const rC = { A:'#f59e0b', B:'#f97316', C:'#3b82f6', D:'#6b7280', E:'#374151' };
      const pC = ['#f59e0b','#94a3b8','#cd7c4b'];
      sorted.forEach((p, i) => {
        const y = titleH + headerH + rowH * i;
        ctx.fillStyle = i % 2 === 0 ? '#111' : '#141414'; ctx.fillRect(0, y, W, rowH);
        ctx.fillStyle = '#1f1f1f'; ctx.fillRect(0, y+rowH-1, W, 1);
        const cy = y + rowH/2 + 5;
        ctx.font = 'bold 16px Arial'; ctx.textAlign = 'center';
        ctx.fillStyle = pC[i] || '#444'; ctx.fillText(String(i+1), 46, cy);
        const rc = rC[p.ranking] || '#555';
        ctx.fillStyle = rc + '33'; ctx.beginPath(); ctx.roundRect(64, y+10, 22, 18, 4); ctx.fill();
        ctx.font = 'bold 10px Arial'; ctx.fillStyle = rc; ctx.textAlign = 'center'; ctx.fillText(p.ranking, 75, y+23);
        ctx.font = '600 13px Arial'; ctx.fillStyle = '#eee'; ctx.textAlign = 'left'; ctx.fillText(p.name, 92, cy);
        [p.champ, p.vice, p.goals, p.pres].forEach((v, si) => {
          ctx.font = 'bold 15px Arial';
          ctx.fillStyle = ['#f59e0b','#94a3b8','#4ade80','#555'][si];
          ctx.textAlign = 'center'; ctx.fillText(String(v), [257,307,357,407][si], cy);
        });
      });
      const fy = titleH + headerH + rowH * sorted.length;
      ctx.fillStyle = '#111'; ctx.fillRect(0, fy, W, footerH);
      ctx.font = '10px Arial'; ctx.fillStyle = '#333'; ctx.textAlign = 'center';
      ctx.fillText('Gerado em ' + new Date().toLocaleDateString('pt-BR') + ' · Depois das Dez FS', W/2, fy+20);
      const link = document.createElement('a');
      link.download = 'tabela-fominhas-' + new Date().toISOString().slice(0,10) + '.png';
      link.href = canvas.toDataURL('image/png'); link.click();
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="stitle" style={{ margin: 0 }}>TABELA GERAL</div>
          <button onClick={downloadImage} style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 8, padding: '7px 14px', color: '#4ade80', fontSize: 12, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", fontWeight: 700 }}>
            📥 BAIXAR
          </button>
        </div>
        <div
          style={{
            borderRadius: 10,
            overflow: 'hidden',
            border: '1px solid #1a1a1a',
          }}
        >
          <table
            style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}
          >
            <thead>
              <tr>
                {['#', 'NOME', '🏆', '🥈', '⚽', '✅'].map((h) => (
                  <th
                    key={h}
                    style={{
                      background: '#1a1a1a',
                      padding: '10px 6px',
                      textAlign: 'center',
                      fontSize: 9,
                      color: '#555',
                      letterSpacing: 1,
                      fontWeight: 700,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #141414' }}>
                  <td
                    style={{
                      padding: '10px 4px',
                      textAlign: 'center',
                      color:
                        i === 0
                          ? '#f59e0b'
                          : i === 1
                          ? '#94a3b8'
                          : i === 2
                          ? '#cd7c4b'
                          : '#444',
                      fontWeight: 700,
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 16,
                    }}
                  >
                    {i + 1}
                  </td>
                  <td
                    style={{ padding: '10px 4px 10px 8px', textAlign: 'left' }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <span
                        style={{
                          background: RANK_COLOR[p.ranking] + '1a',
                          color: RANK_COLOR[p.ranking],
                          fontSize: 9,
                          fontWeight: 900,
                          padding: '1px 5px',
                          borderRadius: 4,
                          flexShrink: 0,
                        }}
                      >
                        {p.ranking}
                      </span>
                      <span
                        style={{ fontWeight: 600, fontSize: 13, color: '#eee' }}
                      >
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: '10px 6px',
                      textAlign: 'center',
                      color: '#f59e0b',
                      fontWeight: 700,
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 16,
                    }}
                  >
                    {p.champ}
                  </td>
                  <td
                    style={{
                      padding: '10px 6px',
                      textAlign: 'center',
                      color: '#94a3b8',
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 16,
                    }}
                  >
                    {p.vice}
                  </td>
                  <td
                    style={{
                      padding: '10px 6px',
                      textAlign: 'center',
                      color: '#4ade80',
                      fontWeight: 700,
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 16,
                    }}
                  >
                    {p.goals}
                  </td>
                  <td
                    style={{
                      padding: '10px 6px',
                      textAlign: 'center',
                      color: '#555',
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 16,
                    }}
                  >
                    {p.pres}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ── CAIXA ────────────────────────────────────────────────────────────────────
  const TabCaixa = () => {
    const subTab = caixaSubTab;
    const setSubTab = (value) => {
      setCaixaSubTab(value);
      save('fm_caixaSubTab', value);
    };

    const mensalistas = players.filter(
      (p) => (p.tipo || 'mensalista') === 'mensalista'
    );
    const avulsosCad = players.filter((p) => p.tipo === 'avulso');
    const avulsosQueJogaram = avulsosCad.filter((p) =>
      lista.slots.some((s) => normalizeName(s.name) === normalizeName(p.name))
    );
    const avulsosNaLista = lista.slots.filter((s) => {
      const found = players.find(
        (p) => normalizeName(p.name) === normalizeName(s.name)
      );
      return found ? found.tipo === 'avulso' : true;
    });

    const mensPaid = mensalistas.filter((p) => p.paid).length;
    const avulsPaid = avulsosQueJogaram.filter((p) => p.paid).length;

    const mensColete = mensalistas;
    const washedCount = mensColete.filter((p) => coletes[p.id]?.washed).length;
    const pendColete = mensColete.length - washedCount;

    const fmtDate = (iso) => {
      if (!iso) return '';
      const d = new Date(iso);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
    };

    const toggleColete = (pid) => {
      if (!isAdmin) return;
      const cur = coletes[pid] || { washed: false, date: '' };
      const now = new Date().toISOString().split('T')[0];
      updateColetes({
        ...coletes,
        [pid]: { washed: !cur.washed, date: !cur.washed ? now : '' },
      });
    };

    const setColeteDate = (pid, val) => {
      if (!isAdmin) return;
      const cur = coletes[pid] || { washed: false, date: '' };
      updateColetes({ ...coletes, [pid]: { ...cur, date: val } });
    };

    const sortedByColete = [...mensColete].sort((a, b) => {
      const wa = coletes[a.id]?.washed ? 1 : 0;
      const wb = coletes[b.id]?.washed ? 1 : 0;
      return wa - wb;
    });

    return (
      <div>
        <div className="stitle">GESTÃO</div>

        {!isAdmin && (
          <div
            style={{
              background: '#1a1200',
              border: '1px solid #f59e0b22',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 12, color: '#6b5a2a' }}>
              🔒 Visualização — admin necessário para editar
            </span>
            <button
              className="btn2"
              style={{ padding: '5px 12px', fontSize: 11 }}
              onClick={() => setShowAdm(true)}
            >
              Admin
            </button>
          </div>
        )}

        {/* Sub-tabs */}
        <div
          style={{
            display: 'flex',
            background: '#111',
            border: '1px solid #1f1f1f',
            borderRadius: 10,
            padding: 4,
            marginBottom: 16,
            gap: 4,
          }}
        >
          {[
            { k: 'pagamentos', i: '💰', l: 'Pagamentos' },
            { k: 'coletes', i: '👕', l: 'Coletes' },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setSubTab(t.k)}
              style={{
                flex: 1,
                background: subTab === t.k ? '#1a3a1a' : 'none',
                border:
                  subTab === t.k
                    ? '1px solid #2d5a2d'
                    : '1px solid transparent',
                borderRadius: 8,
                padding: '9px 6px',
                color: subTab === t.k ? '#4ade80' : '#444',
                fontFamily: "'Barlow',sans-serif",
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all .2s',
              }}
            >
              {t.i} {t.l}
            </button>
          ))}
        </div>

        {/* ─ PAGAMENTOS ─ */}
        {subTab === 'pagamentos' && (
          <>
            {/* MENSALISTAS */}
            <div
              style={{
                fontSize: 10,
                color: '#4ade80',
                fontWeight: 700,
                letterSpacing: 1,
                marginBottom: 10,
                padding: '5px 10px',
                background: '#0d1f0d',
                borderRadius: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>👥 MENSALISTAS</span>
              <span
                style={{
                  color:
                    mensPaid === mensalistas.length ? '#4ade80' : '#ef4444',
                }}
              >
                {mensPaid}/{mensalistas.length} pagos
              </span>
            </div>
            <div className="card" style={{ marginBottom: 14 }}>
              {mensalistas.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 0',
                    borderBottom:
                      i < mensalistas.length - 1 ? '1px solid #1a1a1a' : 'none',
                  }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: '#1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: 14,
                        color: '#666',
                      }}
                    >
                      {initials(p.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#444' }}>
                        Mensalidade
                      </div>
                    </div>
                  </div>
                  <button
                    className={`tog ${p.paid ? 'on' : 'off'}`}
                    disabled={!isAdmin}
                    onClick={() => {
                      if (!isAdmin) return;
                      updatePlayers(
                        players.map((pp) =>
                          pp.id === p.id ? { ...pp, paid: !pp.paid } : pp
                        )
                      );
                    }}
                  />
                </div>
              ))}
            </div>

            {/* AVULSOS */}
            {(avulsosQueJogaram.length > 0 || avulsosNaLista.length > 0) && (
              <>
                <div
                  style={{
                    fontSize: 10,
                    color: '#f59e0b',
                    fontWeight: 700,
                    letterSpacing: 1,
                    marginBottom: 10,
                    padding: '5px 10px',
                    background: '#1a1000',
                    borderRadius: 6,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>🎟️ AVULSOS (jogo)</span>
                  {avulsosQueJogaram.length > 0 && (
                    <span
                      style={{
                        color:
                          avulsPaid === avulsosQueJogaram.length
                            ? '#f59e0b'
                            : '#ef4444',
                      }}
                    >
                      {avulsPaid}/{avulsosQueJogaram.length} pagos
                    </span>
                  )}
                </div>
                {avulsosQueJogaram.length > 0 && (
                  <div className="card" style={{ marginBottom: 8 }}>
                    {avulsosQueJogaram.map((p, i) => (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '11px 0',
                          borderBottom:
                            i < avulsosQueJogaram.length - 1
                              ? '1px solid #1a1a1a'
                              : 'none',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              background: '#1a1000',
                              border: '1px solid #3a2a00',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontFamily: "'Bebas Neue',sans-serif",
                              fontSize: 14,
                              color: '#f59e0b',
                            }}
                          >
                            {initials(p.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>
                              {p.name}
                            </div>
                            <div style={{ fontSize: 10, color: '#5a4a00' }}>
                              Por jogo
                            </div>
                          </div>
                        </div>
                        <button
                          className={`tog ${p.paid ? 'on' : 'off'}`}
                          style={p.paid ? { background: '#b45309' } : {}}
                          disabled={!isAdmin}
                          onClick={() => {
                            if (!isAdmin) return;
                            updatePlayers(
                              players.map((pp) =>
                                pp.id === p.id ? { ...pp, paid: !pp.paid } : pp
                              )
                            );
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {avulsosNaLista.filter(
                  (s) =>
                    !avulsosCad.find(
                      (p) => normalizeName(p.name) === normalizeName(s.name)
                    )
                ).length > 0 && (
                  <div
                    style={{
                      background: '#0f0a00',
                      border: '1px solid #2a1a00',
                      borderRadius: 10,
                      padding: 12,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: '#5a4a00',
                        marginBottom: 6,
                      }}
                    >
                      Avulsos na lista sem cadastro:
                    </div>
                    {avulsosNaLista
                      .filter(
                        (s) =>
                          !avulsosCad.find(
                            (p) =>
                              normalizeName(p.name) === normalizeName(s.name)
                          )
                      )
                      .map((s, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: 13,
                            color: '#6b5500',
                            padding: '4px 0',
                          }}
                        >
                          {s.name}
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ─ COLETES ─ */}
        {subTab === 'coletes' && (
          <>
            <div
              style={{
                background: '#0a0a0a',
                border: '1px solid #1a3a1a',
                borderRadius: 10,
                padding: '8px 12px',
                marginBottom: 12,
                fontSize: 11,
                color: '#2d5a2d',
              }}
            >
              👕 Coletes são responsabilidade dos{' '}
              <strong style={{ color: '#4ade80' }}>mensalistas</strong> —
              avulsos não lavam
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg,#0a0f1f,#101828)',
                border: '1px solid #1e3a5f',
                borderRadius: 12,
                padding: 16,
                marginBottom: 14,
                display: 'flex',
                justifyContent: 'space-around',
                textAlign: 'center',
              }}
            >
              {[
                { v: washedCount, l: 'LAVADOS', c: '#38bdf8' },
                { v: pendColete, l: 'PENDENTES', c: '#ef4444' },
                { v: mensColete.length, l: 'TOTAL', c: '#f0f0f0' },
              ].map(({ v, l, c }, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 38,
                      color: c,
                    }}
                  >
                    {v}
                  </div>
                  <div
                    style={{ fontSize: 9, color: '#2a5a7a', letterSpacing: 1 }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: '#1a1a1a',
                borderRadius: 8,
                height: 8,
                marginBottom: 16,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${
                    mensColete.length
                      ? (washedCount / mensColete.length) * 100
                      : 0
                  }%`,
                  background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
                  borderRadius: 8,
                  transition: 'width .5s',
                }}
              />
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {sortedByColete.map((p, i) => {
                const c = coletes[p.id] || { washed: false, date: '' };
                return (
                  <div
                    key={p.id}
                    style={{
                      padding: '12px 14px',
                      borderBottom:
                        i < mensColete.length - 1
                          ? '1px solid #1a1a1a'
                          : 'none',
                      background: c.washed ? '#071520' : 'transparent',
                      transition: 'background .3s',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: c.washed && isAdmin ? 8 : 0,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 8,
                            background: c.washed ? '#0c2a3a' : '#1a1a1a',
                            border: `1px solid ${
                              c.washed ? '#0ea5e9' : '#2a2a2a'
                            }`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 18,
                            transition: 'all .3s',
                          }}
                        >
                          👕
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 14,
                              color: c.washed ? '#f0f0f0' : '#888',
                            }}
                          >
                            {p.name}
                          </div>
                          {c.washed && c.date ? (
                            <div
                              style={{
                                fontSize: 10,
                                color: '#0ea5e9',
                                fontWeight: 700,
                                marginTop: 1,
                              }}
                            >
                              ✓ Lavado em {fmtDate(c.date)}
                            </div>
                          ) : c.washed ? (
                            <div
                              style={{
                                fontSize: 10,
                                color: '#0ea5e9',
                                marginTop: 1,
                              }}
                            >
                              ✓ Lavado
                            </div>
                          ) : (
                            <div
                              style={{
                                fontSize: 10,
                                color: '#444',
                                marginTop: 1,
                              }}
                            >
                              Pendente
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`tog ${c.washed ? 'on' : 'off'}`}
                        style={c.washed ? { background: '#0284c7' } : {}}
                        disabled={!isAdmin}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleColete(p.id);
                        }}
                      />
                    </div>
                    {c.washed && isAdmin && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginLeft: 48,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            color: '#4a7a9a',
                            letterSpacing: 0.5,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          DATA:
                        </span>
                        <input
                          type="date"
                          value={c.date || ''}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setColeteDate(p.id, e.target.value)}
                          style={{
                            background: '#0a1e2e',
                            border: '1px solid #1e3a5f',
                            borderRadius: 6,
                            padding: '4px 8px',
                            color: '#38bdf8',
                            fontSize: 12,
                            fontFamily: "'Barlow',sans-serif",
                            outline: 'none',
                            flex: 1,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  // ── LISTA ─────────────────────────────────────────────────────────────────────
  const TabLista = () => {
    const totalField = 20;

    const fmtDateBR = (iso) => {
      if (!iso) return '';
      const [y, m, d] = iso.split('-');
      return `${d}/${m}`;
    };

    // Day of week in pt
    const dayName = (iso) => {
      if (!iso) return '';
      const days = [
        'Domingo',
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado',
      ];
      const d = new Date(iso + 'T12:00:00');
      return days[d.getDay()];
    };

    const addPresente = () => {
      const name = (avulsoRef.current?.value || avulsoName).trim();
      if (!name) return;
      if (lista.slots.length >= totalField) {
        alert('A lista já atingiu o limite de 20 jogadores.');
        return;
      }
      if (
        lista.slots.find((s) => normalizeName(s.name) === normalizeName(name))
      )
        return;

      const existing = players.find(
        (p) => normalizeName(p.name) === normalizeName(name)
      );
      if (existing) {
        updateLista({
          ...lista,
          slots: [...lista.slots, { name: existing.name }],
        });
      } else {
        openAddPlayerModal({
          name,
          tipo: 'avulso',
          title: 'NOVO AVULSO',
          onAdded: (player) => addPlayerToLista(player),
        });
      }

      if (avulsoRef.current) avulsoRef.current.value = '';
      setAvulsoName('');
    };

    const addMensalPresente = (p) => {
      if (lista.slots.length >= totalField) {
        alert('A lista já atingiu o limite de 20 jogadores.');
        return;
      }
      if (
        lista.slots.find((s) => normalizeName(s.name) === normalizeName(p.name))
      )
        return;
      updateLista({ ...lista, slots: [...lista.slots, { name: p.name }] });
    };

    const removeSlot = (idx) => {
      const nw = [...lista.slots];
      nw.splice(idx, 1);
      updateLista({ ...lista, slots: nw });
    };

    const addAusente = () => {
      const id = parseInt(ausenteInput.id);
      const player = players.find((p) => p.id === id);
      if (!player) return;
      if (lista.ausentes.find((a) => a.name === player.name)) return;
      const motivo = ausenteMotivoRef.current?.value || ausenteInput.motivo;
      updateLista({
        ...lista,
        ausentes: [
          ...lista.ausentes,
          { id: player.id, name: player.name, motivo },
        ],
      });
      setAusenteInput({ id: '', motivo: '' });
      if (ausenteMotivoRef.current) ausenteMotivoRef.current.value = '';
      setShowAusAdd(false);
    };

    const removeAusente = (idx) => {
      const nw = [...lista.ausentes];
      nw.splice(idx, 1);
      updateLista({ ...lista, ausentes: nw });
    };

    const mensaisPresentes = players.filter((p) =>
      lista.slots.find((s) => s.name === p.name)
    );
    const mensaisNaLista = new Set(lista.slots.map((s) => s.name));
    const mensaisAusentes = new Set(lista.ausentes.map((a) => a.name));

    // Generate WhatsApp text
    const genText = () => {
      const dateStr = `${dayName(lista.date)}, ${fmtDateBR(lista.date)}`;
      let txt = `${dateStr}\n`;
      txt += `⏱️ Jogando: 22h (CHEGAR 21h40)\n`;
      txt += `Presentes ✅\n`;
      txt += `⚽🏃🏽\n`;
      for (let i = 0; i < totalField; i++) {
        txt += `${i + 1}. ${lista.slots[i]?.name || ''}\n`;
      }
      if (lista.ausentes.length > 0) {
        txt += `Ausentes ❌\n`;
        lista.ausentes.forEach((a, i) => {
          txt += `${i + 1}. ${a.name}${a.motivo ? ' ' + a.motivo : ''}\n`;
        });
      }
      return txt;
    };

    const copyText = async () => {
      try {
        await navigator.clipboard.writeText(genText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {
        // fallback: select textarea
      }
    };

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <div className="stitle" style={{ margin: 0 }}>
            LISTA DA SEMANA
          </div>
          {!isAdmin && (
            <button
              className="btn2"
              style={{ padding: '5px 12px', fontSize: 11 }}
              onClick={() => setShowAdm(true)}
            >
              🔑 Admin
            </button>
          )}
        </div>

        {/* Date */}
        <div className="card" style={{ padding: 14, marginBottom: 12 }}>
          <label className="lbl">DATA DO JOGO</label>
          <input
            type="date"
            className="inp"
            style={{ marginBottom: 0 }}
            value={lista.date}
            onChange={(e) => updateLista({ ...lista, date: e.target.value })}
            disabled={!isAdmin}
          />
          <div style={{ marginTop: 8, fontSize: 13, color: '#555' }}>
            {dayName(lista.date)}, {fmtDateBR(lista.date)} — 22h00 ⏱️
          </div>
        </div>

        {/* Presentes */}
        <div
          style={{
            background: '#0a1f0a',
            border: '1px solid #1a4a1a',
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 16,
                color: '#4ade80',
                letterSpacing: 2,
              }}
            >
              ⚽ JOGADORES ({lista.slots.length}/{totalField})
            </div>
            <div
              style={{
                fontSize: 12,
                color: lista.slots.length >= totalField ? '#f59e0b' : '#2d5a2d',
                fontWeight: 700,
              }}
            >
              {lista.slots.length >= totalField
                ? 'LISTA CHEIA'
                : `${totalField - lista.slots.length} vagas`}
            </div>
          </div>

          {/* Slots list */}
          {lista.slots.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 0',
                borderBottom: '1px solid #112211',
              }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 18,
                  color: '#2d5a2d',
                  width: 26,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>
                {s.name}
              </span>
              {isAdmin && (
                <button
                  onClick={() => removeSlot(i)}
                  style={{
                    background: '#1a0a0a',
                    border: '1px solid #3a1a1a',
                    color: '#ef4444',
                    borderRadius: 6,
                    padding: '3px 7px',
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({
            length: Math.max(0, totalField - lista.slots.length),
          }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 0',
                borderBottom: '1px solid #0d1a0d',
              }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 18,
                  color: '#1a2a1a',
                  width: 26,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {lista.slots.length + i + 1}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: '#222',
                  fontStyle: 'italic',
                }}
              >
                —
              </span>
            </div>
          ))}
        </div>

        {/* Add players — admin only */}
        {isAdmin && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 14,
                color: '#4ade80',
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              + ADICIONAR À LISTA
            </div>

            {/* Quick-add mensais */}
            <div style={{ marginBottom: 10 }}>
              <label className="lbl">MENSALISTAS</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {players
                  .filter(
                    (p) =>
                      (p.tipo || 'mensalista') === 'mensalista' &&
                      !mensaisNaLista.has(p.name) &&
                      !mensaisAusentes.has(p.name)
                  )
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addMensalPresente(p)}
                      style={{
                        background: '#0d1f0d',
                        border: '1px solid #1a3a1a',
                        color: '#4ade80',
                        borderRadius: 8,
                        padding: '5px 10px',
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                {players.filter(
                  (p) =>
                    (p.tipo || 'mensalista') === 'mensalista' &&
                    !mensaisNaLista.has(p.name) &&
                    !mensaisAusentes.has(p.name)
                ).length === 0 && (
                  <span style={{ fontSize: 12, color: '#333' }}>
                    Todos os mensalistas adicionados ✓
                  </span>
                )}
              </div>
            </div>

            {/* Quick-add avulsos cadastrados */}
            {players.filter(
              (p) =>
                p.tipo === 'avulso' &&
                !mensaisNaLista.has(p.name) &&
                !mensaisAusentes.has(p.name)
            ).length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <label className="lbl" style={{ color: '#f59e0b' }}>
                  AVULSOS CADASTRADOS
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {players
                    .filter(
                      (p) =>
                        p.tipo === 'avulso' &&
                        !mensaisNaLista.has(p.name) &&
                        !mensaisAusentes.has(p.name)
                    )
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => addMensalPresente(p)}
                        style={{
                          background: '#1a1000',
                          border: '1px solid #3a2a00',
                          color: '#f59e0b',
                          borderRadius: 8,
                          padding: '5px 10px',
                          fontSize: 12,
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        {p.name}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Avulso input */}
            <label className="lbl">AVULSO / NOME LIVRE</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                ref={avulsoRef}
                className="inp"
                style={{ marginBottom: 0, flex: 1 }}
                placeholder="Nome do avulso..."
                defaultValue=""
                onKeyDown={(e) => e.key === 'Enter' && addPresente()}
              />
              <button
                className="btn2"
                style={{ flexShrink: 0 }}
                onClick={() => addPresente()}
              >
                + ADD
              </button>
            </div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 8 }}>
              Se o nome não existir no elenco, o app abre a ficha para cadastrar
              o jogador e já adiciona na lista.
            </div>
          </div>
        )}

        {/* Ausentes */}
        <div
          style={{
            background: '#1a0a0a',
            border: '1px solid #3a1a1a',
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 16,
                color: '#ef4444',
                letterSpacing: 2,
              }}
            >
              ❌ AUSENTES ({lista.ausentes.length})
            </div>
            {isAdmin && (
              <button
                className="btn2"
                style={{
                  background: '#1a0a0a',
                  border: '1px solid #3a1a1a',
                  color: '#ef4444',
                  padding: '5px 10px',
                  fontSize: 11,
                }}
                onClick={() => setShowAusAdd(!showAusAdd)}
              >
                + ADD
              </button>
            )}
          </div>

          {showAusAdd && isAdmin && (
            <div
              style={{
                background: '#0d0505',
                border: '1px solid #2a0f0f',
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <label className="lbl">MENSAL</label>
              <select
                className="sel"
                value={ausenteInput.id}
                onChange={(e) =>
                  setAusenteInput({ ...ausenteInput, id: e.target.value })
                }
              >
                <option value="">Selecione...</option>
                {players
                  .filter(
                    (p) =>
                      !mensaisNaLista.has(p.name) &&
                      !lista.ausentes.find((a) => a.name === p.name)
                  )
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
              <label className="lbl">MOTIVO (opcional)</label>
              <input
                ref={ausenteMotivoRef}
                className="inp"
                placeholder="ex: vai viajar, fora de SP..."
                defaultValue=""
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn2"
                  style={{
                    flex: 1,
                    padding: 9,
                    background: '#0d0505',
                    border: '1px solid #2a0f0f',
                    color: '#555',
                  }}
                  onClick={() => setShowAusAdd(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg,#7f1d1d,#ef4444)',
                  }}
                  onClick={addAusente}
                >
                  Adicionar
                </button>
              </div>
            </div>
          )}

          {lista.ausentes.length === 0 && (
            <div style={{ fontSize: 13, color: '#333', fontStyle: 'italic' }}>
              Nenhum ausente registrado
            </div>
          )}
          {lista.ausentes.map((a, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom:
                  i < lista.ausentes.length - 1 ? '1px solid #1f0a0a' : 'none',
              }}
            >
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#888' }}>
                  {a.name}
                </span>
                {a.motivo && (
                  <span
                    style={{ fontSize: 12, color: '#4a2020', marginLeft: 8 }}
                  >
                    {a.motivo}
                  </span>
                )}
              </div>
              {isAdmin && (
                <button
                  onClick={() => removeAusente(i)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3a1a1a',
                    cursor: 'pointer',
                    fontSize: 16,
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Preview + Copy */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 14,
                color: '#888',
                letterSpacing: 1,
              }}
            >
              PRÉVIA (WhatsApp)
            </div>
            <button
              onClick={copyText}
              style={{
                background: copied ? '#0a3a0a' : '#1a2a1a',
                border: `1px solid ${copied ? '#4ade80' : '#2d5a2d'}`,
                color: copied ? '#4ade80' : '#4ade80',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: "'Barlow',sans-serif",
                fontWeight: 700,
                transition: 'all .2s',
              }}
            >
              {copied ? '✓ COPIADO!' : '📋 COPIAR'}
            </button>
          </div>
          <pre
            style={{
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#555',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.7,
              background: '#0a0a0a',
              padding: 12,
              borderRadius: 8,
              border: '1px solid #1a1a1a',
              maxHeight: 260,
              overflowY: 'scroll',
            }}
          >
            {genText()}
          </pre>
        </div>
      </div>
    );
  };

  // ── MODALS ─────────────────────────────────────────────────────────────────────
  const CardModal = () => {
    if (!cardModal) return null;
    return (
      <div className="overlay" onClick={() => setCardModal(null)}>
        <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 340, width: '100%' }}>
          <img src={cardModal.cardUrl} alt={cardModal.name} style={{ width: '100%', borderRadius: 16, boxShadow: '0 0 40px rgba(0,0,0,0.8)' }} />
          <button
            onClick={() => setCardModal(null)}
            style={{ marginTop: 16, width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: 10, padding: 12, color: '#888', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Barlow',sans-serif" }}
          >
            Fechar
          </button>
        </div>
      </div>
    );
  };

  const ModalAdmin = () => (
    <div
      className="overlay"
      onClick={() => {
        setShowAdm(false);
        setPwdErr('');
      }}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 22,
            color: '#f59e0b',
            marginBottom: 16,
          }}
        >
          🔐 ACESSO ADMIN
        </div>
        <label className="lbl">SENHA</label>
        <input
          type="password"
          className="inp"
          placeholder="Digite a senha"
          value={pwdVal}
          onChange={(e) => setPwdVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (pwdVal === 'fominhas' || pwdVal === 'admin') {
                setIsAdmin(true);
                setShowAdm(false);
                setPwdVal('');
                setPwdErr('');
              } else setPwdErr('Senha incorreta!');
            }
          }}
          autoFocus
        />
        {pwdErr && (
          <div
            style={{
              color: '#ef4444',
              fontSize: 12,
              marginTop: -6,
              marginBottom: 8,
            }}
          >
            {pwdErr}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            className="btn2"
            style={{ flex: 1, padding: '10px' }}
            onClick={() => {
              setShowAdm(false);
              setPwdErr('');
              setPwdVal('');
            }}
          >
            Cancelar
          </button>
          <button
            className="btn"
            style={{ flex: 1 }}
            onClick={() => {
              if (pwdVal === 'fominhas' || pwdVal === 'admin') {
                setIsAdmin(true);
                setShowAdm(false);
                setPwdVal('');
                setPwdErr('');
              } else setPwdErr('Senha incorreta!');
            }}
          >
            Entrar
          </button>
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 10,
            color: '#2a2a2a',
            textAlign: 'center',
          }}
        >
          senha padrão: fominhas
        </div>
      </div>
    </div>
  );

  // ── RENDER ───────────────────────────────────────────────────────────────────
  const tabs = [
    { k: 'inicio', i: '🏠', l: 'Início' },
    { k: 'lista', i: '📋', l: 'Lista' },
    { k: 'sorteio', i: '🎲', l: 'Sorteio' },
    { k: 'partida', i: '⚽', l: 'Partida' },
    { k: 'tabela', i: '🏆', l: 'Tabela' },
    { k: 'jogadores', i: '👥', l: 'Elenco' },
    { k: 'caixa', i: '💰', l: 'Gestão' },
  ];

  const scrollRef = useRef(null);
  const scrollPos = useRef(0);
  const handleScroll = () => {
    scrollPos.current = scrollRef.current?.scrollTop || 0;
  };
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollPos.current;
  });

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Header */}
        <div className="hdr">
          <div>
            <div className="hdr-title">Fominhas League</div>
            <div className="hdr-sub">Depois das Dez FS</div>
          </div>
          {isAdmin ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="admbadge">ADMIN</span>
              <button
                onClick={() => setIsAdmin(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#444',
                  cursor: 'pointer',
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdm(true)}
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderRadius: 8,
                padding: '6px 12px',
                color: '#555',
                fontSize: 11,
                cursor: 'pointer',
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              🔑 ADMIN
            </button>
          )}
        </div>

        {/* Content */}
        <div className="content" ref={scrollRef} onScroll={handleScroll}>
          {tab === 'inicio' && <TabInicio />}
          {tab === 'lista' && <TabLista />}
          {tab === 'jogadores' && <TabJogadores />}
          {tab === 'sorteio' && <TabSorteio />}
          {tab === 'partida' && <TabPartida />}
          {tab === 'tabela' && <TabTabela />}
          {tab === 'caixa' && <TabCaixa />}
        </div>

        {/* Bottom nav */}
        <div className="bnav">
          {tabs.map((t) => (
            <button
              key={t.k}
              className={`ntab ${tab === t.k ? 'on' : ''}`}
              onClick={() => setTab(t.k)}
            >
              <span className="nico">{t.i}</span>
              <span className="nlbl">{t.l}</span>
            </button>
          ))}
        </div>

        {/* Modals */}
        {showAdm && <ModalAdmin />}
        {cardModal && <CardModal />}
        {showEdt && (
          <ModalEdit
            editP={editP}
            setEditP={setEditP}
            setShowEdt={setShowEdt}
            players={players}
            updatePlayers={updatePlayers}
          />
        )}
        <AddPlayerModal
          show={showAdd}
          newP={newP}
          setNewP={setNewP}
          setShowAdd={setShowAdd}
          players={players}
          updatePlayers={updatePlayers}
          onAdded={addPlayerConfig.onAdded}
          title={addPlayerConfig.title}
        />
      </div>
    </>
  );
}
