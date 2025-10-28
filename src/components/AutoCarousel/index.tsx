import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type AutoCarouselProps = {
    children: React.ReactNode
    autoPlayMs?: number
    pauseOnHover?: boolean
    className?: string
    showControls?: boolean
    allowManualControl?: boolean
}

// A lightweight, dependency-free horizontal carousel with auto-scroll and seamless looping.
// - Renders children in a horizontal row
// - Duplicates the children once to enable an infinite-loop illusion
// - Advances by one item per tick
// - Responsive: shows 1/2/4 items per view via Tailwind basis classes
const AutoCarousel: React.FC<AutoCarouselProps> = ({ children, autoPlayMs = 2500, pauseOnHover = true, className = '', showControls = false, allowManualControl = false }) => {
    const originalChildrenArray = useMemo(() => React.Children.toArray(children), [children])
    const duplicatedChildrenArray = useMemo(() => originalChildrenArray.concat(originalChildrenArray), [originalChildrenArray])

    const containerRef = useRef<HTMLDivElement | null>(null)
    const trackRef = useRef<HTMLDivElement | null>(null)
    const firstItemRef = useRef<HTMLDivElement | null>(null)

    const [itemWidth, setItemWidth] = useState<number>(0)
    const [index, setIndex] = useState<number>(0)
    const [isAnimating, setIsAnimating] = useState<boolean>(true)
    const [isPaused, setIsPaused] = useState<boolean>(false)

    const measure = useCallback(() => {
        if (!firstItemRef.current) return
        const width = firstItemRef.current.getBoundingClientRect().width
        if (width > 0) setItemWidth(width)
    }, [])

    useEffect(() => {
        measure()
        const observer = new ResizeObserver(() => measure())
        if (containerRef.current) observer.observe(containerRef.current)
        if (firstItemRef.current) observer.observe(firstItemRef.current)
        return () => observer.disconnect()
    }, [measure])

    // Advance the carousel at an interval
    useEffect(() => {
        if (autoPlayMs <= 0) return
        if (isPaused) return
        const id = window.setInterval(() => {
            setIndex((prev) => prev + 1)
            setIsAnimating(true)
        }, autoPlayMs)
        return () => window.clearInterval(id)
    }, [autoPlayMs, isPaused])

    // Seamless loop: when the index reaches the original length, jump back without animation
    useEffect(() => {
        const total = duplicatedChildrenArray.length
        const half = originalChildrenArray.length
        if (half === 0) return
        if (index >= total - half) {
            // After the animated move completes, disable transition and reset index
            const timeout = window.setTimeout(() => {
                setIsAnimating(false)
                setIndex((curr) => curr % half)
            }, 50)
            return () => window.clearTimeout(timeout)
        } else if (index < 0) {
            setIsAnimating(false)
            setIndex(half + index)
        } else {
            setIsAnimating(true)
        }
    }, [index, duplicatedChildrenArray.length, originalChildrenArray.length])

    const translateX = -(index * itemWidth)

    const handleNext = useCallback(() => {
        setIndex((prev) => prev + 1)
        setIsAnimating(true)
        setIsPaused(true)
    }, [])

    const handlePrev = useCallback(() => {
        setIndex((prev) => prev - 1)
        setIsAnimating(true)
        setIsPaused(true)
    }, [])

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
            onMouseEnter={pauseOnHover ? () => setIsPaused(true) : undefined}
            onMouseLeave={pauseOnHover ? () => setIsPaused(false) : undefined}
        >
            <div
                ref={trackRef}
                className="flex items-stretch"
                style={{
                    transform: `translateX(${Number.isFinite(translateX) ? translateX : 0}px)`,
                    transition: isAnimating ? 'transform 600ms ease' : 'none',
                    willChange: 'transform'
                }}
            >
                {duplicatedChildrenArray.map((child, i) => (
                    <div
                        key={i}
                        ref={i === 0 ? firstItemRef : undefined}
                        className="flex-none basis-full sm:basis-1/2 lg:basis-1/3 px-2 sm:px-3"
                    >
                        {child}
                    </div>
                ))}
            </div>
            
            {showControls && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
                        aria-label="Previous"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
                        aria-label="Next"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    )
}

export default AutoCarousel


