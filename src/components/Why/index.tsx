import CustomButton from "@/screens/CustomButton";
import Card from "@/screens/Card";
import { useNavigate } from "react-router-dom";

const Why = () => {
    const navigate = useNavigate();
    return <div id="why" className="px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding bg-whitec">
    <div className="flex flex-col text-center gap-2 py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding space-y-[var(--space-y)] bg-[url('/layout.svg'),_url('/why.svg')] bg-no-repeat bg-center bg-cover">
        <h1 className="text-2xl lg:text-title-text-size font-bold text-white">Why You Should Attend</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mx-auto w-full max-w-6xl px-6">
            <Card iconSrc="/logo/card1.svg" title="Network with sustainability leaders and policymakers" description="" variant="dark" />
            <Card iconSrc="/logo/card2.svg" title="Discover award-winning innovations and eco-friendly solutions" description="" variant="light" />
            <Card iconSrc="/logo/card3.svg" title="Connect with investors, changemakers, and thought leaders" description="" variant="dark" />
            <Card iconSrc="/logo/card4.svg" title="Celebrate organizations redefining corporate responsibility" description="" variant="light" />
        </div>
        <div className="mx-auto w-5/6 sm:w-1/2 lg:w-1/4">
            <CustomButton className="w-full !bg-white !text-secondary whitespace-nowrap" onClick={() => navigate('/register-for-attend')}>Register to Attend</CustomButton>
        </div>
    </div>
    </div>
}

export default Why;