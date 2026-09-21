import { useState, useEffect, useCallback } from 'react'
import './VideoTheatre.css'

interface VideoItem {
    id: number
    url: string
    title: string
    thumb: string
}

const BASE = import.meta.env.BASE_URL

const videos: VideoItem[] = [
    {
        id: 1,
        url: 'https://vkvideo.ru/video-206140174_456240715',
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

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const check = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])
    return isMobile
}

const FALLBACK_SVG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
            <rect width="100%" height="100%" fill="#efe6ff"/>
            <text x="50%" y="50%" font-size="30" fill="#9B5DE5" font-family="sans-serif"
                  text-anchor="middle" dominant-baseline="middle">🎬 Превью недоступно</text>
        </svg>
    `)

export default function VideoTheatre() {
    const [current, setCurrent] = useState(0)
    const total = videos.length
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [videoFrameOpen, setVideoFrameOpen] = useState(false)
    const isMobile = useIsMobile()

    const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
    const goPrev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

    const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return
        const diff = e.changedTouches[0].clientX - touchStart
        if (Math.abs(diff) > 50) diff < 0 ? goNext() : goPrev()
        setTouchStart(null)
    }

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goNext()
            if (e.key === 'ArrowLeft') goPrev()
            if (e.key === 'Escape') setVideoFrameOpen(false)
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [goNext, goPrev])

    const handleThumbError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget
        if (img.dataset.fallback) return
        img.dataset.fallback = '1'
        img.src = FALLBACK_SVG
    }

    const openVideoFrame = () => setVideoFrameOpen(true)
    const closeVideoFrame = () => setVideoFrameOpen(false)

    const modalNext = () => setCurrent((c) => (c + 1) % total)
    const modalPrev = () => setCurrent((c) => (c - 1 + total) % total)

    return (
        <section className="videotheatre-section">
            <div className="container">
                <h2 className="section-title">Видео по актёрской школе</h2>

                <div className="video-carousel" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    <button className="video-nav video-prev" onClick={goPrev} aria-label="Предыдущее видео">{'←'}</button>

                    <div className="video-slides">
                        {videos.map((v, i) => (
                            <div key={v.id} className={`video-slide ${current === i ? 'active' : ''}`}>
                                <div className="video-play-area" onClick={openVideoFrame}>
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
                                    <span className="video-hint">{'🎬'} Нажмите для просмотра видео</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="video-nav video-next" onClick={goNext} aria-label="Следующее видео">{'→'}</button>
                </div>

                <div className="video-dots">
                    {videos.map((_, i) => (
                        <button key={i}
                            className={`video-dot ${current === i ? 'active' : ''}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Видео ${i + 1}`}
                        />
                    ))}
                </div>

                <div className="video-progress-bar">
                    {Array.from({ length: total }, (_, i) => (
                        <div key={i} className={`video-progress-segment ${i <= current ? 'filled' : ''}`} />
                    ))}
                </div>

                <p className="video-hint-text">{'👻'} Листайте нажатием или стрелками</p>
            </div>

            {videoFrameOpen && (
                <div className="video-player-overlay" onClick={closeVideoFrame}>
                    <button
                        className="video-modal-nav video-modal-prev"
                        onClick={(e) => { e.stopPropagation(); modalPrev() }}
                        aria-label="Предыдущее видео"
                    >{'←'}</button>

                    <div className="video-player-content" onClick={(e) => e.stopPropagation()}>
                        <button className="video-player-close" onClick={closeVideoFrame} aria-label="Закрыть">{'×'}</button>

                        {isMobile ? (
                            <>
                                <div className="video-player-preview-wrap">
                                    <img
                                        src={videos[current].thumb}
                                        alt={videos[current].title}
                                        className="video-player-preview"
                                        onError={handleThumbError}
                                    />
                                    <div className="video-player-preview-overlay">
                                        <div className="video-play-icon video-play-icon-large">{'▶'}</div>
                                    </div>
                                </div>

                                <h4 className="video-player-title">{videos[current].title}</h4>

                                <div className="video-player-fallback">
                                    <a
                                        href={videos[current].url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="video-player-link"
                                    >▶ Смотреть в VK</a>
                                    <p className="video-player-note">Откроется в приложении VK или в новой вкладке</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <iframe
                                    src={videos[current].url}
                                    width="100%"
                                    height="450"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                                    allowFullScreen
                                    title={videos[current].title}
                                    className="video-player-iframe"
                                />
                                <h4 className="video-player-title">{videos[current].title}</h4>
                                <div className="video-player-fallback">
                                    <p className="video-player-note">Не отображается видео?</p>
                                    <a
                                        href={videos[current].url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="video-player-link"
                                    >Открыть видео на сайте VK →</a>
                                </div>
                            </>
                        )}

                        <div className="video-modal-counter">
                            {current + 1} / {total}
                            <span className="video-modal-hint"> · Листайте стрелками ← →</span>
                        </div>
                    </div>

                    <button
                        className="video-modal-nav video-modal-next"
                        onClick={(e) => { e.stopPropagation(); modalNext() }}
                        aria-label="Следующее видео"
                    >{'→'}</button>
                </div>
            )}
        </section>
    )
}