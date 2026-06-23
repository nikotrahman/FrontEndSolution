import { useState, useEffect,useRef } from 'react'
import { sendChatMessage, getHistory } from '../../../services/apiServices'
import { createChatConnection, stopChatConnection } from '../../../services/signalRServices'
import { CCard, CCardHeader, CCardBody, CFormInput, CButton, CRow, CCol } from '@coreui/react'

export default function ChatAI() {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])
  const [connection, setConnection] = useState(null)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom when chat updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chat])

  // Load chat history when page mounts
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const userId = localStorage.getItem('id') // 👈 lowercase 'id'
        if (userId) {
          const history = await getHistory(userId)
          if (Array.isArray(history)) {
            setChat(
              history.map((h) => ({
                sender: h.senderRole === 'user' ? 'You' : 'AI', // or just h.senderRole
                text: h.content,
              })),
            )
          }
        }
      } catch (err) {
        console.error('History error:', err)
      }
    }
    loadHistory()
  }, [])

  // Setup SignalR connection
  useEffect(() => {
    const conn = createChatConnection()

    // Handle incoming messages
    conn.on('ReceiveMessage', (sender, payload) => {
      // If backend sends { senderRole, content }
      if (typeof payload === 'object' && payload.senderRole && payload.content) {
        const displaySender =
          payload.senderRole === 'user' ? 'You' : payload.senderRole === 'assistant' ? 'AI' : sender // fallback

        setChat((prev) => [...prev, { sender: displaySender, text: payload.content }])
      } else {
        // If backend sends plain string
        const text = typeof payload === 'string' ? payload : JSON.stringify(payload)
        const displaySender = sender === localStorage.getItem('id') ? 'You' : sender
        setChat((prev) => [...prev, { sender: displaySender, text }])
      }
    })

    conn
      .start()
      .then(() => setConnection(conn))
      .catch((err) => console.error('SignalR error:', err))

    return () => {
      stopChatConnection()
    }
  }, [])

  // Send message via SignalR or REST fallback
  const handleSend = async () => {
    if (!message.trim()) return
    try {
      if (connection) {
        await connection.invoke('SendMessage', {
          UserId: localStorage.getItem('id'),
          Message: message,
        })
      } else {
        const reply = await sendChatMessage(message)
        setChat((prev) => [
          ...prev,
          { sender: 'You', text: message },
          { sender: 'AI', text: reply },
        ])
      }
      setMessage('')
      if (inputRef.current) inputRef.current.focus() // keep keyboard open on Android
    } catch (err) {
      console.error('Send failed:', err)
    }
  }

  return (
    <CRow className="justify-content-center">
      <CCol md={8} lg={6}>
        <CCard>
          <CCardHeader>
            <h5>Chat Room</h5>
          </CCardHeader>
          <CCardBody>
            <div
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                padding: '10px',
                height: '300px',
                overflowY: 'auto',
                marginBottom: '15px',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {chat.map((c, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: c.sender === 'You' ? 'flex-end' : 'flex-start',
                    backgroundColor: c.sender === 'You' ? '#007bff' : '#e9ecef',
                    color: c.sender === 'You' ? '#fff' : '#000',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    marginBottom: '8px',
                    maxWidth: '70%',
                    wordWrap: 'break-word',
                  }}
                >
                  <strong>{c.sender}:</strong> {c.text}
                </div>
              ))}
              <div ref={chatEndRef} /> {/* invisible marker for auto-scroll */}
            </div>
            <CRow>
              <CCol xs={9}>
                <CFormInput
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type message..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault() // prevent newline
                      handleSend() // send the message
                      setMessage('') // clear the textbox
                    }
                  }}
                />
              </CCol>
              <CCol xs={3}>
                <CButton color="primary" className="w-100" onClick={handleSend}>
                  Send
                </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
