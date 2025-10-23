import CustomButton from "@/screens/CustomButton";

const Form = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: wire up submit handler
    };

    return (
        <section className="lg:px-6 py-10">
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-[var(--border-color)]/30 bg-white/80 backdrop-blur shadow-sm">
                <div className="px-6 pt-6 pb-2">
                    {/* <h2 className="text-[var(--h2-size)] font-semibold text-[var(--secondary-color)]">Send Us A Message</h2> */}
                    <h2 className="!text-subtitle-text-size font-semibold text-[var(--secondary-color)]">Send Us A Message</h2>
                    <p className="mt-1 text-sm text-[color:oklch(0.35_0.02_180)]">We will get touch with you as soon as possible.</p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            {/* <label className="mb-1 block text-sm font-medium text-[var(--secondary-color)]">First Name<span className="text-red-500">*</span></label> */}
                            <label className="mb-1 block text-sm lg:text-form-text-size font-medium text-[var(--secondary-color)]">First Name<span className="text-red-500">*</span></label>
                            <input type="text" required placeholder="Enter your first name" className="w-full rounded-md border border-[var(--border-color)]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--secondary-color)] focus:ring-1 focus:ring-[var(--secondary-color)]" />
                        </div>
                        <div>
                            {/* <label className="mb-1 block text-sm font-medium text-[var(--secondary-color)]">Last Name<span className="text-red-500">*</span></label> */}
                            <label className="mb-1 block text-sm lg:text-form-text-size font-medium text-[var(--secondary-color)]">Last Name<span className="text-red-500">*</span></label>
                            <input type="text" required placeholder="Enter your last name" className="w-full rounded-md border border-[var(--border-color)]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--secondary-color)] focus:ring-1 focus:ring-[var(--secondary-color)]" />
                        </div>
                    </div>

                    <div>
                        {/* <label className="mb-1 block text-sm font-medium text-[var(--secondary-color)]">Email<span className="text-red-500">*</span></label> */}
                        <label className="mb-1 block text-sm lg:text-form-text-size font-medium text-[var(--secondary-color)]">Email<span className="text-red-500">*</span></label>
                        <input type="email" required placeholder="Enter your email address" className="w-full rounded-md border border-[var(--border-color)]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--secondary-color)] focus:ring-1 focus:ring-[var(--secondary-color)]" />
                    </div>

                    <div>
                        {/* <label className="mb-1 block text-sm font-medium text-[var(--secondary-color)]">Phone<span className="text-red-500">*</span></label> */}
                        <label className="mb-1 block text-sm lg:text-form-text-size font-medium text-[var(--secondary-color)]">Phone<span className="text-red-500">*</span></label>
                        <div className="flex flex-col sm:flex-row items-start gap-2">
                            <div className="flex items-center gap-2 rounded-md border border-[var(--border-color)]/40 bg-white px-3 py-2 text-sm">
                                <span className="text-base">🇦🇪</span>
                                <span className="text-[var(--secondary-color)]">+971</span>
                                <span className="ml-1 select-none">▾</span>
                            </div>
                            <input type="tel" required placeholder="Enter phone number" className="flex-1 rounded-md border border-[var(--border-color)]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--secondary-color)] focus:ring-1 focus:ring-[var(--secondary-color)]" />
                        </div>
                    </div>

                    <div>
                        {/* <label className="mb-1 block text-sm font-medium text-[var(--secondary-color)]">Message</label> */}
                        <label className="mb-1 block text-sm lg:text-form-text-size font-medium text-[var(--secondary-color)]">Message</label>
                        <textarea rows={6} placeholder="Enter your email address" className="w-full rounded-md border border-[var(--border-color)]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--secondary-color)] focus:ring-1 focus:ring-[var(--secondary-color)]" />
                    </div>

                    <div className="pt-2 flex justify-center">
                        <CustomButton type="submit" className="min-w-40 px-6 py-2">Submit</CustomButton>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Form;