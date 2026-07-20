'use client';

import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, Heart, TrendingUp, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import { PillBadge } from '@/components/ui/pill-badge'

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        },
    },
};

export function Features8() {
    return (
        <section className="bg-white py-16 md:py-32">
            <div className="mx-auto max-w-3xl lg:max-w-6xl px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={containerVariants}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.div variants={itemVariants}>
                            <PillBadge text="Why Takaful" className="mb-6" />
                        </motion.div>
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-6 tracking-tight">Protection built on principles</motion.h2>
                        <motion.p variants={itemVariants} className="text-lg text-gray-500 max-w-xl mx-auto">Traditional Islamic insurance model focused on community, transparency, and ethical values.</motion.p>
                    </motion.div>
                </div>
                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-4">

                        {/* Card 1 — 100% Transparent (2 cols) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0 }}
                            viewport={{ once: true }}
                            className="col-span-full lg:col-span-2"
                        >
                            <Card className="relative flex overflow-hidden h-full border-0 bg-gradient-to-br from-[#0a1a14] to-[#0d2a1e] group hover:shadow-2xl hover:shadow-[#00c685]/10 transition-all duration-500">
                                <CardContent className="relative m-0 p-0 size-full h-full min-h-[300px]">
                                    <div className="absolute inset-0">
                                        <img
                                            src="/transparent-flower.jpg"
                                            alt="100% Transparent"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Card 2 — Secure Capital (2 cols) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="col-span-full sm:col-span-3 lg:col-span-2"
                        >
                            <Card className="relative overflow-hidden h-full border border-gray-100 bg-white group hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
                                {/* Accent top border */}
                                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00c685] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <CardContent className="pt-8 pb-8">
                                    <div className="relative mx-auto flex aspect-square size-32 rounded-full border-2 border-[#00c685]/20 before:absolute before:-inset-3 before:rounded-full before:border before:border-[#00c685]/10">
                                        <Lock className="m-auto size-10 text-[#00c685] group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                                    </div>
                                    <div className="relative z-10 mt-8 space-y-2 text-center">
                                        <h2 className="text-lg font-semibold text-gray-900">Secure Capital</h2>
                                        <p className="text-gray-500 text-sm leading-relaxed">Funds held separately to protect members with no profit from denying claims.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Card 3 — Fair & Ethical with Chart (2 cols) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="col-span-full sm:col-span-3 lg:col-span-2"
                        >
                            <Card className="relative overflow-hidden h-full border-0 bg-gradient-to-b from-[#f0fdf8] to-white group hover:-translate-y-1 hover:shadow-xl hover:shadow-[#00c685]/10 transition-all duration-500">
                                <CardContent className="pt-8 pb-6">
                                    <div className="pt-2 lg:px-4">
                                        <svg className="w-full" viewBox="0 0 386 123" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="386" height="123" rx="10" fill="#f8fdfb"/>
                                            <g clipPath="url(#clip0_bento)">
                                                <motion.circle
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    whileInView={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                                    viewport={{ once: true }}
                                                    cx="29" cy="29" r="15" fill="#00c685"
                                                />
                                                <path d="M29 23V35" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M35 29L29 35L23 29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <text x="55" y="33" className="text-[13px] font-medium" fill="#1a1a1a">Download Report</text>
                                                <text x="240" y="33" className="text-[11px]" fill="#00c685">14,434 mbps</text>
                                            </g>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M3 123C3 123 14.3298 94.153 35.1282 88.0957C55.9266 82.0384 65.9333 80.5508 65.9333 80.5508C65.9333 80.5508 80.699 80.5508 92.1777 80.5508C103.656 80.5508 100.887 63.5348 109.06 63.5348C117.233 63.5348 117.217 91.9728 124.78 91.9728C132.343 91.9728 142.264 78.03 153.831 80.5508C165.398 83.0716 186.825 91.9728 193.761 91.9728C200.697 91.9728 206.296 63.5348 214.07 63.5348C221.844 63.5348 238.653 93.7771 244.234 91.9728C249.814 90.1684 258.8 60 266.19 60C272.075 60 284.1 88.057 286.678 88.0957C294.762 88.2171 300.192 72.9284 305.423 72.9284C312.323 72.9284 323.377 65.2437 335.553 63.5348C347.729 61.8259 348.218 82.07 363.639 80.5508C367.875 80.1335 372.949 82.2017 376.437 87.1008C379.446 91.3274 381.054 97.4325 382.521 104.647C383.479 109.364 382.521 123 382.521 123"
                                                fill="url(#paint_bento_chart)"
                                            />
                                            <motion.path
                                                d="M3 121C3 121 15.3 93.7 36 87.8C56.7 81.8 66.7 81 66.7 81C66.7 81 80 81 91.5 81C103 81 100.4 64.3 108.6 64.3C116.7 64.3 117.7 92.1 125.2 92.1C132.8 92.1 142.1 78.5 153.6 81C165.1 83.4 186.1 92.1 193 92.1C199.9 92.1 205.3 64.3 213 64.3C220.8 64.3 237.8 93.9 243.4 92.1C249 90.4 257.9 60.5 265.3 60.5C271.1 60.5 283.2 87.7 285.8 87.8C293.8 87.9 299.2 73.1 304.4 73.1C311.3 73.1 321.4 66 333.6 64.3C345.7 62.6 346.9 82.5 362.3 81C377.6 79.5 383 106.6 383 106.6"
                                                stroke="#00c685"
                                                strokeWidth="2.5"
                                                fill="none"
                                                initial={{ pathLength: 0 }}
                                                whileInView={{ pathLength: 1 }}
                                                transition={{ duration: 2, ease: "easeInOut", delay: 0.1 }}
                                                viewport={{ once: true }}
                                            />
                                            <defs>
                                                <linearGradient id="paint_bento_chart" x1="3" y1="60" x2="3" y2="123" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#00c685" stopOpacity="0.15" />
                                                    <stop offset="1" stopColor="#00c685" stopOpacity="0.02" />
                                                </linearGradient>
                                                <clipPath id="clip0_bento">
                                                    <rect width="358" height="30" fill="white" transform="translate(14 14)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="relative z-10 mt-8 space-y-2 text-center">
                                        <h2 className="text-lg font-semibold text-gray-900">Fair & Ethical</h2>
                                        <p className="text-gray-500 text-sm leading-relaxed">No profit from denying claims. Surplus returned to members or donated.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Card 4 — Regulated & Safe (3 cols — wide with image) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="col-span-full lg:col-span-3"
                        >
                            <Card className="relative overflow-hidden h-full border-0 group">
                                {/* Background animation */}
                                <div className="absolute inset-0 z-0">
                                    <ShaderAnimation />
                                </div>

                                <CardContent className="relative grid pt-8 pb-8 sm:grid-cols-2 gap-6 z-10">
                                    <div className="relative z-10 flex flex-col justify-between space-y-8">
                                        <motion.div
                                            whileHover={{ rotate: 5, scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className="relative flex aspect-square size-14 rounded-2xl bg-[#00c685]/20 border border-[#00c685]/30 items-center justify-center"
                                        >
                                            <Shield className="size-6 text-[#00c685]" strokeWidth={1.5} />
                                        </motion.div>
                                        <div className="space-y-3">
                                            <h2 className="text-xl font-semibold text-gray-900">Regulated & Safe</h2>
                                            <p className="text-gray-600 text-sm leading-relaxed">Fully compliant with UK regulations and Islamic financial principles.</p>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl relative overflow-hidden border border-gray-200/50 bg-white/40 backdrop-blur-md p-5 shadow-sm">
                                        <div className="absolute left-3 top-2 flex gap-1">
                                            <span className="block size-2 rounded-full bg-[#FF5F57]"></span>
                                            <span className="block size-2 rounded-full bg-[#FFBD2E]"></span>
                                            <span className="block size-2 rounded-full bg-[#28C840]"></span>
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            {[
                                                { label: "FCA Approved", pct: "100%" },
                                                { label: "Sharia Board", pct: "100%" },
                                                { label: "Fund Separation", pct: "100%" },
                                            ].map((item, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-gray-600">{item.label}</span>
                                                        <span className="text-[#00c685] font-semibold">{item.pct}</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-[#00c685] to-[#00c685]/60 rounded-full"
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: item.pct }}
                                                            transition={{ duration: 1.2, delay: 0.3 + i * 0.2, ease: "easeOut" }}
                                                            viewport={{ once: true }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Card 5 — Community Driven (3 cols — wide with avatars) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="col-span-full lg:col-span-3"
                        >
                            <Card className="relative overflow-hidden h-full border border-gray-100 bg-white group hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
                                {/* Accent top border */}
                                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00c685] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <CardContent className="grid h-full pt-8 pb-8 sm:grid-cols-2 gap-6">
                                    <div className="relative z-10 flex flex-col justify-between space-y-8">
                                        <motion.div
                                            whileHover={{ rotate: -5, scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className="relative flex aspect-square size-14 rounded-2xl bg-[#00c685]/10 border border-[#00c685]/20 items-center justify-center"
                                        >
                                            <Users className="size-6 text-[#00c685]" strokeWidth={1.5} />
                                        </motion.div>
                                        <div className="space-y-3">
                                            <h2 className="text-xl font-semibold text-gray-900">Community Driven</h2>
                                            <p className="text-gray-500 text-sm leading-relaxed">A shared pool designed to protect and serve everyone equally.</p>
                                        </div>
                                    </div>
                                    <div className="relative mt-2 sm:-my-2 sm:-mr-6">
                                        <div className="relative flex h-full flex-col justify-center space-y-5 py-4 pl-6 border-l border-gray-100">
                                            {[
                                                { name: "Zahra", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80", dir: "right", delay: 0.1 },
                                                { name: "Ali", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80", dir: "left", delay: 0.3 },
                                                { name: "Fatima", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80", dir: "right", delay: 0.5 },
                                            ].map((person, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: person.dir === 'right' ? -30 : 30 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.6, delay: person.delay, type: "spring" }}
                                                    viewport={{ once: true }}
                                                    className={`flex items-center gap-3 ${i === 1 ? 'ml-8' : ''}`}
                                                >
                                                    <div className="ring-white size-9 ring-4 shrink-0 rounded-full overflow-hidden shadow-md">
                                                        <img className="size-full object-cover" src={person.img} alt={person.name} />
                                                    </div>
                                                    <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 shadow-sm">
                                                        <span className="text-xs font-medium text-gray-700">{person.name}</span>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">Just joined the community</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    )
}
