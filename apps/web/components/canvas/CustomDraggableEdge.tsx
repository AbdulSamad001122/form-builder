import { BaseEdge, EdgeLabelRenderer, type EdgeProps, useReactFlow } from "@xyflow/react"

export default function CustomDraggableEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    style = {},
    markerEnd,
    selected,
    data
}: EdgeProps) {
    const { getZoom } = useReactFlow()
    const dataAny = data as any
    const cx = (dataAny?.cx as number) ?? (sourceX + targetX) / 2
    const cy = (dataAny?.cy as number) ?? (sourceY + targetY) / 2
    const edgeStyle = (dataAny?.edgeType as string) ?? "smoothstep"

    let path = ""
    if (edgeStyle === "straight") {
        path = `M ${sourceX},${sourceY} L ${cx},${cy} L ${targetX},${targetY}`
    } else if (edgeStyle === "default") {
        path = `M ${sourceX},${sourceY} Q ${cx},${cy} ${targetX},${targetY}`
    } else {
        const midX = (cx + targetX) / 2
        path = `M ${sourceX},${sourceY} H ${cx} V ${cy} H ${midX} V ${targetY} H ${targetX}`
    }

    const onMouseDown = (event: React.MouseEvent) => {
        event.stopPropagation()
        event.preventDefault()

        const startX = event.clientX
        const startY = event.clientY
        const initialCX = cx
        const initialCY = cy

        const onMouseMove = (moveEvent: MouseEvent) => {
            const zoom = getZoom()
            const deltaX = (moveEvent.clientX - startX) / zoom
            const deltaY = (moveEvent.clientY - startY) / zoom

            if (dataAny?.onUpdateControlPoint) {
                dataAny.onUpdateControlPoint(id, initialCX + deltaX, initialCY + deltaY)
            }
        }

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onMouseUp)
        }

        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp)
    }

    return (
        <>
            <BaseEdge path={path} style={style} markerEnd={markerEnd} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${cx}px, ${cy}px)`,
                        pointerEvents: "all"
                    }}
                    className="nodrag nopan"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div
                        onMouseDown={onMouseDown}
                        onClick={(e) => e.stopPropagation()}
                        className={`rounded-full shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing ${
                            selected 
                                ? "w-3.5 h-3.5 bg-primary border-2 border-background ring-2 ring-primary/40 scale-110 shadow-lg" 
                                : "w-2.5 h-2.5 bg-slate-400/50 hover:bg-primary border border-white hover:scale-125"
                        }`}
                        title="Drag to manually route this line"
                    />
                </div>
            </EdgeLabelRenderer>
        </>
    )
}
