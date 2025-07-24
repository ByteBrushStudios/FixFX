import * as React from "react"
import { Button } from "./button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@utils/functions/cn"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const generatePaginationItems = () => {
        // For small number of pages, show all
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        // For many pages, show a window around current page
        const items = []

        // Always include first page
        items.push(1)

        // Add ellipsis if needed
        if (currentPage > 3) {
            items.push(-1) // -1 represents ellipsis
        }

        // Add pages around current page
        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPages - 1, currentPage + 1)

        for (let i = start; i <= end; i++) {
            items.push(i)
        }

        // Add ellipsis if needed
        if (currentPage < totalPages - 2) {
            items.push(-2) // -2 represents second ellipsis
        }

        // Always include last page
        if (totalPages > 1) {
            items.push(totalPages)
        }

        return items
    }

    const items = generatePaginationItems()

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8"
            >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
            </Button>

            {items.map((item, index) => {
                if (item < 0) {
                    return (
                        <Button
                            key={`ellipsis-${index}`}
                            variant="outline"
                            size="icon"
                            disabled
                            className="h-8 w-8 cursor-default"
                        >
                            ...
                        </Button>
                    )
                }

                return (
                    <Button
                        key={item}
                        variant={currentPage === item ? "default" : "outline"}
                        size="icon"
                        onClick={() => onPageChange(item)}
                        className={cn(
                            "h-8 w-8",
                            currentPage === item && "bg-[#5865F2]"
                        )}
                    >
                        {item}
                    </Button>
                )
            })}

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
            >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
            </Button>
        </div>
    )
}
