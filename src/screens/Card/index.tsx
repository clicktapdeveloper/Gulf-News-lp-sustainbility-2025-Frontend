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

const Card: React.FC<CardProps> = ({ iconSrc, title, description, subtitle, extraText, extraHref, variant = 'dark' }) => {
    const isDark = variant === 'dark'
    return (
        <div
            className={
                isDark
                    ? 'bg-[var(--secondary-color)] text-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.15)]'
                    : 'bg-white text-[var(--secondary-color)] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
            }
        >
            <div className="flex flex-col items-center gap-3 mb-4">
                <img src={iconSrc} alt="icon" className="h-10 w-10" />
                <h3 className={`${isDark ? 'font-semibold text-white' : 'font-semibold text-[var(--secondary-color)]'} border p-2`}>{title}</h3>
            </div>
            <p className={isDark ? 'text-white/85 text-sm' : 'text-[var(--secondary-color)] text-sm'}>{description}</p>
            {subtitle ? (
                <p className={isDark ? 'mt-2 text-white/70 text-xs' : 'mt-2 text-[color:oklch(0.35_0.02_180)] text-xs'}>{subtitle}</p>
            ) : null}
            {extraText ? (
                extraHref ? (
                    <a href={extraHref} className={isDark ? 'mt-3 inline-block text-white underline text-xs' : 'mt-3 inline-block text-[var(--secondary-color)] underline text-xs'}>
                        {extraText}
                    </a>
                ) : (
                    <span className={isDark ? 'mt-3 inline-block text-white underline text-xs' : 'mt-3 inline-block text-[var(--secondary-color)] underline text-xs'}>
                        {extraText}
                    </span>
                )
            ) : null}
        </div>
    )
}

export default Card


