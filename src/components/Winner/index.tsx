import CardText from "@/screens/CardText";

const Winner = () => {
    return <div className="bg-[var(--white-color)] flex flex-col !items-start justify-center gap-7 pt-mobile-padding lg:pt-72 pb-10 px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding">
        {/* <h1 className="text-2xl sm:text-3xl lg:text-[var(--h1-size)] font-bold !text-[var(--secondary-color)] text-center">How Winners Are Chosen</h1> */}
        <h1 className="text-2xl lg:text-title-text-size font-bold !text-[var(--secondary-color)] text-start">How Winners Are Chosen</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <CardText text="impact" variant="light" />
            <CardText text="Innovation" variant="dark" />
            <CardText text="Leadership" variant="light" />
            <CardText text="Scalability" variant="dark" />
            <CardText text="Alignment with UAE & global goals" variant="light" />
            <CardText text="Transparency." variant="dark" />
        </div>
    </div>
}

export default Winner;