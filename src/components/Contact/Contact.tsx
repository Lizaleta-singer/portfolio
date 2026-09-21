import './Contact.css'

interface SocialLink {
    name: string
    url: string
    color: string
    icon: JSX.Element
}

const socialLinks: SocialLink[] = [
    {
        name: 'VK',
        url: 'https://vk.ru/lizaleta_singer',
        color: '#4C75A3',
        icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974H.861c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.302 2.708z" />
            </svg>
        ),
    },
    {
        name: 'RuTube',
        url: 'https://rutube.ru/channel/76641235',
        color: '#FF0000',
        icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm8.5 4H7v10h2v-3h1.5l2.5 3h2.5l-2.8-3.4c1.4-.3 2.3-1.4 2.3-2.9 0-2-1.5-3.7-3.5-3.7zM10 9h1.5c.9 0 1.5.5 1.5 1.4 0 .9-.6 1.4-1.5 1.4H10V9z" />
            </svg>
        ),
    },
]

// Email и готовая ссылка mailto с темой и телом письма
const EMAIL = 'lizaletta2603@gmail.com'
const EMAIL_SUBJECT = 'Сотрудничество / предложение о выступлении'
const EMAIL_BODY = `Здравствуйте, Елизавета!

Пишу вам по поводу возможного сотрудничества / выступления.

Меня зовут: [Ваше имя]
Контакт для связи: [Ваш телефон или email]

Детали предложения:
[Опишите, что вы хотите предложить — дата, место, формат]

С уважением,
[Ваше имя]`

// mailto: с закодированными subject и body
const MAILTO_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`

export default function Contact() {
    return (
        <section className="contact-section" id="contact">
            <div className="container">
                <h2 className="section-title">Контакты</h2>

                <p className="contact-intro">
                    Буду рада сотрудничеству и предложениям о выступлениях!
                </p>

                {/* CTA Button */}
                <a href={MAILTO_HREF} className="contact-cta">
                    ✉ Связаться со мной
                </a>

                {/* Social links */}
                <div className="contact-socials">
                    <span className="contact-socials-label">Социальные сети:</span>
                    <div className="socials-grid">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                className="social-link"
                                href={link.url}
                                style={{ '--social-color': link.color } as React.CSSProperties}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.name}
                            >
                                <span className="social-link-icon">{link.icon}</span>
                                <span className="social-link-name">{link.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Contact info */}
                <div className="contact-info">
                    <div className="contact-info-item">
                        <span className="contact-info-icon">☎</span>
                        <a href="tel:+79034789987">+7 (903) 4-789-987</a>
                    </div>
                    <div className="contact-info-item">
                        <span className="contact-info-icon">✉</span>
                        <a href={MAILTO_HREF}>{EMAIL}</a>
                    </div>
                </div>
            </div>
        </section>
    )
}