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

    // ✅ Порядок разделов совпадает с порядком секций ниже
    const navItems = [
        { label: 'Главная', href: '#hero' },
        { label: 'Обо мне', href: '#about' },
        { label: 'Концертные видео', href: '#video' },
        { label: 'Актёрская школа', href: '#videotheatre' },
        { label: 'Фотогалерея', href: '#photogallery' },
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
                <section id="hero">
                    <Hero />
                </section>

                <section id="about">
                    <About />
                </section>

                <section id="video">
                    <Video />
                </section>

                <section id="videotheatre">
                    <VideoTheatre />
                </section>

                <section id="photogallery">
                    <PhotoGallery />
                </section>

                <section id="achievements">
                    <Achievements />
                </section>

                <section id="contact">
                    <Contact />
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default App