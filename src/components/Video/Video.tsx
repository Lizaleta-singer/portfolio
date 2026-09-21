import { useState, useEffect, useCallback } from 'react'
import './Video.css'

interface VideoItem {
    id: number
    embedUrl?: string      // если есть — на десктопе открывается плеер в модалке
    externalUrl: string    // ссылка на VK для перехода
    title: string
    thumb: string
}

const BASE = import.meta.env.BASE_URL

const videos: VideoItem[] = [
    {
        id: 1,
        // ✅ есть рабочий hash → на десктопе откроется плеер
        embedUrl: 'https://vk.ru/video_ext.php?oid=200003545703&id=456239024&hash=c78387867f2b0f92',
        externalUrl: 'https://vk.ru/id200003545703?z=video200003545703_456239024%2Fc113a2323ebded1496%2Fpl_wall_200003545703',
        title: 'Выступление в Гимназии №2 Волгограда "Сказочный билет"',
        thumb: `${BASE}gallery/foto3.jpg`,
    },
    {
        id: 2,
        // ❌ без embedUrl → клик откроет VK в новой вкладке
        externalUrl: 'https://vkvideo.ru/video-206140174_456240715',
        title: 'Выступление в Мармеладе',
        thumb: `${BASE}gallery/foto1.jpg`,
    },
    {
        id: 3,
        // ❌ без embedUrl → клик откроет VK в новой вкладке
        externalUrl: 'https://vkvideo.ru/video200003545703_456239025',
        title: 'Выступление в Мармеладе "Сказочный билет"',
        thumb: `${BASE}gallery/foto2.jpg`,
    },
]

/** Хук: true, если ширина экрана ≤ 768px */
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

export default function Video() {
    const [current, setCurrent] = useState(0)
    const total = videos.length
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [videoFrameOpen, setVideoFrameOpen] = useState(false)
    const isMobile = useIsMobile()

    const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
    const goPrev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

    // Touch swipe support для карусели
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

    // Клавиатура: ← / → листают, Esc закрывает модалку
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goNext()
            if (e.key === 'ArrowLeft') goPrev()
            if (e.key === 'Escape') setVideoFrameOpen(false)
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [goNext, goPrev])

    /**
     * Клик по превью:
     *  - если на мобильном ИЛИ нет embedUrl → открываем VK в новой вкладке
     *  - иначе → открываем модалку с встроенным плеером
     */
    const handleVideoClick = (index: number) => {
        setCurrent(index)
        const v = videos[index]
        const canEmbed = !isMobile && !!v.embedUrl

        if (!canEmbed) {
            window.open(v.externalUrl, '_blank', 'noopener,noreferrer')
            return
        }
        setVideoFrameOpen(true)
    }

    const closeVideoFrame = () => setVideoFrameOpen(false)

    // Навигация внутри модалки (переключает видео и меняет iframe)
    const modalNext = () => {
        // Ищем следующее видео, у которого есть embedUrl
        for (let i = 1; i <= total; i++) {
            const idx = (current + i) % total
            if (videos[idx].embedUrl) {
                setCurrent(idx)
                return
            }
        }
        // Если таких нет — просто закрываем
        setVideoFrameOpen(false)
    }

    const modalPrev = () => {
        for (let i = 1; i <= total; i++) {
            const idx = (current - i + total) % total
            if (videos[idx].embedUrl) {
                setCurrent(idx)
                return
            }
        }
        setVideoFrameOpen(false)
    }

    return (
        <section className="video-section">
            <div className="container">
                <h2 className="section-title">Выступления</h2>

                <div
                    className="video-carousel"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <button
                        className="video-nav video-prev"
                        onClick={goPrev}
                        aria-label="Предыдущее видео"
                    >
                        {'←'}
                    </button>

                    <div className="video-slides">
                        {videos.map((v, i) => (
                            <div
                                key={v.id}
                                className={`video-slide ${current === i ? 'active' : ''}`}
                            >
                                <div
                                    className="video-play-area"
                                    onClick={() => handleVideoClick(i)}
                                >
                                    {v.thumb && (
                                        <img
                                            src={v.thumb}
                                            alt={v.title}
                                            className="video-slide-preview"
                                            loading="lazy"
                                        />
                                    )}
                                    <div className="video-play-icon">{'▶'}</div>
                                    <h3 className="video-title">{v.title}</h3>
                                    <span className="video-hint">
                                        {'🎬'} {v.embedUrl && !isMobile
                                            ? 'Нажмите для просмотра'
                                            : 'Нажмите — откроется в VK'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="video-nav video-next"
                        onClick={goNext}
                        aria-label="Следующее видео"
                    >
                        {'→'}
                    </button>
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
                        <div
                            key={i}
                            className={`video-progress-segment ${i <= current ? 'filled' : ''}`}
                        />
                    ))}
                </div>

                <p className="video-hint-text">
                    {'👻'} Листайте нажатием или стрелками
                </p>
            </div>

            {/* Video Modal — открывается только для встраиваемых видео на десктопе */}
            {videoFrameOpen && videos[current].embedUrl && (
                <div
                    className="video-player-overlay"
                    onClick={closeVideoFrame}
                >
                    <button
                        className="video-modal-nav video-modal-prev"
                        onClick={(e) => { e.stopPropagation(); modalPrev() }}
                        aria-label="Предыдущее видео"
                    >
                        {'←'}
                    </button>

                    <div
                        className="video-player-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="video-player-close"
                            onClick={closeVideoFrame}
                            aria-label="Закрыть"
                        >
                            {'×'}
                        </button>

                        <iframe
                            src={videos[current].embedUrl}
                            width="100%"
                            height="450"
                            frameBorder="0"
                            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                            allowFullScreen
                            title={videos[current].title}
                            className="video-player-iframe"
                        />

                        <h4 className="video-player-title">
                            {videos[current].title}
                        </h4>

                        <div className="video-player-fallback">
                            <a
                                href={videos[current].externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="video-player-link"
                            >
                                ▶ Смотреть в VK
                            </a>
                            <p className="video-player-note">
                                Откроется на сайте VK в новой вкладке
                            </p>
                        </div>

                        <div className="video-modal-counter">
                            {current + 1} / {total}
                            <span className="video-modal-hint">
                                {' '}· Листайте стрелками ← →
                            </span>
                        </div>
                    </div>

                    <button
                        className="video-modal-nav video-modal-next"
                        onClick={(e) => { e.stopPropagation(); modalNext() }}
                        aria-label="Следующее видео"
                    >
                        {'→'}
                    </button>
                </div>
            )}
        </section>
    )
}