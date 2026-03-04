import { ERD_TABLES } from '@/data/architecture'
import styles from './ERDDiagram.module.css'

const DB_LABEL = {
  'PostgreSQL':            { color: '#4f9eff', icon: '🐘', badge: 'PostgreSQL — Auth Service' },
  'MongoDB':               { color: '#ff6b2b', icon: '🍃', badge: 'MongoDB — Catalog Service' },
  'MongoDB (Order Svc)':   { color: '#ffb347', icon: '🍃', badge: 'MongoDB — Order Service' },
}

function ERDTable({ table }) {
  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}
        style={{ background: table.color + '16', borderBottomColor: table.color + '40' }}>
        <span style={{ color: table.color, fontSize: 12 }}>⬛</span>
        <span style={{ color: table.color, fontWeight: 700, fontFamily: 'var(--font-sans)', fontSize: 12 }}>{table.name}</span>
        <span style={{ marginLeft: 'auto', fontSize: 8, color: table.color + '80', fontFamily: 'var(--font-mono)' }}>{table.db}</span>
      </div>
      {table.fields.map(f => (
        <div key={f.name} className={styles.field}>
          <span style={{
            fontSize: 10, color: f.pk ? '#ffb347' : f.fk ? '#4f9eff' : 'var(--text2)',
            fontWeight: (f.pk || f.fk) ? 700 : 400,
          }}>
            {f.pk ? '🔑 ' : f.fk ? '🔗 ' : '   '}{f.name}
          </span>
          <span className={styles.fieldType}>{f.type}</span>
        </div>
      ))}
    </div>
  )
}

function DBSection({ dbKey, tables }) {
  const meta = DB_LABEL[dbKey]
  return (
    <div className={styles.dbSection}>
      <div className={styles.dbHeader} style={{ color: meta.color, borderColor: meta.color + '30' }}>
        <span>{meta.icon}</span>
        <span>{meta.badge}</span>
      </div>
      <div className={styles.tableGrid}>
        {tables.map(t => <ERDTable key={t.name} table={t} />)}
      </div>
    </div>
  )
}

export default function ERDDiagram() {
  const grouped = ERD_TABLES.reduce((acc, t) => {
    if (!acc[t.db]) acc[t.db] = []
    acc[t.db].push(t)
    return acc
  }, {})

  return (
    <div className={styles.wrapper}>
      {Object.entries(grouped).map(([db, tables]) => (
        <DBSection key={db} dbKey={db} tables={tables} />
      ))}
      <div className={styles.note}>
        <span>🔗</span>
        <span>Cross-DB references: MongoDB documents store tenantId and customerId as UUID strings, referencing PostgreSQL rows. No enforced FK — application-level consistency.</span>
      </div>
    </div>
  )
}
