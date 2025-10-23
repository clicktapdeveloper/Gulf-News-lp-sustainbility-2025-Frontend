import UnifiedForm from "@/screens/UnifiedForm";

const BecomeEventSponsor = () => {
    return <div className="bg-[var(--white-color)] py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding">
        {/* <div className="max-w-4xl mx-auto"> */}
        <div className="mx-auto">
            {/* <h1 className="text-[var(--secondary-color)] text-center text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Become Event Sponsor</h1> */}
            <h1 className="text-[var(--secondary-color)] text-center text-2xl lg:text-title-text-size font-bold mb-6 sm:mb-8">Become Event Sponsor</h1>
            <div className="w-full">
                <UnifiedForm formType="registerForAttend" />
            </div>
        </div>
    </div>
}

export default BecomeEventSponsor;