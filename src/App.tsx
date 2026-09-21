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

    // Закрываем меню по Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false)
        }
        if (menuOpen) {
            document.addEventListener('keydown', handleKeyDown)
        }
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [menuOpen])

    // Блокируем скролл body, пока меню открыто
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
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
        </div>
    )
}

export default App