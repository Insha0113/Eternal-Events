import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Chatbot.css';
import chatbotIcon from '../assets/images/chatboticon.png';

const CHATBOT_PAGES = ['/', '/about', '/services', '/gallery'];

const EVENT_TYPES = [
  { value: 'Wedding', label: 'Wedding' },
  { value: 'Birthday', label: 'Birthday Party' },
  { value: 'Corporate', label: 'Corporate Event' },
  { value: 'Graduation', label: 'Graduation' },
  { value: 'Anniversary', label: 'Anniversary' },
  { value: 'Festival', label: 'Festival' },
  { value: 'Concert', label: 'Concert/Show' },
  { value: 'Launch', label: 'Launch Event' },
  { value: 'Other', label: 'Other' }
];

const SERVICES = [
  'Photography',
  'Catering',
  'Decoration',
  'Sound & Lighting',
  'Venue Booking',
  'Other'
];

const Chatbot = () => {
  const location = useLocation();
  const showChatbot = CHATBOT_PAGES.includes(location.pathname);
  const [isOpen, setIsOpen] = useState(false);       // chat window closed by default
  const [isDimmed, setIsDimmed] = useState(true);   // dull overlay + highlighted bubble on first view
  const [hasDismissedGreeting, setHasDismissedGreeting] = useState(false); // once true, bubble collapses to icon
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      content:
        'You can ask me anything about Eternal Vows Events – our services, ceremonies, decorations, or booking process.',
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const toggleService = (service) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const openChat = () => {
    setHasDismissedGreeting(true);
    setIsDimmed(false);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setStep(1);
    setEventType('');
    setSelectedServices([]);
  };

  const minimizeToButton = () => {
    setIsOpen(false);
    setIsDimmed(false);
    setStep(1);
    setEventType('');
    setSelectedServices([]);
  };

  const dismissDimmed = () => {
    setIsDimmed(false);
    setHasDismissedGreeting(true);
  };

  const goToBooking = () => {
    const eventParam = encodeURIComponent(eventType);
    const servicesParam = encodeURIComponent(selectedServices.join(','));
    closeChat();
    navigate(`/book-event?event=${eventParam}&services=${servicesParam}`);
  };

  const whatsappUrl = 'https://wa.me/919539118207';

  const sendAiMessage = async (event) => {
    event.preventDefault();
    const trimmed = aiInput.trim();
    if (!trimmed || isSending) return;

    const userMessage = { role: 'user', content: trimmed };
    const newMessages = [...aiMessages, userMessage];

    setAiMessages(newMessages);
    setAiInput('');
    setIsSending(true);

    try {
      const contextMessages = [];

      if (eventType) {
        contextMessages.push({
          role: 'user',
          content: `Context: The user has selected the event type "${EVENT_TYPES.find(e => e.value === eventType)?.label || eventType}".`,
        });
      }

      if (selectedServices.length > 0) {
        contextMessages.push({
          role: 'user',
          content: `Context: The user is interested in these services: ${selectedServices.join(', ')}.`,
        });
      }

      const payload = [...contextMessages, ...newMessages].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await axios.post('/api/chat', {
        messages: payload,
      });

      const answer =
        response.data?.answer ||
        "I'm not completely sure about that. Please contact the Eternal Vows Events team directly for exact details.";

      setAiMessages((prev) => [
        ...prev,
        { role: 'assistant', content: answer },
      ]);
    } catch (error) {
      console.error('Chatbot request failed:', error);
      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm having trouble responding right now. Please try again in a moment or contact us via WhatsApp.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // When user clicks anywhere outside the chatbot area while it is closed,
  // collapse the greeting bubble into a small icon-only button.
  useEffect(() => {
    if (!showChatbot) return;

    const handleClickOutside = (event) => {
      if (
        !isOpen &&
        !hasDismissedGreeting &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setHasDismissedGreeting(true);
        setIsDimmed(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChatbot, isOpen, hasDismissedGreeting]);

  if (!showChatbot) return null;

  const greetingText = 'Hi this is Antony from Eternal Vows Events, How can I help you?';

  return (
    <>
      {/* Dull overlay when highlighted bubble is shown (user can click to dismiss) */}
      {isDimmed && !isOpen && (
        <div
          className="chatbot-dull-overlay"
          onClick={dismissDimmed}
          onKeyDown={(e) => e.key === 'Escape' && dismissDimmed()}
          role="button"
          tabIndex={0}
          aria-label="Dismiss to view page normally"
        />
      )}

      <div ref={containerRef}>
        <div className="chatbot-fab-container">
          {/* Chat-style message: mini chatbot avatar + bubble (highlighted on landing) */}
          {!isOpen && (
            hasDismissedGreeting ? (
              <button
                type="button"
                className="chatbot-icon-button"
                onClick={openChat}
                aria-label="Chat with us"
              >
                <div className="chatbot-avatar" aria-hidden="true">
                  <img src={chatbotIcon} alt="Chatbot" className="chatbot-avatar-img" />
                </div>
              </button>
            ) : (
              <div className={`chatbot-message-wrap ${isDimmed ? 'chatbot-message-wrap--highlight' : ''}`}>
                <div className="chatbot-avatar" aria-hidden="true">
                  <img src={chatbotIcon} alt="Chatbot" className="chatbot-avatar-img" />
                </div>
                <button
                  type="button"
                  className={isDimmed ? 'chatbot-bubble chatbot-bubble-highlight' : 'chatbot-bubble chatbot-bubble-mini'}
                  onClick={openChat}
                  aria-label="Chat with us"
                >
                  {greetingText}
                </button>
              </div>
            )
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="chatbot-whatsapp"
            aria-label="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="chatbot-whatsapp-icon" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>

        {/* Small chat window at bottom right (no center modal) */}
        {isOpen && (
          <div
            className="chatbot-panel-wrapper"
            role="dialog"
            aria-labelledby="chatbot-title"
          >
            <div className="chatbot-panel">
              <div className="chatbot-header">
                <h2 id="chatbot-title">Eternal Vows Events</h2>
                <button
                  type="button"
                  className="chatbot-close"
                  onClick={minimizeToButton}
                  aria-label="Minimize chat"
                >
                  ×
                </button>
              </div>

              <div className="chatbot-body">
                {/* Guided conversation always visible */}
                <div className="chatbot-message bot">
                  <p>{greetingText}</p>
                </div>
                <div className="chatbot-message bot">
                  <p>What type of event would you like to book?</p>
                </div>

                {eventType && (
                  <div className="chatbot-message user">
                    <p>{EVENT_TYPES.find(e => e.value === eventType)?.label || eventType}</p>
                  </div>
                )}

                {/* Step 1: show event type options until user selects one */}
                {step === 1 && (
                  <div className="chatbot-options">
                    {EVENT_TYPES.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        className={`chatbot-option ${eventType === value ? 'selected' : ''}`}
                        onClick={() => {
                          setEventType(value);
                          setStep(2);  // automatically show services question
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2: Services – appears after event type is chosen */}
                {step >= 2 && (
                  <>
                    <div className="chatbot-message bot">
                      <p>Select the services you need (you can choose more than one):</p>
                    </div>
                    {selectedServices.length > 0 && (
                      <div className="chatbot-message user">
                        <p>{selectedServices.join(', ')}</p>
                      </div>
                    )}
                    {step === 2 && (
                      <div className="chatbot-options checkbox-grid">
                        {SERVICES.map(service => (
                          <label key={service} className="chatbot-checkbox-option">
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(service)}
                              onChange={() => toggleService(service)}
                            />
                            <span>{service}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Step 3: Summary + link to booking */}
                {step === 3 && (
                  <>
                    <div className="chatbot-message bot">
                      <p>👉 Let me take you to the booking page.</p>
                      <p className="chatbot-summary">
                        Event: <strong>{EVENT_TYPES.find(e => e.value === eventType)?.label || eventType}</strong>
                        {selectedServices.length > 0 && (
                          <> · Services: <strong>{selectedServices.join(', ')}</strong></>
                        )}
                      </p>
                    </div>
                    <div className="chatbot-booking-link">
                      <a
                        href={`/book-event?event=${encodeURIComponent(eventType)}&services=${encodeURIComponent(selectedServices.join(','))}`}
                        onClick={(e) => { e.preventDefault(); goToBooking(); }}
                      >
                        Go to booking page →
                      </a>
                      <p className="chatbot-url-hint">
                        Book event with your choices pre-filled
                      </p>
                    </div>
                  </>
                )}

                {/* Footer actions based on current step */}
                {step >= 2 && (
                  <div className="chatbot-actions">
                    {step > 1 && (
                      <button
                        type="button"
                        className="chatbot-btn-back"
                        onClick={() => setStep(step - 1)}
                      >
                        ← Back
                      </button>
                    )}
                    {step === 2 && (
                      <button
                        type="button"
                        className="chatbot-btn-next"
                        onClick={() => setStep(3)}
                      >
                        Next →
                      </button>
                    )}
                    {step === 3 && (
                      <button
                        type="button"
                        className="chatbot-btn-primary"
                        onClick={goToBooking}
                      >
                        Go to booking page →
                      </button>
                    )}
                  </div>
                )}

                {/* Free-form AI chat, always visible with its own history */}
                <div className="chatbot-divider" />
                <div className="chatbot-ai-section">
                  <div className="chatbot-ai-messages">
                    {aiMessages.map((msg, index) => (
                      <div
                        key={`${msg.role}-${index}`}
                        className={`chatbot-message ${msg.role === 'assistant' ? 'bot' : 'user'}`}
                      >
                        <p>{msg.content}</p>
                      </div>
                    ))}
                  </div>
                  <form className="chatbot-ai-input-row" onSubmit={sendAiMessage}>
                    <input
                      type="text"
                      className="chatbot-ai-input"
                      placeholder="Ask Antony anything about Eternal Vows Events..."
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      disabled={isSending}
                    />
                    <button
                      type="submit"
                      className="chatbot-ai-send"
                      disabled={isSending || !aiInput.trim()}
                    >
                      {isSending ? '...' : 'Send'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;
