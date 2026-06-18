import { useState, useEffect} from "react"
import { sendChatMessage, getHistory } from "../../../services/apiServices"
import { createSignalRConnection, stopConnection } from "../../../services/signalRServices"

export default function ChatAI(){
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [connection, setConnection] = useState(null);

  // Load chat history when page mounts
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const userId = localStorage.getItem("Id"); // stored at login
        if (userId) {
          const history = await getHistory(Id);
          // assuming history is an array of { username, message }
          setChat(history.map(h => `${h.username}: ${h.message}`));
        }
      } catch (err) {
        console.error("History error:", err);
      }
    };
    loadHistory();
  }, []);

  // Setup SignalR connection
  useEffect(() => {
    const conn = createSignalRConnection();
    conn.on("ReceiveMessage", (username, msg) => {
      setChat(prev => [...prev, `${username}: ${msg}`]);
    });

    conn.start()
      .then(() => setConnection(conn))
      .catch(err => console.error("SignalR error:", err));

    return () => {
      stopConnection();
    };
  }, []);

  // Send message via API
  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      await sendChatMessage(message);
      setMessage("");
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Chat Room</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {chat.map((c, i) => (
          <div key={i}>{c}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          style={{ flex: 1 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}