import { GROUPS } from "../lib/constants";

export default function LegendBar() {
  return (
    <div className="flex w-full h-20">
      {GROUPS.map((group) => (
        <div
          key={group.label}
          className="flex-1 flex items-center justify-center"
          style={{ backgroundColor: group.color }}
        >
          <span className="text-white font-[family-name:var(--font-bodoni)] text-xl font-normal">
            {group.label}
          </span>
        </div>
      ))}
    </div>
  );
}
