import { memo } from "react"
import { Handle, Position } from "@xyflow/react"
import { CheckCircle2 } from "lucide-react"

export const EndNode = memo(function EndNode() {
    return (
        <div className="bg-card border-2 border-emerald-500/50 rounded-xl shadow-lg w-[180px] overflow-hidden p-3 hover:border-emerald-500 transition-all duration-300 backdrop-blur-sm">
            <Handle
                type="target"
                position={Position.Left}
                id="input"
                className="w-3 h-3 !bg-emerald-500 border-2 border-background hover:scale-125 transition-transform"
            />
            <div className="flex items-center gap-2.5 justify-center py-1">
                <div className="relative flex">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <CheckCircle2 className="relative text-emerald-500 w-5 h-5 shrink-0" />
                </div>
                <div className="text-center">
                    <h4 className="text-xs font-bold text-foreground">
                        Submit Form
                    </h4>
                    <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider block mt-0.5">
                        End of Flow
                    </span>
                </div>
            </div>
        </div>
    )
})
