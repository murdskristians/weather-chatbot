import { Bot, Sparkles } from 'lucide-react';

interface TypingIndicatorProps {
  text?: string;
}

const TypingIndicator = ({ text }: TypingIndicatorProps) => {
  return (
    <div className="message message-assistant">
      <div className="message-avatar">
        <Bot size={20} />
      </div>
      <div className="message-content">
        {text ? (
          <div className="thinking-indicator">
            <Sparkles size={16} className="thinking-icon" />
            <span>{text}</span>
          </div>
        ) : (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingIndicator;

