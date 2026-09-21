import './Contact.css'

const socialLinks = [
      { name: 'Instagram', icon: '&#128247;', url: '#instagram', color: '#E1306C' },
     { name: 'VK', icon: '&#128161;', url: '#vk', color: '#4C75A3' },
     { name: 'Telegram', icon: '&#9994;', url: '#tg', color: '#0088cc' },
      { name: 'YouTube', icon: '&#9654;', url: '#youtube', color: '#FF0000' },
]

export default function Contact() {
     return (
             <section className="contact-section" id="contact">
                   <div className="container">
                       <h2 className="section-title">Контакты</h2>

                        <p className="contact-intro">
                          Буду рада сотрудничеству и предложениям о выступлениях!
                      </p>

                       {/* CTA Button */}
                         <a href="mailto:alisa@example.com" className="contact-cta">
                           &#9993; Записаться на выступление
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
                                        >
                                             <span dangerouslySetInnerHTML={{ __html: link.icon }} />
                                            <span>{link.name}</span>
                                       </a>
                                    ))}
                                 </div>
                             </div>

                                  {/* Contact info */}
                                  <div className="contact-info">
                                      <div className="contact-info-item">
                                           <span className="contact-info-icon">&#9742;</span>
                                          <span>+7 (999) 123-45-67</span>
                                     </div>
                                     <div className="contact-info-item">
                                          <span className="contact-info-icon">&#9993;</span>
                                         <span>https://vk.ru/id200003545703</span>
                                     </div>
                                 </div>
                            </div>
                        </section>
                    )
                }
