import { useMemo, useRef, useState, type ReactNode } from "react";
import { Check, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GridColumn<T> {
  key: string;
  header: string;
  /** raw value used for filtering + default rendering */
  value?: (row: T) => string | number | boolean;
  render?: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  width?: string;
  /** show the funnel filter icon on this column */
  filter?: boolean;
}

interface DataGridProps<T> {
  columns: GridColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** the "Drag a column to group" band above the grid */
  groupBand?: boolean;
  emptyText?: string;
  /** blue numbered hint lines rendered under the grid */
  hints?: string[];
  /** right-aligned buttons on the hint strip */
  toolbar?: ReactNode;
  addRowLabel?: string;
  rowClassName?: (row: T) => string | undefined;
}

function rawValue<T>(col: GridColumn<T>, row: T): string {
  if (col.value) return String(col.value(row));
  const v = (row as Record<string, unknown>)[col.key];
  return v === undefined || v === null ? "" : String(v);
}

function ColumnFilter<T>({
  col,
  rows,
  selected,
  onChange,
}: {
  col: GridColumn<T>;
  rows: T[];
  selected: Set<string> | undefined;
  onChange: (next: Set<string> | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => set.add(rawValue(col, r)));
    return Array.from(set).sort();
  }, [col, rows]);

  const isActive = selected !== undefined;

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        aria-label={`Filter ${col.header}`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "ml-1 inline-flex h-4 w-4 items-center justify-center rounded-[2px] border border-transparent text-muted-foreground transition-colors hover:border-grid hover:text-foreground",
          isActive && "border-accent text-accent",
        )}
      >
        <Filter className="h-3 w-3" strokeWidth={2.5} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-5 z-50 w-56 rounded-sm border border-grid bg-popover shadow-window">
            <div className="flex items-center justify-between border-b border-grid px-2 py-1.5">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
                {col.header}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            <div className="max-h-56 overflow-auto py-1">
              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="flex w-full items-center gap-2 px-2 py-1 text-left text-xs hover:bg-muted"
              >
                <span className="inline-flex h-3.5 w-3.5 items-center justify-center border border-grid bg-surface">
                  {!isActive && <Check className="h-3 w-3 text-primary" />}
                </span>
                (All)
              </button>
              {options.map((opt) => {
                const checked = !isActive || selected!.has(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      const base = isActive ? new Set(selected) : new Set(options);
                      if (base.has(opt)) base.delete(opt);
                      else base.add(opt);
                      onChange(base.size === options.length ? undefined : base);
                    }}
                    className="flex w-full items-center gap-2 px-2 py-1 text-left text-xs hover:bg-muted"
                  >
                    <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center border border-grid bg-surface">
                      {checked && <Check className="h-3 w-3 text-primary" />}
                    </span>
                    <span className="truncate">{opt === "" ? "(blank)" : opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-1 border-t border-grid px-2 py-1.5">
              <button type="button" className="chrome-btn" onClick={() => onChange(undefined)}>
                Clear
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function DataGrid<T>({
  columns,
  rows,
  rowKey,
  groupBand = true,
  emptyText = "No records to display.",
  hints,
  toolbar,
  addRowLabel,
  rowClassName,
}: DataGridProps<T>) {
  const [filters, setFilters] = useState<Record<string, Set<string>>>({});

  const filtered = useMemo(
    () =>
      rows.filter((row) =>
        columns.every((col) => {
          const sel = filters[col.key];
          return !sel || sel.has(rawValue(col, row));
        }),
      ),
    [rows, columns, filters],
  );

  const setColFilter = (key: string, next: Set<string> | undefined) =>
    setFilters((prev) => {
      const copy = { ...prev };
      if (next) copy[key] = next;
      else delete copy[key];
      return copy;
    });

  const activeCount = Object.keys(filters).length;

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      {groupBand && (
        <div className="flex items-center justify-between border-b border-grid bg-surface px-3 py-2 text-sm text-muted-foreground">
          <span>Drag a column to group</span>
          {activeCount > 0 && (
            <button type="button" className="chrome-btn" onClick={() => setFilters({})}>
              Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
            </button>
          )}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-30">
            <tr className="grid-head border-b border-grid">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { minWidth: col.width } : undefined}
                  className={cn(
                    "border-r border-grid/70 px-2 py-1.5 font-semibold",
                    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left",
                  )}
                >
                  <span className="inline-flex items-center">
                    {col.header}
                    {col.filter !== false && (
                      <ColumnFilter
                        col={col}
                        rows={rows}
                        selected={filters[col.key]}
                        onChange={(next) => setColFilter(col.key, next)}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, i) => (
              <tr
                key={rowKey(row)}
                className={cn(
                  "scan-row border-b border-grid/60 hover:bg-muted",
                  i % 2 === 1 && "bg-row-alt",
                  rowClassName?.(row),
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "whitespace-nowrap border-r border-grid/40 px-2 py-1",
                      col.align === "right"
                        ? "text-right num"
                        : col.align === "center"
                          ? "text-center"
                          : "text-left",
                    )}
                  >
                    {col.render ? col.render(row) : rawValue(col, row)}
                  </td>
                ))}
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {addRowLabel && (
          <div className="border-b border-grid bg-surface-raised px-3 py-1.5 text-xs text-muted-foreground">
            {addRowLabel}
          </div>
        )}
      </div>

      {(hints || toolbar) && (
        <div className="flex shrink-0 items-end justify-between gap-4 border-t border-grid bg-chrome px-3 py-2">
          <ol className="space-y-0.5 text-[0.6875rem] leading-tight text-hint">
            {hints?.map((h, i) => (
              <li key={h}>
                {i + 1}. {h}
              </li>
            ))}
          </ol>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">{toolbar}</div>
        </div>
      )}
    </div>
  );
}

export function CheckCell({ checked, onToggle }: { checked: boolean; onToggle?: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={cn(
        "inline-flex h-3.5 w-3.5 items-center justify-center rounded-[2px] border border-grid",
        checked ? "bg-primary text-primary-foreground" : "bg-surface",
      )}
    >
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
    </button>
  );
}

export function PnlCell({ value }: { value: number }) {
  return (
    <span className={cn("num", value > 0 ? "text-profit" : value < 0 ? "text-loss" : "text-foreground")}>
      {value.toFixed(2)}
    </span>
  );
}
