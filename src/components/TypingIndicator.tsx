import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="message message-assistant">
      <div className="message-avatar">
        <Bot size={20} />
      </div>
      <div className="message-content">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

