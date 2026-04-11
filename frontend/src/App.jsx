import { useChat } from 'ai/react'
import ChatWindow from './components/ChatWindow'
import InputBar from './components/InputBar'
import Header from './components/Header'

export default function App() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    error,
  } = useChat({
    api: '/api/chat',
    // streamProtocol: 'text',
    onError: (err) => {
      console.error('Chat error:', err)
    },
  })

  const handleClear = () => {
    setMessages([])
  }

  return (
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        maxWidth: '100vw',
      }}
    >
      <Header messageCount={messages.length} onClear={handleClear} />

      <ChatWindow messages={messages} isLoading={isLoading} />

      {/* Error banner */}
      {error && (
        <div style={{
          padding: '10px 20px',
          background: 'rgba(220, 53, 69, 0.08)',
          borderTop: '1px solid rgba(220, 53, 69, 0.2)',
          fontSize: '13px',
          color: '#c0392b',
          textAlign: 'center',
        }}>
          ⚠ Connection error — is the backend running on port 8000?
        </div>
      )}

      <InputBar
        input={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onStop={stop}
      />
    </div>
  )
}
