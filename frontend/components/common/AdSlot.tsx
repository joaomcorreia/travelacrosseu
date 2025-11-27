interface AdSlotProps {
  position: string;
  className?: string;
}

export default function AdSlot({ position, className = "" }: AdSlotProps) {
  return (
    <div className={`max-w-xl mx-auto ${className}`}>
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
        Ad space – {position}
      </div>
    </div>
  );
}