"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@utils/functions/cn"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = ({
    className,
    ...props
}: SheetPrimitive.DialogPortalProps) => (
    <SheetPrimitive.Portal className={cn(className)} {...props} />
)
SheetPortal.displayName = SheetPrimitive.Portal.displayName

const SheetOverlay = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
        className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
        ref={ref}
    />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
    "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
    {
        variants: {
            side: {
                top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
                bottom:
                    "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
                left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
                right:
                    "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
            },
        },
        defaultVariants: {
            side: "right",
        },
    }
)

interface SheetContentProps
    extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
    hideCloseButton?: boolean;
    closeOnPointerDown?: boolean;
}

const SheetContent = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    SheetContentProps
>(({ side = "right", hideCloseButton = false, closeOnPointerDown = true, className, children, ...props }, ref) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [touchStartY, setTouchStartY] = React.useState<number | null>(null);
    const closeRef = React.useRef<HTMLButtonElement | null>(null);
    const closeOnPointerDownRef = React.useRef(closeOnPointerDown);

    // Update ref whenever the prop changes
    React.useEffect(() => {
        closeOnPointerDownRef.current = closeOnPointerDown;
    }, [closeOnPointerDown]);

    // Create a ref that merges the passed ref and our contentRef
    const handleRef = React.useMemo(
        () => mergeRefs([ref, contentRef]),
        [ref]
    );

    // Use this effect to handle the touch event if side is "bottom"
    React.useEffect(() => {
        const content = contentRef.current;
        if (!content || side !== "bottom") return;

        const handleTouchStart = (e: TouchEvent) => {
            // Only handle touch events on the handle area
            const target = e.target as HTMLElement;
            const isHandleArea = target.closest('[data-drag-handle="true"]');
            if (!isHandleArea) return;

            // Prevent default to avoid browser scroll behavior
            e.preventDefault();
            setTouchStartY(e.touches[0].clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            // Skip if touch didn't start on handle area
            if (touchStartY === null) return;

            const deltaY = e.touches[0].clientY - touchStartY;

            // If dragged down enough, consider it a close intent
            if (deltaY > 100) {
                if (closeRef.current) {
                    closeRef.current.click();
                }
                setTouchStartY(null);
                return;
            }

            // Use transform instead of height for smoother dragging
            const scale = Math.max(0.95, Math.min(1, 1 - (deltaY / 1000)));
            const translateY = Math.max(0, deltaY * 0.5);

            content.style.transform = `translateY(${translateY}px) scale(${scale})`;
            content.style.opacity = `${1 - (deltaY / 500)}`;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (touchStartY === null) return;

            const deltaY = e.changedTouches[0].clientY - touchStartY;

            // Reset styles with transition
            content.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

            // Close if dragged down significantly
            if (deltaY > 150) {
                if (closeRef.current) {
                    closeRef.current.click();
                    console.log("Sheet closed via drag");
                }
            } else {
                // Return to original position
                content.style.transform = '';
                content.style.opacity = '';
            }

            // Clear touch start position
            setTouchStartY(null);

            // Reset transition after animation completes
            setTimeout(() => {
                content.style.transition = '';
            }, 300);
        };

        // Add event listeners
        content.addEventListener('touchstart', handleTouchStart, { passive: false });
        content.addEventListener('touchmove', handleTouchMove, { passive: true });
        content.addEventListener('touchend', handleTouchEnd);

        // Remove event listeners on cleanup
        return () => {
            content.removeEventListener('touchstart', handleTouchStart);
            content.removeEventListener('touchmove', handleTouchMove);
            content.removeEventListener('touchend', handleTouchEnd);
        };
    }, [touchStartY, side]);

    return (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content
                ref={handleRef}
                className={cn(sheetVariants({ side }), className)}
                onPointerDownOutside={(e) => {
                    // Only prevent default if closeOnPointerDown is false
                    if (!closeOnPointerDownRef.current) {
                        e.preventDefault();
                    }
                }}
                {...props}
            >
                {children}
                {!hideCloseButton && (
                    <SheetPrimitive.Close
                        ref={closeRef}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </SheetPrimitive.Close>
                )}
            </SheetPrimitive.Content>
        </SheetPortal>
    )
})

function mergeRefs<T = any>(
    refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>
): React.RefCallback<T> {
    return (value) => {
        refs.forEach((ref) => {
            if (typeof ref === "function") {
                ref(value);
            } else if (ref != null) {
                (ref as React.MutableRefObject<T | null>).current = value;
            }
        });
    };
}

const SheetHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-2 text-center sm:text-left",
            className
        )}
        {...props}
    />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold text-foreground", className)}
        {...props}
    />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
}
