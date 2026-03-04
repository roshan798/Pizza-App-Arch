import { SERVICES, EXTERNAL_SERVICES } from '@/data/architecture'
import { Card, CardHeader, CardTitle, CardBody, Badge, Pill } from '@/components/ui'
import styles from './DocsPage.module.css'

const TECH_STACK = [
  ['Auth DB',           'PostgreSQL',               'Relational user/tenant/role store with FK constraints',    '#4f9eff'],
  ['Catalog / Order DB', 'MongoDB',                  'Flexible document model for products, orders, price config', '#ff6b2b'],
  ['Event Bus',         'Apache Kafka',              'Async events: catalog sync, order notifications',         '#e74c3c'],
  ['Payments',          'Stripe',                    'Card payments — PaymentIntent + webhook verification',     '#6772e5'],
  ['Image Storage',     'AWS S3',                    'Product & topping images uploaded by Catalog Service',    '#ff9900'],
  ['Email',             'SMTP + Nodemailer',         'Order confirmation & status emails from Notif Service',   '#ea4335'],
  ['Real-time',         'Socket.io (WebSocket)',     'Order events pushed to Admin UI & Client UI rooms',       '#2ecc71'],
  ['Backend Runtime',   'Node.js 18 + Express',      'All 5 microservices',                                     '#68a063'],
  ['Customer Frontend', 'Next.js 14 (App Router)',   'mern-pizza-app.cyou — ordering, cart, Stripe redirect',  '#000'],
  ['Admin Frontend',    'React + Vite',              'admin.mern-pizza-app.cyou — tenant/product management',  '#646cff'],
  ['Container',         'Docker (multi-stage builds)', 'Minimal production images pushed to DockerHub',         '#0db7ed'],
  ['Orchestration',     'Kubernetes — AWS EKS',      'Service deployment, scaling, rolling updates',           '#326ce5'],
  ['Ingress',           'NGINX Ingress Controller',  'SSL termination, path routing, CORS, body-size limit',   '#009639'],
  ['UI Hosting',        'Vercel',                    'Edge CDN for both Next.js and React Vite frontends',     '#000'],
  ['CI/CD',             'GitHub Actions + ArgoCD v3.3.2', 'Build image on push → DockerHub → ArgoCD GitOps deploy', '#ff6b2b'],
]

const ROLES = [
  { role: 'ADMIN',    color: '#e74c3c', scope: 'Global', perms: ['Create / manage tenants', 'Create managers for tenants', 'Access all products, orders across tenants', 'Full catalog management'] },
  { role: 'MANAGER',  color: '#ffb347', scope: 'Tenant-scoped', perms: ['Manage products, categories, toppings for their tenant', 'View and update order statuses', 'View tenant orders in real-time via WebSocket'] },
  { role: 'CUSTOMER', color: '#4f9eff', scope: 'Self-scoped', perms: ['Browse published products', 'Place orders (COD or Stripe card)', 'Track own orders in real-time', 'View order history'] },
]

const RISKS = [
  { level: '🔴 High',   title: 'Secret Management',      text: 'K8s Secrets are base64-only. Upgrade to HashiCorp Vault with ArgoCD Vault Plugin for dynamic secrets + rotation.' },
  { level: '🔴 High',   title: 'No HPA on Order Service', text: 'Order Service (3 replicas) has no HorizontalPodAutoscaler. Add HPA targeting CPU >70% to auto-scale during peak hours.' },
  { level: '🟡 Medium', title: 'Cross-DB Consistency',   text: 'MongoDB stores tenantId/customerId as strings referencing PostgreSQL — no enforced FK. Use saga pattern or compensating transactions for consistency.' },
  { level: '🟡 Medium', title: 'Manual Kubectl Updates', text: 'Currently manually updating kubectl after new Docker image. Automate with ArgoCD Image Updater to watch DockerHub tags.' },
  { level: '🟡 Medium', title: 'No Distributed Tracing', text: 'Add OpenTelemetry + Jaeger to trace a request across Auth → Catalog → Order → Kafka → WS in a single view.' },
  { level: '🟢 Low',    title: 'Mutable :latest Tags',   text: 'Using :latest or short SHA. Use immutable semver tags (v1.2.3) for reproducible rollbacks with ArgoCD.' },
  { level: '🟢 Low',    title: 'No Rate Limiting on Auth', text: 'Add nginx-rate-limit annotations on /api/auth/login to prevent brute force. 10 req/min per IP.' },
]

export default function DocsPage() {
  return (
    <div className={`${styles.page} fade-in-up`}>

      {/* Architecture Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Architecture Summary</CardTitle>
          <Badge variant="orange">Accurate to Codebase</Badge>
        </CardHeader>
        <CardBody>
          <p className={styles.p}>
            A multi-tenant pizza ordering platform built on a microservices architecture.
            Five independently-deployable Node.js services communicate via HTTP REST (sync) and Apache Kafka (async).
            Auth uses <strong>PostgreSQL</strong> for relational user/tenant/role data.
            Catalog and Order use <strong>MongoDB</strong> for flexible document schemas.
          </p>
          <p className={styles.p}>
            The <strong>Order Service</strong> maintains a local product/topping price cache by consuming Kafka events from Catalog Service —
            this decouples services and enables offline price validation.
            Card payments go through <strong>Stripe</strong> (PaymentIntent + webhook confirmation).
            Product images are stored in <strong>AWS S3</strong>.
          </p>
          <p className={styles.p}>
            Backend runs on <strong>AWS EKS (Kubernetes)</strong>, managed via <strong>ArgoCD v3.3.2</strong> with GitOps.
            GitHub Actions builds and pushes Docker images on every push.
            Both frontends (Next.js Client UI + React Admin Dashboard) are deployed on <strong>Vercel</strong>.
          </p>
        </CardBody>
      </Card>

      {/* User Roles */}
      <Card>
        <CardHeader>
          <CardTitle>User Roles & Permissions</CardTitle>
          <Badge variant="blue">3 Role Types</Badge>
        </CardHeader>
        <CardBody>
          <div className={styles.rolesGrid}>
            {ROLES.map(r => (
              <div key={r.role} className={styles.roleCard}
                style={{ borderColor: r.color + '44', background: r.color + '08' }}>
                <div className={styles.roleHeader} style={{ color: r.color }}>
                  <span className={styles.roleTitle}>{r.role}</span>
                  <span className={styles.roleScope}>{r.scope}</span>
                </div>
                <ul className={styles.rolePerms}>
                  {r.perms.map(p => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* CI/CD Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>CI/CD Pipeline</CardTitle>
          <Badge variant="green">GitHub Actions + ArgoCD</Badge>
        </CardHeader>
        <CardBody>
          <p className={styles.p} style={{ marginBottom: 12 }}>
            The pipeline uses <strong>GitHub Actions</strong> for build/push and <strong>ArgoCD v3.3.2</strong> for GitOps-based K8s deployment.
            ArgoCD watches the <code className={styles.code}>pizza-app-deployment</code> repo and auto-syncs on manifest changes.
          </p>
          <pre className={styles.pre}>{`# GitHub Actions (per service, e.g. auth-service)
on: push (branches: main)

steps:
  1. Checkout code
  2. Build Docker image (multi-stage)
     → docker build -t roshan798/auth-service:$SHA .
  3. Push to DockerHub
     → docker push roshan798/auth-service:$SHA
  4. Update k8s deployment manifest (image tag)
     → kubectl set image deploy/auth-service (or update yaml)

# ArgoCD (pizza-app-deployment repo)
  → Detects manifest changes (new image tag)
  → Auto-syncs: kubectl apply -f k8s/
  → Rolls out new pods (rolling update strategy)
  → RevisionHistoryLimit set for rollback capability

# Vercel (frontends — auto-deploy)
  → Push to main → Vercel builds + deploys
  → Preview deployments on PRs`}</pre>
        </CardBody>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Full Tech Stack</CardTitle>
          <Badge variant="blue">{TECH_STACK.length} layers</Badge>
        </CardHeader>
        <CardBody style={{ padding: 0 }}>
          <table className={styles.table}>
            <thead><tr><th>Layer</th><th>Technology</th><th>Purpose</th></tr></thead>
            <tbody>
              {TECH_STACK.map(([layer, tech, purpose, color]) => (
                <tr key={layer} className={styles.tr}>
                  <td className={styles.tdBold}>{layer}</td>
                  <td><Pill color={color}>{tech}</Pill></td>
                  <td className={styles.tdMuted}>{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Domains */}
      <Card>
        <CardHeader><CardTitle>Domain Structure</CardTitle></CardHeader>
        <CardBody>
          <div className={styles.domainsGrid}>
            {[
              { domain: 'mern-pizza-app.cyou',        host: 'Vercel',     service: 'Client UI (Next.js)',      color: '#4f9eff', badge: 'Customer' },
              { domain: 'admin.mern-pizza-app.cyou',  host: 'Vercel',     service: 'Admin Dashboard (React)',  color: '#ffb347', badge: 'Admin/Manager' },
              { domain: 'api.mern-pizza-app.cyou',    host: 'AWS EKS',    service: 'NGINX Ingress → Services', color: '#2ecc71', badge: 'Backend' },
            ].map(d => (
              <div key={d.domain} className={styles.domainCard}>
                <div className={styles.domainName} style={{ color: d.color }}>{d.domain}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{d.service}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <Pill color={d.color}>{d.badge}</Pill>
                  <Pill color="#535d72">{d.host}</Pill>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Deployment Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Guide</CardTitle>
          <Badge variant="green">Step-by-step</Badge>
        </CardHeader>
        <CardBody>
          <h3 className={styles.h3}>1. Clone deployment repo</h3>
          <pre className={styles.pre}>{`git clone --recurse-submodules \\
  https://github.com/roshan798/pizza-app-deployment
cd pizza-app-deployment`}</pre>
          <h3 className={styles.h3}>2. Configure secrets</h3>
          <pre className={styles.pre}>{`kubectl apply -f k8s/namespace.yaml
# Auth secrets (PostgreSQL + JWT)
kubectl create secret generic auth-secrets -n mern-pizza \\
  --from-literal=JWT_SECRET=<your_jwt_secret> \\
  --from-literal=REFRESH_TOKEN_SECRET=<your_refresh_secret> \\
  --from-literal=DB_HOST=<postgres_host> \\
  --from-literal=DB_USER=<postgres_user> \\
  --from-literal=DB_PASS=<postgres_password> \\
  --from-literal=DB_NAME=pizza_auth

# Order secrets (Stripe)
kubectl create secret generic order-secrets -n mern-pizza \\
  --from-literal=MONGO_URI=<mongo_uri> \\
  --from-literal=STRIPE_SECRET_KEY=<stripe_secret> \\
  --from-literal=STRIPE_WEBHOOK_SECRET=<stripe_webhook_secret> \\
  --from-literal=KAFKA_BROKER=<kafka_broker>`}</pre>
          <h3 className={styles.h3}>3. Deploy to Kubernetes</h3>
          <pre className={styles.pre}>{`kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
kubectl apply -f k8s/ingresses/
kubectl get pods -n mern-pizza     # verify all running`}</pre>
          <h3 className={styles.h3}>4. Setup ArgoCD</h3>
          <pre className={styles.pre}>{`# ArgoCD watches pizza-app-deployment repo (auto-sync enabled)
# Application: pizza-app-auth-service → namespace mern-pizza
# Sync: HEAD (7936450) — Synced  ♥ Healthy  (as per screenshot)`}</pre>
          <h3 className={styles.h3}>5. Deploy frontends to Vercel</h3>
          <pre className={styles.pre}>{`# Client UI
cd pizza-delivery-client-UI && vercel --prod
# NEXT_PUBLIC_API_URL = https://api.mern-pizza-app.cyou

# Admin Dashboard
cd pizza-app-admin-dashboard && vercel --prod
# VITE_API_URL    = https://api.mern-pizza-app.cyou
# VITE_WS_URL     = wss://api.mern-pizza-app.cyou`}</pre>
        </CardBody>
      </Card>

      {/* Risks */}
      <Card>
        <CardHeader>
          <CardTitle>Risks & Recommendations</CardTitle>
          <Badge variant="red">Review Required</Badge>
        </CardHeader>
        <CardBody>
          <div className={styles.riskList}>
            {RISKS.map(r => (
              <div key={r.title} className={styles.riskRow}>
                <div className={styles.riskLevel}>{r.level}</div>
                <div>
                  <div className={styles.riskTitle}>{r.title}</div>
                  <div className={styles.riskText}>{r.text}</div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Recommendations grid */}
      <Card>
        <CardHeader><CardTitle>Scaling & Observability Recommendations</CardTitle></CardHeader>
        <CardBody>
          <div className={styles.recGrid}>
            {[
              { icon: '🤖', title: 'ArgoCD Image Updater',  desc: 'Auto-update K8s deployments when new DockerHub tags are pushed — fully automated GitOps pipeline.' },
              { icon: '📊', title: 'Prometheus + Grafana',  desc: 'Scrape metrics from all services. Dashboard: order throughput, Kafka consumer lag, Stripe success rate.' },
              { icon: '🔍', title: 'Jaeger Tracing',        desc: 'OpenTelemetry SDK in each service to trace a request from API Gateway → Order → Kafka → Notification.' },
              { icon: '⚡', title: 'HPA for Order Service', desc: 'Scale from 3→10 replicas at CPU >70% or RPS >500 to handle lunch/dinner order spikes.' },
              { icon: '🔐', title: 'Vault for Secrets',     desc: 'ArgoCD Vault Plugin for dynamic secret injection. Rotate Stripe keys and DB passwords without pod restart.' },
              { icon: '💳', title: 'Stripe Idempotency',    desc: 'Add idempotency keys to Stripe API calls to prevent duplicate charges on network retries.' },
            ].map(r => (
              <div key={r.title} className={styles.recCard}>
                <div className={styles.recIcon}>{r.icon}</div>
                <div>
                  <div className={styles.recTitle}>{r.title}</div>
                  <div className={styles.recDesc}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
