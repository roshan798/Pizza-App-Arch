import { useState } from 'react'
import { K8S_TREE } from '@/data/architecture'
import styles from './K8sTree.module.css'

const KIND_COLOR = {
  Namespace:  '#4f9eff',
  Deployment: '#ff6b2b',
  Service:    '#2ecc71',
  Secret:     '#e74c3c',
  Ingress:    '#ffb347',
  ConfigMap:  '#9b59b6',
}
const KIND_ICON = {
  Namespace:  '⬡',
  Deployment: '⬛',
  Service:    '◎',
  Secret:     '🔑',
  Ingress:    '⬡',
  ConfigMap:  '≡',
}

function TreeNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2)
  const color = KIND_COLOR[node.kind] || '#535d72'
  const hasChildren = node.children?.length > 0

  return (
    <div className={styles.nodeWrap}>
      <div
        className={styles.nodeRow}
        onClick={() => hasChildren && setOpen(o => !o)}
        style={{ paddingLeft: depth * 8, cursor: hasChildren ? 'pointer' : 'default' }}
      >
        <span className={styles.nodeIcon} style={{ color }}>{KIND_ICON[node.kind]}</span>
        <span className={styles.kindPill} style={{ background: color + '20', color, borderColor: color + '44' }}>
          {node.kind}
        </span>
        <span className={styles.nodeName}>{node.name}</span>

        {node.replicas && <span className={styles.nodeMeta}>×{node.replicas} replicas</span>}
        {node.meta?.port && <span className={styles.nodeMeta} style={{ color: '#2ecc71' }}>:{node.meta.port}</span>}
        {node.meta?.type && <span className={styles.nodeMeta}>{node.meta.type}</span>}
        {node.meta?.host && <span className={styles.nodeMeta} style={{ color: '#ffb347' }}>{node.meta.host}</span>}
        {node.meta?.image && <span className={styles.nodeImage}>{node.meta.image}</span>}

        {hasChildren && (
          <span className={styles.toggle}>{open ? '▾' : '▸'}</span>
        )}
      </div>

      {/* Keys (for Secret) */}
      {open && node.keys && (
        <div style={{ paddingLeft: (depth + 1) * 8 + 24 }}>
          {node.keys.map(k => (
            <div key={k} className={styles.keyRow}>
              <span style={{ color: '#e74c3c', fontSize: 12 }}>🔑</span>
              <span>{k}</span>
            </div>
          ))}
        </div>
      )}

      {/* Annotations (for Ingress) */}
      {open && node.annotations && (
        <div style={{ paddingLeft: (depth + 1) * 8 + 24 }}>
          {node.annotations.map(a => (
            <div key={a} className={styles.annotRow}># {a}</div>
          ))}
        </div>
      )}

      {/* Children */}
      {open && hasChildren && (
        <div className={styles.children} style={{ marginLeft: depth * 8 + 20 }}>
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function K8sTree() {
  return (
    <div className={styles.wrapper}>
      <TreeNode node={K8S_TREE} depth={0} />
    </div>
  )
}
