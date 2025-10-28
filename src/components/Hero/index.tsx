import CustomButton from "@/screens/CustomButton";
import { Calendar, Clock3, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();
    return <div className="relative flex flex-col lg:flex-row h-[680px] sm:h-[600px] overflow-hidden">
        <div className="py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:pl-standard-desktop-padding 2xl:px-standard-xl-padding z-10 !backdrop-blur-none lg:!backdrop-blur-xs 2xl:backdrop-blur-none !bg-[#EBF1E7]/40 xl:!bg-transparent space-y-[var(--space-y)]">
            <h1 className='text-[34px] sm:text-[55px] lg:text-[50px] font-[600] leading-tight'>
                <div className='text-[var(--secondary-color)] w-full whitespace-nowrap'>The Sustainability</div>
                <div className='text-[var(--secondary-color)] w-full whitespace-nowrap'>Excellence Awards 2025</div>
                <div className='text-[25px] mt-4 font-semibold text-[var(--tertiary-color)] w-full'>Celebrating Leaders, Inspiring Change</div>
            </h1>
                <p className='text-[14px] md:text-[16px] lg:text-[18px] max-w-lg !font-[650]' style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Join the UAE's most impactful sustainability recognition event — honoring organizations and individuals driving environmental and social transformation.
                </p>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4'>
                    <span className='flex items-center gap-2'>
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-[16px] lg:text-[20px] !font-[650]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>26 November 2025</p>
                    </span>
                    <span className='flex items-center gap-2'>
                        <Clock3 className="w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-[16px] lg:text-[20px] !font-[650]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>6:00 PM - 8:30 PM</p>
                    </span>
                    <span className='flex items-center gap-2'>
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-[16px] lg:text-[20px] !font-[650]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Dubai, UAE</p>
                    </span>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 !justify-start gap-3 sm:gap-4 w-full xl:w-2/3 pt-5'>
                    <CustomButton variant="outline" 
                    onClick={() => navigate('/apply-for-nomination')} 
                    className="w-full sm:w-auto">Nominate Now</CustomButton>
                    <CustomButton variant="outline" 
                    onClick={() => navigate('/inquire-about-sponsorship')} 
                    className="w-full sm:w-auto whitespace-nowrap">Become a Sponsor</CustomButton>
                    <CustomButton 
                    onClick={() => navigate('/register-for-attend')} 
                    className="w-full sm:w-auto whitespace-nowrap">Register to Attend</CustomButton>
                    {/* <span className='flex flex-col justify-center'>
                        <small className='text-xs text-gray-500 leading-4'>Powered by</small>
                        <h5 className='font-bold text-[var(--secondary-color)] text-sm sm:text-base'>Gulf News & BeingShe</h5>
                    </span> */}
                </div>
        </div>
        <img src="/hero.svg" alt="Hero" className="absolute top-0 right-0" />
        <img src="/logo/SEA.svg" alt="Hero" className="absolute top-64 lg:top-10 right-[30px] lg:right-[500px] h-[160px] lg:h-[350px]" />
    </div>
}

export default Hero;