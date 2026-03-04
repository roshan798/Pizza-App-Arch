import { useState } from 'react'
import { SERVICES, ENDPOINTS } from '@/data/architecture'
import { TabBar, MethodBadge } from '@/components/ui'
import styles from './EndpointsMap.module.css'

export default function EndpointsMap() {
  const [activeId, setActiveId] = useState('catalog')

  const tabs = SERVICES.map(s => ({
    id:    s.id,
    label: s.name.replace(' Service', '').replace('Notification', 'Notif'),
    color: s.color,
  }))

  const endpoints = ENDPOINTS[activeId] || []
  const activeSvc = SERVICES.find(s => s.id === activeId)

  return (
    <div>
      <TabBar tabs={tabs} active={activeId} onChange={setActiveId} />

      <div className={styles.meta}>
        <span style={{ color: activeSvc.color, fontWeight: 700 }}>{activeSvc.name}</span>
        <span className={styles.metaSep}>·</span>
        <span>{activeSvc.tech}</span>
        <span className={styles.metaSep}>·</span>
        <span style={{ color: activeSvc.color }}>:{activeSvc.port}</span>
        <span className={styles.metaSep}>·</span>
        <span>{endpoints.length} endpoints</span>
      </div>

      <div className={`${styles.list} fade-in-up`} key={activeId}>
        {endpoints.map((ep, i) => (
          <div key={i} className={styles.row}>
            <MethodBadge method={ep.method} />
            <code className={styles.path}>{ep.path}</code>
            <span className={styles.desc}>{ep.desc}</span>
            {ep.auth && <span className={styles.authBadge}>🔒 AUTH</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
