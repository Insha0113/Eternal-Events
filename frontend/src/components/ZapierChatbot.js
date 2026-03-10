import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './ZapierChatbot.css';

const WHATSAPP_URL = 'https://wa.me/919539118207';

const ZapierChatbot = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);

    // Hide on book-event page
    const showWidget = location.pathname !== '/book-event';

    // Inject the Zapier script once
    useEffect(() => {
        const scriptId = 'zapier-interfaces-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.async = true;
            script.type = 'module';
            script.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
            document.head.appendChild(script);
        }
    }, []);

    // Close on Escape key
    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open]);

    // Prevent body scroll when panel is open on mobile
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!showWidget) return null;

    return (
        <>
            {/* ── Backdrop: clicking outside closes the panel ── */}
            {open && (
                <div
                    className="zc-backdrop"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ── Chat panel ── */}
            <div className={`zc-panel${open ? ' zc-panel--open' : ''}`} ref={panelRef}>
                {/* Header bar with title + close button */}
                <div className="zc-panel-header">
                    <div className="zc-panel-title">
                        <span className="zc-panel-title-dot" />
                        <span>Eternal Events Assistant</span>
                    </div>
                    <button
                        className="zc-close-btn"
                        onClick={() => setOpen(false)}
                        aria-label="Close chat"
                        title="Close"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Chatbot embed */}
                <div className="zc-panel-body">
                    <zapier-interfaces-chatbot-embed
                        is-popup="false"
                        chatbot-id="cmmkig993001uo6iqdcql4km9"
                        height="100%"
                        width="100%"
                    />
                </div>
            </div>

            {/* ── WhatsApp floating button ── */}
            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="zc-fab zc-fab--whatsapp"
                aria-label="Chat on WhatsApp"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>

            {/* ── Chat toggle FAB ── */}
            <button
                className={`zc-fab zc-fab--chat${open ? ' zc-fab--active' : ''}`}
                onClick={() => setOpen(prev => !prev)}
                aria-label={open ? 'Close chat' : 'Open chat'}
                title={open ? 'Close chat' : 'Chat with us'}
            >
                {open ? (
                    /* X icon when open */
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    /* Chat bubble icon when closed */
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.836 1.334 5.372 3.438 7.112L4.5 22l4.178-1.98A10.98 10.98 0 0012 20.485c5.523 0 10-4.145 10-9.242C22 6.145 17.523 2 12 2z" />
                    </svg>
                )}
            </button>
        </>
    );
};

export default ZapierChatbot;
