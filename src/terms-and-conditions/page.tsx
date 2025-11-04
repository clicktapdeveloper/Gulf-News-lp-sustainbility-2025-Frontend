import BackButton from "@/components/BackButton";

const TermsAndConditionsPage = () => {
    return (
        <div className="relative mt-10">
            <div className="absolute -left-4 -top-6 z-20 px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding">
                <BackButton />
            </div>
            <div 
            className="px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding py-mobile-padding sm:py-tablet-padding lg:py-desktop-padding"
            >
                <div className="mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold mb-6">
                        <p className="text-[var(--tertiary-color)]">Terms &</p>
                        <p className="text-[var(--secondary-color)]">Conditions</p>
                    </h1>
                    
                    <div className="text-sm lg:text-base mb-8">
                        <p className="font-semibold text-lg mb-2">Sustainability Excellence Awards 2025</p>
                        <p className="text-gray-600 mb-8">Powered by Gulf News & BeingShe</p>
                    </div>

                    <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
                        <section>
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-4">1. Introduction</h2>
                            <p>
                                These Terms and Conditions govern participation in the Sustainability Excellence Awards 2025 powered by Gulf News and BeingShe ("the Awards"). By confirming participation, submitting materials, or attending the Awards, all nominees and participants ("You") agree to be bound by these Terms. If You do not agree, You must not proceed with participation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-4">2. Definitions</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Awards:</strong> Sustainability Excellence Awards 2025 powered by Gulf News & BeingShe.</li>
                                <li><strong>Nominee/Participant:</strong> Any individual, organization, or entity nominated for an award category.</li>
                                <li><strong>Organizing Committee:</strong> The Gulf News and BeingShe representatives managing the Awards.</li>
                                <li><strong>Content:</strong> Any text, images, video, audio, or documentation submitted by a nominee or created by the organizers for promotional or judging purposes.</li>
                                <li><strong>Nomination Fee:</strong> The non-refundable payment made to participate in the Awards.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-4">3. Next Steps for Nominees</h2>
                            <ul className="list-disc pl-6 space-y-3">
                                <li><strong>Confirm Participation:</strong> Finalists must confirm acceptance and attendance by [insert deadline date] via email to the organizing committee.</li>
                                <li><strong>Submit Supporting Materials:</strong> All nominees must provide:
                                    <ul className="list-circle pl-6 mt-2 space-y-1">
                                        <li>A brief sustainability impact summary (max 500 words)</li>
                                        <li>Relevant visuals, data, or documentation</li>
                                        <li>Optional: a 2-minute video pitch or testimonial</li>
                                    </ul>
                                </li>
                                <li><strong>Select Winner Package:</strong> Choose from the available marketing packages and confirm selection by [insert date].</li>
                                <li><strong>Coordinate Media & PR:</strong> Once confirmed, nominees will be contacted to schedule interviews, PR features, and social media content.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-4">4. Nomination Fees</h2>
                            <p>
                                All nomination and participation fees are non-refundable, regardless of withdrawal, disqualification, or outcome. Payment of any fee does not guarantee shortlisting, finalist status, or winning an award. Fees cover administrative and operational costs of the Awards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-4">5. Jury and Evaluation Process</h2>
                            <p>
                                Entries are reviewed by an independent jury panel appointed by the Organizing Committee. Jury members are selected for their expertise and neutrality. Evaluation is based on the published criteria: Impact, Innovation, Leadership, Scalability, Alignment, and Transparency. All judging decisions are final. The Organizing Committee may withhold awards in categories not meeting required standards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-4">6. Mandatory PR Package for Winners</h2>
                            <p>
                                All winners must participate in a mandatory PR and media visibility package managed by Gulf News and BeingShe. This includes editorial features on GN.com, social media coverage, and visibility across Gulf News and BeingShe platforms. Winners agree to participate in interviews, photography, or video sessions arranged by the organizers. This PR package is a required component of the Awards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-4">7. Marketing Packages & Costs</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse border border-gray-300 mt-4">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Package</th>
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Price (AED)</th>
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Deliverables</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-3 font-medium">Package 1</td>
                                            <td className="border border-gray-300 px-4 py-3">25,000 + VAT</td>
                                            <td className="border border-gray-300 px-4 py-3">
                                                Award Presentation, Customized Sustainable Trophy, Certificate of Excellence, PR Article on GN.com, Sit-down Video Interview (shared on GN & BeingShe socials), Instagram Post & Feature, Full Page Gulf News Print Supplement, 6 VIP Passes, VIP Dinner Access
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-3 font-medium">Package 2</td>
                                            <td className="border border-gray-300 px-4 py-3">20,000 + VAT</td>
                                            <td className="border border-gray-300 px-4 py-3">
                                                Award Presentation, Customized Sustainable Trophy, Certificate of Excellence, PR Article on GN.com, Half Page Gulf News Print Supplement, 4 VIP Passes, VIP Dinner Access
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-4">8. Disclaimer</h2>
                            <p>
                                Participation in the Sustainability Excellence Awards does not guarantee selection as a winner or media coverage beyond the deliverables outlined in the chosen package. All judging decisions are final and based on the published criteria: Impact, Innovation, Leadership, Scalability, Alignment, and Transparency. Gulf News and BeingShe reserve the right to modify award categories, judging panels, timelines, or event format without prior notice. By participating, nominees grant permission for their submitted materials, interviews, and visuals to be used across Gulf News and BeingShe platforms for promotional, editorial, and media purposes. All participation fees are non-refundable once confirmation is received.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-4">9. Intellectual Property</h2>
                            <p>
                                All materials and media assets created for the Awards remain the property of Gulf News and BeingShe. Nominees must ensure all submissions are original and non-infringing. By submitting content, nominees grant Gulf News and BeingShe a royalty-free, worldwide license to use materials for award-related and promotional purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-4">10. Liability</h2>
                            <p>
                                Gulf News and BeingShe are not liable for loss or damage arising from participation, schedule changes, or technical issues. No liability is accepted for indirect or consequential losses. Nothing limits liability for fraud, negligence, or personal injury.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-4">11. Data Protection and Privacy</h2>
                            <p>
                                All personal and business information will be used only for Awards administration, marketing, and media features. By submitting information, nominees consent to its use for publicity. Data will be handled per UAE data protection regulations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-4">12. Modifications</h2>
                            <p>
                                The organizers reserve the right to amend these Terms at any time. Updates will be shared via official channels. Continued participation confirms acceptance of changes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-4">13. Contact Information</h2>
                            <p className="mb-2">
                                <strong>Organizing Committee – Sustainability Excellence Awards 2025</strong>
                            </p>
                            <p className="mb-1">
                                Email: <a href="mailto:event@gulfnews-events.com" className="text-[var(--secondary-color)] hover:underline font-medium">event@gulfnews-events.com</a>
                            </p>
                            <p>
                                Website: <a href="https://gulfnews-events.com" target="_blank" rel="noopener noreferrer" className="text-[var(--secondary-color)] hover:underline font-medium">https://gulfnews-events.com</a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditionsPage;

