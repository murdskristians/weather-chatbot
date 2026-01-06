import { useRef, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import { CloudSun, Trash2 } from 'lucide-react';
import './App.css';

const App = () => {
  const { messages, isLoading, sendMessage, clearChat, userMessageHistory } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <CloudSun size={28} />
          <h1>Weather AI</h1>
        </div>
        <button onClick={clearChat} className="clear-button" title="Clear chat">
          <Trash2 size={18} />
        </button>
      </header>

      <main className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="chat-footer">
        <ChatInput onSend={sendMessage} isLoading={isLoading} messageHistory={userMessageHistory} />
      </footer>
    </div>
  );
};

export default App;
