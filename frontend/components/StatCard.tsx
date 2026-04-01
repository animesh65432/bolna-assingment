import Icon from "./Icon"

interface StatCardProps {
    icon: string
    value: string
    label: string
    accent: string
    bg: string
    border: string
}

const StatCard = ({ icon, value, label, accent, bg, border }: StatCardProps) => (
    <div className={`rounded-2xl border p-3 sm:p-4 ${bg} ${border}`}>
        <Icon path={icon} className={`w-5 h-5 ${accent} mb-2`} />
        <p className={`text-xl sm:text-2xl font-bold font-playfair ${accent}`}>{value}</p>
        <p className="text-slate-500 text-xs mt-0.5">{label}</p>
    </div>
)

export default StatCard