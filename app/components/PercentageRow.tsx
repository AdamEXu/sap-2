import { GROUPS } from "../lib/constants";

export default function PercentageRow({ values }: { values: number[] }) {
  return (
    <div className="flex w-full">
      {values.map((value, i) => (
        <div key={i} className="flex-1 text-center">
          <span
            className="font-[family-name:var(--font-bodoni)] text-2xl font-bold"
            style={{ color: GROUPS[i].color }}
          >
            {value}%
          </span>
        </div>
      ))}
    </div>
  );
}
