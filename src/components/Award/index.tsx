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
                {/* Row 1 */}
                <CardCategory iconSrc="/logo/award1.svg" title="Green Construction Leadership Award" description="Sustainable building & energy efficiency." extraText="Construction" extraHref="/construction" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Sustainable Developer of the Year" description="Long-term sustainability in planning & renewable energy." extraText="Property Development" extraHref="/property-development" variant="dark" />
                <CardCategory iconSrc="/logo/award1.svg" title="Future-Ready Free Zone Award" description="Sustainable infrastructure & green operations." extraText="Free Zones" extraHref="/free-zones" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Green Business Enabler Award" description="Supporting sustainable company setups & operations." extraText="Business Set Up" extraHref="/business-setup" variant="dark" />
                <CardCategory iconSrc="/logo/award1.svg" title="Sustainability in Education Excellence Award" description="Integrating sustainability into learning & campus life." extraText="Education" extraHref="/education" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Healthcare Sustainability Leader" description="Energy efficiency, waste management & green healthcare." extraText="Healthcare" extraHref="/healthcare" variant="dark" />
                
                {/* Row 2 */}
                <CardCategory iconSrc="/logo/award1.svg" title="Ports & Logistics Trailblazer" description="Sustainable operations in shipping, ports & logistics." extraText="Maritime & Logistics" extraHref="/maritime-logistics" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Sustainable Retail Champion" description="Eco-friendly design, ethical sourcing & low-carbon retail." extraText="Retail" extraHref="/retail" variant="dark" />
                <CardCategory iconSrc="/logo/award1.svg" title="Ethical Fashion & Textile Excellence Award" description="Sustainable materials, circular design & green production." extraText="Fashion & Textiles" extraHref="/fashion-textiles" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Responsible Travel & Hospitality Award" description="Environmentally conscious tourism & local culture promotion." extraText="Tourism & Hospitality" extraHref="/tourism-hospitality" variant="dark" />
                <CardCategory iconSrc="/logo/award1.svg" title="Eco-Efficient Manufacturer of the Year" description="Clean technology, resource efficiency & low emissions." extraText="Manufacturing" extraHref="/manufacturing" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Green Mobility Award" description="Sustainable transport innovations & green logistics." extraText="Transport & Mobility" extraHref="/transport-mobility" variant="dark" />
                
                {/* Row 3 */}
                <CardCategory iconSrc="/logo/award1.svg" title="Electric Vehicle of the Year Award" description="Advancing EV technology & carbon-reduction mobility." extraText="Electric Vehicles" extraHref="/electric-vehicles" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Sustainable F&B Brand of the Year" description="Eco-friendly sourcing, waste reduction & packaging." extraText="Food & Beverage" extraHref="/food-beverage" variant="dark" />
                <CardCategory iconSrc="/logo/award1.svg" title="Clean Energy Pioneer Award" description="Innovation in renewable energy & sustainable power." extraText="Renewable Energy" extraHref="/renewable-energy" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Energy Efficiency Leader Award" description="Reducing energy use & optimizing performance." extraText="Energy Management" extraHref="/energy-management" variant="dark" />
                <CardCategory iconSrc="/logo/award1.svg" title="Green Finance Leadership Award" description="Sustainable investments & responsible funding." extraText="Finance" extraHref="/finance" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Sustainable Digital Innovation Award" description="Technology-driven sustainability & efficiency." extraText="Technology" extraHref="/technology" variant="dark" />
                
                {/* Row 4 */}
                <CardCategory iconSrc="/logo/award1.svg" title="Next-Gen Green Business Award" description="Innovative solutions transforming industries." extraText="Start-Ups" extraHref="/startups" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Changemaker of the Year" description="Visionary leadership in sustainability & impact." extraText="Leadership (Individual)" extraHref="/leadership" variant="dark" />
                <CardCategory iconSrc="/logo/award1.svg" title="Eco-Airline of the Year" description="Carbon reduction, sustainable fuels & eco operations." extraText="Aviation" extraHref="/aviation" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Green Essence Award" description="Natural ingredients, ethical sourcing & eco-packaging." extraText="Fragrances & Cosmetics" extraHref="/fragrances-cosmetics" variant="dark" />
                <CardCategory iconSrc="/logo/award1.svg" title="Regenerative Agriculture Excellence Award" description="Soil health, biodiversity & sustainable farming." extraText="Food & Agriculture" extraHref="/food-agriculture" variant="light" />
                <CardCategory iconSrc="/logo/award2.svg" title="Impact Investment Leadership Award" description="Responsible investing & ESG-driven portfolios." extraText="Investments & ESG" extraHref="/investments-esg" variant="dark" />
                <CardCategory iconSrc="/logo/award2.svg" title="Sustainable Travel Award" description="Eco-friendly tourism & responsible experiences." extraText="Travel & Hospitality" extraHref="/investments-esg" variant="dark" />
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