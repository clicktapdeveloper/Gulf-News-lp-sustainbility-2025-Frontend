import { useState } from 'react';
import CustomButton from '../../screens/CustomButton';
import { Separator } from '@/components/ui/separator';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const scrollToSection = (id: string) => {
        const homePath = '/the-sustainability-excellence-awards-2025';
        const scrollOffset = 100; // Offset in pixels to stop before the section
        
        if (pathname === '/' || pathname === homePath) {
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
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className='flex flex-col gap-2 py-mobile-padding sm:py-tablet-padding xl:py-desktop-padding'>
            {/* Desktop Layout */}
            <div className='hidden xl:flex items-center justify-between bg-[var(--primary-color)] rounded-full px-6'>
                <div className='flex items-center gap-3 hover:cursor-pointer' onClick={() => {
                    navigate('/the-sustainability-excellence-awards-2025');
                    // Small delay to ensure smooth scroll happens after route change
                    setTimeout(() => {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }, 0);
                }}>
                    <div className="w-16 h-16 xl:w-[150px] xl:h-[80px] overflow-hidden">
                        <img 
                            src="/logo/left.svg" 
                            alt="Gulf News" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <Separator orientation='vertical' className='h-8 xl:h-10 bg-[var(--border-color)]' />
                    <div className="w-16 h-16 xl:w-[100px] xl:h-[80px] overflow-hidden">
                        <img 
                            src="/logo/right.svg" 
                            alt="BeingShe" 
                            className="w-full h-full object-contain" 
                        />
                    </div>
                </div>
                <ul className='hidden xl:flex items-center gap-4 space-x-5 hover:cursor-pointer relative'>
                    <li className='hover:text-[var(--secondary-color)] font-semibold p-2 rounded-full' onClick={() => scrollToSection('about-event')}>About Event</li>
                    <li className='hover:text-[var(--secondary-color)] font-semibold p-2 rounded-full' onClick={() => scrollToSection('why')}>Why Attend</li>
                    <li className='hover:text-[var(--secondary-color)] font-semibold p-2 rounded-full' onClick={() => scrollToSection('awards')}>Awards Categories</li>
                    <li 
                        className='hover:text-[var(--secondary-color)] font-semibold p-2 rounded-full relative'
                        onMouseEnter={() => setIsMoreMenuOpen(true)}
                        onMouseLeave={() => setIsMoreMenuOpen(false)}
                    >
                        More
                        {isMoreMenuOpen && (
                            <ul className='absolute top-full left-0 mt-2 bg-[var(--primary-color)] rounded-lg shadow-lg py-2 min-w-[180px] z-50 border border-[var(--border-color)]'>
                                <li 
                                    className='hover:text-[var(--secondary-color)] font-semibold p-2 rounded-lg hover:bg-black/5 px-4 whitespace-nowrap' 
                                    onClick={() => {
                                        scrollToSection('awards-criteria');
                                        setIsMoreMenuOpen(false);
                                    }}
                                >
                                    Awards Criteria
                                </li>
                                <li 
                                    className='hover:text-[var(--secondary-color)] font-semibold p-2 rounded-lg hover:bg-black/5 px-4 whitespace-nowrap' 
                                    onClick={() => {
                                        scrollToSection('sponsors');
                                        setIsMoreMenuOpen(false);
                                    }}
                                >
                                    Sponsors
                                </li>
                                <li 
                                    className='hover:text-[var(--secondary-color)] font-semibold p-2 rounded-lg hover:bg-black/5 px-4 whitespace-nowrap' 
                                    onClick={() => {
                                        navigate('/terms-and-conditions');
                                        setIsMoreMenuOpen(false);
                                    }}
                                >
                                    Terms & Conditions
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
                <CustomButton 
                className="text-sm xl:text-base"
                onClick={() => navigate('/apply-for-nomination')}
                >Nominate Now</CustomButton>
            </div>

            {/* Mobile Layout */}
            <div className={`xl:hidden bg-[var(--primary-color)] px-4 ${isMobileMenuOpen ? 'rounded-4xl pb-3' : 'rounded-full'}`}>
                {/* Mobile Header */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2' onClick={() => {
                        navigate('/the-sustainability-excellence-awards-2025');
                        // Small delay to ensure smooth scroll happens after route change
                        setTimeout(() => {
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
                        }, 0);
                    }}>
                        <div className="w-32 h-16 overflow-hidden">
                            <img 
                                src="/logo/left.svg" 
                                alt="Gulf News" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <Separator orientation='vertical' className='h-6 bg-[var(--border-color)]' />
                        <div className="w-26 h-16 overflow-hidden">
                            <img 
                                src="/logo/right.svg" 
                                alt="BeingShe" 
                                className="w-full h-full object-contain" 
                            />
                        </div>
                    </div>
                    <button
                        onClick={toggleMobileMenu}
                        className='p-2 rounded-lg hover:bg-black/10 transition-colors !bg-transparent !outline-0'
                        aria-label="Toggle menu"
                    >
                        <svg
                            className={`w-6 h-6 transition-transform duration-200 ${
                                isMobileMenuOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>

            {/* Mobile Menu */}
            <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isMobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className='overflow-hidden'>
                    <div className='border-t border-[var(--border-color)] pt-4'>
                        <ul className='space-y-3 mb-4'>
                            <li className='hover:text-[var(--secondary-color)] font-semibold p-3 rounded-lg hover:bg-black/5 transition-colors cursor-pointer' onClick={() => { scrollToSection('about-event'); setIsMobileMenuOpen(false); }}>
                                About Event
                            </li>
                            <li className='hover:text-[var(--secondary-color)] font-semibold p-3 rounded-lg hover:bg-black/5 transition-colors cursor-pointer' onClick={() => { scrollToSection('why'); setIsMobileMenuOpen(false); }}>
                                Why Attend
                            </li>
                            <li className='hover:text-[var(--secondary-color)] font-semibold p-3 rounded-lg hover:bg-black/5 transition-colors cursor-pointer' onClick={() => { scrollToSection('awards'); setIsMobileMenuOpen(false); }}>
                                Awards Categories
                            </li>
                            <li className='hover:text-[var(--secondary-color)] font-semibold p-3 rounded-lg hover:bg-black/5 transition-colors cursor-pointer' onClick={() => { scrollToSection('awards-criteria'); setIsMobileMenuOpen(false); }}>
                                Awards Criteria
                            </li>
                            <li className='hover:text-[var(--secondary-color)] font-semibold p-3 rounded-lg hover:bg-black/5 transition-colors cursor-pointer' onClick={() => { scrollToSection('sponsors'); setIsMobileMenuOpen(false); }}>
                                Sponsors
                            </li>
                            <li className='hover:text-[var(--secondary-color)] font-semibold p-3 rounded-lg hover:bg-black/5 transition-colors cursor-pointer' onClick={() => { navigate('/terms-and-conditions'); setIsMobileMenuOpen(false); }}>
                                Terms & Conditions
                            </li>
                        </ul>
                        <div className='w-full'>
                            <CustomButton className="w-full text-center"
                            onClick={() => { setIsMobileMenuOpen(false); navigate('/apply-for-nomination'); }}
                            >Nominate Now</CustomButton>
                        </div>
                    </div>
                </div>
            </div>
            </div>

        </nav>
    );
}

export default Navbar;