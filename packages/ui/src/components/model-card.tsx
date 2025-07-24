import React, { ReactElement } from "react";
import { cn } from "@utils/functions/cn";

interface ModelCardProps {
    id: string;
    name: string;
    description: string;
    icon: ReactElement;
    color: string;
    provider: string;
    isSelected: boolean;
    disabled?: boolean;
    onClick: () => void;
}

export function ModelCard({
    id,
    name,
    description,
    icon,
    color,
    provider,
    isSelected,
    disabled = false,
    onClick
}: ModelCardProps) {
    return (
        <div
            className={cn(
                "group relative rounded-md border p-3 transition-all duration-200",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-white/20",
                isSelected
                    ? "border-[#5865F2] bg-[#5865F2]/10"
                    : "border-[#5865F2]/20 bg-[#0F0B2B]"
            )}
            onClick={() => !disabled && onClick()}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: color + "20" }}>
                        {React.cloneElement(icon, {
                            style: { color },
                            className: "h-4 w-4"
                        })}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{name}</span>
                            <span className="rounded bg-[#1A1C2D] px-1.5 py-0.5 text-xs text-muted-foreground">
                                {provider}
                            </span>
                            {disabled && (
                                <span className="rounded bg-[#2D1A1A] text-red-400 px-1.5 py-0.5 text-xs">
                                    Coming Soon
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                </div>
                <div className={cn(
                    "h-4 w-4 rounded-full border-2",
                    isSelected
                        ? "border-[#5865F2] bg-[#5865F2]"
                        : "border-white/20"
                )} />
            </div>
        </div>
    );
}
