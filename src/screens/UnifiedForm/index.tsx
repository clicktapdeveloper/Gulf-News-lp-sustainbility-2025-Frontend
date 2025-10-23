import CustomButton from "@/screens/CustomButton";
import NominationPayment from "@/components/Payment/NominationPayment";
import PDFUpload from "@/components/Upload/PDFUpload";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENV_CONFIG } from "@/config/env";
import type { UploadedFile } from "@/lib/pdf-upload-service";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

export interface FormConfig {
    title: string;
    description: string;
    fields: FormField[];
    submitButtonText: string;
    submitButtonPrice?: string;
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'file' | 'pdf-upload';
    placeholder: string;
    required: boolean;
    gridCols?: 1 | 2; // For grid layout
    maxLength?: number;
    rows?: number; // For textarea
    maxSize?: number; // For PDF upload (in MB)
    maxFiles?: number; // For PDF upload
}

const FORM_CONFIGS: Record<string, FormConfig> = {
    applyForNomination: {
        title: "Send Us A Message",
        description: "We will get touch with you as soon as possible.",
        submitButtonText: "Pay AED 199 for Register",
        fields: [
            {
                name: "firstName",
                label: "First Name",
                type: "text",
                placeholder: "Enter your first name",
                required: true,
                gridCols: 1
            },
            {
                name: "lastName",
                label: "Last Name",
                type: "text",
                placeholder: "Enter your last name",
                required: true,
                gridCols: 1
            },
            {
                name: "designation",
                label: "Designation",
                type: "text",
                placeholder: "Enter your designation",
                required: true,
                gridCols: 1
            },
            {
                name: "companyName2",
                label: "Company Name",
                type: "text",
                placeholder: "Enter your company",
                required: true,
                gridCols: 1
            },
            {
                name: "email",
                label: "Email",
                type: "email",
                placeholder: "Enter your email address",
                required: true,
                gridCols: 1
            },
            {
                name: "phone",
                label: "Phone",
                type: "tel",
                placeholder: "Enter phone number",
                required: true,
                gridCols: 1
            },
            {
                name: "tradeLicense",
                label: "Trade License",
                type: "text",
                placeholder: "Enter your trade license",
                required: true,
                gridCols: 1
            },
            {
                name: "supportingDocument",
                label: "Supporting Document",
                type: "pdf-upload",
                placeholder: "Upload PDF documents to support your nomination",
                required: false,
                gridCols: 1,
                maxSize: 10, // 10MB limit
                maxFiles: 3  // Maximum 3 files
            },
            {
                name: "message",
                label: "Message (1000 words)",
                type: "textarea",
                placeholder: "Text here",
                required: false,
                maxLength: 1000,
                rows: 6,
                gridCols: 2
            }
        ]
    },
    inquireAboutSponsorship: {
        title: "Send Us A Message",
        description: "Submit your details to explore sponsorship opportunities at the Sustainability Excellence Awards 2025.",
        submitButtonText: "Submit",
        fields: [
            {
                name: "firstName",
                label: "Fast Name",
                type: "text",
                placeholder: "Enter your first name",
                required: true,
                gridCols: 1
            },
            {
                name: "lastName",
                label: "Last Name",
                type: "text",
                placeholder: "Enter your last name",
                required: true,
                gridCols: 1
            },
            {
                name: "email",
                label: "Email",
                type: "email",
                placeholder: "Enter your email address",
                required: true,
                gridCols: 1
            },
            {
                name: "phone",
                label: "Phone",
                type: "tel",
                placeholder: "Enter phone number",
                required: true,
                gridCols: 1
            },
            {
                name: "message",
                label: "Message (1000 words)",
                type: "textarea",
                placeholder: "Text here",
                required: false,
                maxLength: 1000,
                rows: 6,
                gridCols: 2
            }
        ]
    },
    registerForAttend: {
        title: "Send Us A Message",
        description: "Join industry leaders, innovators, and changemakers shaping a sustainable future.",
        submitButtonText: "Submit",
        fields: [
            {
                name: "firstName",
                label: "Fast Name",
                type: "text",
                placeholder: "Enter your first name",
                required: true,
                gridCols: 1
            },
            {
                name: "lastName",
                label: "Last Name",
                type: "text",
                placeholder: "Enter your last name",
                required: true,
                gridCols: 1
            },
            {
                name: "email",
                label: "Email",
                type: "email",
                placeholder: "Enter your email address",
                required: true,
                gridCols: 1
            },
            {
                name: "phone",
                label: "Phone",
                type: "tel",
                placeholder: "Enter phone number",
                required: true,
                gridCols: 1
            },
            {
                name: "message",
                label: "Message (1000 words)",
                type: "textarea",
                placeholder: "Text here",
                required: false,
                maxLength: 1000,
                rows: 6,
                gridCols: 2
            }
        ]
    }
};

interface UnifiedFormProps {
    formType: 'applyForNomination' | 'inquireAboutSponsorship' | 'registerForAttend';
}

const UnifiedForm = ({ formType }: UnifiedFormProps) => {
    const config = FORM_CONFIGS[formType];
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile[]>>({}); // Used in PDF upload handlers
    const [showPayment, setShowPayment] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Track uploaded files for debugging
    useEffect(() => {
        const totalFiles = Object.values(uploadedFiles).flat().length;
        if (totalFiles > 0) {
            console.log('Total uploaded files:', totalFiles);
        }
    }, [uploadedFiles]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePDFUploadSuccess = (fieldName: string, uploadedFile: UploadedFile) => {
        setUploadedFiles(prev => {
            const newFiles = [...(prev[fieldName] || []), uploadedFile];
            
            // Also store the file URLs in formData for backend submission
            const fileUrls = newFiles.map(file => file.url).join(',');
            setFormData(prevFormData => ({ ...prevFormData, [fieldName]: fileUrls }));
            
            // Debug log to show uploadedFiles is being used
            console.log(`Uploaded files for ${fieldName}:`, newFiles);
            
            return {
                ...prev,
                [fieldName]: newFiles
            };
        });
    };

    const handlePDFUploadError = (error: string) => {
        console.error('PDF upload error:', error);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (formType === 'applyForNomination') {
                // For nominations, show payment component
                setShowPayment(true);
            } else {
                // For other forms, submit directly
                await submitForm(formType, formData);
            }
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitForm = async (type: string, data: Record<string, string>) => {
        let endpoint: string;
        
        switch (type) {
            case 'applyForNomination':
                endpoint = '/api/nomination';
                break;
            case 'inquireAboutSponsorship':
                endpoint = '/api/sponsorship';
                break;
            case 'registerForAttend':
                endpoint = '/api/register-attendee';
                break;
            default:
                throw new Error('Unknown form type');
        }
        
        const response = await fetch(`${ENV_CONFIG.API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to submit form');
        }

        const result = await response.json();
        console.log('Form submitted successfully:', result);
        
        // Redirect to thankyou page with appropriate hash (only for non-nomination forms)
        if (type === 'inquireAboutSponsorship') {
            navigate('/thankyou#inquire-about-sponsorship');
        } else if (type === 'registerForAttend') {
            navigate('/thankyou#register-for-attend');
        }
        // Note: Nomination forms redirect is handled in handlePaymentSuccess
    };

    const handlePaymentSuccess = async () => {
        console.log('Payment successful');
        
        try {
            // Add payment information to form data
            const formDataWithPayment = {
                ...formData,
                paymentStatus: 'completed',
                paymentAmount: '199',
                paymentCurrency: 'AED',
                paymentDate: new Date().toISOString(),
                paymentReference: `nomination-${Date.now()}`
            };
            
            // Submit the form data to backend after successful payment
            await submitForm(formType, formDataWithPayment);
            
            // Show success message
            showSuccessToast('Nomination submitted successfully!');
            
            // Reset form and redirect to thankyou page
            setFormData({});
            setUploadedFiles({});
            setShowPayment(false);
            
            // Redirect to thankyou page for nomination payment
            if (formType === 'applyForNomination') {
                navigate('/thankyou#apply-for-nomination');
            }
        } catch (error) {
            console.error('Failed to submit form after payment:', error);
            // Show error message to user
            showErrorToast('Payment successful but failed to submit form. Please contact support.');
        }
    };

    const handlePaymentError = (error: string) => {
        console.error('Payment error:', error);
        // Show error message to user
    };

    const renderField = (field: FormField) => {
        const baseInputClasses = "w-full rounded-md border border-[var(--border-color)]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--secondary-color)] focus:ring-1 focus:ring-[var(--secondary-color)]";
        
        if (field.type === 'textarea') {
            return (
                <textarea
                    name={field.name}
                    rows={field.rows || 6}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    className={baseInputClasses}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                />
            );
        }

        if (field.type === 'pdf-upload') {
            return (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <PDFUpload
                        onUploadSuccess={(uploadedFile) => handlePDFUploadSuccess(field.name, uploadedFile)}
                        onUploadError={handlePDFUploadError}
                        maxSize={field.maxSize || 10}
                        maxFiles={field.maxFiles || 3}
                        autoUpload={true}
                        className="mt-2"
                    />
                    {field.placeholder && (
                        <p className="text-sm text-gray-500 mt-1">{field.placeholder}</p>
                    )}
                </div>
            );
        }

        if (field.type === 'tel') {
            return (
                <div className="flex flex-col sm:flex-row items-start gap-2">
                    <div className="flex items-center gap-2 rounded-md border border-[var(--border-color)]/40 bg-white px-3 py-2 text-sm min-w-fit sm:w-auto">
                        <span className="text-base">🇦🇪</span>
                        <span className="text-[var(--secondary-color)]">+971</span>
                        <span className="ml-1 select-none">▾</span>
                    </div>
                    <input
                        type="tel"
                        name={field.name}
                        required={field.required}
                        placeholder={field.placeholder}
                        className={`flex-1 ${baseInputClasses}`}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                    />
                </div>
            );
        }

        return (
            <input
                type={field.type}
                name={field.name}
                required={field.required}
                placeholder={field.placeholder}
                className={baseInputClasses}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
            />
        );
    };

    return (
        <section className="py-2 lg:px-6">
            {/* <div className="w-full max-w-4xl rounded-2xl border border-[var(--border-color)]/30 bg-white/80 backdrop-blur shadow-sm"> */}
            <div className="w-full rounded-2xl border border-[var(--border-color)]/30 bg-white/80 backdrop-blur shadow-sm">
                <div className="px-6 pt-6 pb-2">
                    {/* <h2 className="font-semibold text-[var(--secondary-color)]"> */}
                    <h2 className="!text-subtitle-text-size font-semibold text-[var(--secondary-color)]">
                        {config.title}
                    </h2>
                    {/* <p className="mt-1 text-sm text-[color:oklch(0.35_0.02_180)]"> */}
                    <p className="mt-1 text-sm lg:text-form-text-size text-[color:oklch(0.35_0.02_180)]">
                        {config.description}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {config.fields.map((field) => (
                            <div key={field.name} className={field.gridCols === 2 ? "md:col-span-2" : ""}>
                                {/* <label className="mb-1 block text-sm font-medium text-[var(--secondary-color)]"> */}
                                <label className="mb-1 block text-sm lg:text-form-text-size font-medium text-[var(--secondary-color)]">
                                    {field.label}
                                    {field.required && <span className="text-red-500">*</span>}
                                </label>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 flex justify-center">
                        {formType === 'applyForNomination' && showPayment ? (
                            <NominationPayment
                                formData={formData}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                            />
                        ) : (
                            <CustomButton 
                                type="submit" 
                                className="min-w-40 px-6 py-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : config.submitButtonText}
                            </CustomButton>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
};

export default UnifiedForm;
