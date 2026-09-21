import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import PhotoGallery from './components/PhotoGallery/PhotoGallery'
import Video from './components/Video/Video'
import VideoTheatre from './components/VideoTheatre/VideoTheatre'
import Achievements from './components/Achievements/Achievements'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import './App.css'

function App() {
    const [menuOpen, setMenuOpen] = useState(false)

    // Close mobile menu on Escape (глобально — на случай, если фокус вне Header)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMenuOpen(false)
            }
        }
        if (menuOpen) {
            document.addEventListener('keydown', handleKeyDown)
        }
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [menuOpen])

    const navItems = [
        { label: 'Главная', href: '#hero' },
        { label: 'Обо мне', href: '#about' },
        { label: 'Фотогалерея', href: '#photogallery' },
        { label: 'Видео', href: '#video' },
        { label: 'Актёрская школа', href: '#videotheatre' },
        { label: 'Достижения', href: '#achievements' },
        { label: 'Контакты', href: '#contact' },
    ]

    return (
        <div className="app">
            <Header
                items={navItems}
                menuOpen={menuOpen}
                onToggleMenu={() => setMenuOpen((v) => !v)}
            />

            <main>
                <section id="hero" style={{ minHeight: '100vh' }}>
                    <Hero />
                </section>

                <section id="about" style={{ padding: '80px 24px', background: '#fff', minHeight: '60vh' }}>
                    <About />
                </section>

                <section id="photogallery" style={{ padding: '80px 24px', background: '#fff', minHeight: '60vh' }}>
                    <PhotoGallery />
                </section>

                <section id="video" style={{ padding: '80px 24px', background: '#f8f8ff', minHeight: '60vh' }}>
                    <Video />
                </section>

                <section id="videotheatre" style={{ padding: '80px 24px', background: '#fff', minHeight: '60vh' }}>
                    <VideoTheatre />
                </section>

                <section id="achievements" style={{ padding: '80px 24px', background: '#f8f8ff', minHeight: '60vh' }}>
                    <Achievements />
                </section>

                <section id="contact" style={{ padding: '80px 24px', background: '#fff', minHeight: '60vh' }}>
                    <Contact />
                </section>
            </main>

            <Footer />

            {/* Mobile overlay menu (альтернатива выпадающему списку) */}
            {menuOpen && (
                <nav className="nav-overlay">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                className="nav-overlay-link"
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </nav>
            )}
        </div>
    )
}

export default App