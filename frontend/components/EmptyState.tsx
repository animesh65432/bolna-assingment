import { ICONS } from "@/constants"
import Icon from "./Icon"

const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Icon path={ICONS.pill} className="w-8 h-8 text-slate-600" />
        </div>
        <p className="text-slate-400 text-sm font-medium">No reminders</p>
        <button onClick={onAdd} className="mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors">
            + Schedule one now
        </button>
    </div>
)

export default EmptyState