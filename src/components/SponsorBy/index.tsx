import SponsorCard from "@/screens/SponsorCard";

const sponsors = [
    { id: 1, name: "ICEE", logo: "/logo/sponsor1.svg" },
    { id: 2, name: "BITS Pilani", logo: "/logo/sponsor2.svg" },
    { id: 3, name: "Batterjee Medical Colleges", logo: "/logo/sponsor3.svg" },
    { id: 4, name: "Symbiosis Int University Dubai", logo: "/logo/sponsor4.svg" },
    { id: 5, name: "Amity University Dubai", logo: "/logo/sponsor5.svg" },
    { id: 6, name: "De Montfort University", logo: "/logo/sponsor6.svg" },
    { id: 7, name: "Gulf Medical University", logo: "/logo/sponsor7.svg" },
    { id: 8, name: "Score Plus", logo: "/logo/sponsor8.svg" }
];

const SponsorBy = () => {
    return <div id="sponsors" className="bg-[var(--secondary-color)] px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding">
        <div className="bg-[var(--secondary-color)] flex py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding flex-col items-center justify-center text-center space-y-[var(--space-y)] text-[var(--card-color)]">
            <h1 className="text-2xl lg:text-title-text-size font-bold w-full">Sponsored By</h1>
            <span className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 sm:gap-y-6 full w-full">
                {sponsors.map((sponsor) => (
                    <SponsorCard 
                        key={sponsor.id} 
                        image={sponsor.logo} 
                        sponsorName={sponsor.name} 
                    />
                ))}
            </span>
        </div>
    </div>
}
export default SponsorBy;