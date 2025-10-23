const SponsorCard = ({image, sponsorName}: {image: string, sponsorName: string}) => {
    return <div className="text-center py-2 h-full lg:max-w-64 flex flex-col">
        <span className="flex items-center justify-center bg-[var(--primary-color)] px-6 py-4 rounded-md h-44 sm:h-32 w-full">
            <img src={image} alt="sponsor" className="max-h-24 max-w-full object-contain" />
        </span>
        <small className="text-[var(--white-color)] mt-2 text-xs sm:text-sm">{sponsorName}</small>
    </div>
}

export default SponsorCard;