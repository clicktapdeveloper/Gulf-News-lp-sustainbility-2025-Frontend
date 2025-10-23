import InquireAboutSponsorship from "@/components/InquireAboutSponsorship";
import BackButton from "@/components/BackButton";

const InquireAboutSponsorshipPage = () => {
    return (
        <div className="relative">
            <div className="absolute -left-4 z-20 px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding">
                <BackButton />
            </div>
            <InquireAboutSponsorship />
        </div>
    )
}
export default InquireAboutSponsorshipPage;