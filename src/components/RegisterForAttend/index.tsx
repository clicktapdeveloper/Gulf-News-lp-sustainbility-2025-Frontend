import UnifiedForm from "@/screens/UnifiedForm";

const RegisterForAttend = () => {
    return <div className='flex flex-col sm:flex-row items-center justify-center pt-12 py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding relative'>
        <div className="z-10 w-full mx-auto space-y-[var(--space-y)]">
            <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-[50px] font-bold text-start lg:text-left'>
                <p className='text-[var(--tertiary-color)]'>Be Part of the</p>
                <p className='text-[var(--secondary-color)]'>Celebration of Excellence</p>
            </h1>
            <UnifiedForm formType="registerForAttend" />
        </div>
        <div className="absolute right-0 top-0">
            <img src="/hero.svg" alt="Hero" />
        </div>
    </div>
}

export default RegisterForAttend;