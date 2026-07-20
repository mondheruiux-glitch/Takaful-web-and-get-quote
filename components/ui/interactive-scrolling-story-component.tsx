import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, Shield, RefreshCcw } from 'lucide-react';

// --- Data for each slide ---
const slidesData = [
  {
    title: "Join the Community",
    description: "Members contribute into a shared pool (Tabarru) designed to help each other in times of loss, rather than paying a premium to an insurer.",
    icon: <UserPlus size={20} strokeWidth={2.5} />,
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
    bgColor: "transparent",
    textColor: "#05362B",
  },
  {
    title: "Full Protection",
    description: "If your home suffers damage, funds are released from the pool. Claims are handled with fairness and speed, prioritized by need.",
    icon: <Shield size={20} strokeWidth={2.5} />,
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
    bgColor: "transparent",
    textColor: "#05362B",
  },
  {
    title: "Surplus Sharing",
    description: "At the end of the year, any surplus money remaining in the pool isn't kept as profit—it's distributed back to you or donated to charity.",
    icon: <RefreshCcw size={20} strokeWidth={2.5} />,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    bgColor: "transparent",
    textColor: "#05362B",
  }
];

// --- Main App Component ---
export function ScrollingFeatureShowcase() {
  // State to track the currently active slide index
  const [activeIndex, setActiveIndex] = useState(0);
  // Ref to the main scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Ref to the sticky content panel
  const stickyPanelRef = useRef<HTMLDivElement>(null);

  // --- Scroll Handler ---
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollableHeight = container.scrollHeight - window.innerHeight;
      const stepHeight = scrollableHeight / slidesData.length;
      const newActiveIndex = Math.min(
        slidesData.length - 1,
        Math.floor(container.scrollTop / stepHeight)
      );
      setActiveIndex(newActiveIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic styles for the background and text color transitions
  const dynamicStyles = {
    backgroundColor: slidesData[activeIndex].bgColor,
    color: slidesData[activeIndex].textColor,
    transition: 'background-color 0.7s ease, color 0.7s ease',
  };

  // Styles for the grid pattern on the right side
  const gridPatternStyle = {
    '--grid-color': 'rgba(0, 0, 0, 0.05)',
    backgroundImage: `
      linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
      linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
    `,
    backgroundSize: '3.5rem 3.5rem',
  } as React.CSSProperties;

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen w-full overflow-y-auto"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <div style={{ height: `${slidesData.length * 100}vh` }}>
        <div ref={stickyPanelRef} className="sticky top-0 h-screen w-full flex flex-col items-center justify-center" style={dynamicStyles}>
          <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full max-w-7xl mx-auto">

            {/* Left Column: Text Content, Pagination & Button */}
            <div className="relative flex flex-col justify-center p-8 md:p-16 border-r border-black/10">
              {/* Pagination Bars */}
              <div className="absolute top-16 left-16 flex space-x-2">
                {slidesData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                        const container = scrollContainerRef.current;
                        if(container){
                            const scrollableHeight = container.scrollHeight - window.innerHeight;
                            const stepHeight = scrollableHeight / slidesData.length;
                            container.scrollTo({ top: stepHeight * index, behavior: 'smooth' });
                        }
                    }}
                    className={`h-1 rounded-full transition-all duration-500 ease-in-out ${
                      index === activeIndex ? 'w-12 bg-black/80' : 'w-6 bg-black/20'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="relative h-[340px] w-full">
                {slidesData.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === activeIndex
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#F0FDF8] text-[#05362B] flex items-center justify-center mb-6">
                      {slide.icon}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">{slide.title}</h2>
                    <p className="mt-4 text-lg md:text-xl max-w-md opacity-80 leading-relaxed">{slide.description}</p>
                  </div>
                ))}
              </div>

              {/* Get Started Button */}
              <div className="mt-6">
                <a
                  href="#get-started"
                  className="px-8 py-4 bg-[#00c685] hover:bg-[#00a871] text-white font-semibold rounded-full uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#00c685]/40 inline-block shadow-lg shadow-[#00c685]/20"
                >
                  Get Started
                </a>
              </div>
            </div>

            {/* Right Column: Image Content with Grid Background */}
            <div className="hidden md:flex items-center justify-center p-8" style={gridPatternStyle}>
              <div className="relative w-[80%] h-[60vh] rounded-[28px] overflow-hidden shadow-2xl border border-black/5">
                <div
                  className="absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                >
                  {slidesData.map((slide, index) => (
                    <div key={index} className="w-full h-full">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-full w-full object-cover transition-transform duration-[10s] hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src = `https://placehold.co/800x1200/e2e8f0/4a5568?text=Image+Not+Found`;
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Floating Glassy Card */}
                <div className="absolute bottom-6 left-6 w-[360px] max-w-[calc(100%-48px)] bg-white/70 backdrop-blur-xl rounded-[18px] p-7 shadow-2xl z-10 border border-white/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-3xl hover:bg-white/80 group">
                  <h4 className="font-bold text-gray-900 mb-2">Fairness starts with understanding</h4>
                  <p className="text-gray-700 text-sm mb-5 leading-relaxed">
                    Our guided process keeps things simple. You'll always know what we're asking and why.
                  </p>
                  <div className="flex items-center gap-2 text-[#00c685] font-bold tracking-wide">
                    <div className="w-5 h-5 rounded-full border-[2.5px] border-[#00c685]" />
                    takaful
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
