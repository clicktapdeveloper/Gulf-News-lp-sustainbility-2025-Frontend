import RegisterForAttend from "@/components/RegisterForAttend";
import BackButton from "@/components/BackButton";

const RegisterForAttendPage = () => {
    return (
        <div className="relative mt-10">
            <div className="absolute -left-4 -top-6 z-20 px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding">
                <BackButton />
            </div>
            <RegisterForAttend />
        </div>
    )
}
export default RegisterForAttendPage;