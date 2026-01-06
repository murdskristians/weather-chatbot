import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  messageHistory: string[];
}

const ChatInput = ({
  onSend,
  isLoading,
  placeholder = "Ask about weather in any city...",
  messageHistory,
}: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedInput, setSavedInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
      setHistoryIndex(-1);
      setSavedInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'ArrowUp') {
      if (messageHistory.length === 0) return;

      e.preventDefault();

      if (historyIndex === -1) {
        setSavedInput(input);
      }

      const newIndex = Math.min(historyIndex + 1, messageHistory.length - 1);
      setHistoryIndex(newIndex);
      setInput(messageHistory[messageHistory.length - 1 - newIndex]);
    } else if (e.key === 'ArrowDown') {
      if (historyIndex === -1) return;

      e.preventDefault();

      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);

      if (newIndex === -1) {
        setInput(savedInput);
      } else {
        setInput(messageHistory[messageHistory.length - 1 - newIndex]);
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Refocus input after loading completes
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <div className="chat-input-container">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="chat-send-button"
        >
          {isLoading ? (
            <Loader2 size={20} className="spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
      <div className="chat-input-hint">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
};

export default ChatInput;

