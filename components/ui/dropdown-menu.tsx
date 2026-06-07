// components/ui/dropdown-menu.tsx
"use client"

import React, { useState, useRef, useEffect, createContext, useContext } from "react"
import { ChevronRight, Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

// Types
type DropdownMenuContextType = {
    open: boolean
    setOpen: (open: boolean) => void
    triggerRef: React.RefObject<HTMLButtonElement>
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(undefined)

const useDropdownMenu = () => {
    const context = useContext(DropdownMenuContext)
    if (!context) {
        throw new Error("DropdownMenu components must be used within a DropdownMenu")
    }
    return context
}

// Root Component
interface DropdownMenuProps {
    children: React.ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null!)

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
            {children}
        </DropdownMenuContext.Provider>
    )
}

// Trigger Component
interface DropdownMenuTriggerProps {
    children: React.ReactNode
    asChild?: boolean
    className?: string
}

export function DropdownMenuTrigger({ children, asChild, className }: DropdownMenuTriggerProps) {
    const { open, setOpen, triggerRef } = useDropdownMenu()

    if (asChild && React.isValidElement(children)) {
        const child = children as React.ReactElement<any>

        return React.cloneElement(child, {
            onClick: () => {
                if (child.props && typeof child.props.onClick === 'function') {
                    child.props.onClick()
                }
                setOpen(!open)
            },
            ref: triggerRef as any,
            className: cn(className, child.props?.className)
        })
    }

    return (
        <button
            ref={triggerRef}
            onClick={() => setOpen(!open)}
            className={cn("outline-none", className)}
        >
            {children}
        </button>
    )
}

// Content Component
interface DropdownMenuContentProps {
    children: React.ReactNode
    className?: string
    sideOffset?: number
    align?: "start" | "center" | "end"
}

export function DropdownMenuContent({
    children,
    className,
    sideOffset = 4,
    align = "start"
}: DropdownMenuContentProps) {
    const { open, setOpen, triggerRef } = useDropdownMenu()
    const contentRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (open && triggerRef.current && contentRef.current) {
            const trigger = triggerRef.current.getBoundingClientRect()
            const content = contentRef.current.getBoundingClientRect()

            let top = trigger.bottom + sideOffset
            let left = trigger.left

            if (align === "center") {
                left = trigger.left + (trigger.width - content.width) / 2
            } else if (align === "end") {
                left = trigger.right - content.width
            }

            // Prevent overflow
            if (left + content.width > window.innerWidth) {
                left = window.innerWidth - content.width - 8
            }
            if (top + content.height > window.innerHeight) {
                top = trigger.top - content.height - sideOffset
            }

            setPosition({ top, left })
        }
    }, [open, sideOffset, align])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                contentRef.current &&
                !contentRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [open, setOpen])

    // Close on Escape
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false)
            }
        }

        if (open) {
            document.addEventListener("keydown", handleEscape)
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
        }
    }, [open, setOpen])

    if (!open) return null

    return (
        <div
            ref={contentRef}
            className={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            style={{
                position: "fixed",
                top: position.top,
                left: position.left,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    )
}

// Item Component - با asChild و onClick
interface DropdownMenuItemProps {
    children: React.ReactNode
    className?: string
    inset?: boolean
    onSelect?: () => void
    onClick?: () => void
    disabled?: boolean
    asChild?: boolean
}

export function DropdownMenuItem({
    children,
    className,
    inset,
    onSelect,
    onClick,
    disabled,
    asChild
}: DropdownMenuItemProps) {
    const { setOpen } = useDropdownMenu()

    const handleClick = () => {
        if (disabled) return
        onClick?.()
        onSelect?.()
        setOpen(false)
    }

    // اگر asChild باشد و children یک element معتبر باشد
    if (asChild && React.isValidElement(children)) {
        const child = children as React.ReactElement<any>

        return React.cloneElement(child, {
            onClick: (e: React.MouseEvent) => {
                // اگر child خودش onClick داشت، اول اجرا کن
                if (child.props && typeof child.props.onClick === 'function') {
                    child.props.onClick(e)
                }
                handleClick()
            },
            className: cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                inset && "pl-8",
                disabled && "opacity-50 pointer-events-none",
                className,
                child.props?.className
            )
        })
    }

    return (
        <div
            onClick={handleClick}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                inset && "pl-8",
                disabled && "opacity-50 pointer-events-none",
                className
            )}
            role="menuitem"
        >
            {children}
        </div>
    )
}

// Label Component
interface DropdownMenuLabelProps {
    children: React.ReactNode
    className?: string
    inset?: boolean
}

export function DropdownMenuLabel({ children, className, inset }: DropdownMenuLabelProps) {
    return (
        <div
            className={cn(
                "px-2 py-1.5 text-sm font-semibold",
                inset && "pl-8",
                className
            )}
        >
            {children}
        </div>
    )
}

// Separator Component
interface DropdownMenuSeparatorProps {
    className?: string
}

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps) {
    return (
        <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
    )
}

// Shortcut Component
interface DropdownMenuShortcutProps {
    className?: string
    children: React.ReactNode
}

export function DropdownMenuShortcut({ className, children }: DropdownMenuShortcutProps) {
    return (
        <span className={cn("mr-auto text-xs tracking-widest opacity-60", className)}>
            {children}
        </span>
    )
}

// Checkbox Item Component
interface DropdownMenuCheckboxItemProps {
    children: React.ReactNode
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    className?: string
    disabled?: boolean
}

export function DropdownMenuCheckboxItem({
    children,
    checked,
    onCheckedChange,
    className,
    disabled
}: DropdownMenuCheckboxItemProps) {
    const { setOpen } = useDropdownMenu()

    return (
        <div
            onClick={() => {
                if (!disabled) {
                    onCheckedChange?.(!checked)
                }
            }}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                disabled && "opacity-50 pointer-events-none",
                className
            )}
            role="menuitemcheckbox"
            aria-checked={checked}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {checked && <Check className="h-4 w-4" />}
            </span>
            {children}
        </div>
    )
}

// Radio Group Component
interface DropdownMenuRadioGroupProps {
    children: React.ReactNode
    value?: string
    onValueChange?: (value: string) => void
}

export function DropdownMenuRadioGroup({
    children,
    value,
    onValueChange
}: DropdownMenuRadioGroupProps) {
    return (
        <div role="group">
            {React.Children.map(children, (child) => {
                if (React.isValidElement<{ value?: string; checked?: boolean; onClick?: () => void }>(child)) {
                    return React.cloneElement(child, {
                        checked: child.props.value === value,
                        onClick: () => {
                            if (child.props.value) {
                                onValueChange?.(child.props.value)
                            }
                        }
                    })
                }
                return child
            })}
        </div>
    )
}

// Radio Item Component
interface DropdownMenuRadioItemProps {
    children: React.ReactNode
    value: string
    className?: string
    checked?: boolean
    onClick?: () => void
    disabled?: boolean
}

export function DropdownMenuRadioItem({
    children,
    value: _itemValue,
    className,
    checked,
    onClick,
    disabled
}: DropdownMenuRadioItemProps) {
    const { setOpen } = useDropdownMenu()

    return (
        <div
            onClick={() => {
                if (!disabled) {
                    onClick?.()
                    setOpen(false)
                }
            }}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                disabled && "opacity-50 pointer-events-none",
                className
            )}
            role="menuitemradio"
            aria-checked={checked}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {checked && <Circle className="h-2 w-2 fill-current" />}
            </span>
            {children}
        </div>
    )
}

// Sub Menu Components
interface DropdownMenuSubProps {
    children: React.ReactNode
}

export function DropdownMenuSub({ children }: DropdownMenuSubProps) {
    return <>{children}</>
}

interface DropdownMenuSubTriggerProps {
    children: React.ReactNode
    className?: string
    inset?: boolean
}

export function DropdownMenuSubTrigger({ children, className, inset }: DropdownMenuSubTriggerProps) {
    const [subOpen, setSubOpen] = useState(false)
    const subTriggerRef = useRef<HTMLDivElement>(null)
    const [subPosition, setSubPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (subOpen && subTriggerRef.current) {
            const trigger = subTriggerRef.current.getBoundingClientRect()
            setSubPosition({
                top: trigger.top,
                left: trigger.right + 4
            })
        }
    }, [subOpen])

    return (
        <div
            ref={subTriggerRef}
            onMouseEnter={() => setSubOpen(true)}
            onMouseLeave={() => setSubOpen(false)}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                "focus:bg-accent data-[state=open]:bg-accent",
                inset && "pl-8",
                className
            )}
        >
            {children}
            <ChevronRight className="mr-auto h-4 w-4" />

            {subOpen && (
                <div
                    className={cn(
                        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
                        "data-[state=open]:animate-in",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                    )}
                    style={{
                        position: "fixed",
                        top: subPosition.top,
                        left: subPosition.left,
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    )
}

interface DropdownMenuSubContentProps {
    children: React.ReactNode
    className?: string
}

export function DropdownMenuSubContent({ children, className }: DropdownMenuSubContentProps) {
    return (
        <div className={cn("p-1", className)}>
            {children}
        </div>
    )
}

// Group Component
interface DropdownMenuGroupProps {
    children: React.ReactNode
}

export function DropdownMenuGroup({ children }: DropdownMenuGroupProps) {
    return <>{children}</>
}

// Portal Component (simplified - renders children)
interface DropdownMenuPortalProps {
    children: React.ReactNode
}

export function DropdownMenuPortal({ children }: DropdownMenuPortalProps) {
    return <>{children}</>
}