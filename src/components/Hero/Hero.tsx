import { useEffect, useState } from 'react'
import './Hero.css'

const name = 'Елизавета Сиволобова'

// ✅ BASE подставляется Vite: './' при локальной сборке, '/имя-репо/' на GitHub Pages
const BASE = import.meta.env.BASE_URL

export default function Hero() {
    const [revealed, setRevealed] = useState(0)

             // Letter reveal animation
        useEffect(() => {
            let index = 0
            const timer = setInterval(() => {
                index++
             setRevealed(index)
             if (index >= name.length) clearInterval(timer)
                         }, 120)
               return () => clearInterval(timer)
                    }, [])

             // Particles data
        const particles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
             left: Math.random() * 60 + 15,
              delay: (Math.random() * 5).toFixed(2),
                  duration: (3 + Math.random() * 4).toFixed(2),
                     size: (8 + Math.random() * 16).toFixed(0),
                      }))

       return (
              <section className="hero">
                   {/* Photo - full screen background */}
                    <img src={`${BASE}about.jpg`} alt="Елизавета Сиволобова" className="hero-photo-wrapper" />

                     {/* Gradient overlay - smooth fade from photo into dark content area */}
                      <div className="hero-gradient"></div>

                          {/* Floating particles */}
                           <div className="hero-particles">
                                   {particles.map((p) => (
                                         <span
                                            key={p.id}
                                                 className="particle"
                                                      style={{
                                                              left: `${p.left}%`,
                                                                   animationDelay: `${p.delay}s`,
                                                                        animationDuration: `${p.duration}s`,
                                                                             fontSize: `${p.size}px`,
                                                                                          }}>{'✨'}</span>
                                                                                                       ))}
                                                                                    </div>

                                               {/* Text content - centered over gradient area */}
                                                <div className="hero-content">
                                                        <h1 className="hero-name">
                                                            {name.split('').map((char, i) => (
                                                                <span
                                                                   key={i}
                                                                        style={{
                                                                            opacity: revealed > i ? 1 : 0,
                                                                                transform: revealed > i ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
                                                                                    transition: 'all 0.3s ease',
                                                                                         marginRight: char === ' ' ? '' : '-0.05em',
                                                                                            }}>
                                                                                               {char === ' ' ? ' ' : char}
                                                                                                 </span>
                                                                                                     ))}
                                                                                                      </h1>

                                                        <p className="hero-subtitle">
                                                           Вокал &bull; Актёрская школа &bull; Выступления
                                                                  </p>

                                                               <p className="hero-description">
                                                                    Юная певица и актриса. Весёлая, открытая и очень общительная девочка.
                                                                    Умеет заряжать всех вокруг хорошим настроением — после её выступлений улыбаются даже самые серьёзные зрители.
                                                                              </p>

                                                                          <a href="#about" className="hero-cta hero-cta-primary">
                                                                           Узнать больше
                                                                                      </a>

                                                                                <a href="#video" className="hero-cta hero-cta-secondary">
                                                                                   Выступления &#10132;
                                                                                             </a>
                                                                          </div>

                                                                  {/* Scroll indicator */}
                                                                   <div className="hero-scroll">
                                                                       <span>Листайте вниз</span>
                                                                                <div className="scroll-arrow">&#8595;</div>
                                                                                    </div>
                                                                                  </section>
                                                                              )
                                                                            }
