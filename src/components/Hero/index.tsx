import CustomButton from "@/screens/CustomButton";
import { Calendar, Clock3, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();
    return <div className='flex flex-col lg:flex-row items-center justify-center py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding'>
        <div className="flex-2 space-y-[var(--space-y)] w-full lg:w-auto">
            <h1 className='text-[34px] sm:text-[55px] lg:text-[76px] font-[600] leading-tight'>
                <div className='text-[var(--secondary-color)] w-full whitespace-nowrap'>Celebrating Leaders<span className="text-black">,</span></div>
                <div className='text-[var(--tertiary-color)] w-full'>Inspiring Change</div>
            </h1>
            <p className='text-[14px] md:text-[16px] lg:text-[18px] max-w-2xl' style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Join the UAE's most impactful sustainability recognition event — honoring organizations and individuals driving environmental and social transformation.
            </p>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4'>
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
            <div className='grid grid-cols-1 sm:grid-cols-2 !justify-start gap-3 sm:gap-4 w-full xl:w-2/3 pt-5'>
                <CustomButton variant="outline" 
                onClick={() => navigate('/apply-for-nomination')} 
                className="w-full sm:w-auto">Apply for Nomination</CustomButton>
                <CustomButton variant="outline" 
                onClick={() => navigate('/inquire-about-sponsorship')} 
                className="w-full sm:w-auto">Inquire about Sponsorship</CustomButton>
                <CustomButton 
                onClick={() => navigate('/register-for-attend')} 
                className="w-full sm:w-auto">Register for Attend</CustomButton>
                <span className='flex flex-col justify-center'>
                    <small className='text-xs text-gray-500 leading-4'>Powered by</small>
                    <h5 className='font-bold text-[var(--secondary-color)] text-sm sm:text-base'>Gulf News & BeingShe</h5>
                </span>
            </div>
        </div>
        <div className="flex-1 relative mt-8 lg:mt-0 w-full max-w-md lg:max-w-none">
            <img src="/logo/SEA.svg" alt="SEA" className="absolute left-8 sm:left-12 lg:left-16 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32" />
            <img src="/hero.svg" alt="Hero" className="w-full h-auto" />
        </div>
    </div>
}

export default Hero;