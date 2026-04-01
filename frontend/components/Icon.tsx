// Reusable SVG icon — pass any heroicons path string
const Icon = ({ path, className = "w-4 h-4" }: { path: string; className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
)

export default Icon