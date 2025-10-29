import CustomButton from "@/screens/CustomButton";

const Event = () => {
    return <div id="about-event" className="flex flex-col text-center gap-2 py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding bg-[var(--white-color)] space-y-[var(--space-y-mobile)] lg:space-y-[var(--space-y)] px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding">
        <h1 className="text-xl lg:text-title-text-size font-bold !text-[var(--secondary-color)]">About Event</h1>
        <p className="text-[14px] md:text-[16px] lg:text-[20px]"
        style={{ fontFamily: "'Nunito Sans', sans-serif" }}
        >
        {/* The Sustainability Excellence Awards 2025, powered by Gulf News and BeingShe, celebrates pioneers shaping a greener, more resilient future. From renewable energy innovation to circular fashion, this event recognizes excellence across industries championing sustainable progress. */}
        Powered by Gulf News and BeingShe, the Sustainability Excellence Awards 2025 honors the pioneers shaping a greener, more resilient future of the UAE. <br /><br />
From renewable energy innovation to circular fashion, the event spotlights excellence across industries leading the sustainable movement. 

        </p>
        <div className="mx-auto w-full sm:w-1/2 lg:w-1/6">
            <CustomButton className="w-full">Nominate Now</CustomButton>
        </div>
    </div>
}

export default Event;