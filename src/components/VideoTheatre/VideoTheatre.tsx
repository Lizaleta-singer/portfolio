import { useState, useEffect, useCallback } from 'react'
import './VideoTheatre.css'

interface VideoItem {
    id: number
    embedUrl: string      // VK embed-ссылка с hash
    externalUrl: string   // обычная ссылка — на случай «открыть в VK»
    title: string
    thumb: string
}

const BASE = import.meta.env.BASE_URL

const videos: VideoItem[] = [
    {
        id: 1,
        embedUrl: 'https://vk.ru/video_ext.php?oid=200003545703&id=456239026&hash=7b74ef99fc09f696',
        externalUrl: 'https://vkvideo.ru/video200003545703_456239026',
        title: 'Актёрская видеовизитка',
        thumb: `${BASE}gallery/actress1.jpg`,
    },
    {
        id: 2,
        embedUrl: 'https://vk.ru/video_ext.php?oid=200003545703&id=456239033&hash=e760b2474169b076',
        externalUrl: 'https://vkvideo.ru/video200003545703_456239033',
        title: 'Я - Актер. "(Не) Шумите! Поэзия шестидесятников" Всероссийский чтецкий конкурс. Городской этап. Лауреат 2 степени',
        thumb: `${BASE}gallery/actress1.jpg`,
    },
    {
        id: 3,
        embedUrl: 'https://vk.ru/video_ext.php?oid=200003545703&id=456239027&hash=3efe73606e265176',
        externalUrl: 'https://vkvideo.ru/video200003545703_456239027',
        title: 'Про/Рок "По барабану"',
        thumb: `${BASE}gallery/actress2.jpg`,
    },
    {
        id: 4,
        embedUrl: 'https://vk.ru/video_ext.php?oid=200003545703&id=456239029&hash=85452d04ecaf261c',
        externalUrl: 'https://vkvideo.ru/video200003545703_456239029',
        title: 'Я актер. Всероссийский конкурс чтецов "Про/Рок" "Смельчак и ветер". Лауреат 3 степени (всероссийский этап)',
        thumb: `${BASE}gallery/actress3.jpg`,
    },
]

export default function VideoTheatre() {
    const [current, setCurrent] = useState(0)
    const total = videos.length
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [videoFrameOpen, setVideoFrameOpen] = useState(false)

    const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
    const goPrev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

    const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return
        const diff = e.changedTouches[0].clientX - touchStart
        if (Math.abs(diff) > 50) {
            diff < 0 ? goNext() : goPrev()
        }
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

    const openVideoFrame = () => setVideoFrameOpen(true)
    const closeVideoFrame = () => setVideoFrameOpen(false)

    const modalNext = () => setCurrent((c) => (c + 1) % total)
    const modalPrev = () => setCurrent((c) => (c - 1 + total) % total)

    return (
        <section className="videotheatre-section">
            <div className="container">
                <h2 className="section-title">Актёрская школа</h2>

                <div className="video-carousel" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    <button className="video-nav video-prev" onClick={goPrev} aria-label="Предыдущее видео">{'←'}</button>

                    <div className="video-slides">
                        {videos.map((v, i) => (
                            <div key={v.id} className={`video-slide ${current === i ? 'active' : ''}`}>
                                <div className="video-play-area" onClick={openVideoFrame}>
                                    {v.thumb && (
                                        <img src={v.thumb} alt={v.title} className="video-slide-preview" loading="lazy" />
                                    )}
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
                        <button
                            key={i}
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

                        <div className="video-player-iframe-wrap">
                            <iframe
                                src={videos[current].embedUrl}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                                title={videos[current].title}
                                className="video-player-iframe"
                            />
                        </div>

                        <h4 className="video-player-title">{videos[current].title}</h4>

                        <div className="video-player-fallback">
                            <a
                                href={videos[current].externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="video-player-link"
                            >
                                ▶ Открыть в VK
                            </a>
                            <p className="video-player-note">
                                На случай, если видео не воспроизводится
                            </p>
                        </div>

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