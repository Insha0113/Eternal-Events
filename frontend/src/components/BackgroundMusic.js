import React, { useEffect, useRef, useState } from 'react';
import './BackgroundMusic.css';

// Songs served from the /public folder so the browser loads them as plain URLs
const PLAYLIST = [
    '/audio/weddingsong1.mp3',
    '/audio/weddingsong2.mp3',
];

const BackgroundMusic = () => {
    const audioRef = useRef(null);
    const idxRef = useRef(0);

    const [isMuted, setIsMuted] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [blocked, setBlocked] = useState(false);

    // ── Build the Audio object once, on mount ──────────────────────────────
    useEffect(() => {
        const audio = new Audio(PLAYLIST[0]);
        audio.volume = 0.35;
        // Start muted — browsers ALWAYS allow muted autoplay
        audio.muted = true;
        audioRef.current = audio;

        const tryPlay = (startIdx) => {
            let attempts = 0;
            const tryNextSong = () => {
                if (attempts >= PLAYLIST.length) return;
                idxRef.current = (startIdx + attempts) % PLAYLIST.length;
                audio.src = PLAYLIST[idxRef.current];
                audio.load();
                audio.play().catch(() => {
                    attempts++;
                    tryNextSong();
                });
            };
            tryNextSong();
        };

        const onEnded = () => {
            const nextIdx = (idxRef.current + 1) % PLAYLIST.length;
            tryPlay(nextIdx);
        };
        audio.addEventListener('ended', onEnded);

        // Play muted first (always succeeds), then unmute after a tiny delay
        audio.play()
            .then(() => {
                setPlaying(true);
                setBlocked(false);
                // Auto-unmute after 300 ms — invisible to the user, sounds like autoplay
                setTimeout(() => {
                    if (audioRef.current) {
                        audioRef.current.muted = false;
                        setIsMuted(false);
                    }
                }, 300);
            })
            .catch(() => {
                // Extremely rare — even muted play blocked; fall back to click-to-play
                setBlocked(true);
            });

        return () => {
            audio.removeEventListener('ended', onEnded);
            audio.pause();
            audioRef.current = null;
        };
    }, []);

    // ── If even muted autoplay was blocked, start on first user interaction ─
    useEffect(() => {
        if (!blocked) return;
        const start = () => {
            const audio = audioRef.current;
            if (!audio) return;
            audio.muted = false;
            audio.play()
                .then(() => { setPlaying(true); setBlocked(false); setIsMuted(false); })
                .catch(() => { });
        };
        const EVENTS = ['click', 'keydown', 'touchstart', 'scroll'];
        EVENTS.forEach(ev => window.addEventListener(ev, start, { once: true }));
        return () => EVENTS.forEach(ev => window.removeEventListener(ev, start));
    }, [blocked]);

    // ── Mute / unmute toggle ─────────────────────────────────────────────────
    const handleClick = (e) => {
        e.stopPropagation();
        const audio = audioRef.current;
        if (!audio) return;

        if (blocked) {
            audio.muted = false;
            audio.play()
                .then(() => { setPlaying(true); setBlocked(false); setIsMuted(false); })
                .catch(() => { });
            return;
        }

        const next = !isMuted;
        audio.muted = next;
        setIsMuted(next);
    };

    // ── UI ───────────────────────────────────────────────────────────────────
    const showPlay = blocked || !playing;

    return (
        <>
            <button
                className={`music-toggle-btn${showPlay ? ' music-needs-play' : ''}`}
                onClick={handleClick}
                aria-label={showPlay ? 'Play music' : isMuted ? 'Unmute music' : 'Mute music'}
                title={showPlay ? 'Click to play music' : isMuted ? 'Unmute' : 'Mute'}
            >
                <span className="music-icon">
                    {showPlay ? '🎵' : isMuted ? '🔇' : '🎶'}
                </span>
                {showPlay && <span className="music-label">Play Music</span>}
            </button>
        </>
    );
};

export default BackgroundMusic;
