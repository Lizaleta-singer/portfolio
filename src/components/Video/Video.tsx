import { useState, useEffect, useCallback } from 'react'
import './Video.css'

interface VideoItem {
    id: number
    url: string
    title: string
    thumb: string
}

// ✅ BASE подставляется Vite: './' при локальной сборке, '/имя-репо/' на GitHub Pages
const BASE = import.meta.env.BASE_URL

const videos: VideoItem[] = [
       { id: 1, url: 'https://vk.ru/id200003545703?z=video200003545703_456239024%2Fc113a2323ebded1496%2Fpl_wall_200003545703', title: 'Выступление в Гимназии №2 Волгограда "Сказочный билет"', thumb: `${BASE}gallery/foto3.jpg` },
       { id: 2, url: 'https://vkvideo.ru/video-206140174_456240715?ysclid=mu9avk2d2p635871168', title: 'Выступление в Мармеладе', thumb: `${BASE}gallery/foto1.jpg` },
       { id: 3, url: 'https://vkvideo.ru/video200003545703_456239025', title: 'Выступление в Мармеладе "Сказочный билет"', thumb: `${BASE}gallery/foto2.jpg` },
]

export default function Video() {
    const [current, setCurrent] = useState(0)
    const total = videos.length
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [videoFrameOpen, setVideoFrameOpen] = useState(false)

       // Navigation functions — only click/swipe/keyboard triggers
     const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
         const goPrev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

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

         // Open video frame on current page
     const openVideoFrame = () => {
             setVideoFrameOpen(true)
              }

          const closeVideoFrame = () => {
           setVideoFrameOpen(false)
               }

       return (
            <section className="video-section">
                 <div className="container">
                     <h2 className="section-title">Выступления</h2>

                   <div
                       className="video-carousel"
                          onTouchStart={handleTouchStart}
                             onTouchEnd={handleTouchEnd}
                              >
                      {/* Previous button */}
                         <button
                          className="video-nav video-prev"
                             onClick={goPrev}
                                 aria-label="Предыдущее видео"
                                  >
                                    {'←'}
                               </button>

                            {/* Slides */}
                                 <div className="video-slides">
                                          {videos.map((v) => (
                                                 <div key={v.id} className={`video-slide ${current === v.id - 1 ? 'active' : ''}`}>
                                                  <div
                                                     className="video-play-area"
                                                           onClick={openVideoFrame}
                                                                   >
                                                                        {/* Show preview image */}
                                                                           {v.thumb && (
                                                                                  <img src={v.thumb} alt="" className="video-slide-preview" />
                                                                                           )}
                                                                                              <div className="video-play-icon">{'▶'}</div>
                                                                                                    <h3 className="video-title">{v.title}</h3>
                                                                                                        <span className="video-hint">{'🎬'} Нажмите для просмотра видео</span>
                                                                         </div>
                                                                        </div>
                                                                 ))}
                                                                     </div>

                            {/* Next button */}
                                   <button
                                       className="video-nav video-next"
                                           onClick={goNext}
                                                aria-label="Следующее видео"
                                                     >
                                                        {'→'}
                                                       </button>
                                                     </div>

                          {/* Dots indicators */}
                                    <div className="video-dots">
                                          {videos.map((_, i) => (
                                              <button
                                                  key={i}
                                                    className={`video-dot ${current === i ? 'active' : ''}`}
                                                         onClick={() => setCurrent(i)}
                                                              aria-label={`Видео ${i + 1}`}
                                                             />
                                                                ))}
                                                                        </div>

                                    {/* Progress bar */}
                                         <div className="video-progress-bar">
                                              {Array.from({ length: total }, (_, i) => (
                                                      <div key={i} className={`video-progress-segment ${i <= current ? 'filled' : ''}`} />
                                                                ))}
                                                                   </div>

                                   {/* Hint */}
                                            <p className="video-hint-text">{'👻'} Листайте нажатием или стрелками</p>
                                           </div>

                                      {/* Video Player Frame Overlay */}
                                      {videoFrameOpen && (
                                              <div
                                                  className="video-player-overlay"
                                                   onClick={closeVideoFrame}
                                                         >
                                                              <div
                                                                  className="video-player-content"
                                                                     onClick={(e) => e.stopPropagation()}
                                                                             >
                                                                   <button
                                                                    className="video-player-close"
                                                                         onClick={closeVideoFrame}
                                                                            aria-label="Закрыть видео"
                                                                                   >
                                                                                        {'×'}
                                                                                </button>

                                                                                  {/* Video iframe */}
                                                                                    <iframe
                                                                                        src={videos[current].url}
                                                                                             width="100%"
                                                                                                  height="450"
                                                                                                       frameBorder="0"
                                                                                                            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                                                                                                                 allowFullScreen
                                                                                                                      title={videos[current].title}
                                                                                                                           className="video-player-iframe"
                                                                                                                              ></iframe>

                                                                                  {/* Video title below player */}
                                                                                    <h4 className="video-player-title">
                                                                                        {videos[current].title}
                                                                                            </h4>

                                                                               {/* Fallback link if iframe doesn't work */}
                                                                              <div className="video-player-fallback">
                                                                                  <p>Не отображается видео?</p>
                                                                                     <a
                                                                                         href={videos[current].url}
                                                                                             target="_blank"
                                                                                                  rel="noopener noreferrer"
                                                                                                       className="video-player-link"
                                                                                                              >
                                                                                                                  Открыть видео на сайте VK &rarr;
                                                                                                                 </a>
                                                                                                             </div>
                                                                                                         </div>
                                                                                                     </div>
                                                                                                )}
                                                                                        </section>
                                                                                   )
                                                                               }
