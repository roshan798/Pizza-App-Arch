import { useState } from 'react'
import { SERVICES } from '@/data/architecture'
import styles from './HLDDiagram.module.css'

// ─── Layout constants ──────────────────────────────────────────────
const SVC = [
  { id: 'auth',    x: 190, y: 210, w: 118, h: 54 },
  { id: 'catalog', x: 345, y: 210, w: 118, h: 54 },
  { id: 'order',   x: 500, y: 210, w: 118, h: 54 },
  { id: 'ws',      x: 655, y: 210, w: 118, h: 54 },
  { id: 'notif',   x: 810, y: 210, w: 120, h: 54 },
]

// Databases directly below each service
const DBS = [
  { svcId: 'auth',    label: 'PostgreSQL', sub: 'Auth DB',    color: '#4f9eff', x: 216, y: 342 },
  { svcId: 'catalog', label: 'MongoDB',    sub: 'Catalog DB', color: '#ff6b2b', x: 371, y: 342 },
  { svcId: 'order',   label: 'MongoDB',    sub: 'Order DB + Cache', color: '#ffb347', x: 510, y: 342 },
  { svcId: 'ws',      label: 'In-Memory',  sub: 'WS State',   color: '#2ecc71', x: 669, y: 342 },
]

// Kafka bus
const KAFKA = { x: 365, y: 430, w: 420, h: 36 }

// External services (right side)
const EXT = [
  { id: 's3',     label: 'AWS S3',  sub: 'Image storage',  color: '#ff9900', x: 960, y: 210 },
  { id: 'stripe', label: 'Stripe',  sub: 'Card payments',  color: '#6772e5', x: 960, y: 280 },
  { id: 'smtp',   label: 'SMTP',    sub: 'Email delivery', color: '#ea4335', x: 960, y: 350 },
]

function Tooltip({ data, x, y }) {
  if (!data) return null
  return (
    <div className={styles.tooltip} style={{ left: x + 14, top: y - 10 }}>
      <div className={styles.tooltipTitle} style={{ color: data.color }}>{data.name}</div>
      {[
        ['Port',      `:${data.port}`],
        ['DB',        data.db],
        ['Replicas',  `${data.replicas}×`],
        ['Produces',  data.kafkaProduces?.length ? data.kafkaProduces.length + ' events' : '—'],
        ['Consumes',  data.kafkaConsumes?.length ? data.kafkaConsumes.length + ' events' : '—'],
      ].map(([k, v]) => (
        <div key={k} className={styles.tooltipRow}>
          <span className={styles.tooltipKey}>{k}</span>
          <span className={styles.tooltipVal}>{v}</span>
        </div>
      ))}
      <div className={styles.tooltipDesc}>{data.desc}</div>
    </div>
  )
}

export default function HLDDiagram() {
  const [hovered, setHovered] = useState(null)
  const getSvc = id => SERVICES.find(s => s.id === id)

  return (
    <div className={styles.wrapper}>
      {hovered && <Tooltip data={hovered.svc} x={hovered.x} y={hovered.y} />}

      <svg viewBox="0 0 1100 510" className={styles.svg}>
        <defs>
          <marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
            <path d="M0,0 L0,5 L7,2.5 z" fill="#535d72" />
          </marker>
          <marker id="arr-kafka" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
            <path d="M0,0 L0,5 L7,2.5 z" fill="#e74c3c88" />
          </marker>
          <marker id="arr-ws" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
            <path d="M0,0 L0,5 L7,2.5 z" fill="#2ecc71" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="k8sGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1a1e2e" />
            <stop offset="100%" stopColor="#14172200" />
          </linearGradient>
          <linearGradient id="kafkaGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#e74c3c22" />
            <stop offset="100%" stopColor="#9b59b622" />
          </linearGradient>
        </defs>

        {/* ── Background regions ── */}

        {/* K8s cluster box */}
        <rect x="170" y="140" width="810" height="240" rx="14"
          fill="url(#k8sGrad)" stroke="#252840" strokeWidth="1.5" />
        <text x="186" y="159" fontSize="8.5" fill="#3a4460" fontFamily="Space Mono" fontWeight="700">
          ⬡ KUBERNETES CLUSTER — AWS EKS  ·  namespace: mern-pizza  ·  CI/CD: ArgoCD
        </text>

        {/* NGINX ingress strip */}
        <rect x="294" y="147" width="502" height="26" rx="5"
          fill="rgba(255,107,43,.06)" stroke="rgba(255,107,43,.25)" strokeWidth="1" />
        <text x="545" y="164" fontSize="8" fill="#ff6b2b" textAnchor="middle" fontFamily="Space Mono">
          NGINX INGRESS  ·  api.mern-pizza-app.cyou
        </text>

        {/* Kafka bus */}
        <rect x={KAFKA.x} y={KAFKA.y} width={KAFKA.w} height={KAFKA.h} rx="8"
          fill="url(#kafkaGrad)" stroke="#e74c3c44" strokeWidth="1.2" />
        <text x={KAFKA.x + KAFKA.w / 2} y={KAFKA.y + 15} fontSize="9" fontWeight="700"
          fill="#e74c3c" textAnchor="middle" fontFamily="Syne">Apache Kafka</text>
        <text x={KAFKA.x + KAFKA.w / 2} y={KAFKA.y + 28} fontSize="7.5" fill="#535d72"
          textAnchor="middle" fontFamily="Space Mono">Event Bus — topics: catalog · orders · payments</text>

        {/* ── Client UIs (left) ── */}
        {[
          { label: 'Client UI', sub: 'mern-pizza-app.cyou', sub2: 'Next.js · Vercel', y: 210, color: '#4f9eff' },
          { label: 'Admin Dashboard', sub: 'admin.mern-pizza-app.cyou', sub2: 'React+Vite · Vercel', y: 288, color: '#ffb347' },
        ].map((f, i) => (
          <g key={i}>
            <rect x="14" y={f.y} width="146" height="56" rx="8"
              fill={f.color + '10'} stroke={f.color + '44'} strokeWidth="1.5" />
            <text x="87" y={f.y + 20} fontSize="10.5" fontWeight="700"
              fill={f.color} textAnchor="middle" fontFamily="Syne">{f.label}</text>
            <text x="87" y={f.y + 34} fontSize="7.5" fill="rgba(255,255,255,.45)"
              textAnchor="middle" fontFamily="Space Mono">{f.sub}</text>
            <text x="87" y={f.y + 46} fontSize="7" fill={f.color + '66'}
              textAnchor="middle" fontFamily="Space Mono">{f.sub2}</text>
          </g>
        ))}

        {/* ── Lines: UIs → NGINX ingress ── */}
        <line x1="160" y1="238" x2="294" y2="168" stroke="#4f9eff44" strokeWidth="1" markerEnd="url(#arr)" />
        <line x1="160" y1="316" x2="294" y2="168" stroke="#ffb34744" strokeWidth="1" markerEnd="url(#arr)" />

        {/* ── WebSocket bidirectional arrows: WS Service ↔ Admin/Client UI ── */}
        {/* WS → Admin Dashboard */}
        <path d="M655,254 C620,290 240,316 160,316"
          fill="none" stroke="#2ecc71" strokeWidth="1.1" strokeDasharray="4 3"
          markerEnd="url(#arr-ws)" opacity=".55" />
        {/* WS → Client UI */}
        <path d="M660,220 C640,190 240,218 160,238"
          fill="none" stroke="#2ecc71" strokeWidth="1.1" strokeDasharray="4 3"
          markerEnd="url(#arr-ws)" opacity=".4" />

        {/* ── Service nodes ── */}
        {SVC.map(n => {
          const svc = getSvc(n.id)
          const cx = n.x + n.w / 2
          return (
            <g key={n.id} style={{ cursor: 'pointer' }}
              onMouseMove={e => setHovered({ svc, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setHovered(null)}
            >
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8"
                fill={svc.color + '16'} stroke={svc.color + '55'} strokeWidth="1.5"
                filter="url(#glow)" />
              <text x={cx} y={n.y + 21} fontSize="10" fontWeight="700"
                fill={svc.color} textAnchor="middle" fontFamily="Syne">{svc.name}</text>
              <text x={cx} y={n.y + 36} fontSize="8" fill="rgba(255,255,255,.38)"
                textAnchor="middle" fontFamily="Space Mono">:{svc.port} · {svc.db}</text>
              <text x={cx} y={n.y + 48} fontSize="7" fill={svc.color + '55'}
                textAnchor="middle" fontFamily="Space Mono">{svc.replicas}× replicas</text>
            </g>
          )
        })}

        {/* ── DB nodes + vertical connectors ── */}
        {DBS.map((db, i) => {
          const svc = SVC.find(s => s.id === db.svcId)
          const scx = svc.x + svc.w / 2
          return (
            <g key={db.svcId}>
              <line x1={scx} y1={svc.y + svc.h} x2={db.x + 44} y2={db.y}
                stroke={db.color + '35'} strokeWidth="1" strokeDasharray="3 3" />
              <rect x={db.x} y={db.y} width="88" height="42" rx="6"
                fill={db.color + '10'} stroke={db.color + '38'} strokeWidth="1" />
              <text x={db.x + 44} y={db.y + 17} fontSize="8.5" fontWeight="700"
                fill={db.color} textAnchor="middle" fontFamily="Syne">{db.label}</text>
              <text x={db.x + 44} y={db.y + 32} fontSize="7.5" fill="rgba(255,255,255,.3)"
                textAnchor="middle" fontFamily="Space Mono">{db.sub}</text>
            </g>
          )
        })}

        {/* ── Kafka connectors (services → Kafka) ── */}
        {/* Catalog → Kafka (producer) */}
        <line x1="404" y1="264" x2="430" y2={KAFKA.y}
          stroke="#e74c3c55" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#arr-kafka)" />
        {/* Order → Kafka (producer) */}
        <line x1="559" y1="264" x2="545" y2={KAFKA.y}
          stroke="#e74c3c55" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#arr-kafka)" />
        {/* Kafka → Order (consumer — catalog events) */}
        <path d="M430,430 C410,410 520,390 530,264"
          fill="none" stroke="#ffb34744" strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#arr)" />
        {/* Kafka → WS (consumer) */}
        <line x1={KAFKA.x + KAFKA.w} y1={KAFKA.y + 18} x2="695" y2="264"
          stroke="#2ecc7144" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#arr-ws)" />
        {/* Kafka → Notif (consumer) */}
        <line x1={KAFKA.x + KAFKA.w * 0.85} y1={KAFKA.y + 36} x2="870" y2="264"
          stroke="#9b59b644" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#arr)" />

        {/* ── External services ── */}
        {EXT.map(e => (
          <g key={e.id}>
            <rect x={e.x} y={e.y} width="96" height="44" rx="8"
              fill={e.color + '10'} stroke={e.color + '44'} strokeWidth="1.2" />
            <text x={e.x + 48} y={e.y + 18} fontSize="9.5" fontWeight="700"
              fill={e.color} textAnchor="middle" fontFamily="Syne">{e.label}</text>
            <text x={e.x + 48} y={e.y + 32} fontSize="7.5" fill="rgba(255,255,255,.35)"
              textAnchor="middle" fontFamily="Space Mono">{e.sub}</text>
          </g>
        ))}

        {/* ── Connectors to external services ── */}
        {/* Catalog → S3 */}
        <line x1="960" y1="232" x2="930" y2="237" stroke="#ff990055" strokeWidth="1" markerEnd="url(#arr)" />
        {/* Order → Stripe */}
        <line x1="960" y1="302" x2="930" y2="302" stroke="#6772e555" strokeWidth="1" markerEnd="url(#arr)" />
        {/* Notif → SMTP */}
        <line x1="960" y1="372" x2="930" y2="350" stroke="#ea433555" strokeWidth="1" markerEnd="url(#arr)" />

        {/* Catalog service → S3 (dashed from catalog box) */}
        <line x1="930" y1="237" x2="858" y2="237" stroke="#ff990033" strokeWidth="1" strokeDasharray="3 2" />
        {/* Order service → Stripe */}
        <line x1="930" y1="302" x2="858" y2="248" stroke="#6772e533" strokeWidth="1" strokeDasharray="3 2" />
        {/* Notif → SMTP */}
        <line x1="930" y1="350" x2="858" y2="248" stroke="#ea433533" strokeWidth="1" strokeDasharray="3 2" />

        {/* ArgoCD badge */}
        <rect x="820" y="460" width="112" height="24" rx="5"
          fill="rgba(79,158,255,.08)" stroke="rgba(79,158,255,.25)" strokeWidth="1" />
        <text x="876" y="476" fontSize="8" fill="#4f9eff" textAnchor="middle" fontFamily="Space Mono">
          ArgoCD v3.3.2 — GitOps
        </text>

        {/* ── Legend ── */}
        {[
          { color: '#535d72', label: 'HTTP / REST',     dash: false },
          { color: '#e74c3c', label: 'Kafka Event',     dash: true  },
          { color: '#2ecc71', label: 'WebSocket',       dash: true  },
          { color: '#535d72', label: 'DB Connection',   dash: true  },
          { color: '#ff9900', label: 'External Service', dash: false },
        ].map((l, i) => (
          <g key={i} transform={`translate(${14 + i * 118}, 490)`}>
            <line x1="0" y1="0" x2="18" y2="0" stroke={l.color} strokeWidth="1.4"
              strokeDasharray={l.dash ? '4 3' : 'none'} />
            <text x="23" y="4" fontSize="8" fill="#535d72" fontFamily="Space Mono">{l.label}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}
