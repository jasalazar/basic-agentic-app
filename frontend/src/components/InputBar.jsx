import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function InputBar({ input, onChange, onSubmit, isLoading, onStop }) {
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [input])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && input.trim()) onSubmit(e)
    }
  }

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      background: 'rgba(245, 240, 232, 0.95)',
      backdropFilter: 'blur(12px)',
      padding: '16px 20px 20px',
    }}>
      <form onSubmit={onSubmit}>
        <div className="flex items-end gap-3 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything…"
              rows={1}
              style={{
                width: '100%',
                resize: 'none',
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '12px 16px',
                fontSize: '14.5px',
                color: 'var(--ink)',
                outline: 'none',
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.55,
                overflowY: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = '0 0 0 3px rgba(196,98,45,0.1)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)'
                e.target.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '12px',
              fontSize: '10.5px',
              color: 'var(--muted)',
              pointerEvents: 'none',
              letterSpacing: '0.03em',
            }}>
              ↵ send
            </div>
          </div>

          {/* Send / Stop button */}
          <motion.button
            type={isLoading ? 'button' : 'submit'}
            onClick={isLoading ? onStop : undefined}
            whileTap={{ scale: 0.93 }}
            disabled={!isLoading && !input.trim()}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: isLoading ? 'var(--ink-light)' : 'var(--accent)',
              border: 'none',
              cursor: (!isLoading && !input.trim()) ? 'not-allowed' : 'pointer',
              opacity: (!isLoading && !input.trim()) ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.2s, opacity 0.2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            }}
          >
            {isLoading ? (
              /* Stop icon */
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="5" width="14" height="14" rx="2" fill="white" />
              </svg>
            ) : (
              /* Send icon */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </motion.button>
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--muted)',
          marginTop: '10px',
          letterSpacing: '0.02em',
        }}>
          Powered by LangChain · Shift+Enter for new line
        </p>
      </form>
    </div>
  )
}
