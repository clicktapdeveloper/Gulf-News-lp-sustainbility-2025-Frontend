import CustomButton from "@/screens/CustomButton";
import { Calendar, Clock3, MapPin } from "lucide-react";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();
    return <div className="relative flex flex-col lg:flex-row min-h-[800px] sm:min-h-[1200px] lg:h-[680px] lg:min-h-0 overflow-hidden">
        <div 
        // className="py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:pl-standard-desktop-padding 2xl:px-standard-xl-padding z-10 !backdrop-blur-none lg:!backdrop-blur-xs 2xl:backdrop-blur-none !bg-[#EBF1E7]/40 xl:!bg-transparent space-y-[var(--space-y)]"
        className="py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:pl-standard-desktop-padding 2xl:px-standard-xl-padding z-10 xl:!bg-transparent space-y-[var(--space-y)]"
        >
            <h1 className='text-[28px] sm:text-[55px] lg:text-[50px] font-[600] leading-tight'>
                <div className='text-[var(--secondary-color)] w-full whitespace-nowrap'>The Sustainability</div>
                <div className='text-[var(--secondary-color)] w-full whitespace-nowrap'>Excellence Awards 2025</div>
                {/* <div className='text-[23px] mt-4 font-semibold text-[var(--tertiary-color)] w-full'>Celebrating Leaders, Inspiring Change</div> */}
                <div className='text-[23px] mt-4 font-semibold text-[var(--tertiary-color)] w-full'>Honoring Visionaries Driving a Greener Tomorrow</div>
            </h1>
                <p className='text-[14px] md:text-[16px] lg:text-[18px] max-w-lg !font-[650]' style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                {/* Join the UAE's most impactful sustainability recognition event honoring organizations and individuals driving environmental and social transformation. */}
                Join the UAE’s leading sustainability recognition event, celebrating organizations and individuals shaping the nation’s environmental and social transformation.
                </p>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4'>
                    <span className='flex items-center gap-2'>
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-[16px] lg:text-[20px] !font-[650]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>26 November 2025</p>
                    </span>
                    <Separator orientation='vertical' className='hidden sm:block h-6 bg-[var(--border-color)]' />
                    <span className='flex items-center gap-2'>
                        <Clock3 className="w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-[16px] lg:text-[20px] !font-[650]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>6:00 PM - 8:30 PM</p>
                    </span>
                    <Separator orientation='vertical' className='hidden sm:block h-6 bg-[var(--border-color)]' />
                    <span className='flex items-center gap-2'>
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-[16px] lg:text-[20px] !font-[650]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Dubai, UAE</p>
                    </span>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 !justify-start gap-3 sm:gap-4 w-full xl:w-3/4 pt-5'>
                    <CustomButton variant="outline" 
                    onClick={() => navigate('/apply-for-nomination')} 
                    className="!w-full sm:w-auto !text-sm sm:!text-base !whitespace-nowrap">Nominate Now</CustomButton>
                    <CustomButton variant="outline" 
                    onClick={() => navigate('/inquire-about-sponsorship')} 
                    className="!w-full sm:w-auto !text-sm sm:!text-base !whitespace-nowrap">Become a Sponsor</CustomButton>
                    <CustomButton 
                    onClick={() => navigate('/register-for-attend')} 
                    className="w-full sm:w-auto !text-sm sm:!text-base whitespace-nowrap col-span-2">Register to Attend</CustomButton>
                    {/* <span className='flex flex-col justify-center'>
                        <small className='text-xs text-gray-500 leading-4'>Powered by</small>
                        <h5 className='font-bold text-[var(--secondary-color)] text-sm sm:text-base'>Gulf News & BeingShe</h5>
                    </span> */}
                </div>
                {/* Mobile view images - shown below buttons */}
                <div className="block lg:hidden mt-8 relative">
                    <img src="/hero.svg" alt="Hero" className="w-full" />
                    <img src="/logo/SEA.svg" alt="SEA Logo" className="absolute left-0 top-1/2 -translate-y-1/2 h-[200px]" />
                </div>
        </div>
        {/* Desktop view images - absolute positioned */}
        <img src="/hero.svg" alt="Hero" className="hidden lg:block absolute top-0 right-0" />
        {/* <img src="/logo/SEA.svg" alt="Hero" className="hidden lg:block absolute top-64 lg:top-10 right-[30px] lg:right-[500px] h-[160px] lg:h-[350px]" /> */}
        {/* <img src="/logo/SEA.svg" alt="Hero" className="hidden lg:block absolute top-64 lg:top-10 sm:!right-standard-tablet-padding lg:!right-standard-desktop-padding xl:!right-standard-xl-padding h-[160px] lg:h-[300px]" /> */}
        <img src="/logo/SEA.svg" alt="Hero" className="hidden lg:block absolute top-64 lg:top-10 sm:!right-standard-tablet-padding lg:!right-standard-desktop-padding 2xl:!right-standard-xl-padding h-[160px] lg:h-[220px]" />
        {/* <img src="/logo/SEA.svg" alt="Hero" className="hidden lg:block absolute top-64 lg:top-10 right-[30px] lg:right-[30px] h-[160px] lg:h-[300px]" /> */}
    </div>
}

export default Hero;