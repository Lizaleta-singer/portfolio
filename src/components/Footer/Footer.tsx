import './Footer.css'

export default function Footer() {
     const year = new Date().getFullYear()
     return (
             <footer className="footer" role="contentinfo">
                   <div className="container">
                        <div className="footer-content">
                             <p className="footer-copyright">
                                  &copy; {year} Елизавета Сиволобова. Все права защищены.
                              </p>

                               <p className="footer-tagline">
                                   Сделано с &#10084; и любовью к музыке
                               </p>
                           </div>
                       </div>
                    </footer>
                )
}
