// AI chatbot gives public visitors and signed-in users immediate Agricore platform help.
import { FormEvent, useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
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
  'Hi, I am Agricore Assistant. Ask me about bookings, admin tools, farm operations, crop forecasts, sustainability reporting, or how to use this platform.';

export function AiChatbot({ user }: AiChatbotProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: welcome }]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = String(form.get('message')).trim();

    if (!message) {
      return;
    }

    event.currentTarget.reset();
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

  return (
    <div className={open ? 'ai-chatbot open' : 'ai-chatbot'}>
      {open && (
        <section className="ai-chat-window" aria-label="Agricore AI assistant">
          <header>
            <div>
              <strong>Agricore Assistant</strong>
              <span>{user ? `${user.role} support` : 'Enterprise help'}</span>
            </div>
            <button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </header>
          <div className="ai-chat-messages">
            {messages.map((item, index) => (
              <p className={`ai-message ${item.role}`} key={`${item.role}-${index}`}>
                {item.text}
              </p>
            ))}
            {busy && <p className="ai-message assistant">Thinking...</p>}
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
