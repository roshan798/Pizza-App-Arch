import clsx from 'clsx'
import styles from './ui.module.css'

/* ===== BADGE ===== */
export function Badge({ children, variant = 'default', style }) {
  return (
    <span className={clsx(styles.badge, styles[`badge_${variant}`])} style={style}>
      {children}
    </span>
  )
}

/* ===== PILL ===== */
export function Pill({ children, color }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 99,
        fontSize: 9,
        fontWeight: 700,
        background: color + '20',
        color: color,
        border: `1px solid ${color}44`,
      }}
    >
      {children}
    </span>
  )
}

/* ===== METHOD BADGE ===== */
const METHOD_COLORS = {
  GET:    '#2ecc71',
  POST:   '#4f9eff',
  PUT:    '#ffb347',
  PATCH:  '#9b59b6',
  DELETE: '#e74c3c',
}
export function MethodBadge({ method }) {
  const color = METHOD_COLORS[method] || '#535d72'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 46, padding: '2px 0', borderRadius: 4,
      fontSize: 9, fontWeight: 700, letterSpacing: .5,
      background: color + '22', color, border: `1px solid ${color}44`,
    }}>
      {method}
    </span>
  )
}

/* ===== CARD ===== */
export function Card({ children, style, className }) {
  return (
    <div className={clsx(styles.card, className)} style={style}>
      {children}
    </div>
  )
}
export function CardHeader({ children, style }) {
  return <div className={styles.cardHeader} style={style}>{children}</div>
}
export function CardTitle({ children, style }) {
  return <h3 className={styles.cardTitle} style={style}>{children}</h3>
}
export function CardBody({ children, style }) {
  return <div className={styles.cardBody} style={style}>{children}</div>
}

/* ===== STAT CARD ===== */
export function StatCard({ value, label, sub, color }) {
  return (
    <div className={styles.statCard}>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-sans)', color }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 6 }}>{sub}</div>
      )}
    </div>
  )
}

/* ===== TAB BAR ===== */
export function TabBar({ tabs, active, onChange }) {
  return (
    <div className={styles.tabBar}>
      {tabs.map(t => (
        <button
          key={t.id}
          className={clsx(styles.tabBtn, active === t.id && styles.tabBtnActive)}
          onClick={() => onChange(t.id)}
          style={active === t.id ? { color: t.color || 'var(--text)' } : {}}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* ===== SECTION HEADER ===== */
export function SectionHeader({ title, badge, badgeVariant = 'orange', children }) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionDot} />
      <h2 className={styles.sectionTitle}>{title}</h2>
      {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
      {children}
    </div>
  )
}

/* ===== CODE BLOCK ===== */
export function CodeBlock({ children, style }) {
  return (
    <pre className={styles.codeBlock} style={style}>
      <code>{children}</code>
    </pre>
  )
}

/* ===== PING DOT ===== */
export function PingDot({ color = 'var(--green)', size = 10 }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size }}>
      <span style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: color, animation: 'ping 1.5s ease-out infinite',
      }} />
      <span style={{ width: size, height: size, borderRadius: '50%', background: color, position: 'relative', zIndex: 1 }} />
    </span>
  )
}

/* ===== DATA TABLE ===== */
export function DataTable({ headers, rows }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map(h => <th key={h} className={styles.th}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={styles.tr}>
            {row.map((cell, j) => <td key={j} className={styles.td}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
