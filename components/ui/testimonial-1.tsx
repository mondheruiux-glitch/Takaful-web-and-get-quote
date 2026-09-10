'use client';

"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { ArrowDown, ArrowUp, Shield, Scale, Home, Heart } from "lucide-react";
import { useState } from "react";
import { PillBadge } from "@/components/ui/pill-badge";
import { motion } from "framer-motion";

export default function Testimonial1() {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const stats = [
    {
      percentage: "100%",
      label: "sharia compliant",
      isIncrease: true,
      Icon: Shield,
      company: "Ethical"
    },
    {
      percentage: "0%",
      label: "interest (riba)",
      isIncrease: false,
      Icon: Scale,
      company: "Pure"
    },
    {
      percentage: "40%",
      label: "cheaper on average",
      isIncrease: false,
      Icon: Home,
      company: "Savings"
    },
    {
      percentage: "£2M+",
      label: "surplus returned",
      isIncrease: true,
      Icon: Heart,
      company: "Community"
    },
  ];
  
  return (
    <div className="bg-white w-full grid place-content-center py-24 px-4 md:px-8 lg:px-16 relative border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Animated header container */}
        <motion.div
          className="text-center max-w-screen-xl mx-auto relative text-neutral-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Community Badge */}
          <div className="flex justify-center mb-8">
            <PillBadge text="Our Community" className="mb-0" />
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-5xl font-normal font-heading leading-tight">
            We make it easy for <br className="sm:hidden" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block mx-2 align-middle relative">
                    <div className="relative overflow-hidden sm:w-16 w-12 h-12 origin-center transition-all duration-300 md:hover:w-36 rounded-full border-2 border-white">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
                        alt="Person smiling"
                        className="object-cover w-full h-full"
                        style={{ objectPosition: "center" }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="max-w-xs bg-white text-black p-4 rounded-lg shadow-lg border-none"
                >
                  <p className="mb-2 text-sm">
                    "Finding a genuinely halal way to protect our new home was a priority. This gave us total peace of mind without compromising our beliefs."
                  </p>
                  <p className="font-medium text-sm">Aisha Rahman</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            families and
          </h1>

          <h1 className="text-2xl md:text-3xl lg:text-5xl font-normal font-heading leading-tight">
            their
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block mx-2 align-middle">
                    <div className="relative overflow-hidden sm:w-16 w-14 h-14 origin-center transition-all duration-300 lg:hover:w-36 md:hover:w-24 rounded-full border-2 border-white">
                      <img
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200"
                        alt="Employee"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="max-w-xs bg-white text-black p-4 rounded-lg shadow-lg border-none z-50"
                >
                  <p className="mb-2 text-sm">
                    "I love that my contributions help others when they need it most, and any surplus comes back to the community."
                  </p>
                  <p className="font-medium text-sm">Omar Farooq</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            communities to protect and
          </h1>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-normal font-heading text-[#333333] leading-tight">
            secure their homes
          </h1>
        </motion.div>
        
        <div className="sm:flex grid grid-cols-2 gap-8 bg-neutral-100 mt-12 w-full mx-auto px-8 py-6 border rounded-md border-neutral-200">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="flex-1 flex gap-4 pl-6 sm:pl-10 relative"
            >
              {index !== 0 && (
                <div className="w-0.5 h-9 border border-dashed border-neutral-300 absolute left-0" />
              )}
              <div className="w-full h-16 group relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-0 group-hover:-translate-y-full opacity-100 group-hover:opacity-0 transition-all duration-300 ease-out text-gray-500">
                  <stat.Icon className="w-8 h-8 mb-1" strokeWidth={1.5} />
                  <span className="text-xs font-medium uppercase tracking-wider">{stat.company}</span>
                </div>
                
                <div className="absolute inset-0 translate-y-full opacity-0 flex flex-col items-center justify-center w-full group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                  <div className="flex items-center justify-center gap-2 relative">
                    {stat.isIncrease ? (
                      <ArrowUp className="md:w-6 md:h-6 w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="md:w-6 md:h-6 w-4 h-4 text-gray-800" />
                    )}
                    <span className="md:text-3xl text-2xl font-semibold text-gray-800">
                      {stat.percentage}
                    </span>
                  </div>
                  <p className="text-gray-800 md:text-sm text-xs text-center capitalize">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
