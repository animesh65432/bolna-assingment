import Icon from "./Icon"

const Logo = () => (
    <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Icon path="M9.75 3.104..." className="w-4 h-4 text-white" />
        </div>
        <span className="font-playfair text-slate-100 text-base font-semibold">MedPing</span>
    </div>
)

export default Logo