import { GROUPS } from "../lib/constants";

export default function WealthBar({
  values,
  height = "h-16",
}: {
  values: number[];
  height?: string;
}) {
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div className={`flex w-full ${height} overflow-hidden`}>
      {values.map((value, i) => (
        <div
          key={i}
          className={`${height} transition-all duration-300`}
          style={{
            backgroundColor: GROUPS[i].color,
            width: total > 0 ? `${(value / total) * 100}%` : "0%",
          }}
        />
      ))}
    </div>
  );
}
