"use client"
import React from "react"
import { useRouter } from "next/navigation"

const stats = [
    { value: "98%", label: "Adherence Rate" },
    { value: "2min", label: "Avg Call Time" },
    { value: "24/7", label: "Always On" },
]

const steps = [
    {
        number: "01",
        icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5",
        title: "Set Your Schedule",
        desc: "Enter your name, phone, medication name, and preferred reminder time.",
    },
    {
        number: "02",
        icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z",
        title: "AI Calls You",
        desc: "Our AI voice agent calls you at the exact scheduled time — no app needed.",
    },
    {
        number: "03",
        icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
        title: "Track Adherence",
        desc: "Every call is logged and your weekly adherence is tracked automatically.",
    },
]

const HeroSection: React.FC = () => {
    const router = useRouter()

    return (
        <main className="font-dm bg-slate-950 text-slate-100">

            <section className="relative min-h-[92vh] flex items-center overflow-hidden px-5 sm:px-10 lg:px-20 py-20">

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-violet-600/20 blur-[100px]" />
                    <div className="absolute -bottom-20 -right-20 w-[360px] h-[360px] rounded-full bg-indigo-500/20 blur-[90px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-700/10 blur-[80px]" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    <div className="flex flex-col gap-6">
                        <div className="fade-up-1 inline-flex items-center gap-2 w-fit border border-white/10 bg-white/5 rounded-full px-4 py-1.5">
                            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                            <span className="text-slate-300 text-xs font-medium tracking-wide">AI-Powered Medication Reminders</span>
                        </div>

                        <div className="fade-up-2">
                            <h1 className="font-playfair text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.1] text-slate-100">
                                Never miss a{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                                    dose
                                </span>{" "}
                                again.
                            </h1>
                        </div>

                        <p className="fade-up-3 text-slate-400 text-base sm:text-lg leading-relaxed max-w-md">
                            We call you at the right time, every time. Our AI voice agent reminds you to take your medication and logs your adherence automatically.
                        </p>

                        <div className="fade-up-4 flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={() => router.push("/schedule")}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-violet-500/30"
                            >
                                Schedule a Reminder
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="flex items-center justify-center gap-2 border border-white/10 bg-white/5 text-slate-300 px-6 py-3.5 rounded-xl text-sm font-medium hover:border-white/20 hover:bg-white/10 transition-all duration-200"
                            >
                                View Dashboard
                            </button>
                        </div>

                        <div className="fade-up-5 flex items-center gap-8 pt-4 border-t border-white/10">
                            {stats.map(({ value, label }) => (
                                <div key={label}>
                                    <p className="font-playfair text-2xl font-bold text-slate-100">{value}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fade-up-2 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-sm">

                            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 space-y-5">

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-100">AI Reminder Call</p>
                                            <p className="text-xs text-slate-500">Incoming · Now</p>
                                        </div>
                                    </div>
                                    <span className="flex items-end gap-0.5">
                                        {[10, 16, 22, 16, 10].map((h, i) => (
                                            <span
                                                key={i}
                                                className="w-1 rounded-full bg-violet-400 animate-pulse"
                                                style={{ height: `${h}px`, animationDelay: `${i * 0.15}s` }}
                                            />
                                        ))}
                                    </span>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        "Hello Ravi, this is your medication reminder. It's time to take your{" "}
                                        <span className="text-violet-400 font-semibold">Metformin 500mg</span>{" "}
                                        for your evening dose."
                                    </p>
                                    <div className="flex items-center gap-2 pt-1">
                                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                                        <p className="text-xs text-slate-500">Speaking · 0:12</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    {[
                                        { label: "Patient", value: "Ravi K." },
                                        { label: "Dose", value: "Evening" },
                                        { label: "Time", value: "8:00 PM" },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-2">
                                            <p className="text-slate-500">{label}</p>
                                            <p className="font-semibold text-slate-200 mt-0.5">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl py-2.5 text-xs font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/30">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        Taken
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1.5 border border-white/10 bg-white/5 text-slate-400 rounded-xl py-2.5 text-xs font-medium hover:border-white/20 hover:text-slate-300 transition-all">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Skip
                                    </button>
                                </div>
                            </div>

                            <div className="absolute -top-4 -right-4 border border-white/10 bg-slate-900/90 backdrop-blur rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-medium text-slate-200">Dose confirmed</span>
                            </div>

                            <div className="absolute -bottom-4 -left-4 border border-white/10 bg-slate-900/90 backdrop-blur rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2">
                                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                </svg>
                                <span className="text-xs font-medium text-slate-200">92% this week</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-5 sm:px-10 lg:px-20 py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-3">How it works</p>
                        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-slate-100">Simple as a phone call</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {steps.map(({ number, icon, title, desc }) => (
                            <div key={number} className="group relative border border-white/10 bg-white/5 backdrop-blur rounded-2xl p-7 hover:border-violet-500/50 hover:bg-violet-500/5 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.15)] transition-all duration-300">
                                <div className="flex items-start justify-between mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                                        </svg>
                                    </div>
                                    <span className="font-playfair text-4xl font-bold text-white/5 group-hover:text-violet-500/10 transition-colors leading-none">{number}</span>
                                </div>
                                <h3 className="font-semibold text-slate-100 text-base mb-2">{title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-5 sm:px-10 lg:px-20 py-20 border-t border-white/5">
                <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
                    <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-slate-100 leading-tight">
                        Ready to stay on track?
                    </h2>
                    <p className="text-slate-400 text-base leading-relaxed max-w-md">
                        Set up your first reminder in under a minute. No app download needed — just a phone call.
                    </p>
                    <button
                        onClick={() => router.push("/schedule")}
                        className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-violet-500/30"
                    >
                        Schedule Your First Call
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>
            </section>

        </main>
    )
}

export default HeroSection