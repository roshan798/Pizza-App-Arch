const ACTORS = [
  { label: 'Client UI',     sub: 'Vercel',     color: '#4f9eff' },
  { label: 'Auth Svc',      sub: ':8001 PG',   color: '#4f9eff' },
  { label: 'Catalog Svc',   sub: ':8002 Mongo', color: '#ff6b2b' },
  { label: 'Order Svc',     sub: ':8003 Mongo', color: '#ffb347' },
  { label: 'Stripe',        sub: 'Payment',    color: '#6772e5' },
  { label: 'Kafka',         sub: 'Event Bus',  color: '#e74c3c' },
  { label: 'WS Svc',        sub: ':8004',      color: '#2ecc71' },
  { label: 'Notif Svc',     sub: ':8005 SMTP', color: '#9b59b6' },
  { label: 'Admin UI',      sub: 'Vercel',     color: '#ffb347' },
]

const GAP = 90
const X0 = 42
const getX = i => X0 + i * GAP

const MSGS = [
  // Auth
  { from: 0, to: 1,  label: 'POST /auth/login',           y: 120, ret: false },
  { from: 1, to: 0,  label: 'JWT + refreshToken cookie',  y: 140, ret: true  },
  // Browse catalog
  { from: 0, to: 2,  label: 'GET /catalog/products',      y: 168, ret: false },
  { from: 2, to: 0,  label: 'products[] (isPublished)',    y: 188, ret: true  },
  // Order + cache validate
  { from: 0, to: 3,  label: 'POST /api/orders (CARD)',     y: 218, ret: false },
  { from: 3, to: 3,  label: 'validate prices vs cache',    y: 238, self: true },
  // Stripe
  { from: 3, to: 4,  label: 'create PaymentIntent',        y: 262, ret: false },
  { from: 4, to: 3,  label: 'paymentIntent + URL',         y: 282, ret: true  },
  { from: 3, to: 0,  label: '200 { stripeUrl, orderId }',  y: 302, ret: true  },
  // Stripe webhook
  { from: 4, to: 3,  label: 'POST /payments/webhook',      y: 332, ret: false },
  { from: 3, to: 3,  label: 'verify sig → PAID',           y: 350, self: true },
  // Kafka publish
  { from: 3, to: 5,  label: 'ORDER_PLACED event',          y: 372, ret: false },
  // WS → Admin
  { from: 5, to: 6,  label: 'consume ORDER_PLACED',         y: 398, ret: false },
  { from: 6, to: 8,  label: 'socket: new-order',            y: 416, ret: false },
  // Notif → Email
  { from: 5, to: 7,  label: 'consume ORDER_PLACED',         y: 440, ret: false },
  { from: 7, to: 7,  label: 'send confirmation email',      y: 458, self: true },
  // Status update
  { from: 8, to: 3,  label: 'PATCH /orders/:id/status',    y: 484, ret: false },
  { from: 3, to: 5,  label: 'ORDER_STATUS_CHANGED',         y: 504, ret: false },
  { from: 5, to: 6,  label: 'consume STATUS_CHANGED',       y: 524, ret: false },
  { from: 6, to: 0,  label: 'socket: order-update → UI',   y: 542, ret: false },
]

export default function SequenceDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${X0 * 2 + GAP * (ACTORS.length - 1) + 20} 580`}
        style={{ minWidth: 820, height: 'auto', maxHeight: 560, display: 'block' }}>
        <defs>
          <marker id="seqArr" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
            <path d="M0,0 L0,5 L7,2.5 z" fill="#535d72" />
          </marker>
        </defs>

        {/* Actor headers */}
        {ACTORS.map((a, i) => (
          <g key={i}>
            <rect x={getX(i) - 40} y={12} width="80" height="34" rx="5"
              fill={a.color + '18'} stroke={a.color + '44'} strokeWidth="1" />
            <text x={getX(i)} y={26} fontSize="8" fill={a.color}
              textAnchor="middle" fontFamily="Space Mono" fontWeight="700">{a.label}</text>
            <text x={getX(i)} y={39} fontSize="7" fill={a.color + '80'}
              textAnchor="middle" fontFamily="Space Mono">{a.sub}</text>
            <line x1={getX(i)} y1={46} x2={getX(i)} y2={580}
              stroke={a.color + '25'} strokeWidth="1" strokeDasharray="4 4" />
          </g>
        ))}

        {/* Messages */}
        {MSGS.map((m, i) => {
          const color = ACTORS[m.from]?.color || '#535d72'
          if (m.self) {
            const x = getX(m.from)
            return (
              <g key={i}>
                <path d={`M${x},${m.y} C${x + 26},${m.y} ${x + 26},${m.y + 14} ${x},${m.y + 14}`}
                  fill="none" stroke={color + '80'} strokeWidth="1.1" markerEnd="url(#seqArr)" />
                <text x={x + 30} y={m.y + 9} fontSize="7.5" fill="#535d72" fontFamily="Space Mono">{m.label}</text>
              </g>
            )
          }
          const x1 = getX(m.from), x2 = getX(m.to)
          return (
            <g key={i}>
              <line x1={x1} y1={m.y} x2={x2} y2={m.y}
                stroke={m.ret ? '#3a4460' : color}
                strokeWidth="1.1"
                strokeDasharray={m.ret ? '4 3' : 'none'}
                markerEnd="url(#seqArr)" />
              <text x={(x1 + x2) / 2} y={m.y - 5} fontSize="7.5"
                fill={m.ret ? '#535d72' : color} textAnchor="middle" fontFamily="Space Mono">
                {m.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
