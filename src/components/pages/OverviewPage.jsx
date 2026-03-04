import { StatCard, Card, CardHeader, CardTitle, CardBody, Badge, Pill } from '@/components/ui'
import HLDDiagram from '@/components/diagrams/HLDDiagram'
import { SERVICES, REPOS, EXTERNAL_SERVICES } from '@/data/architecture'
import styles from './OverviewPage.module.css'

const TYPE_COLOR = { Backend: '#ff6b2b', Frontend: '#4f9eff', Infra: '#9b59b6' }

const CICD = [
  { label: 'Push to GitHub',     sub: 'service repo',     color: '#4f9eff' },
  { label: 'GitHub Actions',     sub: 'build + test',     color: '#ffb347' },
  { label: 'Docker Build',       sub: 'multi-stage',      color: '#ff6b2b' },
  { label: 'Push DockerHub',     sub: 'roshan798/*',      color: '#0db7ed' },
  { label: 'Update Manifest',    sub: 'image tag in yaml', color: '#2ecc71' },
  { label: 'ArgoCD Sync',        sub: 'GitOps auto-sync', color: '#f05033' },
  { label: 'K8s Rollout',        sub: 'rolling update',   color: '#326ce5' },
]

export default function OverviewPage() {
  return (
    <div className={`${styles.page} fade-in-up`}>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {[
          { value: '8',  label: 'Repositories',    sub: '5 backend · 2 frontend · 1 infra',  color: '#ff6b2b' },
          { value: '44', label: 'API Endpoints',    sub: 'across 5 microservices',             color: '#4f9eff' },
          { value: '9',  label: 'Kafka Events',     sub: '3 topics: catalog · orders · payments', color: '#e74c3c' },
          { value: '3',  label: 'User Roles',       sub: 'Admin · Manager · Customer',         color: '#9b59b6' },
        ].map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* HLD */}
      <Card>
        <CardHeader>
          <span style={{ color: '#ff6b2b', fontSize: 16 }}>◈</span>
          <CardTitle>High-Level Architecture</CardTitle>
          <Badge variant="orange">HLD</Badge>
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>Hover service nodes for details</span>
        </CardHeader>
        <CardBody><HLDDiagram /></CardBody>
      </Card>

      <div className={styles.grid2}>

        {/* Repo Scan */}
        <Card>
          <CardHeader>
            <CardTitle>Repository Scan</CardTitle>
            <Badge variant="blue">{REPOS.length} repos</Badge>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            <table className={styles.table}>
              <thead><tr><th>Repository</th><th>Type</th><th>Last Commit</th></tr></thead>
              <tbody>
                {REPOS.map(r => (
                  <tr key={r.name} className={styles.tr}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--text)' }}>
                        {r.name.replace('pizza-delivery-', '').replace('pizza-app-', '').replace('pizza-delivery-app-', '')}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>{r.files}</div>
                    </td>
                    <td><Pill color={TYPE_COLOR[r.type]}>{r.type}</Pill></td>
                    <td style={{ fontSize: 9, color: 'var(--text3)', maxWidth: 160 }}>{r.lastCommit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* External services */}
          <Card>
            <CardHeader>
              <CardTitle>External Integrations</CardTitle>
              <Badge variant="orange">{EXTERNAL_SERVICES.length} services</Badge>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {EXTERNAL_SERVICES.map(e => (
                  <div key={e.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 10px', background: 'var(--bg3)', borderRadius: 7, border: `1px solid ${e.color}22` }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{e.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: e.color, fontFamily: 'var(--font-sans)', fontSize: 12 }}>{e.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{e.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* CI/CD */}
          <Card>
            <CardHeader>
              <CardTitle>CI/CD Pipeline</CardTitle>
              <Badge variant="green">ArgoCD + GitHub Actions</Badge>
            </CardHeader>
            <CardBody>
              <div className={styles.cicdFlow}>
                {CICD.map((c, i) => (
                  <div key={i} className={styles.cicdRow}>
                    <div className={styles.cicdNode}
                      style={{ background: c.color + '16', borderColor: c.color + '44', color: c.color }}>
                      <div style={{ fontWeight: 700, fontSize: 10, fontFamily: 'var(--font-sans)' }}>{c.label}</div>
                      <div style={{ fontSize: 8, opacity: .6, marginTop: 2 }}>{c.sub}</div>
                    </div>
                    {i < CICD.length - 1 && <span className={styles.cicdArrow}>→</span>}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Services quick ref */}
          <Card>
            <CardHeader><CardTitle>Services Quick Ref</CardTitle></CardHeader>
            <CardBody style={{ padding: 0 }}>
              <table className={styles.table}>
                <thead><tr><th>Service</th><th>Port</th><th>DB</th><th>Kafka</th></tr></thead>
                <tbody>
                  {SERVICES.map(s => (
                    <tr key={s.id} className={styles.tr}>
                      <td style={{ fontWeight: 700, color: s.color, fontSize: 11 }}>{s.name.replace(' Service', '')}</td>
                      <td><Pill color={s.color}>:{s.port}</Pill></td>
                      <td><Pill color="#535d72">{s.db}</Pill></td>
                      <td style={{ fontSize: 9, color: 'var(--text3)' }}>
                        {s.kafkaProduces?.length ? `▲ ${s.kafkaProduces.length}` : ''}
                        {s.kafkaProduces?.length && s.kafkaConsumes?.length ? ' ' : ''}
                        {s.kafkaConsumes?.length ? `▼ ${s.kafkaConsumes.length}` : ''}
                        {!s.kafkaProduces?.length && !s.kafkaConsumes?.length ? '—' : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  )
}
