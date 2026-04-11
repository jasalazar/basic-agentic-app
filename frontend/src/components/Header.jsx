import { motion } from 'framer-motion'

export default function Header({ messageCount, onClear }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(245, 240, 232, 0.9)',
        backdropFilter: 'blur(12px)',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <div style={{
          width: '30px', height: '30px', borderRadius: '8px',
          background: 'var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" fill="var(--accent-light)" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3"
              stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"
              stroke="rgba(255,255,255,0.3)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        <div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '16px',
            color: 'var(--ink)',
            lineHeight: 1.2,
            margin: 0,
          }}>
            Agent Chat
          </h1>
          <p style={{
            fontSize: '11px',
            color: 'var(--muted)',
            margin: 0,
            letterSpacing: '0.04em',
          }}>
            Powered by LangChain
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Message count badge */}
        {messageCount > 0 && (
          <span style={{
            fontSize: '11px',
            color: 'var(--muted)',
            background: 'var(--sand-dark)',
            padding: '2px 8px',
            borderRadius: '999px',
            border: '1px solid var(--border)',
          }}>
            {messageCount} {messageCount === 1 ? 'message' : 'messages'}
          </span>
        )}

        {/* Clear button */}
        {messageCount > 0 && (
          <button
            onClick={onClear}
            style={{
              fontSize: '12px',
              color: 'var(--muted)',
              background: 'none',
              border: '1px solid var(--border)',
              padding: '4px 10px',
              borderRadius: '7px',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
              e.target.style.color = 'var(--accent)'
              e.target.style.borderColor = 'var(--accent)'
            }}
            onMouseLeave={e => {
              e.target.style.color = 'var(--muted)'
              e.target.style.borderColor = 'var(--border)'
            }}
          >
            Clear
          </button>
        )}
      </div>
    </motion.header>
  )
}
