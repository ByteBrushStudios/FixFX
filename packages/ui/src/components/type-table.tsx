"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@utils/functions/cn";

interface TypeInfo {
  /** The type of the property (e.g., "string", "boolean", "ReactNode") */
  type?: string;
  /** Description of the property */
  description?: string;
  /** Additional type description */
  typeDescription?: string;
  /** Link to type documentation */
  typeDescriptionLink?: string;
  /** Default value */
  default?: string;
  /** Whether the property is required */
  required?: boolean;
  /** Whether the property is deprecated */
  deprecated?: boolean;
}

interface TypeTableProps {
  /** Object where keys are property names and values are TypeInfo */
  type: Record<string, TypeInfo>;
  /** Optional title for the table */
  title?: string;
}

export function TypeTable({ type, title }: TypeTableProps) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      {title && (
        <div className="border-b border-fd-border bg-fd-muted/30 px-4 py-2">
          <h4 className="text-sm font-semibold text-fd-foreground">{title}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fd-border bg-fd-muted/20">
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Prop
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Type
              </th>
              <th className="w-10 px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(type).map(([name, info]) => (
              <TypeTableRow key={name} name={name} info={info} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface TypeTableRowProps {
  name: string;
  info: TypeInfo;
}

function TypeTableRow({ name, info }: TypeTableRowProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const hasExpandableContent =
    info.description || info.typeDescription || info.default !== undefined;
  const isOptional = name.endsWith("?") || !info.required;
  const displayName = name.endsWith("?")
    ? name
    : isOptional
      ? `${name}?`
      : name;

  return (
    <>
      <tr
        className={cn(
          "border-b border-fd-border/50 transition-colors",
          hasExpandableContent && "cursor-pointer hover:bg-fd-muted/20",
          isExpanded && "bg-fd-muted/10",
        )}
        onClick={() => hasExpandableContent && setIsExpanded(!isExpanded)}
      >
        <td className="px-4 py-2.5">
          <span
            className={cn(
              "font-mono text-sm",
              info.deprecated
                ? "text-fd-muted-foreground line-through"
                : "text-fd-primary",
            )}
          >
            {displayName}
          </span>
          {info.required && (
            <span className="ml-1.5 text-xs text-red-500">*</span>
          )}
          {info.deprecated && (
            <span className="ml-2 rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-500">
              deprecated
            </span>
          )}
        </td>
        <td className="px-4 py-2.5">
          {info.typeDescriptionLink ? (
            <a
              href={info.typeDescriptionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-fd-muted-foreground hover:text-fd-foreground hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {info.type || "any"}
            </a>
          ) : (
            <span className="font-mono text-sm text-fd-muted-foreground">
              {info.type || "any"}
            </span>
          )}
        </td>
        <td className="px-4 py-2.5 text-right">
          {hasExpandableContent && (
            <ChevronDown
              className={cn(
                "inline-block h-4 w-4 text-fd-muted-foreground transition-transform duration-200",
                isExpanded && "rotate-180",
              )}
            />
          )}
        </td>
      </tr>
      {isExpanded && hasExpandableContent && (
        <tr className="border-b border-fd-border/50 bg-fd-muted/5">
          <td colSpan={3} className="px-4 py-3">
            <div className="space-y-2 pl-2 border-l-2 border-fd-border">
              {info.description && (
                <p className="text-sm text-fd-muted-foreground">
                  {info.description}
                </p>
              )}
              {info.typeDescription && (
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium text-fd-muted-foreground">
                    Type
                  </span>
                  <span className="font-mono text-sm text-fd-muted-foreground">
                    {info.typeDescription}
                  </span>
                </div>
              )}
              {info.default !== undefined && (
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium text-fd-muted-foreground">
                    Default
                  </span>
                  <code className="rounded bg-fd-muted px-1.5 py-0.5 font-mono text-xs text-fd-foreground">
                    {info.default}
                  </code>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// Alternative simpler table for basic key-value display
interface SimpleTypeTableProps {
  data: Record<string, string>;
  title?: string;
}

export function SimpleTypeTable({ data, title }: SimpleTypeTableProps) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      {title && (
        <div className="border-b border-fd-border bg-fd-muted/30 px-4 py-2">
          <h4 className="text-sm font-semibold text-fd-foreground">{title}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fd-border bg-fd-muted/20">
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Property
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr
                key={key}
                className="border-b border-fd-border/50 last:border-b-0"
              >
                <td className="px-4 py-2.5">
                  <span className="font-mono text-sm text-fd-primary">
                    {key}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-fd-muted-foreground">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
