# 🍕 PizzaApp Architecture Visualizer

An interactive architecture visualizer for the [roshan798/pizza-delivery-app](https://github.com/roshan798/pizza-app-deployment) microservices ecosystem.

Built with **React 18 + Vite + React Router** — no UI framework dependencies.

---

## 📁 Project Structure

```
pizza-arch-visualizer/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx               # App entry point
    ├── App.jsx                # Router setup
    ├── styles/
    │   └── globals.css        # Design tokens + global styles
    ├── data/
    │   └── architecture.js    # All arch data (services, ERD, K8s, flow)
    ├── components/
    │   ├── layout/
    │   │   ├── AppShell.jsx           # Sidebar + topbar layout
    │   │   └── AppShell.module.css
    │   ├── ui/
    │   │   ├── index.jsx              # Badge, Card, StatCard, TabBar, etc.
    │   │   └── ui.module.css
    │   ├── diagrams/
    │   │   ├── HLDDiagram.jsx         # SVG high-level diagram (hover tooltips)
    │   │   ├── HLDDiagram.module.css
    │   │   ├── SequenceDiagram.jsx    # Order sequence SVG
    │   │   ├── K8sTree.jsx            # Collapsible K8s resource tree
    │   │   ├── K8sTree.module.css
    │   │   ├── ERDDiagram.jsx         # MongoDB entity relationship diagram
    │   │   ├── ERDDiagram.module.css
    │   │   ├── EndpointsMap.jsx       # API endpoints viewer (tabbed by service)
    │   │   └── EndpointsMap.module.css
    │   └── pages/
    │       ├── OverviewPage.jsx       # Stats + HLD + repo scan + CI/CD
    │       ├── OverviewPage.module.css
    │       ├── FlowPage.jsx           # Animated order lifecycle simulation
    │       ├── FlowPage.module.css
    │       ├── DiagramsPage.jsx       # Tabbed: Sequence / K8s / ERD / Endpoints
    │       ├── DiagramsPage.module.css
    │       ├── DocsPage.jsx           # Full architecture docs + deployment guide
    │       └── DocsPage.module.css
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
cd pizza-arch-visualizer
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

---

## 📄 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/overview` | System Overview | HLD SVG diagram, repo scan table, CI/CD pipeline |
| `/flow` | Order Flow | Animated microservice trace for order lifecycle |
| `/diagrams` | Diagrams | Sequence · K8s tree · ERD · API endpoints |
| `/docs` | Documentation | Architecture summary, deploy guide, tech stack, risks |

---

## 🏗️ Architecture Analyzed

| Service | Port | Tech | DB |
|---------|------|------|----|
| Auth Service | 8001 | Node.js + JWT | MongoDB |
| Catalog Service | 8002 | Node.js + Express | MongoDB |
| Order Service | 8003 | Node.js + Express | MongoDB |
| WebSocket Service | 8004 | Socket.io | Redis |
| Notification Service | 8005 | Nodemailer | Kafka |
| Client UI | — | Next.js 14 | Vercel |
| Admin Dashboard | — | React + Vite | Vercel |

---

## 🔧 Customization

All architecture data lives in `src/data/architecture.js` — edit this file to update services, endpoints, K8s resources, or ERD tables without touching component code.
