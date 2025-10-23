import CustomButton from "@/screens/CustomButton";
import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton";

const NominationSuccessComponent = () => {
    const navigate = useNavigate();
    return <div className='flex flex-col items-center justify-center pt-12 sm:pt-0 py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding relative space-y-[var(--space-y)]'>
        <div className="items-start justify-start w-full">
            <BackButton />
        </div>
        <div>
            <img src="/AFNThankYou.webp" alt="ThankYou" className="w-auto h-auto max-w-md lg:max-w-lg xl:max-w-xl" />
        </div>
        <div className="z-10 w-full max-w-6xl mx-auto text-center space-y-[var(--space-y)]">
            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold'>
                <p className='text-[var(--tertiary-color)]'>Thank You for Supporting a</p>
                <p className='text-[var(--secondary-color)]'>Sustainable Future</p>
            </h1>
            <p className="text-gray-600 text-center text-lg">
                Your registration for the Sustainability Excellence Awards 2025 is confirmed. Together, we honor organizations and individuals making a real difference for a greener tomorrow.
            </p>
            <div className="flex justify-center">
                <CustomButton onClick={() => navigate('/')} className="w-1/4">
                    Okay
                </CustomButton>
            </div>
        </div>
    </div>
}

export default NominationSuccessComponent;