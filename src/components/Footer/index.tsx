import { Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
    return <footer className="w-full bg-secondary text-white">
        <div className="px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                    {/* <p className="text-sm"><span className="font-semibold">Event Details:</span> 15 July 2025 | Grand Ballroom, JCC</p> */}
                    <p className="text-sm lg:text-form-text-size"><span className="font-semibold">Event Details:</span> 15 July 2025 | Grand Ballroom, JCC</p>
                    {/* <p className="text-sm">tectalk@inovasi2025.com</p> */}
                    <p className="text-sm lg:text-form-text-size">tectalk@inovasi2025.com</p>
                </div>

                <nav className="flex flex-col !items-start gap-6 md:items-center md:gap-10">
                    <ul className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
                        {/* <li><a href="#about" className="hover:underline !text-[var(--white-color)] text-sm lg:text-form-text-size ">About Event</a></li>
                        <li><a href="#why" className="hover:underline !text-[var(--white-color)] text-sm lg:text-form-text-size ">Why Attend</a></li>
                        <li><a href="#awards" className="hover:underline !text-[var(--white-color)] text-sm lg:text-form-text-size ">Awards Criteria</a></li>
                        <li><a href="#sponsors" className="hover:underline !text-[var(--white-color)] text-sm lg:text-form-text-size ">Sponsors</a></li> */}
                        <li><a href="#about" className="hover:underline !text-[var(--white-color)] text-sm ">About Event</a></li>
                        <li><a href="#why" className="hover:underline !text-[var(--white-color)] text-sm ">Why Attend</a></li>
                        <li><a href="#awards" className="hover:underline !text-[var(--white-color)] text-sm ">Awards Criteria</a></li>
                        <li><a href="#sponsors" className="hover:underline !text-[var(--white-color)] text-sm ">Sponsors</a></li>
                    </ul>
                    <ul className="flex flex-col sm:flex-row !items-start gap-4 sm:gap-8">
                        {/* <li><a href="#terms" className="hover:underline !text-[var(--white-color)] text-sm lg:text-form-text-size ">Terms & Conditions</a></li>
                        <li><a href="#privacy" className="hover:underline !text-[var(--white-color)] text-sm lg:text-form-text-size ">Privacy Policy</a></li> */}
                        <li><a href="#terms" className="hover:underline !text-[var(--white-color)] text-sm ">Terms & Conditions</a></li>
                        <li><a href="#privacy" className="hover:underline !text-[var(--white-color)] text-sm ">Privacy Policy</a></li>
                    </ul>
                </nav>
            </div>

            <div className="flex flex-col space-y-[var(--space-y)] sm:space-y-0 sm:flex-row-reverse justify-between items-center mt-10 border-t border-whitec/10 pt-6">
            <div className="flex items-center gap-5">
                <a aria-label="LinkedIn" href="#linkedin" className="opacity-90 hover:opacity-100 !text-[var(--white-color)]"><Linkedin className="h-5 w-5 sm:h-6 sm:w-6" /></a>
                <a aria-label="X" href="#x" className="opacity-90 hover:opacity-100 !text-[var(--white-color)]"><Twitter className="h-5 w-5 sm:h-6 sm:w-6" /></a>
                <a aria-label="Instagram" href="#instagram" className="opacity-90 hover:opacity-100 !text-[var(--white-color)]"><Instagram className="h-5 w-5 sm:h-6 sm:w-6" /></a>
            </div>
            <div>
                {/* <p className="text-xs sm:text-sm text-center md:text-left">© 2025 sustainabilityexcellenceawards. All rights reserved.</p> */}
                <p className="text-sm lg:text-form-text-size text-center md:text-left">© 2025 sustainabilityexcellenceawards. All rights reserved.</p>
            </div>
            </div>
        </div>
    </footer>
}
export default Footer;