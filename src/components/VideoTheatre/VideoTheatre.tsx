import { useState, useEffect, useCallback } from 'react'
import './VideoTheatre.css'

interface VideoItem {
    id: number
    url: string
    title: string
    thumb: string   // ← путь к превью-картинке
}

// ✅ BASE подставляется Vite: './' при локальной сборке, '/имя-репо/' на GitHub Pages
const BASE = import.meta.env.BASE_URL

const videos: VideoItem[] = [
    {
        id: 1,
        url: 'https://vkvideo.ru/video-206140174_456240715?ysclid=mu9avk2d2p635871168',
        title: 'Актёрская визитка "Я-Актёр!"',
        thumb: `${BASE}gallery/actress1.jpg`,
    },
    {
        id: 2,
        url: 'https://vkvideo.ru/video-206140174_456240689',
        title: 'Спектакль - Кто ограбил миссис Рэббит (реж. Е.Апакова)',
        thumb: `${BASE}gallery/actress2.jpg`,
    },
    {
        id: 3,
        url: 'https://vkvideo.ru/video-206140174_456240420',
        title: 'Про Рок "По барабану"',
        thumb: `${BASE}gallery/actress3.jpg`,
    },
]

/** SVG-заглушка, если превью не загрузилось */
const FALLBACK_SVG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
            <rect width="100%" height="100%" fill="#efe6ff"/>
            <text x="50%" y="50%" font-size="30" fill="#9B5DE5"
                  font-family="sans-serif"
                  text-anchor="middle" dominant-baseline="middle">
                🎬 Превью недоступно
            </text>
        </svg>
    `)

export default function VideoTheatre() {
    const [current, setCurrent] = useState(0)
    const total = videos.length
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [videoFrameOpen, setVideoFrameOpen] = useState(false)

    // Navigation — click only (no auto-play)
    const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
    const goPrev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

    // Touch swipe support
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX)
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return
        const diff = e.changedTouches[0].clientX - touchStart
        if (Math.abs(diff) > 50) {
            diff < 0 ? goNext() : goPrev()
        }
        setTouchStart(null)
    }

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goNext()
            if (e.key === 'ArrowLeft') goPrev()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [goNext, goPrev])

    // Open / close video frame
    const openVideoFrame = () => setVideoFrameOpen(true)
    const closeVideoFrame = () => setVideoFrameOpen(false)

    /** Универсальный обработчик ошибки загрузки превью */
    const handleThumbError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget
        if (img.dataset.fallback) return
        img.dataset.fallback = '1'
        img.src = FALLBACK_SVG
    }

    return (
        <section className="videotheatre-section">
            <div className="container">
                <h2 className="section-title">Видео по актёрской школе</h2>

                <div
                    className="video-carousel"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Previous button */}
                    <button
                        className="video-nav video-prev"
                        onClick={goPrev}
                        aria-label="Предыдущее видео"
                    >
                        {'←'}
                    </button>

                    {/* Slides */}
                    <div className="video-slides">
                        {videos.map((v, i) => (
                            <div
                                key={v.id}
                                className={`video-slide ${current === i ? 'active' : ''}`}
                            >
                                <div
                                    className="video-play-area"
                                    onClick={openVideoFrame}
                                >
                                    <img
                                        src={v.thumb}
                                        alt={v.title}
                                        className="video-slide-preview"
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                        onError={handleThumbError}
                                    />
                                    <div className="video-play-icon">{'▶'}</div>
                                    <h3 className="video-title">{v.title}</h3>
                                    <span className="video-hint">
                                        {'🎬'} Нажмите для просмотра видео
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Next button */}
                    <button
                        className="video-nav video-next"
                        onClick={goNext}
                        aria-label="Следующее видео"
                    >
                        {'→'}
                    </button>
                </div>

                {/* Dots indicators */}
                <div className="video-dots">
                    {videos.map((_, i) => (
                        <button
                            key={i}
                            className={`video-dot ${current === i ? 'active' : ''}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Видео ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Progress bar */}
                <div className="video-progress-bar">
                    {Array.from({ length: total }, (_, i) => (
                        <div
                            key={i}
                            className={`video-progress-segment ${i <= current ? 'filled' : ''}`}
                        />
                    ))}
                </div>

                {/* Hint */}
                <p className="video-hint-text">
                    {'👻'} Листайте нажатием или стрелками
                </p>
            </div>

            {/* Video Player Frame Overlay */}
            {videoFrameOpen && (
                <div
                    className="video-player-overlay"
                    onClick={closeVideoFrame}
                >
                    <div
                        className="video-player-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="video-player-close"
                            onClick={closeVideoFrame}
                            aria-label="Закрыть видео"
                        >
                            {'×'}
                        </button>

                        {/* Video iframe */}
                        <iframe
                            src={videos[current].url}
                            width="100%"
                            height="450"
                            frameBorder="0"
                            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                            allowFullScreen
                            title={videos[current].title}
                            className="video-player-iframe"
                        ></iframe>

                        {/* Video title below player */}
                        <h4 className="video-player-title">
                            {videos[current].title}
                        </h4>

                        {/* Fallback link if iframe doesn't work */}
                        <div className="video-player-fallback">
                            <p>Не отображается видео?</p>
                            <a
                                href={videos[current].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="video-player-link"
                            >
                                Открыть видео на сайте VK →
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}