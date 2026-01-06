import { Message } from '../types/weather';
import { User, Bot } from 'lucide-react';
import WeatherCard from './WeatherCard';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      
      if (line.startsWith('• ')) {
        return (
          <div key={i} className="message-bullet">
            <span dangerouslySetInnerHTML={{ __html: line.substring(2) }} />
          </div>
        );
      }
      
      if (line === '---') {
        return <hr key={i} className="message-divider" />;
      }
      
      if (line === '') {
        return <br key={i} />;
      }
      
      return (
        <div key={i} dangerouslySetInnerHTML={{ __html: line }} />
      );
    });
  };

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="message-avatar">
        {isUser ? (
          <User size={20} />
        ) : (
          <Bot size={20} />
        )}
      </div>
      <div className="message-content">
        <div className="message-text">
          {formatContent(message.content)}
        </div>
        {message.weatherData && (
          <WeatherCard weather={message.weatherData} />
        )}
        <div className="message-time">
          {message.timestamp.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

