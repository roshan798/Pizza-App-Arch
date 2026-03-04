import { useState, useEffect, useRef } from 'react'
import { ORDER_FLOW } from "@/data/architecture"
import { Card, CardHeader, CardTitle, CardBody, PingDot } from '@/components/ui'
import styles from './FlowPage.module.css'

export default function FlowPage() {
  const [activeStep, setActiveStep] = useState(-1)
  const [running, setRunning]       = useState(false)
  const timerRef = useRef(null)

  const totalSteps = ORDER_FLOW.length

  const simulate = () => {
    clearTimeout(timerRef.current)
    setActiveStep(-1)
    setRunning(true)

    let i = 0
    const tick = () => {
      setActiveStep(i)
      if (i < totalSteps - 1) {
        i++
        timerRef.current = setTimeout(tick, 950)
      } else {
        setTimeout(() => setRunning(false), 600)
      }
    }
    timerRef.current = setTimeout(tick, 200)
  }

  const reset = () => {
    clearTimeout(timerRef.current)
    setActiveStep(-1)
    setRunning(false)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const progress = activeStep < 0 ? 0 : Math.round(((activeStep + 1) / totalSteps) * 100)

  return (
    <div className={`${styles.page} fade-in-up`}>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Order Lifecycle Simulator</CardTitle>
          <span style={{ fontSize: 10, color: 'var(--text3)', flex: 1 }}>
            Traces a single order across all 5 microservices
          </span>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={simulate}
            disabled={running}
          >
            {running ? '▶ Simulating...' : '▶ Run Simulation'}
          </button>
          {activeStep >= 0 && (
            <button className={`${styles.btn} ${styles.btnGhost}`} onClick={reset}>
              ↺ Reset
            </button>
          )}
        </CardHeader>
        {activeStep >= 0 && (
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        )}
      </Card>

      <div className={styles.grid}>
        {/* Steps */}
        <div className={styles.steps}>
          {ORDER_FLOW.map((s, i) => {
            const done   = activeStep > i
            const active = activeStep === i
            const future = activeStep < i && activeStep >= 0
            return (
              <div
                key={i}
                className={`${styles.step} ${active ? styles.stepActive : ''} ${done ? styles.stepDone : ''} ${future ? styles.stepFuture : ''}`}
                style={{ '--step-color': s.color }}
              >
                <div className={styles.stepNum}
                  style={{
                    background: done ? s.color + '33' : active ? s.color + '22' : 'var(--bg)',
                    color:      done ? s.color : active ? s.color : 'var(--text3)',
                    borderColor: done || active ? s.color + '55' : 'var(--border)',
                  }}
                >
                  {done ? '✓' : i + 1}
                </div>

                <div className={styles.stepBody}>
                  <div className={styles.stepTitle}
                    style={{ color: active ? s.color : done ? 'var(--text)' : 'var(--text3)' }}>
                    {s.title}
                  </div>
                  <div className={styles.stepActor}>{s.actor}</div>
                  <div className={styles.stepDesc}>{s.desc}</div>
                </div>

                {active && (
                  <div style={{ marginLeft: 'auto', flexShrink: 0, alignSelf: 'flex-start', paddingTop: 4 }}>
                    <PingDot color={s.color} size={10} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Sidebar info */}
        <div className={styles.info}>
          <Card style={{ position: 'sticky', top: 0 }}>
            <CardHeader>
              <CardTitle>
                {activeStep >= 0 ? ORDER_FLOW[activeStep]?.title : 'Waiting to start…'}
              </CardTitle>
            </CardHeader>
            <CardBody>
              {activeStep >= 0 ? (
                <>
                  <div className={styles.infoRow}>
                    <span className={styles.infoKey}>Step</span>
                    <span style={{ color: ORDER_FLOW[activeStep].color, fontWeight: 700 }}>
                      {activeStep + 1} / {totalSteps}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoKey}>Actor</span>
                    <span>{ORDER_FLOW[activeStep].actor}</span>
                  </div>
                  <p className={styles.infoDesc}>{ORDER_FLOW[activeStep].desc}</p>

                  {/* Service health mini */}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                      Services involved so far
                    </div>
                    {[...new Set(ORDER_FLOW.slice(0, activeStep + 1).map(s => s.actor))].map(actor => (
                      <div key={actor} className={styles.actorRow}>
                        <span className={styles.actorDot} style={{ background: ORDER_FLOW.find(s => s.actor === actor)?.color || '#2ecc71' }} />
                        <span>{actor}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className={styles.infoDesc} style={{ color: 'var(--text3)' }}>
                  Click "Run Simulation" to animate the full order lifecycle — from browser click through Auth, Catalog, Order, Kafka, WebSocket, and Notification services.
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
