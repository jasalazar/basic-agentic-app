import { motion } from 'framer-motion'

export default function AgentTyping() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 px-4 py-3"
    >
      {/* Agent avatar */}
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--accent)', opacity: 0.9 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
            fill="white" fillOpacity="0.9" />
        </svg>
      </div>

      {/* Thinking dots */}
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{ background: 'var(--agent-bg)', border: '1px solid var(--border)' }}>
        <span style={{ fontSize: '11px', color: 'var(--muted)', marginRight: '6px', fontStyle: 'italic' }}>
          thinking
        </span>
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: 'var(--accent)', display: 'block', opacity: 0.6
            }}
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.18,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
