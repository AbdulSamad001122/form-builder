import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
    type Edge,
    type Node
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { Button } from "~/components/ui/button"
import { QuestionNode } from "./QuestionNode"
import { EndNode } from "./EndNode"
import CustomDraggableEdge from "./CustomDraggableEdge"
import { Save, RefreshCw, Trash2, ShieldAlert, Maximize2, Minimize2, Activity } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"

const nodeTypes: any = {
    question: QuestionNode,
    end: EndNode
}

const edgeTypes: any = {
    custom: CustomDraggableEdge
}

const colorPresets = [
    { name: "Indigo", value: "#6366f1", bg: "bg-[#6366f1]" },
    { name: "Emerald", value: "#10b981", bg: "bg-[#10b981]" },
    { name: "Amber", value: "#f59e0b", bg: "bg-[#f59e0b]" },
    { name: "Rose", value: "#f43f5e", bg: "bg-[#f43f5e]" },
    { name: "Purple", value: "#8b5cf6", bg: "bg-[#8b5cf6]" },
    { name: "Cyan", value: "#06b6d4", bg: "bg-[#06b6d4]" },
    { name: "Slate", value: "#64748b", bg: "bg-[#64748b]" }
]

function getEdgeColor(val: string): string {
    const lower = val.toLowerCase().trim()
    if (lower === "yes" || lower === "true") return "#10b981"
    if (lower === "no" || lower === "false") return "#f43f5e"
    
    let hash = 0
    for (let i = 0; i < val.length; i++) {
        hash = val.charCodeAt(i) + ((hash << 5) - hash)
    }
    const h = Math.abs(hash % 360)
    return `hsl(${h}, 70%, 50%)`
}

interface LogicFlowCanvasProps {
    formId: string
    fields: any[]
    onSaveLogic: (updatedFields: any[]) => Promise<void>
    isSaving: boolean
    isFullscreen: boolean
    setIsFullscreen: (val: boolean) => void
}

export default function LogicFlowCanvas({ 
    formId, 
    fields, 
    onSaveLogic, 
    isSaving,
    isFullscreen,
    setIsFullscreen
}: LogicFlowCanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
    const nodesRef = useRef(nodes)
    const edgesRef = useRef(edges)

    useEffect(() => {
        nodesRef.current = nodes
    }, [nodes])

    useEffect(() => {
        edgesRef.current = edges
    }, [edges])
    const [edgeType, setEdgeType] = useState<"default" | "smoothstep" | "straight">(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(`form-edge-style-${formId}`)
            if (saved === "default" || saved === "smoothstep" || saved === "straight") {
                return saved
            }
        }
        return "smoothstep"
    })

    const sortedFields = useMemo(() => {
        return [...(fields || [])].sort((a, b) => parseFloat(a.index) - parseFloat(b.index))
    }, [fields])

    const updateControlPoint = useCallback((edgeId: string, newCx: number, newCy: number) => {
        setEdges((eds) => eds.map((e) => e.id === edgeId ? {
            ...e,
            data: {
                ...e.data,
                cx: newCx,
                cy: newCy
            }
        } : e))
    }, [setEdges])

    const initFlow = useCallback(() => {
        if (!sortedFields || sortedFields.length === 0) return

        const storageKey = `form-node-positions-${formId}`
        const savedPositionsStr = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null
        const savedPositions = savedPositionsStr ? JSON.parse(savedPositionsStr) : {}

        const initialNodes: Node[] = sortedFields.map((field, idx) => {
            const savedPos = savedPositions[field.id]
            return {
                id: field.id,
                type: "question",
                position: savedPos || { x: idx * 340 + 50, y: 150 },
                data: {
                    id: field.id,
                    label: field.label,
                    type: field.type,
                    isRequired: field.isRequired,
                    options: field.options,
                    index: field.index,
                    conditionalRules: field.conditionalRules
                }
            }
        })

        const savedSubmitPos = savedPositions["submit"]
        initialNodes.push({
            id: "submit",
            type: "end",
            position: savedSubmitPos || { x: sortedFields.length * 340 + 50, y: 190 },
            data: {}
        })

        const initialEdges: Edge[] = []
        sortedFields.forEach((field) => {
            const rules = Array.isArray(field.conditionalRules) ? field.conditionalRules : []
            rules.forEach((rule: any) => {
                if (rule && rule.value && rule.targetFieldId) {
                    const fallbackColor = getEdgeColor(rule.value)
                    initialEdges.push({
                        id: rule.id || `edge-${field.id}-${rule.value}`,
                        source: field.id,
                        sourceHandle: rule.value,
                        target: rule.targetFieldId,
                        targetHandle: "input",
                        animated: rule.animated !== undefined ? rule.animated : true,
                        type: "custom",
                        data: {
                            cx: rule.cx,
                            cy: rule.cy,
                            edgeType: rule.edgeType || edgeType,
                            onUpdateControlPoint: updateControlPoint
                        },
                        style: { 
                            stroke: rule.color || fallbackColor, 
                            strokeWidth: 2.5,
                            strokeDasharray: rule.stylePattern === "dashed" ? "5,5" : undefined
                        }
                    })
                }
            })
        })

        setNodes(initialNodes)
        setEdges(initialEdges)
        setSelectedEdgeId(null)
    }, [formId, sortedFields, setNodes, setEdges, edgeType, updateControlPoint])

    useEffect(() => {
        if (nodes.length === 0 && sortedFields && sortedFields.length > 0) {
            initFlow()
        }
    }, [initFlow, nodes.length, sortedFields])

    useEffect(() => {
        if (nodesRef.current.length === 0) return

        const currentNodes = nodesRef.current
        const currentEdges = edgesRef.current

        const nextNodes: Node[] = sortedFields.map((field) => {
            const existingNode = currentNodes.find((n) => n.id === field.id)
            const idx = sortedFields.findIndex((f) => f.id === field.id)
            const storageKey = `form-node-positions-${formId}`
            const savedPositionsStr = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null
            const savedPositions = savedPositionsStr ? JSON.parse(savedPositionsStr) : {}
            const savedPos = savedPositions[field.id]

            if (existingNode) {
                return {
                    ...existingNode,
                    data: {
                        id: field.id,
                        label: field.label,
                        type: field.type,
                        isRequired: field.isRequired,
                        options: field.options,
                        index: field.index,
                        conditionalRules: field.conditionalRules
                    }
                }
            }

            return {
                id: field.id,
                type: "question",
                position: savedPos || { x: idx * 340 + 50, y: 150 },
                data: {
                    id: field.id,
                    label: field.label,
                    type: field.type,
                    isRequired: field.isRequired,
                    options: field.options,
                    index: field.index,
                    conditionalRules: field.conditionalRules
                }
            }
        })

        const existingSubmitNode = currentNodes.find((n) => n.id === "submit")
        const storageKey = `form-node-positions-${formId}`
        const savedPositionsStr = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null
        const savedPositions = savedPositionsStr ? JSON.parse(savedPositionsStr) : {}
        const savedSubmitPos = savedPositions["submit"]

        if (existingSubmitNode) {
            nextNodes.push(existingSubmitNode)
        } else {
            nextNodes.push({
                id: "submit",
                type: "end",
                position: savedSubmitPos || { x: sortedFields.length * 340 + 50, y: 190 },
                data: {}
            })
        }

        setNodes(nextNodes)

        const fieldIds = new Set(sortedFields.map((f) => f.id))
        fieldIds.add("submit")

        const getFieldOptions = (field: any) => {
            if (!field) return []
            return ["SINGLE_SELECT", "MULTI_SELECT", "DROPDOWN"].includes(field.type)
                ? (typeof field.options === "string"
                    ? field.options.split(",").map((s: string) => s.trim()).filter(Boolean)
                    : (Array.isArray(field.options) ? field.options : []))
                : (field.type === "YES_NO"
                    ? ["Yes", "No"]
                    : (field.type === "CHECKBOX"
                        ? (field.options && (typeof field.options === "string" || Array.isArray(field.options))
                            ? (typeof field.options === "string"
                                ? field.options.split(",").map((s: string) => s.trim()).filter(Boolean)
                                : field.options)
                            : ["Checked"])
                        : []))
        }

        const baseEdges = currentEdges.filter((edge) => {
            if (!fieldIds.has(edge.source) || !fieldIds.has(edge.target)) {
                return false
            }
            const sourceField = sortedFields.find((f) => f.id === edge.source)
            if (sourceField) {
                const validOptions = getFieldOptions(sourceField)
                if (edge.sourceHandle !== "default" && !validOptions.includes(edge.sourceHandle || "")) {
                    return false
                }
            }
            return true
        })

        const reconciledEdges: Edge[] = [...baseEdges]

        sortedFields.forEach((field) => {
            const rules = Array.isArray(field.conditionalRules) ? field.conditionalRules : []
            rules.forEach((rule: any) => {
                if (rule && rule.value && rule.targetFieldId) {
                    const existingEdgeIndex = reconciledEdges.findIndex(
                        (e) => e.source === field.id && e.sourceHandle === rule.value
                    )
                    const fallbackColor = getEdgeColor(rule.value)

                    const ruleEdge: Edge = {
                        id: rule.id || `edge-${field.id}-${rule.value}`,
                        source: field.id,
                        sourceHandle: rule.value,
                        target: rule.targetFieldId,
                        targetHandle: "input",
                        animated: rule.animated !== undefined ? rule.animated : true,
                        type: "custom",
                        data: {
                            cx: rule.cx,
                            cy: rule.cy,
                            edgeType: rule.edgeType || edgeType,
                            onUpdateControlPoint: updateControlPoint
                        },
                        style: {
                            stroke: rule.color || fallbackColor,
                            strokeWidth: 2.5,
                            strokeDasharray: rule.stylePattern === "dashed" ? "5,5" : undefined
                        }
                    }

                    if (existingEdgeIndex > -1) {
                        const existingEdge = reconciledEdges[existingEdgeIndex]!
                        reconciledEdges[existingEdgeIndex] = {
                            ...existingEdge,
                            id: rule.id || existingEdge.id,
                            target: rule.targetFieldId,
                            animated: rule.animated !== undefined ? rule.animated : existingEdge.animated,
                            data: {
                                ...existingEdge.data,
                                cx: rule.cx !== undefined ? rule.cx : existingEdge.data?.cx,
                                cy: rule.cy !== undefined ? rule.cy : existingEdge.data?.cy,
                                edgeType: rule.edgeType || existingEdge.data?.edgeType || edgeType
                            },
                            style: {
                                ...existingEdge.style,
                                stroke: rule.color || existingEdge.style?.stroke || fallbackColor,
                                strokeDasharray: rule.stylePattern === "dashed" ? "5,5" : (rule.stylePattern === "solid" ? undefined : existingEdge.style?.strokeDasharray)
                            }
                        }
                    } else {
                        reconciledEdges.push(ruleEdge)
                    }
                }
            })
        })

        setEdges(reconciledEdges)
    }, [sortedFields, formId, setNodes, setEdges, edgeType, updateControlPoint])

    useEffect(() => {
        if (selectedEdgeId && !edges.some((e) => e.id === selectedEdgeId)) {
            setSelectedEdgeId(null)
        }
    }, [edges, selectedEdgeId])

    const onNodeDragStop = useCallback((event: any, node: Node) => {
        const storageKey = `form-node-positions-${formId}`
        const savedPositions = localStorage.getItem(storageKey)
        const positions = savedPositions ? JSON.parse(savedPositions) : {}
        
        positions[node.id] = {
            x: node.position.x,
            y: node.position.y
        }
        
        localStorage.setItem(storageKey, JSON.stringify(positions))
    }, [formId])

    const onConnect = useCallback((connection: Connection) => {
        if (connection.source === connection.target) {
            toast.error("A question cannot connect to itself.")
            return
        }

        setEdges((eds) => {
            const existingEdgeIndex = eds.findIndex(
                (e) => e.source === connection.source && e.sourceHandle === connection.sourceHandle
            )

            let nextEdges = [...eds]
            if (existingEdgeIndex > -1) {
                nextEdges.splice(existingEdgeIndex, 1)
            }

            const fallbackColor = getEdgeColor(connection.sourceHandle || "")
            const newEdge: Edge = {
                id: `edge-${connection.source}-${connection.sourceHandle}-${Date.now()}`,
                source: connection.source,
                sourceHandle: connection.sourceHandle,
                target: connection.target,
                targetHandle: connection.targetHandle,
                animated: true,
                type: "custom",
                data: {
                    cx: undefined,
                    cy: undefined,
                    edgeType: edgeType,
                    onUpdateControlPoint: updateControlPoint
                },
                style: { 
                    stroke: fallbackColor, 
                    strokeWidth: 2.5 
                }
            }

            return addEdge(newEdge, nextEdges)
        })
    }, [setEdges, edgeType, updateControlPoint])

    const handleClearAll = useCallback(() => {
        setEdges([])
        setSelectedEdgeId(null)
        toast.success("All connections cleared from visual map canvas. Click Save Changes to store this state.")
    }, [setEdges])

    const handleSave = useCallback(async () => {
        try {
            const areRulesEqual = (r1: any, r2: any) => {
                const list1 = [...(Array.isArray(r1) ? r1 : [])].sort((a: any, b: any) => String(a.id || a.value).localeCompare(String(b.id || b.value)));
                const list2 = [...(Array.isArray(r2) ? r2 : [])].sort((a: any, b: any) => String(a.id || a.value).localeCompare(String(b.id || b.value)));
                if (list1.length !== list2.length) return false;
                for (let i = 0; i < list1.length; i++) {
                    const item1 = list1[i];
                    const item2 = list2[i];
                    if (!item1 || !item2) return false;
                    if (item1.value !== item2.value) return false;
                    if (item1.targetFieldId !== item2.targetFieldId) return false;
                    if (item1.edgeType !== item2.edgeType) return false;
                    if (item1.color !== item2.color) return false;
                    if (item1.stylePattern !== item2.stylePattern) return false;
                    if (item1.animated !== item2.animated) return false;
                    if (item1.cx !== item2.cx) return false;
                    if (item1.cy !== item2.cy) return false;
                }
                return true;
            };

            const updatedFields = sortedFields.map((field) => {
                const fieldEdges = edges.filter((e) => e.source === field.id);
                const fieldRules = fieldEdges.map((e) => ({
                    id: e.id,
                    value: e.sourceHandle,
                    targetFieldId: e.target,
                    edgeType: e.data?.edgeType || e.type,
                    color: e.style?.stroke,
                    stylePattern: e.style?.strokeDasharray ? "dashed" : "solid",
                    animated: e.animated !== false,
                    cx: e.data?.cx,
                    cy: e.data?.cy
                }));
                return {
                    ...field,
                    conditionalRules: fieldRules
                };
            });

            const changedFields = updatedFields.filter((field) => {
                const originalField = sortedFields.find((f) => f.id === field.id);
                return !areRulesEqual(originalField?.conditionalRules, field.conditionalRules);
            });

            if (changedFields.length === 0) {
                toast.info("No changes to save.");
                return;
            }

            await onSaveLogic(changedFields);
            toast.success("✨ Visual logic flow map saved successfully!");
        } catch (err: any) {
            toast.error(`Failed to save logic flow: ${err.message}`);
        }
    }, [edges, sortedFields, onSaveLogic])

    const selectedEdge = useMemo(() => {
        return edges.find((e) => e.id === selectedEdgeId) || null
    }, [edges, selectedEdgeId])

    const selectedEdgeInfo = useMemo(() => {
        if (!selectedEdge) return null
        const srcField = fields.find((f) => f.id === selectedEdge.source)
        const tgtField = selectedEdge.target === "submit" 
            ? { label: "Submit Form" } 
            : fields.find((f) => f.id === selectedEdge.target)

        const srcIdx = srcField ? fields.indexOf(srcField) + 1 : 0
        const tgtIdx = tgtField && selectedEdge.target !== "submit" ? fields.findIndex((f) => f.id === selectedEdge.target) + 1 : 0

        return {
            source: srcField ? `Q${srcIdx}: ${srcField.label}` : "Unknown",
            target: selectedEdge.target === "submit" ? "Submit Form" : (tgtField ? `Q${tgtIdx}: ${tgtField.label}` : "Unknown")
        }
    }, [selectedEdge, fields])

    const styledEdges = useMemo(() => {
        return edges.map((e) => {
            const isSelected = e.id === selectedEdgeId
            return {
                ...e,
                style: {
                    ...e.style,
                    strokeWidth: isSelected ? 4 : 2.5,
                    filter: isSelected ? "drop-shadow(0 0 6px rgba(99, 102, 241, 0.8))" : undefined
                }
            }
        })
    }, [edges, selectedEdgeId])

    return (
        <div className={`transition-all duration-300 border bg-card shadow-md flex flex-col relative ${
            isFullscreen 
                ? "w-full h-full flex-1" 
                : "w-full rounded-xl overflow-hidden h-[650px]"
        }`}>
            <div className="bg-muted/40 p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Save size={16} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-foreground">
                            Visual Logic Map Designer
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Drag paths from options on the right side of cards and drop them onto next questions to branch flow.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Select 
                        value={edgeType} 
                        onValueChange={(val: any) => {
                            setEdgeType(val)
                            localStorage.setItem(`form-edge-style-${formId}`, val)
                            setEdges((eds) => eds.map(e => ({
                                ...e,
                                data: {
                                    ...e.data,
                                    edgeType: val
                                }
                            })))
                        }}
                    >
                        <SelectTrigger className="h-9 text-xs w-[140px] bg-background">
                            <SelectValue placeholder="Line Style" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default" className="text-xs">Bezier (Curve)</SelectItem>
                            <SelectItem value="smoothstep" className="text-xs">Smooth Step (Angles)</SelectItem>
                            <SelectItem value="straight" className="text-xs">Straight (Direct)</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={initFlow} 
                        className="flex items-center gap-2 h-9 text-xs"
                    >
                        <RefreshCw size={14} />
                        Reset Canvas
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                            const storageKey = `form-node-positions-${formId}`
                            localStorage.removeItem(storageKey)
                            initFlow()
                            toast.success("Canvas layout positions reset to default grid.")
                        }} 
                        className="flex items-center gap-2 h-9 text-xs"
                    >
                        <RefreshCw size={14} />
                        Reset Layout
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsFullscreen(!isFullscreen)} 
                        className="flex items-center gap-2 h-9 text-xs"
                    >
                        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        {isFullscreen ? "Exit Full" : "Fullscreen"}
                    </Button>
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleClearAll} 
                        className="flex items-center gap-2 h-9 text-xs"
                    >
                        <Trash2 size={14} />
                        Clear Paths
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="flex items-center gap-2 h-9 text-xs bg-primary"
                    >
                        <Save size={14} />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="flex-1 w-full relative bg-slate-900/5">
                <ReactFlow
                    nodes={nodes}
                    edges={styledEdges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeDragStop={onNodeDragStop}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onEdgeClick={(_, edge) => setSelectedEdgeId(edge.id)}
                    onPaneClick={() => setSelectedEdgeId(null)}
                    fitView
                    minZoom={0.2}
                    maxZoom={1.5}
                >
                    <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
                    <Controls showInteractive={false} className="!bg-background !border-border !shadow-sm" />
                    <MiniMap 
                        nodeColor={() => "#f1f5f9"} 
                        maskColor="rgba(241, 245, 249, 0.08)"
                        className="!bg-background !border-border !shadow-sm rounded-lg overflow-hidden" 
                    />
                </ReactFlow>

                {selectedEdge && selectedEdgeInfo && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur border border-border shadow-2xl rounded-2xl p-4.5 z-30 flex flex-col sm:flex-row sm:items-center gap-4 animate-in slide-in-from-bottom-5 fade-in duration-200 w-[96%] sm:w-auto max-w-5xl select-none">
                        <div className="flex flex-col gap-1 shrink-0 sm:border-r sm:pr-4 border-muted">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Active Connection</span>
                            <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                                <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-mono truncate max-w-[130px]">{selectedEdgeInfo.source}</span>
                                <span className="text-muted-foreground font-light">→</span>
                                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-1.5 py-0.5 rounded font-mono truncate max-w-[130px]">{selectedEdgeInfo.target}</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Line Style</span>
                                <Select 
                                    value={(selectedEdge.data as any)?.edgeType || "smoothstep"} 
                                    onValueChange={(val: any) => {
                                        setEdges((eds) => eds.map(e => e.id === selectedEdgeId ? {
                                            ...e,
                                            data: {
                                                ...e.data,
                                                edgeType: val
                                            }
                                        } : e))
                                    }}
                                >
                                    <SelectTrigger className="h-8 text-[11px] w-[115px] bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default" className="text-xs">Bezier (Curve)</SelectItem>
                                        <SelectItem value="smoothstep" className="text-xs">Smooth (Angle)</SelectItem>
                                        <SelectItem value="straight" className="text-xs">Straight</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Pattern</span>
                                <div className="flex bg-muted p-0.5 rounded-lg border h-8">
                                    <Button
                                        variant={selectedEdge.style?.strokeDasharray ? "ghost" : "secondary"}
                                        size="sm"
                                        className="h-full text-[10px] px-3 shadow-none rounded"
                                        onClick={() => {
                                            setEdges((eds) => eds.map(e => e.id === selectedEdgeId ? {
                                                ...e,
                                                style: {
                                                    ...e.style,
                                                    strokeDasharray: undefined
                                                }
                                            } : e))
                                        }}
                                    >
                                        Solid
                                    </Button>
                                    <Button
                                        variant={selectedEdge.style?.strokeDasharray ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-full text-[10px] px-3 shadow-none rounded"
                                        onClick={() => {
                                            setEdges((eds) => eds.map(e => e.id === selectedEdgeId ? {
                                                ...e,
                                                style: {
                                                    ...e.style,
                                                    strokeDasharray: "5,5"
                                                }
                                            } : e))
                                        }}
                                    >
                                        Dashed
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Flow</span>
                                <Button
                                    variant={selectedEdge.animated ? "secondary" : "outline"}
                                    size="sm"
                                    className="h-8 text-[10px] px-3 rounded-lg"
                                    onClick={() => {
                                        setEdges((eds) => eds.map(e => e.id === selectedEdgeId ? { ...e, animated: !e.animated } : e))
                                    }}
                                >
                                    <Activity size={11} className={`mr-1.5 ${selectedEdge.animated ? "animate-pulse text-emerald-500" : ""}`} />
                                    {selectedEdge.animated ? "Moving" : "Static"}
                                </Button>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Color Code</span>
                                <div className="flex items-center gap-1.5 h-8">
                                    {colorPresets.map(preset => {
                                        const isCurrent = (selectedEdge.style?.stroke || "#3b82f6") === preset.value
                                        return (
                                            <button
                                                key={preset.value}
                                                onClick={() => {
                                                    setEdges((eds) => eds.map(e => e.id === selectedEdgeId ? {
                                                        ...e,
                                                        style: {
                                                            ...e.style,
                                                            stroke: preset.value
                                                        }
                                                    } : e))
                                                }}
                                                className={`w-4 h-4 rounded-full transition-transform hover:scale-125 duration-100 ${preset.bg} ${isCurrent ? "ring-2 ring-foreground ring-offset-1 scale-110" : ""}`}
                                                title={preset.name}
                                            />
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 sm:pl-2.5 sm:border-l border-muted">
                                <span className="text-[9px] text-destructive font-bold uppercase tracking-wider">Action</span>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8 text-[10px] px-3 rounded-lg"
                                    onClick={() => {
                                        setEdges((eds) => eds.filter(e => e.id !== selectedEdgeId))
                                        setSelectedEdgeId(null)
                                        toast.success("Connection deleted")
                                    }}
                                >
                                    <Trash2 size={11} className="mr-1.5" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="bg-muted/30 px-4 py-2.5 border-t flex items-center justify-between text-xs text-muted-foreground shrink-0 select-none">
                <div className="flex items-center gap-1.5 font-medium">
                    <ShieldAlert size={13} className="text-amber-500" />
                    <span>Click on any connection line to customize its visual path. Grab the middle handle on selected lines to manually route them.</span>
                </div>
                <div>
                    <span>Total Nodes: {nodes.length} | Connections: {edges.length}</span>
                </div>
            </div>
        </div>
    )
}
