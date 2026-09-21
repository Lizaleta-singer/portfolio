import { useState, useEffect, useCallback } from 'react'
import './Gallery.css'

interface PhotoItem {
    id: number
    src: string
    caption: string
    alt: string
}

/**
 * Фотографии для галереи.
 *
 * 📌 Можно использовать ДВА типа src:
 *
 *   1) Локальный файл из папки public/gallery/:
 *      src: '/gallery/1000051234.jpg'
 *      (файл должен лежать в public/gallery/)
 *
 *   2) Внешняя ссылка на картинку из интернета:
 *      src: 'https://example.com/photo.jpg'
 *      (ссылка должна вести НА САМ ФАЙЛ .jpg/.png/.webp, а не на страницу сайта)
 *
 * 📌 Как добавить новую:
 *   - id делай уникальным (просто увеличивай на 1)
 *   - caption — подпись под фото
 *   - alt — описание для доступности (и если картинка не загрузится)
 */
const photos: PhotoItem[] = [
    // --- локальные файлы из public/gallery/ ---
    {
        id: 1,
        src: '/gallery/foto2.jpg',
        caption: 'Выступление в Мармелад "Росиночка Россия"',
        alt: 'Мармелад',
    },
    {
        id: 2,
        src: '/gallery/foto1.jpg',
        caption: 'Выступление в Мармелад "Росиночка Россия"',
        alt: 'мармелад',
    },
    {
        id: 3,
        src: '/gallery/foto3.jpg',
        caption: 'Выступление на набережной',
        alt: 'Набережная Волгограда',
    },

    // --- внешняя ссылка (пример) ---
    // ВАЖНО: ссылка должна вести на сам файл картинки, а не на страницу сайта.
    // Правильно: 'https://picsum.photos/800/500?random=5'
    // Неправильно: 'https://vk.ru/public221492758' (это страница, а не картинка)
    {
        id: 4,
        src: 'https://vk.ru/public221492758?ysclid=muaaab07d0920017896',
        caption: 'Выступление в Мармелад "Росиночка Россия"',
        alt: 'Мармелад',
    },
    // {
    //     id: 5,
    //     src: 'https://picsum.photos/800/500?random=6',
    //     caption: 'Актёрская школа — экзаменационное представление',
    //     alt: 'Актёрская школа',
    // },

    // 👇 Шаблон для новой строки (раскомментируй и заполни):
    // {
    //     id: 6,
    //     src: '/gallery/1000051244.jpg',       // или 'https://...'
    //     caption: 'Подпись под фото',
    //     alt: 'Описание для доступности',
    // },
]

export default function Gallery() {
    const [current, setCurrent] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [touchStart, setTouchStart] = useState<number | null>(null)

    const total = photos.length

    const goNext = useCallback(
        () => setCurrent((c) => (c + 1) % total),
        [total]
    )
    const goPrev = useCallback(
        () => setCurrent((c) => (c - 1 + total) % total),
        [total]
    )

    // Auto-play
    useEffect(() => {
        if (isPaused || total <= 1) return
        const timer = setInterval(goNext, 4000)
        return () => clearInterval(timer)
    }, [goNext, isPaused, total])

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

    return (
        <section className="gallery-section">
            <div className="container">
                <h2 className="section-title">Фотогалерея</h2>

                <div
                    className="gallery-carousel"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Previous button */}
                    <button
                        className="gallery-nav gallery-prev"
                        onClick={goPrev}
                        aria-label="Предыдущее фото"
                    >
                        {'←'}
                    </button>

                    <div className="gallery-slides">
                        {photos.map((p, i) => (
                            <div
                                key={p.id}
                                className={`gallery-slide ${current === i ? 'active' : ''}`}
                            >
                                <img
                                    src={p.src}
                                    alt={p.alt}
                                    loading="lazy"
                                    // если внешняя ссылка не загрузится — покажем alt-текст
                                    onError={(e) => {
                                        const target = e.currentTarget
                                        target.style.display = 'none'
                                    }}
                                />
                                <div className="gallery-caption">
                                    {p.caption}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Next button */}
                    <button
                        className="gallery-nav gallery-next"
                        onClick={goNext}
                        aria-label="Следующее фото"
                    >
                        {'→'}
                    </button>
                </div>

                {/* Dots indicators */}
                <div className="gallery-dots">
                    {photos.map((_, i) => (
                        <button
                            key={i}
                            className={`gallery-dot ${current === i ? 'active' : ''}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Фото ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Progress bar */}
                <div className="gallery-progress-bar">
                    {Array.from({ length: total }, (_, i) => (
                        <div
                            key={i}
                            className={`gallery-progress-segment ${i <= current ? 'filled' : ''}`}
                        />
                    ))}
                </div>

                {/* Mobile hint */}
                <p className="gallery-hint">
                    {'👾'} Листайте нажатием или свайпом
                </p>
            </div>
        </section>
    )
}