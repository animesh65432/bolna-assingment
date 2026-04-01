import React, { useContext } from "react"
import { UserContext } from "@/context/user"

const Login: React.FC = () => {
    const [userInput, setUserInput] = React.useState({ name: "", phoneNumber: "" })
    const [focused, setFocused] = React.useState<string | null>(null)
    const { onLogin } = useContext(UserContext)!

    const isValid = userInput.name.trim().length > 0 && userInput.phoneNumber.trim().length >= 10

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async () => {
        if (!isValid) return
        onLogin(userInput)
    }

    const inputClass = (field: string) =>
        `flex items-center gap-2 sm:gap-3 rounded-xl border px-3.5 sm:px-4 py-3 sm:py-3.5 transition-all duration-200 ${focused === field
            ? "border-violet-500 bg-violet-500/5 shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
            : "border-white/10 bg-white/5 hover:border-white/20"
        }`

    const iconClass = (field: string) =>
        `w-4 h-4 shrink-0 transition-colors duration-200 ${focused === field ? "text-violet-400" : "text-slate-500"}`

    return (
        <div className="font-dm min-h-screen bg-slate-950 flex flex-col lg:flex-row relative overflow-hidden">

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                Medicine Remider App
            </div>

            <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between p-12 xl:p-16 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <span className="font-playfair text-slate-100 text-lg font-semibold tracking-wide">MedPing</span>
                </div>

                <div>
                    <p className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-4">Secure Access</p>
                    <h2 className="font-playfair text-4xl xl:text-5xl font-bold text-slate-100 leading-tight mb-5">
                        Your Medicine Scheduler <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                            one tap away.
                        </span>
                    </h2>
                    <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                        Sign in with your name and phone number to access your personalised dashboard.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    {[
                        { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", label: "End-to-end encrypted" },
                        { icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z", label: "No password needed" },
                    ].map(({ icon, label }) => (
                        <div key={label} className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                            </svg>
                            <span className="text-slate-500 text-xs">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10">
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-[420px]">
                    <div className="bg-transparent sm:bg-white/5 sm:backdrop-blur-xl sm:border sm:border-white/10 sm:rounded-3xl sm:shadow-2xl px-0 py-6 sm:px-8 sm:py-10">

                        <div className="flex items-center gap-2.5 mb-8 lg:hidden fade-up-1">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                            <span className="font-playfair text-slate-100 text-lg font-semibold">MedPing</span>
                        </div>

                        <div className="fade-up-1 mb-7 sm:mb-8">
                            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-100 leading-tight">
                                Welcome back
                            </h1>
                            <p className="mt-1.5 text-slate-400 text-sm font-light">
                                Sign in to continue to your account
                            </p>
                        </div>

                        <div className="fade-up-2 mb-4">
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wide uppercase">
                                Full Name
                            </label>
                            <div className={inputClass("name")}>
                                <svg className={iconClass("name")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                                </svg>
                                <input
                                    type="text"
                                    name="name"
                                    value={userInput.name}
                                    onChange={handleChange}
                                    onFocus={() => setFocused("name")}
                                    onBlur={() => setFocused(null)}
                                    placeholder="John Doe"
                                    className="flex-1 min-w-0 bg-transparent text-slate-100 placeholder-slate-600 text-sm outline-none font-dm"
                                />
                                {userInput.name.trim().length > 0 && (
                                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        <div className="fade-up-3 mb-6">
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wide uppercase">
                                Phone Number
                            </label>
                            <div className={inputClass("phoneNumber")}>
                                <div className="flex items-center gap-1 sm:gap-1.5 pr-2 sm:pr-3 border-r border-white/10 shrink-0">
                                    <span className="text-sm sm:text-base leading-none">🇮🇳</span>
                                    <span className="text-slate-400 text-xs font-medium">+91</span>
                                </div>
                                <svg className={iconClass("phoneNumber")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={userInput.phoneNumber}
                                    onChange={handleChange}
                                    onFocus={() => setFocused("phoneNumber")}
                                    onBlur={() => setFocused(null)}
                                    placeholder="98765 43210"
                                    maxLength={10}
                                    className="flex-1 min-w-0 bg-transparent text-slate-100 placeholder-slate-600 text-sm outline-none font-dm tracking-wide"
                                />
                                {userInput.phoneNumber.trim().length >= 10 && (
                                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <p className="mt-1.5 text-xs text-slate-600">Enter 10-digit mobile number</p>
                        </div>

                        <div className="fade-up-4">
                            <button
                                onClick={handleSubmit}
                                disabled={!isValid}
                                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 sm:py-3.5 text-sm font-medium transition-all duration-300 ${isValid
                                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98]"
                                    : "bg-white/5 text-slate-600 cursor-not-allowed border border-white/10"
                                    }`}
                            >

                                <>
                                    <span>Continue</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </>

                            </button>
                        </div>

                        <div className="fade-up-5 mt-5 sm:mt-6 text-center">
                            <p className="text-xs text-slate-600">
                                By continuing you agree to our{" "}
                                <span className="text-violet-400 hover:text-violet-300 cursor-pointer transition-colors">Terms of Service</span>
                                {" & "}
                                <span className="text-violet-400 hover:text-violet-300 cursor-pointer transition-colors">Privacy Policy</span>
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-xs text-slate-700">
                        Protected with end-to-end encryption
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login