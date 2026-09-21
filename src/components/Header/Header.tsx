import { useState, useEffect, useRef } from 'react'
import './Header.css'

interface NavItem {
    label: string
    href: string
}

interface HeaderProps {
    items: NavItem[]
    menuOpen: boolean
    onToggleMenu: () => void
}

export default function Header({ items, menuOpen, onToggleMenu }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false)
    const headerRef = useRef<HTMLElement>(null)

    // Смена стиля шапки при скролле
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 80)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Закрытие меню: клик вне шапки + Escape
    useEffect(() => {
        if (!menuOpen) return

        const handleClickOutside = (e: MouseEvent) => {
            if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
                onToggleMenu()
            }
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onToggleMenu()
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [menuOpen, onToggleMenu])

    // Блокируем скролл body, пока меню открыто
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [menuOpen])

    return (
        <header ref={headerRef} className={`header ${scrolled ? 'scrolled' : ''}`} role="banner">
            <div className="container header-content">
                <a href="#hero" className="header-logo">
                    <span className="logo-icon">&#9835;</span>
                    <span className="logo-text">Елизавета Сиволобова</span>
                </a>

                <nav
                    className={`header-nav ${menuOpen ? 'open' : ''}`}
                    role="navigation"
                    aria-label="Основная навигация"
                >
                    <button
                        className="header-menu-btn"
                        onClick={onToggleMenu}
                        aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
                        aria-expanded={menuOpen}
                    >
                        <span className={`menu-line menu-line-1 ${menuOpen ? 'rotate-45 translate' : ''}`}></span>
                        <span className={`menu-line menu-line-2 ${menuOpen ? 'fade-out' : ''}`}></span>
                        <span className={`menu-line menu-line-3 ${menuOpen ? 'rotate-minus45 translate' : ''}`}></span>
                    </button>

                    <ul className={`header-menu ${menuOpen ? 'open' : ''}`}>
                        {items.map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    onClick={() => {
                                        // ✅ Закрываем меню при клике по пункту
                                        if (menuOpen) onToggleMenu()
                                    }}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    )
}