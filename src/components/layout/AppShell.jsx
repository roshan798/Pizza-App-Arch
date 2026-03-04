import { NavLink, useLocation } from "react-router-dom";
import { SERVICES, FRONTENDS } from "@/data/architecture";
import styles from "./AppShell.module.css";

const NAV = [
    {
        to: "/overview",
        label: "Overview",
        color: "#ff6b2b",
        icon: "◈",
        badge: "HLD",
    },
    {
        to: "/flow",
        label: "Order Flow",
        color: "#2ecc71",
        icon: "▶",
        badge: "Live Sim",
    },
    {
        to: "/diagrams",
        label: "Diagrams",
        color: "#4f9eff",
        icon: "⬡",
        badge: "4 views",
    },
    {
        to: "/docs",
        label: "Documentation",
        color: "#9b59b6",
        icon: "≡",
        badge: "Full guide",
    },
    {
        to: "/learning",
        label: "Learning",
        color: "#1abc9c",
        icon: "📚",
        badge: "12 topics",
    },
];

const PAGE_TITLE = {
    "/overview": { title: "System Overview", sub: "HLD + repo scan" },
    "/flow": {
        title: "Order Lifecycle Simulation",
        sub: "Animated microservice trace",
    },
    "/diagrams": {
        title: "Architecture Diagrams",
        sub: "Sequence · K8s · ERD · APIs",
    },
    "/docs": {
        title: "Documentation & Guides",
        sub: "Architecture · Deploy · Recommendations",
    },
};

export default function AppShell({ children }) {
    const { pathname } = useLocation();
    const page = PAGE_TITLE[pathname] || { title: "PizzaApp", sub: "" };

    return (
        <div className={styles.shell}>
            <div className="grid-bg" />

            {/* SIDEBAR */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTop}>
                    <div className={styles.logoMark}>🍕</div>
                    <div>
                        <div className={styles.logoTitle}>PizzaApp Arch</div>
                        <div className={styles.logoSub}>
                            Architecture Visualizer
                        </div>
                    </div>
                </div>

                <nav className={styles.nav}>
                    <div className={styles.navSection}>
                        <p className={styles.navLabel}>Pages</p>
                        {NAV.map((n) => (
                            <NavLink
                                key={n.to}
                                to={n.to}
                                className={({ isActive }) =>
                                    `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
                                }
                                style={({ isActive }) =>
                                    isActive ? { "--item-color": n.color } : {}
                                }>
                                <span
                                    className={styles.navIcon}
                                    style={{
                                        color: "var(--item-color, var(--text3))",
                                    }}>
                                    {n.icon}
                                </span>
                                <span className={styles.navLabel2}>
                                    {n.label}
                                </span>
                                <span className={styles.navBadge}>
                                    {n.badge}
                                </span>
                            </NavLink>
                        ))}
                    </div>

                    <div className={styles.navSection}>
                        <p className={styles.navLabel}>Backend Services</p>
                        {SERVICES.map((s) => (
                            <div
                                key={s.id}
                                className={styles.serviceRow}>
                                <span
                                    className={styles.serviceDot}
                                    style={{ background: s.color }}
                                />
                                <span className={styles.serviceName}>
                                    {s.name.replace(" Service", "")}
                                </span>
                                <span
                                    className={styles.servicePort}
                                    style={{ color: s.color }}>
                                    :{s.port}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.navSection}>
                        <p className={styles.navLabel}>Frontends</p>
                        {FRONTENDS.map((f) => (
                            <div
                                key={f.id}
                                className={styles.serviceRow}>
                                <span
                                    className={styles.serviceDot}
                                    style={{ background: f.color }}
                                />
                                <span className={styles.serviceName}>
                                    {f.name}
                                </span>
                                <span
                                    className={styles.servicePort}
                                    style={{ color: f.color }}>
                                    {f.host}
                                </span>
                            </div>
                        ))}
                    </div>
                </nav>

                <div className={styles.sidebarFooter}>
                    <span className={styles.onlineDot} />
                    <span className={styles.footerText}>
                        roshan798 / pizza-delivery-app
                    </span>
                </div>
            </aside>

            {/* MAIN */}
            <div className={styles.main}>
                <header className={styles.topbar}>
                    <div className={styles.topbarTitle}>{page.title}</div>
                    <div className={styles.topbarSub}>{page.sub}</div>
                    <div className={styles.topbarBadges}>
                        <span
                            className={styles.tbBadge}
                            style={{
                                background: "rgba(255,107,43,.12)",
                                color: "#ff6b2b",
                                border: "1px solid rgba(255,107,43,.3)",
                            }}>
                            MERN Stack
                        </span>
                        <span
                            className={styles.tbBadge}
                            style={{
                                background: "rgba(79,158,255,.12)",
                                color: "#4f9eff",
                                border: "1px solid rgba(79,158,255,.3)",
                            }}>
                            Kubernetes
                        </span>
                        <span
                            className={styles.tbBadge}
                            style={{
                                background: "rgba(46,204,113,.12)",
                                color: "#2ecc71",
                                border: "1px solid rgba(46,204,113,.3)",
                            }}>
                            Multi-Tenant
                        </span>
                    </div>
                </header>
                <main className={styles.content}>{children}</main>
            </div>
        </div>
    );
}
