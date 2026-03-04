import { useState } from 'react'
import { KAFKA_EVENTS, SERVICES } from '@/data/architecture'
import styles from './KafkaEvents.module.css'

const SVC_COLORS = Object.fromEntries(SERVICES.map(s => [s.id, s.color]))

const CONSUMER_ICONS = { order: '📦', ws: '⚡', notif: '📧' }
const PRODUCER_ICONS = { catalog: '🍕', order: '📦' }

export default function KafkaEvents() {
  const [highlight, setHighlight] = useState(null)

  const grouped = KAFKA_EVENTS.reduce((acc, e) => {
    if (!acc[e.topic]) acc[e.topic] = []
    acc[e.topic].push(e)
    return acc
  }, {})

  const topicColors = { catalog: '#ff6b2b', orders: '#ffb347', payments: '#6772e5' }

  return (
    <div className={styles.wrapper}>
      {/* Header row */}
      <div className={styles.legend}>
        <div className={styles.legendItem}><span style={{ background: '#ff6b2b44', border: '1px solid #ff6b2b44' }} className={styles.legendDot} />Producer</div>
        <div className={styles.legendItem}><span style={{ background: '#2ecc7133', border: '1px solid #2ecc7144' }} className={styles.legendDot} />Consumer</div>
        <div className={styles.legendItem}><span style={{ background: '#e74c3c22', border: '1px solid #e74c3c44' }} className={styles.legendDot} />Kafka Topic</div>
      </div>

      {Object.entries(grouped).map(([topic, events]) => (
        <div key={topic} className={styles.topicGroup}>
          <div className={styles.topicHeader} style={{ background: topicColors[topic] + '15', borderColor: topicColors[topic] + '44' }}>
            <span style={{ color: topicColors[topic], fontWeight: 700 }}>topic: {topic}</span>
            <span style={{ color: 'var(--text3)', fontSize: 10 }}>{events.length} events</span>
          </div>
          {events.map((e, i) => (
            <div
              key={i}
              className={`${styles.eventRow} ${highlight === e.event ? styles.eventRowActive : ''}`}
              onMouseEnter={() => setHighlight(e.event)}
              onMouseLeave={() => setHighlight(null)}
            >
              {/* Producer */}
              <div className={styles.producer} style={{ color: SVC_COLORS[e.producer] }}>
                <span>{PRODUCER_ICONS[e.producer]} {e.producer}</span>
              </div>

              {/* Event name */}
              <div className={styles.eventName} style={{ color: topicColors[topic] }}>
                {e.event}
              </div>

              {/* Arrow */}
              <div className={styles.arrow}>→</div>

              {/* Consumers */}
              <div className={styles.consumers}>
                {e.consumers.map(c => (
                  <span key={c} className={styles.consumerBadge} style={{
                    background: SVC_COLORS[c] + '18',
                    color: SVC_COLORS[c],
                    borderColor: SVC_COLORS[c] + '44',
                  }}>
                    {CONSUMER_ICONS[c]} {c}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className={styles.eventDesc}>{e.desc}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
