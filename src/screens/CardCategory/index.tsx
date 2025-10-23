import React from 'react'

type CardProps = {
    iconSrc: string
    title: string
    description: string
    subtitle?: string
    extraText?: string
    extraHref?: string
    variant?: 'dark' | 'light'
}

const CardCategory: React.FC<CardProps> = ({ iconSrc, title, description, subtitle, extraText, extraHref, variant = 'dark' }) => {
    const isDark = variant === 'dark'
    return (
        <div
            className={
                `${isDark ? 'bg-[var(--secondary-color)] text-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.15)]' : 'bg-white text-[var(--secondary-color)] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]'} border-1 h-full flex flex-col`
            }
        >
            <div className="flex flex-col items-start gap-6 mb-6">
                <img src={iconSrc} alt="icon" className="h-10 w-10" />
                <h3 className={`${isDark ? 'text-white' : 'text-[var(--secondary-color)]'} text-xl font-semibold leading-snug text-start`}>{title}</h3>
            </div>
            <div className="flex-1 flex flex-col">
                <p className={`${isDark ? 'text-white/85 text-base leading-relaxed' : 'text-[color:oklch(0.35_0.02_180)] text-base leading-relaxed'} text-start`}>{description}</p>
                {subtitle ? (
                    <p className={`${isDark ? 'mt-6 italic text-white/90' : 'mt-6 italic text-[var(--secondary-color)]'}`}>{subtitle}</p>
                ) : null}
                <div className="mt-auto">
                    {extraText ? (
                        extraHref ? (
                            <a href={extraHref} className={`${isDark ? 'inline-block !text-white underline' : 'inline-block !text-[var(--secondary-color)] underline'} text-lg italic`}>
                                {extraText}
                            </a>
                        ) : (
                            <span className={`${isDark ? 'inline-block text-white underline' : 'inline-block text-[var(--secondary-color)] underline'} text-lg`}>
                                {extraText}
                            </span>
                        )
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default CardCategory


