import { Calendar, Clock3, Facebook, Instagram, Linkedin, MapPin, Send, Twitter, Youtube } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const scrollToSection = (id: string) => {
        const homePath = "/the-sustainability-excellence-awards-2025";
        const scrollOffset = 100; // Offset in pixels to stop before the section

        if (pathname === "/" || pathname === homePath) {
            const element = document.getElementById(id);
            if (element) {
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = window.pageYOffset + elementPosition - scrollOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                return;
            }
        }

        navigate(`${homePath}#${id}`);
    };
    return <footer className="w-full bg-secondary text-white">
        <div className="px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div className="">
                    <p className="text-base lg:text-subtitle-text-size !font-bold">
                        The Sustainability Excellence Awards 2025
                    </p>
                    <p className="text-base lg:text-subtitle-text-size !font-bold">
                        Powered by Gulf News and BeingShe
                    </p>
                    {/* <p className="text-sm lg:text-form-text-size">tectalk@inovasi2025.com</p> */}
                    
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-5'>
                        <span className='flex items-center gap-2'>
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                            <p className="text-[16px] lg:text-[20px]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>26 November 2025</p>
                        </span>
                        <span className='flex items-center gap-2'>
                            <Clock3 className="w-4 h-4 sm:w-5 sm:h-5" />
                            <p className="text-[16px] lg:text-[20px]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>6:00 PM - 8:30 PM</p>
                        </span>
                        <span className='flex items-center gap-2'>
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                            <p className="text-[16px] lg:text-[20px]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Dubai, UAE</p>
                        </span>
                    </div>
                </div>

                <nav className="flex flex-col !items-start gap-6 md:items-center md:gap-10">
                    <ul className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
                        <li className="hover:underline !text-[var(--white-color)] text-sm " onClick={() => scrollToSection('about-event')}>About Event</li>
                        <li className="hover:underline !text-[var(--white-color)] text-sm " onClick={() => scrollToSection('why')}>Why Attend</li>
                        <li className="hover:underline !text-[var(--white-color)] text-sm " onClick={() => scrollToSection('awards')}>Awards Criteria</li>
                        <li className="hover:underline !text-[var(--white-color)] text-sm " onClick={() => scrollToSection('sponsors')}>Sponsors</li>
                    </ul>
                    <ul className="flex flex-col sm:flex-row !items-start gap-4 sm:gap-8">
                        {/* <li><a href="#terms" className="hover:underline !text-[var(--white-color)] text-sm ">Terms & Conditions</a></li>
                        <li><a href="#privacy" className="hover:underline !text-[var(--white-color)] text-sm ">Privacy Policy</a></li> */}
                    </ul>
                </nav>
            </div>

            <div className="flex flex-col space-y-[var(--space-y)] sm:space-y-0 sm:flex-row-reverse justify-between items-center mt-10 border-t border-whitec/10 pt-6">
            <div className="flex items-center gap-5">
                <a aria-label="Facebook" target="_blank" href="https://www.facebook.com/GulfNews.UAE/" className="opacity-90 hover:opacity-100 !text-[var(--white-color)]"><Facebook className="h-5 w-5 sm:h-6 sm:w-6" /></a>
                <a aria-label="Instagram" target="_blank" href="https://www.instagram.com/gulfnews/" className="opacity-90 hover:opacity-100 !text-[var(--white-color)]"><Instagram className="h-5 w-5 sm:h-6 sm:w-6" /></a>
                <a aria-label="X" target="_blank" href="https://x.com/gulf_news" className="opacity-90 hover:opacity-100 !text-[var(--white-color)]"><Twitter className="h-5 w-5 sm:h-6 sm:w-6" /></a>
                <a aria-label="YouTube" target="_blank" href="https://www.youtube.com/GulfNewsTV" className="opacity-90 hover:opacity-100 !text-[var(--white-color)]"><Youtube className="h-5 w-5 sm:h-6 sm:w-6" /></a>
                <a aria-label="WhatsApp" target="_blank" href="https://www.whatsapp.com/channel/0029Va23xpxEFeXuMgVqck3B" className="opacity-90 hover:opacity-100 !text-[var(--white-color)]">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                </a>
                <a aria-label="Telegram" target="_blank" href="https://t.me/gulfnewsUAE" className="opacity-90 hover:opacity-100 !text-[var(--white-color)]"><Send className="h-5 w-5 sm:h-6 sm:w-6" /></a>
                <a aria-label="LinkedIn" target="_blank" href="https://www.linkedin.com/company/gulf-news/" className="opacity-90 hover:opacity-100 !text-[var(--white-color)]"><Linkedin className="h-5 w-5 sm:h-6 sm:w-6" /></a>
            </div>
            <div>
                {/* <p className="text-xs sm:text-sm text-center md:text-left">© 2025 sustainabilityexcellenceawards. All rights reserved.</p> */}
                <p className="text-[12px] lg:text-[16px] text-center md:text-left">© 2025 Gulf News. All rights reserved.</p>
            </div>
            </div>
        </div>
    </footer>
}
export default Footer;