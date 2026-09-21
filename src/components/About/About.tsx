import { useEffect, useRef } from 'react'
import './About.css'

const stats = [
    { value: '8+', label: 'Лет занятий' },
    { value: '100+', label: 'Выступлений' },
    { value: '50+', label: 'Представлений' },
]

export default function About() {
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible')
                    }
                })
            },
            { threshold: 0.2 }
        )

        const el = sectionRef.current
        if (el) {
            observer.observe(el)
            return () => observer.unobserve(el)
        }
    }, [])

    return (
        <section className="about-section" ref={sectionRef}>
            <div className="container">
                <h2 className="section-title">Обо мне</h2>

                <div className="about-layout">
                    {/* Profile photo placeholder */}
                    <div className="about-photo-wrapper">
                        <div className="about-photo">
                            <img
                                src="https://sun9-71.vkuserphoto.ru/s/v1/ig2/VSgJbP00xc2rt1hQY6Avbq3v24KOGiu9hZqUAdiRG6WgoEzzcNB9Lorn1BVixcZ8TIPoTN59fuyYuF04qStSAPok.jpg?quality=95&crop=0,0,2560,2560&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=r38vwj4Cp1dwIf1suD_XvN15D4HD_Y5LYSAWtB0-hFo&cs=2560x0"
                                alt="Елизавета Сиволобова — фото для портфолио"
                                loading="lazy"
                            />
                            <div className="about-photo-decoration"></div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="about-text">
                        <p>
                            Привет! Меня зовут <strong>Елизавета Сиволобова</strong>, и я мечтаю о сцене уже с тех пор,
                            как себя помню. Музыка и театр — это два мира, которые наполняют мою жизнь смыслом и радостью.
                        </p>

                        <p>
                            Я занимаюсь вокалом в студии музыки и вокала "Престиж" с 3 лет и одновременно
                            посещаю актёрскую школу "Я-актер". На сцене я чувствую настоящую свободу —
                            каждый выход это маленькая жизнь, прожитая вместе со зрителями.
                        </p>

                        <p>
                            Мечтаю о большой сцене и уже сейчас выступаю на городских фестивалях,
                            конкурсах вокалистов и театральных постановках. Каждый раз я стараюсь
                            дать больше, чем ожидает зал.
                        </p>

                        {/* Stats row */}
                        <div className="about-stats">
                            {stats.map((stat) => (
                                <div key={stat.label} className="stat-card animate-on-scroll">
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
