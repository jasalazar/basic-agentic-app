import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const AgentIcon = () => (
  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
    style={{ background: 'var(--accent)' }}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill="white" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"
        stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </div>
)

const UserIcon = () => (
  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
    style={{ background: 'var(--ink-light)' }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill="white" fillOpacity="0.85" />
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="white" strokeOpacity="0.85" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </div>
)

const CodeBlock = ({ children, className }) => {
  const lang = className?.replace('language-', '') || 'text'
  return (
    <SyntaxHighlighter language={lang} style={oneDark}
      customStyle={{ borderRadius: '8px', fontSize: '0.82em', margin: '0.75em 0' }}>
      {String(children).trim()}
    </SyntaxHighlighter>
  )
}

export default function MessageBubble({ message, index }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.03 * Math.min(index, 5) }}
      className={`flex gap-3 px-4 py-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {isUser ? <UserIcon /> : <AgentIcon />}

      <div className={`max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Role label */}
        <span style={{
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          fontWeight: 500,
          marginBottom: '5px',
          paddingLeft: isUser ? '0' : '2px',
          paddingRight: isUser ? '2px' : '0',
        }}>
          {isUser ? 'You' : 'Agent'}
        </span>

        <div
          className={`px-4 py-3 text-sm leading-relaxed ${
            isUser ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'
          }`}
          style={isUser ? {
            background: 'var(--user-bg)',
            color: '#f0ebe3',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          } : {
            background: 'var(--agent-bg)',
            color: 'var(--ink)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          {isUser ? (
            <p style={{ margin: 0, lineHeight: 1.6 }}>{message.content}</p>
          ) : (
            <div className="prose-agent">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return inline
                      ? <code className={className} {...props}>{children}</code>
                      : <CodeBlock className={className}>{children}</CodeBlock>
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
