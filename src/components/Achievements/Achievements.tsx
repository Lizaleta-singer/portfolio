import { useState, useEffect, useCallback } from 'react'
import './Achievements.css'

interface DiplomaItem {
    id: number
    src: string
    title: string
    category: 'music' | 'theatre'
}

// ✅ BASE подставляется Vite: './' при локальной сборке, '/имя-репо/' на GitHub Pages
const BASE = import.meta.env.BASE_URL

const diplomas: DiplomaItem[] = [
    { id: 1, src: `${BASE}diplom/1000051220.jpg`, title: 'Диплом ГРАН-ПРИ "Top Music"', category: 'music' },
    { id: 2, src: `${BASE}diplom/1000051222.jpg`, title: 'Диплом конкурса студийных записей "Салют, Артист!"', category: 'music' },
    { id: 3, src: `${BASE}diplom/1000051234.jpg`, title: 'Всероссийский этап чтецкого конкурса "Про рок"', category: 'theatre' },
    { id: 4, src: `${BASE}diplom/1000051224.jpg`, title: 'Диплом Лауреата I степени "Top Music"', category: 'music' },
    { id: 5, src: `${BASE}diplom/1000051236.jpg`, title: 'Городской этап чтецкого конкурса "Про рок"', category: 'theatre' },
    { id: 6, src: `${BASE}diplom/1000051226.jpg`, title: 'Диплом фестиваль-кастинг "Наследники традиций"', category: 'music' },
    { id: 7, src: `${BASE}diplom/1000051238.jpg`, title: 'Городской этап чтецкого конкурса "Про рок"', category: 'theatre' },
    { id: 8, src: `${BASE}diplom/1000051228.jpg`, title: 'Диплом Лауреата I степени "Lime Fest"', category: 'music' },
    { id: 9, src: `${BASE}diplom/1000051232.jpg`, title: 'Всероссийский этап чтецкого конкурса "(Не) шумите! поэзия шестидесятников"', category: 'theatre' },
    { id: 10, src: `${BASE}diplom/1000051240.jpg`, title: 'Всероссийский этап чтецкого конкурса "Объединение реального искусства"', category: 'theatre' },
    { id: 11, src: `${BASE}diplom/1000051242.jpg`, title: 'Диплом Лауреата I степени "Музыкальный десерт"', category: 'theatre' },
]

/** SVG-заглушка, если диплом не загрузился */
const FALLBACK_SVG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
            <rect width="100%" height="100%" fill="#f3ecff"/>
            <text x="50%" y="50%" font-size="28" fill="#9B5DE5"
                  font-family="sans-serif"
                  text-anchor="middle" dominant-baseline="middle">
                🏆 Изображение недоступно
            </text>
        </svg>
    `)

export default function Achievements() {
    const [current, setCurrent] = useState(0)
    const total = diplomas.length
    const [touchStart, setTouchStart] = useState<number | null>(null)

    // ✅ Автоплей: пауза при наведении и при открытой модалке
    const [paused, setPaused] = useState(false)

    // ✅ храним ИНДЕКС открытого диплома, а не объект
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    // Navigation — click only (no auto-play)
    const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
    const goPrev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

    // ✅ Автоплей каждые 4 секунды
    //    не работает, если:
    //      - наведение мыши на карусель (paused)
    //      - открыта модалка (selectedIndex !== null)
    //      - всего 1 слайд и меньше
    useEffect(() => {
        if (paused || selectedIndex !== null || total <= 1) return
        const timer = setInterval(goNext, 4000)
        return () => clearInterval(timer)
    }, [goNext, paused, selectedIndex, total])

    // Keyboard navigation (модалка имеет приоритет, если открыта)
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (selectedIndex !== null) {
            if (e.key === 'ArrowRight') setSelectedIndex((i) => (i === null ? 0 : (i + 1) % total))
            else if (e.key === 'ArrowLeft') setSelectedIndex((i) => (i === null ? 0 : (i - 1 + total) % total))
            else if (e.key === 'Escape') setSelectedIndex(null)
            return
        }
        if (e.key === 'ArrowRight') goNext()
        else if (e.key === 'ArrowLeft') goPrev()
    }, [goNext, goPrev, selectedIndex, total])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

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

    // ✅ открываем по индексу того слайда, по которому кликнули
    const openDiploma = (index: number) => setSelectedIndex(index)
    const closeDiploma = () => setSelectedIndex(null)

    // Навигация внутри модалки
    const modalNext = () =>
        setSelectedIndex((i) => (i === null ? 0 : (i + 1) % total))
    const modalPrev = () =>
        setSelectedIndex((i) => (i === null ? 0 : (i - 1 + total) % total))

    // IntersectionObserver for fade-in animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible')
                    }
                })
            },
            { threshold: 0.15 }
        )

        const el = document.querySelector('.diploma-frame')
        if (el) {
            observer.observe(el)
            return () => observer.unobserve(el)
        }
    }, [])

    /** Обработчик ошибки загрузки картинки */
    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget
        if (img.dataset.fallback) return
        img.dataset.fallback = '1'
        img.src = FALLBACK_SVG
    }

    const selectedDiploma = selectedIndex !== null ? diplomas[selectedIndex] : null

    return (
        <section className="achievements-section">
            <div className="container">
                <h2 className="section-title">Достижения</h2>

                <div
                    className="diploma-carousel"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    {/* Previous button */}
                    <button
                        className="diploma-nav diploma-prev"
                        onClick={goPrev}
                        aria-label="Предыдущий диплом"
                    >
                        {'←'}
                    </button>

                    {/* Slides */}
                    <div className="diploma-slides">
                        {diplomas.map((d, i) => (
                            <div
                                key={d.id}
                                className={`diploma-slide ${current === i ? 'active' : ''}`}
                            >
                                <img
                                    src={d.src}
                                    alt={d.title}
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                    onClick={() => openDiploma(i)}
                                    onError={handleImgError}
                                    style={{ cursor: 'pointer' }}
                                />
                                <div className="diploma-info">
                                    <span className={`diploma-badge ${d.category}`}>
                                        {d.category === 'music' ? '🎵 Музыка' : '🎭 Театр'}
                                    </span>
                                    <h3 className="diploma-title">{d.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Next button */}
                    <button
                        className="diploma-nav diploma-next"
                        onClick={goNext}
                        aria-label="Следующий диплом"
                    >
                        {'→'}
                    </button>
                </div>

                {/* Dots indicators */}
                <div className="diploma-dots">
                    {diplomas.map((_, i) => (
                        <button
                            key={i}
                            className={`diploma-dot ${current === i ? 'active' : ''}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Диплом ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Progress bar */}
                <div className="diploma-progress-bar">
                    {Array.from({ length: total }, (_, i) => (
                        <div
                            key={i}
                            className={`diploma-progress-segment ${i <= current ? 'filled' : ''}`}
                        />
                    ))}
                </div>

                {/* Hint */}
                <p className="diploma-hint-text">
                    {'🏆'} Автоплей каждые 4 сек • Листайте нажатием или стрелками
                </p>
            </div>

            {/* Diploma Modal - Full size gallery with arrows */}
            {selectedDiploma !== null && selectedIndex !== null && (
                <div className="diploma-modal-overlay" onClick={closeDiploma}>
                    <button
                        className="diploma-modal-nav diploma-modal-prev"
                        onClick={(e) => { e.stopPropagation(); modalPrev() }}
                        aria-label="Предыдущий диплом"
                    >
                        {'←'}
                    </button>

                    <button
                        className="diploma-modal-nav diploma-modal-next"
                        onClick={(e) => { e.stopPropagation(); modalNext() }}
                        aria-label="Следующий диплом"
                    >
                        {'→'}
                    </button>

                    <div className="diploma-modal-body" onClick={e => e.stopPropagation()}>
                        <button className="diploma-modal-close" onClick={closeDiploma}>{'×'}</button>

                        <img
                            src={selectedDiploma.src}
                            alt={selectedDiploma.title}
                            className="diploma-modal-img"
                            referrerPolicy="no-referrer"
                            onError={handleImgError}
                        />

                        <div className="diploma-modal-info">
                            <span className={`diploma-badge ${selectedDiploma.category}`}>
                                {selectedDiploma.category === 'music' ? '🎵 Музыка' : '🎭 Театр'}
                            </span>
                            <h3 className="diploma-modal-title">{selectedDiploma.title}</h3>

                            <p className="diploma-modal-counter">
                                {selectedIndex + 1} / {total}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}