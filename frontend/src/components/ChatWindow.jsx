import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import MessageBubble from './MessageBubble'
import AgentTyping from './AgentTyping'

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full gap-6 px-8"
    style={{ paddingBottom: '60px' }}>
    {/* Decorative mark */}
    <div style={{
      width: '52px', height: '52px', borderRadius: '50%',
      background: 'white',
      border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" fill="var(--accent)" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"
          stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>

    <div className="text-center" style={{ maxWidth: '320px' }}>
      <h2 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: '22px',
        color: 'var(--ink)',
        marginBottom: '10px',
        lineHeight: 1.3,
      }}>
        What would you like to explore?
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.65 }}>
        Ask a question and an AI agent will engage with you until you have full clarity.
      </p>
    </div>

    {/* Suggested prompts */}
    <div className="flex flex-col gap-2 w-full" style={{ maxWidth: '380px' }}>
      {[
        'How does retrieval-augmented generation work?',
        'Explain the difference between agents and chains in LangChain',
        'What are the best practices for prompt engineering?',
      ].map((prompt, i) => (
        <div key={i} style={{
          padding: '10px 14px',
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          fontSize: '13px',
          color: 'var(--ink-light)',
          cursor: 'default',
          lineHeight: 1.5,
        }}>
          {prompt}
        </div>
      ))}
    </div>
  </div>
)

export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto" style={{ paddingTop: '16px', paddingBottom: '8px' }}>
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="max-w-3xl mx-auto">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <MessageBubble key={m.id} message={m} index={i} />
            ))}
            {isLoading && <AgentTyping key="typing" />}
          </AnimatePresence>
          <div ref={bottomRef} style={{ height: '8px' }} />
        </div>
      )}
    </div>
  )
}
