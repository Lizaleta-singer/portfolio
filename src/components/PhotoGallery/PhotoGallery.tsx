import { useState, useEffect, useCallback } from 'react'
import './PhotoGallery.css'

type Category = 'music' | 'theatre'

interface PhotoItem {
    id: number
    src: string
    caption: string
    alt: string
    category?: Category
}

// ✅ BASE подставляется Vite: './' при локальной сборке, '/имя-репо/' на GitHub Pages
const BASE = import.meta.env.BASE_URL

const photosRaw: PhotoItem[] = [
    {
        id: 1,
        src: `${BASE}about.jpg`,
        caption: ``,
        alt: 'Мармелад',
        category: 'music',
    },
    {
        id: 2,
        src: `${BASE}gallery/foto3.jpg`,
        caption: '',
        alt: 'мармелад',
        category: 'music',
    },
    {
        id: 3,
        src: `${BASE}gallery/foto1.jpg`,
        caption: '',
        alt: 'Набережная Волгограда',
        category: 'music',
    },
    {
        id: 4,
        src: `${BASE}gallery/actress1.jpg`,
        caption: '',
        alt: 'Hair Boom',
        category: 'theatre',
    },
    {
        id: 5,
        // ⚠️ ЗАМЕНИТЕ на прямую ссылку VK (sun9-*.userapi.com/...jpg)
        // или положите файл в public/gallery/ и укажите '/gallery/theatre1.jpg'
        src: `${BASE}gallery/actress2.jpg`,
        caption: '',
        alt: 'Перед выходом на сцену',
        category: 'theatre',
    },
    {
        id: 6,
        // ⚠️ ЗАМЕНИТЕ на прямую ссылку VK или локальный файл
        src: `${BASE}gallery/actress3.jpg`,
        caption: '',
        alt: 'Школьный спектакль',
        category: 'theatre',
    },
]

/**
 * Автоопределение категории.
 *
 * ⚠️ Порядок проверки ВАЖЕН:
 *   - сначала театр (более специфичные слова),
 *   - потом музыка.
 */
function detectCategory(caption: string): Category {
    const t = caption.toLowerCase()

    const theatreKeywords = [
        'театр', 'спектакл', 'мюзикл', 'актёр', 'актер',
        'грамота', 'репетиц', 'сцен', 'портрет', 'роль',
    ]
    const musicKeywords = [
        'музык', 'вокал', 'песн', 'фестивал',
        'чтец', 'голос', 'мармелад', 'росиночка',
    ]

    if (theatreKeywords.some(k => t.includes(k))) return 'theatre'
    if (musicKeywords.some(k => t.includes(k))) return 'music'
    return 'music' // по умолчанию
}

/** Итоговый массив с гарантированно проставленной category */
const photos: (PhotoItem & { category: Category })[] = photosRaw.map(p => {
    const finalCategory = p.category ?? detectCategory(p.caption)
    return { ...p, category: finalCategory }
})

/** SVG-заглушка на случай, если картинка не загрузилась */
const FALLBACK_SVG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
            <rect width="100%" height="100%" fill="#f0e8ff"/>
            <text x="50%" y="50%" font-size="28" fill="#9B5DE5"
                  font-family="sans-serif"
                  text-anchor="middle" dominant-baseline="middle">
                Фото недоступно
            </text>
        </svg>
    `)

export default function PhotoGallery() {
    const [current, setCurrent] = useState(0)
    const [paused, setPaused] = useState(false)
    const [touchStart, setTouchStart] = useState<number | null>(null)

    const total = photos.length
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [isFullSize, setIsFullSize] = useState(false)

    const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
    const goPrev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

    useEffect(() => {
        if (paused || total <= 1) return
        const timer = setInterval(goNext, 4000)
        return () => clearInterval(timer)
    }, [goNext, paused, total])

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (selectedIndex !== null) {
            if (e.key === 'ArrowRight')
                setSelectedIndex((i) => (i === null ? 0 : (i + 1) % total))
            else if (e.key === 'ArrowLeft')
                setSelectedIndex((i) => (i === null ? 0 : (i - 1 + total) % total))
            else if (e.key === 'Escape') {
                if (isFullSize) setIsFullSize(false)
                else setSelectedIndex(null)
            }
            return
        }
        if (e.key === 'ArrowRight') goNext()
        else if (e.key === 'ArrowLeft') goPrev()
    }, [goNext, goPrev, selectedIndex, total, isFullSize])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

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

    const openPhoto = (index: number) => {
        setSelectedIndex(index)
        setIsFullSize(false)
    }
    const closePhoto = () => {
        setSelectedIndex(null)
        setIsFullSize(false)
    }

    const modalNext = () =>
        setSelectedIndex((i) => (i === null ? 0 : (i + 1) % total))
    const modalPrev = () =>
        setSelectedIndex((i) => (i === null ? 0 : (i - 1 + total) % total))

    const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null

    /** Универсальный обработчик ошибки загрузки картинки */
    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget
        if (img.dataset.fallback) return
        img.dataset.fallback = '1'
        img.src = FALLBACK_SVG
    }

    return (
        <section className="photogallery-section">
            <div className="container">
                <h2 className="section-title">Фотогалерея</h2>

                <div
                    className="photo-carousel"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <button
                        className="photo-nav photo-prev"
                        onClick={goPrev}
                        aria-label="Предыдущее фото"
                    >
                        {'←'}
                    </button>

                    <div className="photo-slides">
                        {photos.map((p, i) => (
                            <div
                                key={p.id}
                                className={`photo-slide ${current === i ? 'active' : ''}`}
                            >
                                <img
                                    src={p.src}
                                    alt={p.alt}
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                    onClick={() => openPhoto(i)}
                                    style={{ cursor: 'pointer' }}
                                    onError={handleImgError}
                                />

                                <span className={`photo-badge ${p.category}`}>
                                    {p.category === 'music' ? '🎵 Музыка' : '🎭 Театр'}
                                </span>

                                <div className="photo-caption">
                                    <div className="photo-caption-text">
                                        {p.caption}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="photo-nav photo-next"
                        onClick={goNext}
                        aria-label="Следующее фото"
                    >
                        {'→'}
                    </button>
                </div>

                <div className="photo-dots">
                    {photos.map((_, i) => (
                        <button
                            key={i}
                            className={`photo-dot ${current === i ? 'active' : ''}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Фото ${i + 1}`}
                        />
                    ))}
                </div>

                <div className="photo-progress-bar">
                    {Array.from({ length: total }, (_, i) => (
                        <div
                            key={i}
                            className={`photo-progress-segment ${i <= current ? 'filled' : ''}`}
                        />
                    ))}
                </div>

                <p className="photo-hint-text">
                    {'📸'} Автоплей каждые 4 сек • Листайте нажатием или стрелками • Клик по фото — открыть
                </p>
            </div>

            {selectedPhoto !== null && selectedIndex !== null && (
                <div
                    className={`photo-modal-overlay ${isFullSize ? 'fullsize' : ''}`}
                    onClick={closePhoto}
                >
                    {!isFullSize && (
                        <>
                            <button
                                className="photo-modal-nav photo-modal-prev"
                                onClick={(e) => { e.stopPropagation(); modalPrev() }}
                                aria-label="Предыдущее фото"
                            >
                                {'←'}
                            </button>

                            <button
                                className="photo-modal-nav photo-modal-next"
                                onClick={(e) => { e.stopPropagation(); modalNext() }}
                                aria-label="Следующее фото"
                            >
                                {'→'}
                            </button>
                        </>
                    )}

                    <div
                        className={`photo-modal-body ${isFullSize ? 'fullsize' : ''}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="photo-modal-close"
                            onClick={closePhoto}
                            aria-label="Закрыть"
                        >
                            {'×'}
                        </button>

                        <img
                            src={selectedPhoto.src}
                            alt={selectedPhoto.alt}
                            className={`photo-modal-img ${isFullSize ? 'fullsize' : ''}`}
                            referrerPolicy="no-referrer"
                            onClick={() => setIsFullSize(v => !v)}
                            onError={handleImgError}
                            title={isFullSize ? 'Свернуть' : 'Открыть в полном размере'}
                        />

                        {!isFullSize && (
                            <div className="photo-modal-info">
                                <span className={`photo-badge ${selectedPhoto.category}`}>
                                    {selectedPhoto.category === 'music' ? '🎵 Музыка' : '🎭 Театр'}
                                </span>

                                <h3 className="photo-modal-title">{selectedPhoto.caption}</h3>

                                <p className="photo-modal-counter">
                                    {selectedIndex + 1} / {total}
                                </p>

                                <p className="photo-modal-hint">
                                    🔍 Клик по фото — открыть в полном размере
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}