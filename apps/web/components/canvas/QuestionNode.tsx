import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { 
    Type, AlignLeft, Hash, Mail, Key, HelpCircle, 
    ToggleLeft, List, CheckSquare, ChevronDown, Star, Calendar 
} from "lucide-react"

const getFieldIcon = (type: string) => {
    switch (type) {
        case "TEXT": return <Type size={14} className="text-blue-500" />
        case "LONG_TEXT": return <AlignLeft size={14} className="text-blue-500" />
        case "NUMBER": return <Hash size={14} className="text-amber-500" />
        case "EMAIL": return <Mail size={14} className="text-purple-500" />
        case "PASSWORD": return <Key size={14} className="text-red-500" />
        case "YES_NO": return <ToggleLeft size={14} className="text-emerald-500" />
        case "SINGLE_SELECT": return <List size={14} className="text-indigo-500" />
        case "MULTI_SELECT": return <CheckSquare size={14} className="text-indigo-500" />
        case "CHECKBOX": return <CheckSquare size={14} className="text-teal-500" />
        case "DROPDOWN": return <ChevronDown size={14} className="text-cyan-500" />
        case "RATING": return <Star size={14} className="text-yellow-500" />
        case "DATE": return <Calendar size={14} className="text-pink-500" />
        default: return <HelpCircle size={14} className="text-muted-foreground" />
    }
}

export const QuestionNode = memo(function QuestionNode({ data }: any) {
    const { label, type, isRequired, options, index } = data

    const currentOptions = ["SINGLE_SELECT", "MULTI_SELECT", "DROPDOWN"].includes(type)
        ? (typeof options === "string"
            ? options.split(",").map((s: string) => s.trim()).filter(Boolean)
            : (Array.isArray(options) ? options : []))
        : (type === "YES_NO"
            ? ["Yes", "No"]
            : (type === "CHECKBOX"
                ? (options && (typeof options === "string" || Array.isArray(options))
                    ? (typeof options === "string"
                        ? options.split(",").map((s: string) => s.trim()).filter(Boolean)
                        : options)
                    : ["Checked"])
                : []))

    return (
        <div className="bg-card border-2 border-border/80 rounded-xl shadow-lg w-[260px] overflow-hidden hover:border-primary/50 transition-all duration-300 backdrop-blur-sm">
            <Handle
                type="target"
                position={Position.Left}
                id="input"
                className="w-3 h-3 !bg-primary border-2 border-background hover:scale-125 transition-transform"
            />
            
            <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Q{parseFloat(index).toFixed(0)}
                    </span>
                    <span className="text-xs font-semibold truncate text-foreground pr-2">
                        {type}
                    </span>
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                    {isRequired && (
                        <span className="w-1.5 h-1.5 bg-destructive rounded-full" title="Required Field" />
                    )}
                    {getFieldIcon(type)}
                </div>
            </div>

            <div className="p-3">
                <h4 className="text-xs font-semibold text-foreground line-clamp-2 leading-relaxed mb-3">
                    {label}
                </h4>

                {currentOptions.length > 0 && (
                    <div className="space-y-2 mt-2">
                        {currentOptions.map((opt: string, idx: number) => (
                            <div 
                                key={idx} 
                                className="relative flex items-center justify-between bg-muted/40 p-1.5 rounded border border-border/40 hover:bg-muted/60 transition-colors"
                            >
                                <span className="text-[10px] font-medium text-foreground truncate pr-6 pl-1 select-none">
                                    {opt}
                                </span>
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={opt}
                                    className="w-2.5 h-2.5 !bg-blue-500 border-2 border-background hover:scale-125 transition-transform !right-[-5px]"
                                    style={{ transform: "translateY(-50%)" }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="relative flex justify-between items-center bg-muted/30 p-1.5 mt-3 rounded border border-border/40 hover:bg-muted/50 transition-colors">
                    <span className="text-[10px] text-muted-foreground italic pl-1 select-none">
                        Otherwise
                    </span>
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="default"
                        className="w-2.5 h-2.5 !bg-muted-foreground border-2 border-background hover:scale-125 transition-transform !right-[-5px]"
                        style={{ transform: "translateY(-50%)" }}
                    />
                </div>
            </div>
        </div>
    )
})
