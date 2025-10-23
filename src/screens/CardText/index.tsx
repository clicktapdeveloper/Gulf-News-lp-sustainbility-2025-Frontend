const CardText = ({text, variant = 'dark'}: {text: string, variant?: 'dark' | 'light'}) => {
    return <div className={`${variant === 'dark' ? 'text-white bg-[var(--secondary-color)]' : 'bg-[var(--card-color)] text-[var(--secondary-color)]'} text-center p-6`}>
        <p className="font-semibold">{text}</p>
    </div>
}

export default CardText;