import * as React from "react"
import { Plus, Send, ChevronDown, FileUp, Camera, Monitor, Sparkles, Brain, Zap, X, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "./DropdownMenu"

export interface Attachment {
    id: string
    file: File
    previewUrl?: string
    isImage: boolean
}

interface PromptInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    onSend?: (value: string, attachments: Attachment[]) => void
    onUpload?: (files: FileList | null) => void
    onCamera?: () => void
    onScreenShare?: () => void
    models?: { id: string; name: string; icon: any }[]
    selectedModelId?: string
    onModelChange?: (modelId: string) => void
    attachments?: Attachment[]
    onRemoveAttachment?: (id: string) => void
    variant?: "glass" | "ghost" | "classic" | "minimal"
    size?: "sm" | "md" | "lg"
}

const defaultModels = [
    { id: "sonnet", name: "Sonnet 3.7", icon: Sparkles },
    { id: "opus", name: "Opus 3", icon: Brain },
    { id: "haiku", name: "Haiku 3", icon: Zap },
]

const PromptInput = React.forwardRef<HTMLTextAreaElement, PromptInputProps>(
    ({
        className,
        onSend,
        onUpload,
        onCamera,
        onScreenShare,
        models = defaultModels,
        selectedModelId = "sonnet",
        onModelChange,
        attachments: externalAttachments,
        onRemoveAttachment,
        variant = "glass",
        size = "md",
        ...props
    }, ref) => {
        const [value, setValue] = React.useState("")
        const [isFocused, setIsFocused] = React.useState(false)
        const [internalAttachments, setInternalAttachments] = React.useState<Attachment[]>([])
        const textareaRef = React.useRef<HTMLTextAreaElement>(null)
        const fileInputRef = React.useRef<HTMLInputElement>(null)

        const attachments = externalAttachments || internalAttachments
        const selectedModel = models.find(m => m.id === selectedModelId) || models[0]

        const textValue = value

        const handleSend = () => {
            if (textValue.trim() || attachments.length > 0) {
                onSend?.(textValue, attachments)
                setValue("")
                setInternalAttachments([])
            }
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
            }
        }

        const handleFileChange = (files: FileList | null) => {
            if (!files) return

            Array.from(files).forEach(file => {
                const isImage = file.type.startsWith("image/")
                const id = Math.random().toString(36).substring(7)

                const attachment: Attachment = {
                    id,
                    file,
                    isImage,
                }

                if (isImage) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        attachment.previewUrl = reader.result as string
                        setInternalAttachments(prev => [...prev, attachment])
                    }
                    reader.readAsDataURL(file)
                } else {
                    setInternalAttachments(prev => [...prev, attachment])
                }
            })

            onUpload?.(files)
        }

        const removeAttachment = (id: string) => {
            if (onRemoveAttachment) {
                onRemoveAttachment(id)
            } else {
                setInternalAttachments(prev => prev.filter(a => a.id !== id))
            }
        }

        const autoResize = () => {
            const textarea = textareaRef.current
            if (textarea) {
                textarea.style.height = "auto"
                textarea.style.height = `${textarea.scrollHeight}px`
            }
        }

        React.useEffect(() => {
            autoResize()
        }, [value])

        const variantStyles = {
            glass: "bg-card/50 backdrop-blur-md border-border shadow-sm",
            ghost: "bg-transparent border-transparent shadow-none",
            classic: "bg-background border-border shadow-none",
            minimal: "bg-muted/30 border-transparent shadow-none rounded-xl"
        }

        const focusStyles = {
            glass: "border-primary/40 ring-1 ring-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
            ghost: "bg-muted/30 border-border/50",
            classic: "border-primary shadow-sm",
            minimal: "bg-muted/50 border-border/20"
        }

        return (
            <motion.div
                layout
                className={cn(
                    "relative flex flex-col w-full rounded-2xl border transition-all duration-300",
                    variantStyles[variant],
                    isFocused && focusStyles[variant],
                    className
                )}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileChange(e.target.files)}
                />

                {/* Attachments Preview Area */}
                <AnimatePresence mode="popLayout" initial={false}>
                    {attachments.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="flex flex-wrap gap-2.5 px-4 pt-4 overflow-hidden"
                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        >
                            {attachments.map((attachment) => (
                                <motion.div
                                    key={attachment.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                                    className="relative group shrink-0"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                    <div className={cn(
                                        "rounded-xl border border-border/60 bg-muted/30 overflow-hidden ring-1 ring-border/5",
                                        size === "sm" ? "w-12 h-12" : size === "lg" ? "w-20 h-20" : "w-16 h-16"
                                    )}>
                                        {attachment.isImage && attachment.previewUrl ? (
                                            <motion.img
                                                layoutId={`image-${attachment.id}`}
                                                src={attachment.previewUrl}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/60">
                                                <FileText className={cn(size === "sm" ? "size-4" : size === "lg" ? "size-8" : "size-6")} />
                                            </div>
                                        )}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => removeAttachment(attachment.id)}
                                        className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-destructive text-destructive-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                                    >
                                        <X className="size-3" />
                                    </motion.button>
                                    <div className="absolute inset-0 rounded-xl bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input Area */}
                <div className={cn(
                    "flex flex-col px-4",
                    size === "sm" ? "pt-2" : size === "lg" ? "pt-5" : "pt-3.5"
                )}>
                    <textarea
                        ref={(node) => {
                            if (typeof ref === "function") ref(node)
                            else if (ref) ref.current = node
                            // @ts-ignore
                            textareaRef.current = node
                        }}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value)
                            props.onChange?.(e)
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={(e) => {
                            setIsFocused(true)
                            props.onFocus?.(e)
                        }}
                        onBlur={(e) => {
                            setIsFocused(false)
                            props.onBlur?.(e)
                        }}
                        placeholder="Kuchh poochiye..."
                        className={cn(
                            "w-full bg-transparent resize-none outline-none py-1 leading-relaxed",
                            "text-foreground placeholder:text-muted-foreground/50",
                            size === "sm" ? "text-sm min-h-[32px]" : size === "lg" ? "text-lg min-h-[56px]" : "text-[15px] min-h-[44px]",
                            "max-h-[300px] hide-scrollbar"
                        )}
                        {...props}
                    />
                </div>

                {/* Action Bar */}
                {variant !== "minimal" && (
                    <div className={cn(
                        "flex items-center justify-between px-3 mt-1.5 border-t border-border/40",
                        size === "sm" ? "py-1.5" : size === "lg" ? "py-4" : "py-3"
                    )}>
                        <div className="flex items-center gap-1">
                            {/* Plus Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        className="p-2 rounded-xl text-muted-foreground/80 hover:text-foreground hover:bg-accent/50 transition-colors"
                                    >
                                        <Plus className={cn(size === "sm" ? "size-4" : "size-5")} />
                                    </motion.button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    className="w-52 bg-popover/90 backdrop-blur-xl border-border/50 text-popover-foreground shadow-2xl"
                                >
                                    <DropdownMenuLabel className="text-muted-foreground/60 text-[10px] uppercase tracking-[0.1em] px-3 py-2">Features</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => fileInputRef.current?.click()}
                                        className="gap-2.5 px-3 py-2 focus:bg-accent focus:text-accent-foreground cursor-pointer rounded-lg mx-1"
                                    >
                                        <FileUp className="size-4 opacity-70" />
                                        <span className="text-[13px] font-medium">Upload File</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onCamera?.()}
                                        className="gap-2.5 px-3 py-2 focus:bg-accent focus:text-accent-foreground cursor-pointer rounded-lg mx-1"
                                    >
                                        <Camera className="size-4 opacity-70" />
                                        <span className="text-[13px] font-medium">Take Photo</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onScreenShare?.()}
                                        className="gap-2.5 px-3 py-2 focus:bg-accent focus:text-accent-foreground cursor-pointer rounded-lg mx-1"
                                    >
                                        <Monitor className="size-4 opacity-70" />
                                        <span className="text-[13px] font-medium">Screen Share</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="h-4 w-px bg-border/40 mx-1.5" />

                            {/* Model Selector */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-muted-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all text-xs font-medium border border-transparent hover:border-border/30"
                                    >
                                        {selectedModel && <selectedModel.icon className={cn(size === "sm" ? "size-3" : "size-3.5", "text-primary/80")} />}
                                        <span className={cn(size === "sm" && "text-[10px]")}>{selectedModel?.name}</span>
                                        <ChevronDown className="size-3 opacity-40" />
                                    </motion.button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    className="w-52 bg-popover/90 backdrop-blur-xl border-border/50 text-popover-foreground shadow-2xl"
                                >
                                    <DropdownMenuLabel className="text-muted-foreground/60 text-[10px] uppercase tracking-[0.1em] px-3 py-2">Switch Model</DropdownMenuLabel>
                                    {models.map((model) => (
                                        <DropdownMenuItem
                                            key={model.id}
                                            onClick={() => onModelChange?.(model.id)}
                                            className={cn(
                                                "gap-2.5 px-3 py-2 focus:bg-accent focus:text-accent-foreground cursor-pointer rounded-lg mx-1",
                                                selectedModelId === model.id && "bg-accent/60 text-accent-foreground font-semibold"
                                            )}
                                        >
                                            <model.icon className={cn("size-4 shadow-sm transition-colors", selectedModelId === model.id ? "text-primary" : "text-muted-foreground/50")} />
                                            <span className="text-[13px]">{model.name}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.button
                                initial={false}
                                animate={{
                                    backgroundColor: (textValue.trim() || attachments.length > 0) ? "var(--primary)" : "var(--muted)",
                                    color: (textValue.trim() || attachments.length > 0) ? "var(--primary-foreground)" : "rgb(var(--muted-foreground) / 0.4)",
                                    scale: (textValue.trim() || attachments.length > 0) ? 1 : 0.98,
                                }}
                                whileHover={(textValue.trim() || attachments.length > 0) ? { scale: 1.08, y: -1 } : {}}
                                whileTap={(textValue.trim() || attachments.length > 0) ? { scale: 0.92, y: 0 } : {}}
                                onClick={handleSend}
                                className={cn(
                                    "p-2 rounded-xl transition-shadow duration-300",
                                    (textValue.trim() || attachments.length > 0)
                                        ? "shadow-[0_4px_12px_rgba(var(--primary),0.25)]"
                                        : "cursor-not-allowed",
                                    size === "sm" && "p-1.5"
                                )}
                            >
                                <Send className={cn(size === "sm" ? "size-3.5" : "size-4.5", "translate-x-[1px] -translate-y-[0.5px]")} />
                            </motion.button>
                        </div>
                    </div>
                )}

                {/* Minimal Variant Floating Send */}
                {variant === "minimal" && (
                    <div className="absolute right-3 bottom-3">
                        <motion.button
                            whileHover={(textValue.trim() || attachments.length > 0) ? { scale: 1.1 } : {}}
                            whileTap={(textValue.trim() || attachments.length > 0) ? { scale: 0.9 } : {}}
                            onClick={handleSend}
                            className={cn(
                                "p-2 rounded-full transition-all",
                                (textValue.trim() || attachments.length > 0)
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "bg-muted text-muted-foreground/30"
                            )}
                        >
                            <Send className="size-4" />
                        </motion.button>
                    </div>
                )}
            </motion.div>
        )
    }
)
PromptInput.displayName = "PromptInput"

export { PromptInput }
