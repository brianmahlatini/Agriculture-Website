// AI chatbot gives public visitors and signed-in users immediate Agricore platform help.
import { FormEvent, useState } from 'react';
import { Bot, RefreshCw, Send, X } from 'lucide-react';
import { askAgricoreAssistant } from '../api';
import type { AuthUser } from '../types';

type ChatMessage = {
  role: 'assistant' | 'user';
  text: string;
};

type AiChatbotProps = {
  user?: AuthUser | null;
};

const welcome =
  'Hi, I am Agricore Assistant. Ask me anything about this platform, Agricore operations, bookings, dashboards, sustainability, crop forecasts, or general help.';

const quickPrompts = [
  'How do I create or cancel a booking?',
  'What can an admin manage?',
  'Explain Agricore crop forecasts.',
  'Help me plan a farm assessment request.'
];

export function AiChatbot({ user }: AiChatbotProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: welcome }]);

  async function sendMessage(rawMessage: string) {
    const message = rawMessage.trim();
    if (!message) {
      return;
    }

    setMessages((current) => [...current, { role: 'user', text: message }]);
    setBusy(true);

    try {
      const response = await askAgricoreAssistant({
        message,
        context: {
          role: user?.role,
          page: user ? `${user.role} dashboard` : 'public website'
        }
      });
      setMessages((current) => [...current, { role: 'assistant', text: response.answer }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: 'I could not reach the AI assistant right now. Please check the backend configuration and try again.'
        }
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const message = String(form.get('message')).trim();

    if (!message) {
      return;
    }

    formElement.reset();
    void sendMessage(message);
  }

  function resetConversation() {
    setMessages([{ role: 'assistant', text: welcome }]);
  }

  return (
    <div className={open ? 'ai-chatbot open' : 'ai-chatbot'}>
      {open && (
        <section className="ai-chat-window" aria-label="Agricore AI assistant">
          <header>
            <div>
              <strong>Agricore Assistant</strong>
              <span>{user ? `${user.role} support` : 'Enterprise help'}</span>
            </div>
            <div className="ai-chat-actions">
              <button type="button" aria-label="Clear chat" onClick={resetConversation} disabled={busy}>
                <RefreshCw size={17} />
              </button>
              <button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </header>
          <div className="ai-chat-messages">
            {messages.map((item, index) => (
              <p className={`ai-message ${item.role}`} key={`${item.role}-${index}`}>
                {item.text}
              </p>
            ))}
            {busy && <p className="ai-message assistant">Thinking...</p>}
          </div>
          <div className="ai-chat-quick-actions" aria-label="Quick assistant prompts">
            {quickPrompts.map((prompt) => (
              <button type="button" key={prompt} onClick={() => void sendMessage(prompt)} disabled={busy}>
                {prompt}
              </button>
            ))}
          </div>
          <form className="ai-chat-form" onSubmit={handleSubmit}>
            <input name="message" type="text" placeholder="Ask about Agricore..." maxLength={1200} required />
            <button type="submit" aria-label="Send message" disabled={busy}>
              <Send size={17} />
            </button>
          </form>
        </section>
      )}
      <button className="ai-chat-toggle" type="button" onClick={() => setOpen((value) => !value)}>
        <Bot size={20} />
        <span>AI Help</span>
      </button>
    </div>
  );
}
