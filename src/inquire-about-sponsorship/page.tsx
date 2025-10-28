import InquireAboutSponsorship from "@/components/InquireAboutSponsorship";
import BackButton from "@/components/BackButton";

const InquireAboutSponsorshipPage = () => {
    return (
        <div className="relative mt-10">
            <div className="absolute -left-4 -top-6 z-20 px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding">
                <BackButton />
            </div>
            <InquireAboutSponsorship />
        </div>
    )
}
export default InquireAboutSponsorshipPage;