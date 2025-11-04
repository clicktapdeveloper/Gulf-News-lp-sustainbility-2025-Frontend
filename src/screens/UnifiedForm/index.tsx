import CustomButton from "@/screens/CustomButton";
import NominationPayment from "@/components/Payment/NominationPayment";
import PDFUpload from "@/components/Upload/PDFUpload";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENV_CONFIG } from "@/config/env";
import type { UploadedFile } from "@/lib/pdf-upload-service";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { nominationAPIService, type NominationFormData } from "@/lib/nomination-api-service";
import { nominationLocalStorageService } from "@/lib/nomination-localstorage-service";

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
    type: 'text' | 'email' | 'tel' | 'textarea' | 'file' | 'pdf-upload' | 'select';
    placeholder: string;
    required: boolean;
    gridCols?: 1 | 2; // For grid layout
    maxLength?: number;
    rows?: number; // For textarea
    maxSize?: number; // For PDF upload (in MB)
    maxFiles?: number; // For PDF upload
    options?: string[]; // For select dropdowns
}

const FORM_CONFIGS: Record<string, FormConfig> = {
    applyForNomination: {
        title: "Nominate Now",
        description: "",
        submitButtonText: "Pay AED 499 for Register",
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
                type: "pdf-upload",
                placeholder: "Upload your trade license document (PDF)",
                required: true,
                gridCols: 1,
                maxSize: 10, // 10MB limit
                maxFiles: 1  // Maximum 1 file (single trade license)
            },
            {
                name: "category",
                label: "Select Category",
                type: "select",
                placeholder: "Select Category",
                required: true,
                gridCols: 1,
                options: [
                    "Construction",
                    "Property Development",
                    "Free Zones",
                    "Business Set Up",
                    "Education",
                    "Healthcare",
                    "Maritime & Logistics",
                    "Retail",
                    "Fashion & Textiles",
                    "Tourism & Hospitality",
                    "Manufacturing",
                    "Transport & Mobility",
                    "Electric Vehicles",
                    "Food & Beverage",
                    "Renewable Energy",
                    "Energy Management",
                    "Finance",
                    "Technology",
                    "Start-Ups",
                    "Leadership (Individual)",
                    "Aviation",
                    "Fragrances & Cosmetics",
                    "Food & Agriculture",
                    "Investments & ESG",
                    "Travel & Hospitality"
                ]
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
                label: "Tell us why you deserve to win?",
                type: "textarea",
                placeholder: "(1000 words)",
                required: false,
                rows: 6,
                gridCols: 2
            }
        ]
    },
    inquireAboutSponsorship: {
        title: "Become a Sponsor",
        description: "Submit your details to explore sponsorship opportunities at the Sustainability Excellence Awards 2025.",
        submitButtonText: "Submit",
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
                label: "Tell us why you want to be a sponsor?",
                type: "textarea",
                placeholder: "(1000 words)",
                required: false,
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
                label: "Tell us why you want to register?",
                type: "textarea",
                placeholder: "(1000 words)",
                required: false,
                rows: 6,
                gridCols: 2
            }
        ]
    },
    becomeEventSponsor: {
        title: "Send Us A Message",
        description: "Join industry leaders, innovators, and changemakers shaping a sustainable future.",
        submitButtonText: "Submit",
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
                label: "Tell us why you want to be sponsor?",
                type: "textarea",
                placeholder: "(1000 words)",
                required: false,
                rows: 6,
                gridCols: 2
            }
        ]
    }
};

interface UnifiedFormProps {
    formType: 'applyForNomination' | 'inquireAboutSponsorship' | 'registerForAttend' | 'becomeEventSponsor';
}

const UnifiedForm = ({ formType }: UnifiedFormProps) => {
    const config = FORM_CONFIGS[formType];
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile[]>>({}); // Used in PDF upload handlers
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPayment, setShowPayment] = useState(false); // Control payment form visibility
    const [acceptedTerms, setAcceptedTerms] = useState(false);
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
        
        // Restrict phone number fields to only 9 digits
        if (name === 'phone') {
            // Remove all non-digit characters and limit to 9 digits
            const digitsOnly = value.replace(/\D/g, '').slice(0, 9);
            setFormData(prev => ({ ...prev, [name]: digitsOnly }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
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

    const MAX_MESSAGE_WORDS = 1000;
    const limitWords = (text: string, maxWords: number) => {
        const words = text.trim().split(/\s+/);
        if (words.filter(Boolean).length <= maxWords) return text;
        return words.slice(0, maxWords).join(' ');
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const limited = limitWords(value, MAX_MESSAGE_WORDS);
        setFormData(prev => ({ ...prev, [name]: limited }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Prevent form submission if payment is already shown
        if (showPayment) {
            console.log('Payment already shown, preventing form submission');
            return;
        }
        
        // Validate terms acceptance for nomination form
        if (formType === 'applyForNomination' && !acceptedTerms) {
            showErrorToast('Please check the Terms & Conditions checkbox to proceed.');
            return;
        }
        
        if (formType === 'applyForNomination') {
            // For nomination forms, submit to MongoDB with 'unpaid' status first
            setIsSubmitting(true);
            try {
                await submitNominationForm();
            } catch (error) {
                console.error('Nomination form submission error:', error);
                showErrorToast('Failed to submit nomination form. Please try again with correct phone number and other compulsory data.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            // For other forms, use the existing logic
            setIsSubmitting(true);
            try {
                await submitForm(formType, formData);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const submitNominationForm = async () => {
        console.log('=== SUBMITTING NOMINATION FORM ===');
        
        // Prevent double submission
        if (isSubmitting) {
            console.log('Form already submitting, ignoring duplicate submission');
            return;
        }
        
        setIsSubmitting(true);
        console.log('Form Data:', formData);
        console.log('Uploaded Files:', uploadedFiles);

        // Prepare uploaded file URLs
        const uploadedFileUrls = Object.keys(uploadedFiles).reduce((acc, key) => {
            acc[key] = uploadedFiles[key].map(file => file.url);
            return acc;
        }, {} as Record<string, string[]>);

        // Validate required file uploads
        const tradeLicenseFiles = uploadedFileUrls.tradeLicense || [];
        
        if (tradeLicenseFiles.length === 0) {
            setIsSubmitting(false);
            showErrorToast('Please upload a Trade License document.');
            return;
        }
        
        // supportingDocument is optional; no validation required

        // Prepare nomination form data
        const nominationFormData: NominationFormData = {
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            email: formData.email || '',
            companyName: formData.companyName2 || formData.companyName || '',
            designation: formData.designation || '',
            phone: formData.phone ? `+971${formData.phone}` : '',
            category: formData.category || undefined,
            tradeLicense: uploadedFileUrls.tradeLicense?.join(',') || undefined,
            supportingDocument: uploadedFileUrls.supportingDocument?.join(',') || undefined,
            message: formData.message || undefined
        };

        console.log('Prepared nomination form data:', nominationFormData);

        // Submit to backend
        const result = await nominationAPIService.submitNominationForm(nominationFormData);
        
        if (result.success && result.objectId) {
            console.log('Nomination form submitted successfully with ObjectId:', result.objectId);
            
            // Save ObjectId and form data to localStorage
            const saved = nominationLocalStorageService.saveNominationData(
                result.objectId,
                formData,
                uploadedFileUrls
            );
            
            if (saved) {
                // Store nomination ID for payment verification
                localStorage.setItem('nominationId', result.objectId);
                localStorage.setItem('nominationEmail', formData.email || '');
                
                // Only show payment if not already shown
                if (!showPayment) {
                    setShowPayment(true); // Automatically show payment form
                    showSuccessToast('Nomination form submitted successfully! Please complete your payment.');
                } else {
                    console.log('Payment form already shown, skipping duplicate display');
                }
            } else {
                throw new Error('Failed to save nomination data locally');
            }
        } else {
            console.error('Failed to submit nomination form:', result.error);
            throw new Error(result.error || 'Failed to submit nomination form');
        }
    };

    const submitForm = async (type: string, data: Record<string, string>) => {
        console.log('=== SUBMIT FORM TO BACKEND ===');
        console.log('Form Type:', type);
        console.log('Form Data:', data);
        
        // Automatically add +971 country code to phone numbers
        const processedData = { ...data };
        if (processedData.phone) {
            processedData.phone = `+971${processedData.phone}`;
        }
        
        let endpoint: string;
        
        switch (type) {
            case 'applyForNomination':
                endpoint = '/api/nomination';
                break;
            case 'inquireAboutSponsorship':
                endpoint = '/api/sponsorship';
                break;
            case 'becomeEventSponsor':
                // Reuse the same sponsorship endpoint for this form type
                endpoint = '/api/sponsorship';
                break;
            case 'registerForAttend':
                endpoint = '/api/register-attendee';
                break;
            default:
                throw new Error('Unknown form type');
        }
        
        console.log('API Endpoint:', `${ENV_CONFIG.API_BASE_URL}${endpoint}`);
        console.log('Request Body:', JSON.stringify(processedData));
        
        const response = await fetch(`${ENV_CONFIG.API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(processedData),
        });

        console.log('Response Status:', response.status);
        console.log('Response OK:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response Error:', errorText);
            throw new Error('Failed to submit form');
        }

        const result = await response.json();
        console.log('Form submitted successfully:', result);
        console.log('=== BACKEND SUBMISSION COMPLETE ===');
        
        // Redirect to thankyou page with appropriate hash (only for non-nomination forms)
        if (type === 'inquireAboutSponsorship') {
            navigate('/thankyou#inquire-about-sponsorship');
        } else if (type === 'registerForAttend') {
            navigate('/thankyou#register-for-attend');
        }
        // Note: Nomination forms redirect is handled in handlePaymentSuccess
    };

    const handlePaymentSuccess = async (paymentId?: string) => {
        console.log('=== PAYMENT SUCCESS HANDLER CALLED ===');
        console.log('Payment successful, payment ID:', paymentId);
        
        // Get saved nomination data from localStorage
        const savedNominationData = nominationLocalStorageService.getNominationData();
        
        console.log('=== SAVED NOMINATION DATA CHECK ===');
        console.log('savedNominationData:', savedNominationData);
        console.log('savedNominationData?.objectId:', savedNominationData?.objectId);
        console.log('typeof savedNominationData?.objectId:', typeof savedNominationData?.objectId);
        
        if (!savedNominationData || !savedNominationData.objectId) {
            console.error('No saved nomination data found for payment update');
            console.error('savedNominationData:', savedNominationData);
            showErrorToast('Payment successful but failed to update nomination. Please contact support.');
            return;
        }
        
        try {
            // Generate a transaction ID for this payment
            const transactionId = paymentId || `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            console.log('=== UPDATING NOMINATION PAYMENT STATUS ===');
            console.log('Saved ObjectId:', savedNominationData.objectId);
            console.log('Payment ID received:', paymentId);
            console.log('Generated Transaction ID:', transactionId);

            // Prepare payment data
            const paymentData = {
                paymentAmount: 499,
                paymentCurrency: 'AED',
                paymentDate: new Date().toISOString(),
                paymentReference: transactionId,
                paymentStatus: 'completed',
                paymentMethod: 'cybersource_hosted',
                cybersourceTransactionId: transactionId,
                authCode: '831000', // Mock auth code for cybersource_hosted
                authTime: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
                cardType: 'Visa' // Mock card type
            };

            console.log('Payment data for update:', paymentData);

            // Update the nomination with payment information using saved ObjectId
            const updateResult = await nominationAPIService.updateNominationPayment(
                savedNominationData.objectId, 
                paymentData
            );
            
            if (updateResult.success) {
                console.log('Nomination payment updated successfully:', updateResult);
                
                // Update localStorage status to 'paid'
                const localStorageUpdated = nominationLocalStorageService.updateNominationStatus(paymentData);
                
                if (localStorageUpdated) {
                    console.log('LocalStorage status updated to paid');
                }
                
                showSuccessToast('Payment successful! Your nomination has been completed.');
                
                // Navigate to success page with transaction ID and ObjectId
                const navigationUrl = `/nomination/success?transaction_id=${transactionId}&object_id=${savedNominationData.objectId}`;
                console.log('=== NAVIGATION TO SUCCESS PAGE ===');
                console.log('Navigation URL:', navigationUrl);
                console.log('Transaction ID:', transactionId);
                console.log('Object ID:', savedNominationData.objectId);
                navigate(navigationUrl);
            } else {
                console.error('Failed to update nomination payment:', updateResult.error);
                showErrorToast('Payment successful! Your nomination data is saved, but payment update failed. Please contact support.');
                
                // Navigate to success page with transaction ID and ObjectId even if update failed
                const navigationUrl = `/nomination/success?transaction_id=${transactionId}&object_id=${savedNominationData.objectId}`;
                console.log('=== NAVIGATION TO SUCCESS PAGE (UPDATE FAILED) ===');
                console.log('Navigation URL:', navigationUrl);
                console.log('Transaction ID:', transactionId);
                console.log('Object ID:', savedNominationData.objectId);
                navigate(navigationUrl);
            }
            
            // Reset form and clear localStorage
            setFormData({});
            setUploadedFiles({});
            setShowPayment(false);
            nominationLocalStorageService.clearNominationData();
            
        } catch (error) {
            console.error('Failed to update nomination after payment:', error);
            showErrorToast('Payment successful but failed to update nomination. Please contact support.');
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
                    placeholder={field.placeholder}
                    className={baseInputClasses}
                    value={formData[field.name] || ''}
                    onChange={handleTextAreaChange}
                />
            );
        }

        if (field.type === 'pdf-upload') {
            return (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {/* {field.label} */}
                        {/* {field.required && <span className="text-red-500 ml-1">*</span>} */}
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

        if (field.type === 'select') {
            return (
                <select
                    name={field.name}
                    required={field.required}
                    className={baseInputClasses}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                >
                    <option value="" disabled>
                        {field.placeholder || 'Select an option'}
                    </option>
                    {(field.options || []).map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            );
        }

        if (field.type === 'tel') {
            return (
                <div className="flex items-start gap-2">
                    <div className="flex items-center gap-2 rounded-md border border-[var(--border-color)]/40 bg-white px-3 py-[5px] text-sm min-w-fit sm:w-auto">
                        <span className="text-base">🇦🇪</span>
                        <span className="text-[var(--secondary-color)]">+971</span>
                        <span className="ml-1 select-none">▾</span>
                    </div>
                    <input
                        type="tel"
                        name={field.name}
                        required={field.required}
                        placeholder="Enter phone number"
                        className={`flex-1 ${baseInputClasses}`}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        maxLength={9}
                        pattern="[0-9]{9}"
                        inputMode="numeric"
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
        <section className="py-2">
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

                    {formType === 'applyForNomination' && (
                        <div className="md:col-span-2 pt-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    required
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--secondary-color)] focus:ring-[var(--secondary-color)]"
                                />
                                <span className="text-sm lg:md text-gray-700">
                                    I agree to the{' '}
                                    <a
                                        href="/terms-and-conditions"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--secondary-color)] hover:underline font-medium"
                                    >
                                        Terms & Conditions
                                    </a>
                                </span>
                            </label>
                        </div>
                    )}

                    <div className="pt-2 flex justify-center">
                        {formType === 'applyForNomination' ? (
                            showPayment ? (
                                <NominationPayment
                                    formData={formData}
                                    onSuccess={handlePaymentSuccess}
                                    onError={handlePaymentError}
                                />
                            ) : (
                                <CustomButton 
                                    type="submit" 
                                    className="min-w-40 px-6 py-2"
                                    disabled={isSubmitting || !acceptedTerms}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Nomination Form'}
                                </CustomButton>
                            )
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
