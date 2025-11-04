import CustomButton from "@/screens/CustomButton";
import CardCategory from "@/screens/CardCategory";
import AutoCarousel from "@/components/AutoCarousel";
import { useNavigate } from 'react-router-dom';

const AwardCriteria = () => {
  const navigate = useNavigate();

    return <div id="awards-criteria" className="flex flex-col text-center gap-2 px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding space-y-[var(--space-y)] bg-[url('/layout.svg'),_url('/award.svg')] bg-no-repeat bg-center bg-cover min-h-[400px] sm:min-h-[400px] lg:min-h-[600px] lg:pt-48 pb-10">
        {/* Evaluation Criteria Section */}
        <div className="mb-8 space-y-6">
            <h1 className="text-2xl lg:text-title-text-size font-bold !text-white">Sustainability Excellence Awards 2025</h1>
            {/* <div className="max-w-4xl mx-auto"> */}
            <div className="max-w-6xl mx-auto">
                <p className="text-white/90 text-lg mb-6">All award entries will be evaluated based on the following six pillars:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <h3 className="text-white font-semibold text-lg mb-2">Impact</h3>
                        <p className="text-white/85 text-sm">Demonstrated measurable environmental, social, or economic benefits.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <h3 className="text-white font-semibold text-lg mb-2">Innovation</h3>
                        <p className="text-white/85 text-sm">Use of new technologies, processes, or models advancing sustainability.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <h3 className="text-white font-semibold text-lg mb-2">Leadership</h3>
                        <p className="text-white/85 text-sm">Commitment to inspiring change within the sector.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <h3 className="text-white font-semibold text-lg mb-2">Scalability</h3>
                        <p className="text-white/85 text-sm">Potential for replication or growth of the initiative.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <h3 className="text-white font-semibold text-lg mb-2">Alignment</h3>
                        <p className="text-white/85 text-sm">Conformance with UAE and global sustainability goals (e.g., SDGs, UAE Vision 2021, COP28 outcomes).</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <h3 className="text-white font-semibold text-lg mb-2">Transparency</h3>
                        <p className="text-white/85 text-sm">Clear data reporting and accountability.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Award Categories Section */}
        <h2 className="text-xl lg:text-2xl font-bold !text-white mb-6">Award Criteria</h2>
        <div className="mx-auto w-full max-w-6xl">
            <AutoCarousel className="-mx-2 sm:-mx-3" showControls={true}>
                {/* Row 1 */}
                <CardCategory 
                    iconSrc="/logo/award1.svg" 
                    title="Green Construction Leadership Award" 
                    description="Honors companies leading sustainable construction through green materials, energy-efficient designs, and eco-friendly practices." 
                    subtitle="Examples: LEED-certified projects, smart buildings."
                    extraText="Construction" 
                    extraHref="/construction" 
                    variant="light" 
                />
                <CardCategory 
                    iconSrc="/logo/award2.svg" 
                    title="Sustainable Developer of the Year" 
                    description="Recognizes developers integrating long-term sustainability in urban planning, energy efficiency, and renewable power." 
                    subtitle="Examples: Walkable communities, solar-powered developments."
                    extraText="Property Development" 
                    extraHref="/property-development" 
                    variant="dark" 
                />
                <CardCategory 
                    iconSrc="/logo/award1.svg" 
                    title="Future-Ready Free Zone Award" 
                    description="For free zones implementing sustainable infrastructure and operations, promoting green business ecosystems." 
                    subtitle="Examples: Waste reduction initiatives, renewable energy adoption."
                    extraText="Free Zones" 
                    extraHref="/free-zones" 
                    variant="light" 
                />
                <CardCategory 
                    iconSrc="/logo/award2.svg" 
                    title="Green Business Enabler Award" 
                    description="Acknowledges business set-up services that facilitate sustainable company formations and practices." 
                    subtitle="Examples: Eco-friendly office spaces, green licensing support."
                    extraText="Business Set Up" 
                    extraHref="/business-setup" 
                    variant="dark" 
                />
                <CardCategory 
                    iconSrc="/logo/award1.svg" 
                    title="Sustainability in Education Excellence Award" 
                    description="Rewards institutions integrating sustainability into curricula, campus operations, and community outreach." 
                    subtitle="Examples: Eco-campus initiatives, sustainability-focused courses."
                    extraText="Education" 
                    extraHref="/education" 
                    variant="light" 
                />
                <CardCategory 
                    iconSrc="/logo/award2.svg" 
                    title="Healthcare Sustainability Leader" 
                    description="Recognizes healthcare providers adopting energy efficiency, waste management, and sustainable healthcare services." 
                    subtitle="Examples: Green hospitals, medical waste recycling."
                    extraText="Healthcare" 
                    extraHref="/healthcare" 
                    variant="dark" 
                />
                
                {/* Row 2 */}
                <CardCategory 
                    iconSrc="/logo/award1.svg" 
                    title="Ports & Logistics Trailblazer" 
                    description="For companies driving sustainability in shipping, ports, and logistics via green technologies and practices." 
                    subtitle="Examples: Electric port equipment, low-emission fleets."
                    extraText="Maritime & Logistics" 
                    extraHref="/maritime-logistics" 
                    variant="light" 
                />
                <CardCategory 
                    iconSrc="/logo/award2.svg" 
                    title="Sustainable Retail Champion" 
                    description="Acknowledges retailers with eco-friendly store designs, ethical sourcing, and carbon footprint reduction." 
                    subtitle="Examples: Sustainable product lines, energy-efficient stores."
                    extraText="Retail" 
                    extraHref="/retail" 
                    variant="dark" 
                />
                <CardCategory 
                    iconSrc="/logo/award1.svg" 
                    title="Ethical Fashion & Textile Excellence Award" 
                    description="Rewards brands using sustainable materials, circular fashion, and eco-friendly production." 
                    subtitle="Examples: Organic fabrics, recycled materials."
                    extraText="Fashion & Textiles" 
                    extraHref="/fashion-textiles" 
                    variant="light" 
                />
                <CardCategory 
                    iconSrc="/logo/award2.svg" 
                    title="Responsible Travel & Hospitality Award" 
                    description="For tourism companies minimizing environmental impact while promoting local culture and conservation." 
                    subtitle="Examples: Eco-hotels, waste reduction programs."
                    extraText="Tourism & Hospitality" 
                    extraHref="/tourism-hospitality" 
                    variant="dark" 
                />
                <CardCategory 
                    iconSrc="/logo/award1.svg" 
                    title="Eco-Efficient Manufacturer of the Year" 
                    description="Honors manufacturers adopting clean technologies, reducing resource use, and lowering emissions." 
                    subtitle="Examples: Water-efficient factories, clean energy adoption."
                    extraText="Manufacturing" 
                    extraHref="/manufacturing" 
                    variant="light" 
                />
                <CardCategory 
                    iconSrc="/logo/award2.svg" 
                    title="Green Mobility Award" 
                    description="For companies pioneering sustainable transport solutions like public transit innovations and green logistics." 
                    subtitle="Examples: Electric fleets, bike-sharing programs."
                    extraText="Transport & Mobility" 
                    extraHref="/transport-mobility" 
                    variant="dark" 
                />
                
                {/* Row 3 */}
                <CardCategory 
                    iconSrc="/logo/award1.svg" 
                    title="Electric Vehicle of the Year Award" 
                    description="Recognizes innovation and adoption of electric vehicles to reduce carbon emissions." 
                    subtitle="Examples: EV fleets, charging infrastructure."
                    extraText="Electric Vehicles" 
                    extraHref="/electric-vehicles" 
                    variant="light" 
                />
                <CardCategory 
                    iconSrc="/logo/award2.svg" 
                    title="Sustainable F&B Brand of the Year" 
                    description="Rewards companies prioritizing sustainable sourcing, waste reduction, and eco-packaging." 
                    subtitle="Examples: Organic ingredients, composting initiatives."
                    extraText="Food & Beverage" 
                    extraHref="/food-beverage" 
                    variant="dark" 
                />
                <CardCategory 
                    iconSrc="/logo/award1.svg" 
                    title="Clean Energy Pioneer Award" 
                    description="Acknowledges leaders in developing or implementing renewable energy projects." 
                    subtitle="Examples: Solar farms, wind energy solutions."
                    extraText="Renewable Energy" 
                    extraHref="/renewable-energy" 
                    variant="light" 
                />
                <CardCategory 
                    iconSrc="/logo/award2.svg" 
                    title="Energy Efficiency Leader Award" 
                    description="For companies making significant strides in reducing energy consumption and optimizing usage." 
                    subtitle="Examples: Smart grids, LED lighting projects."
                    extraText="Energy Management" 
                    extraHref="/energy-management" 
                    variant="dark" 
                />
                <CardCategory 
                    iconSrc="/logo/award1.svg" 
                    title="Green Finance Leadership Award" 
                    description="Honors financial institutions supporting sustainable investments and green projects." 
                    subtitle="Examples: ESG funds, green bonds."
                    extraText="Finance" 
                    extraHref="/finance" 
                    variant="light" 
                />
                <CardCategory 
                    iconSrc="/logo/award2.svg" 
                    title="Sustainable Digital Innovation Award" 
                    description="Recognizes use of technology to promote sustainability, resource management, and carbon footprint reduction." 
                    subtitle="Examples: AI-driven energy savings, cloud efficiency."
                    extraText="Technology" 
                    extraHref="/technology" 
                    variant="dark" 
                />
                
                {/* Row 4 */}
                <CardCategory 
                    iconSrc="/logo/award1.svg" 
                    title="Next-Gen Green Business Award" 
                    description="For emerging companies with innovative sustainable solutions disrupting their industries." 
                    subtitle="Examples: Renewable tech startups, circular economy models."
                    extraText="Start-Ups" 
                    extraHref="/startups" 
                    variant="light" 
                />
                <CardCategory 
                    iconSrc="/logo/award2.svg" 
                    title="Changemaker of the Year" 
                    description="Celebrates visionary leaders driving sustainability initiatives and inspiring positive change." 
                    subtitle=""
                    extraText="Leadership (Individual)" 
                    extraHref="/leadership" 
                    variant="dark" 
                />
                <CardCategory 
                    iconSrc="/logo/award1.svg" 
                    title="Eco-Airline of the Year" 
                    description="Recognizes airlines implementing carbon reduction, sustainable fuels, and eco-friendly operations." 
                    subtitle="Examples: Sustainable aviation fuel use, waste reduction on flights."
                    extraText="Aviation" 
                    extraHref="/aviation" 
                    variant="light" 
                />
                <CardCategory 
                    iconSrc="/logo/award2.svg" 
                    title="Green Essence Award" 
                    description="For brands adopting natural ingredients, sustainable sourcing, and eco-packaging." 
                    subtitle="Examples: Organic fragrances, biodegradable packaging."
                    extraText="Fragrances & Cosmetics" 
                    extraHref="/fragrances-cosmetics" 
                    variant="dark" 
                />
                <CardCategory 
                    iconSrc="/logo/award1.svg" 
                    title="Regenerative Agriculture Excellence Award" 
                    description="Honors farmers and companies applying regenerative practices enhancing soil health and biodiversity." 
                    subtitle="Examples: Crop rotation, organic farming."
                    extraText="Food & Agriculture" 
                    extraHref="/food-agriculture" 
                    variant="light" 
                />
                <CardCategory 
                    iconSrc="/logo/award2.svg" 
                    title="Impact Investment Leadership Award" 
                    description="Recognizes investors prioritizing environmental, social, and governance factors in their portfolios." 
                    subtitle="Examples: Green bonds, impact funds."
                    extraText="Investments & ESG" 
                    extraHref="/investments-esg" 
                    variant="dark" 
                />
                <CardCategory 
                    iconSrc="/logo/award2.svg" 
                    title="Sustainable Travel Award" 
                    description="Celebrates travel companies promoting eco-friendly experiences and reducing tourism impact." 
                    subtitle="Examples: Carbon offset programs, eco-tourism initiatives."
                    extraText="Travel & Hospitality" 
                    extraHref="/travel-hospitality" 
                    variant="dark" 
                />
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

export default AwardCriteria;