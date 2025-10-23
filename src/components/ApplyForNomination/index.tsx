import UnifiedForm from "@/screens/UnifiedForm";

const ApplyForNomination = () => {
    return <div className='flex flex-col lg:flex-row items-center justify-center pt-12 sm:pt-0 py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding relative'>
        <div className="z-10 w-full max-w-6xl mx-auto">
            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold text-start lg:text-left'>
                <p className='text-[var(--tertiary-color)]'>Your Journey to</p>
                <p className='text-[var(--secondary-color)]'>Recognition Begins</p>
            </h1>
            <UnifiedForm formType="applyForNomination" />
        </div>
        <div className="absolute right-0 top-0 hidden lg:block">
            <img src="/hero.svg" alt="Hero" className="w-auto h-auto max-w-md lg:max-w-lg xl:max-w-xl" />
        </div>
    </div>
}

export default ApplyForNomination;