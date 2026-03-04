import { useState } from "react";
import { LEARNING_TOPICS } from "@/data/learning";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui";
import styles from "./LearningPage.module.css";

export default function LearningPage() {
    const [active, setActive] = useState(null);
    const [search, setSearch] = useState("");

    const filtered = LEARNING_TOPICS.filter(
        (t) =>
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.relatedTo.some((r) =>
                r.toLowerCase().includes(search.toLowerCase()),
            ),
    );

    const selected = active
        ? LEARNING_TOPICS.find((t) => t.id === active)
        : null;

    return (
        <div className={`${styles.page} fade-in-up`}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Learning Roadmap</h1>
                    <p className={styles.sub}>
                        Every technology in this project — what it is, why
                        it&apos;s here, and what to study.
                    </p>
                </div>
                <input
                    className={styles.search}
                    placeholder="Search topics..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className={styles.layout}>
                {/* Topic cards grid */}
                <div className={styles.grid}>
                    {filtered.map((t) => (
                        <div
                            key={t.id}
                            className={`${styles.topicCard} ${active === t.id ? styles.topicCardActive : ""}`}
                            style={{ "--topic-color": t.color }}
                            onClick={() =>
                                setActive(active === t.id ? null : t.id)
                            }>
                            <div className={styles.topicIcon}>{t.icon}</div>
                            <div className={styles.topicTitle}>{t.title}</div>
                            <div className={styles.topicTags}>
                                {t.relatedTo.slice(0, 2).map((r) => (
                                    <span
                                        key={r}
                                        className={styles.tag}
                                        style={{
                                            color: t.color,
                                            borderColor: t.color + "44",
                                            background: t.color + "12",
                                        }}>
                                        {r}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail panel */}
                {selected && (
                    <div
                        className={`${styles.detail} fade-in-up`}
                        key={selected.id}>
                        <Card>
                            <CardHeader>
                                <span style={{ fontSize: 20 }}>
                                    {selected.icon}
                                </span>
                                <CardTitle style={{ color: selected.color }}>
                                    {selected.title}
                                </CardTitle>
                                <button
                                    className={styles.closeBtn}
                                    onClick={() => setActive(null)}>
                                    ✕
                                </button>
                            </CardHeader>
                            <CardBody>
                                {/* Why section */}
                                <div
                                    className={styles.whyBox}
                                    style={{
                                        borderColor: selected.color + "44",
                                        background: selected.color + "08",
                                    }}>
                                    <div
                                        className={styles.whyLabel}
                                        style={{ color: selected.color }}>
                                        WHY this is in the project
                                    </div>
                                    <p className={styles.whyText}>
                                        {selected.why}
                                    </p>
                                </div>

                                {/* Related to */}
                                <div className={styles.section}>
                                    <div className={styles.sectionLabel}>
                                        Related to
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 6,
                                            flexWrap: "wrap",
                                            marginTop: 6,
                                        }}>
                                        {selected.relatedTo.map((r) => (
                                            <span
                                                key={r}
                                                className={styles.tag}
                                                style={{
                                                    color: selected.color,
                                                    borderColor:
                                                        selected.color + "44",
                                                    background:
                                                        selected.color + "12",
                                                }}>
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Concepts to study */}
                                <div className={styles.section}>
                                    <div className={styles.sectionLabel}>
                                        Concepts to study
                                    </div>
                                    <ul className={styles.conceptList}>
                                        {selected.concepts.map((c) => (
                                            <li
                                                key={c}
                                                className={styles.conceptItem}>
                                                <span
                                                    style={{
                                                        color: selected.color,
                                                    }}>
                                                    ▸
                                                </span>{" "}
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Resources */}
                                <div className={styles.section}>
                                    <div className={styles.sectionLabel}>
                                        Resources
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 6,
                                            marginTop: 8,
                                        }}>
                                        {selected.resources.map((r) => (
                                            <a
                                                key={r.url}
                                                href={r.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.resourceLink}
                                                style={{
                                                    "--link-color":
                                                        selected.color,
                                                }}>
                                                <span
                                                    style={{
                                                        color: selected.color,
                                                    }}>
                                                    ↗
                                                </span>
                                                {r.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
