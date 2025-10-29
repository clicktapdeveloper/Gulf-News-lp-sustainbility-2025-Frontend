import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
    className?: string;
}

const BackButton = ({ className = "" }: BackButtonProps) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Go back to previous page
        // Small delay to ensure smooth scroll happens after route change
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 0);
    };

    return (
        <button
            onClick={handleBack}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--secondary-color)] hover:text-[var(--tertiary-color)] transition-colors duration-200 ${className} !bg-transparent`}
        >
            <ArrowLeft className="w-4 h-4" />
            Back
        </button>
    );
};

export default BackButton;
