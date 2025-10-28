import CustomButton from "@/screens/CustomButton";
import CardCategory from "@/screens/CardCategory";
import AutoCarousel from "@/components/AutoCarousel";
import { useNavigate } from 'react-router-dom';

const Award = () => {
  const navigate = useNavigate();

    return <div className="flex flex-col text-center gap-2 px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding space-y-[var(--space-y)] bg-[url('/layout.svg'),_url('/award.svg')] bg-no-repeat bg-center bg-cover min-h-[400px] sm:min-h-[400px] lg:h-80">
        <h1 className="text-2xl lg:text-title-text-size font-bold !text-white">Award Categories</h1>
        <div className="mx-auto w-full max-w-6xl">
            <AutoCarousel className="-mx-2 sm:-mx-3">
                <CardCategory iconSrc="/logo/award1.svg" title="Green Construction Leadership Award" description="Sustainable building & energy efficiency." extraText="Construction" extraHref="/construction" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Healthcare Sustainability Leader" description="Eco-friendly medical innovation." extraText="Healthcare" extraHref="/healthcare" variant="dark" />
                <CardCategory iconSrc="/logo/award1.svg" title="Sustainability in Education Excellence Award" description="Integrating sustainability into curriculum." extraText="Education" extraHref="/education" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Green Construction Leadership Award" description="Sustainable building & energy efficiency." extraText="Construction" extraHref="/construction" variant="dark" />
            </AutoCarousel>
        </div>
        <div className="mx-auto w-5/6 sm:w-1/2 lg:w-1/6">
            <CustomButton 
            className="w-full !border-white md:border-0"
            onClick={() => navigate('/apply-for-nomination')}
            >Nominate Now</CustomButton>
        </div>
    </div>
}

export default Award;