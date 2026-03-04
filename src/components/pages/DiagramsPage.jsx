import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardBody, Badge, TabBar } from '@/components/ui'
import SequenceDiagram from '@/components/diagrams/SequenceDiagram'
import K8sTree         from '@/components/diagrams/K8sTree'
import ERDDiagram      from '@/components/diagrams/ERDDiagram'
import EndpointsMap    from '@/components/diagrams/EndpointsMap'
import KafkaEvents     from '@/components/diagrams/KafkaEvents'
import styles          from './DiagramsPage.module.css'

const TABS = [
  { id: 'sequence',  label: 'Order Sequence', color: '#4f9eff',  badge: { label: 'Sequence',  variant: 'blue'   } },
  { id: 'kafka',     label: 'Kafka Events',   color: '#e74c3c',  badge: { label: 'Async Bus',  variant: 'red'    } },
  { id: 'k8s',       label: 'K8s + ArgoCD',   color: '#ff6b2b',  badge: { label: 'Cluster',   variant: 'orange' } },
  { id: 'erd',       label: 'Data Model',      color: '#2ecc71',  badge: { label: 'PG + Mongo', variant: 'green'  } },
  { id: 'endpoints', label: 'API Endpoints',   color: '#9b59b6',  badge: { label: 'REST',      variant: 'purple' } },
]

const NOTES = {
  sequence:  'JWT is validated locally in each service using a shared JWT_SECRET — no synchronous call to Auth Service, avoiding circular dependencies and single-point-of-failure. Stripe webhooks are signature-verified before any DB updates. Kafka events are fire-and-forget: if Notification Service is down, events queue and replay on restart.',
  kafka:     'The Kafka event bus decouples Catalog → Order (cache sync) and Order → WS/Notif (notifications). The Order Service maintains its own ProductCache by consuming catalog events — this means orders always validate prices against locally-stored data, even if Catalog Service is temporarily unavailable.',
  k8s:       'Deployed on AWS EKS, managed by ArgoCD v3.3.2 with GitOps. GitHub Actions builds Docker images on push and pushes to DockerHub. ArgoCD watches the pizza-app-deployment repo and automatically applies manifest changes. The auth-service runs 2 replicas; order-service runs 3 for peak load tolerance.',
  erd:       'Auth Service uses PostgreSQL (relational: users/tenants/roles with proper FK constraints). Catalog and Order Services use MongoDB (flexible document model for nested price configs and order snapshots). Cross-DB: MongoDB docs store tenantId and customerId as UUID strings referencing PostgreSQL — application-level consistency.',
  endpoints: 'All protected endpoints validate JWT via shared secret middleware (no per-request Auth Service call). The Stripe webhook endpoint is intentionally unauthenticated — it validates the Stripe-Signature header instead. Catalog mutation endpoints publish Kafka events as a side-effect.',
}

export default function DiagramsPage() {
  const [active, setActive] = useState('sequence')
  const tab = TABS.find(t => t.id === active)

  return (
    <div className={`${styles.page} fade-in-up`}>
      <Card>
        <CardHeader>
          <CardTitle>Architecture Diagrams</CardTitle>
          <Badge variant={tab.badge.variant}>{tab.badge.label}</Badge>
        </CardHeader>
        <CardBody>
          <TabBar tabs={TABS} active={active} onChange={setActive} />
          <div key={active} className="fade-in-up">
            {active === 'sequence'  && <SequenceDiagram />}
            {active === 'kafka'     && <KafkaEvents />}
            {active === 'k8s'       && <K8sTree />}
            {active === 'erd'       && <ERDDiagram />}
            {active === 'endpoints' && <EndpointsMap />}
          </div>
        </CardBody>
      </Card>

      <div className={styles.note} key={active + '_note'}>
        <span className={styles.noteIcon}>💡</span>
        <p className={styles.noteText}>{NOTES[active]}</p>
      </div>
    </div>
  )
}
