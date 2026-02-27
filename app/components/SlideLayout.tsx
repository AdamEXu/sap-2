import Title from "./Title";
import LegendBar from "./LegendBar";

export default function SlideLayout({
  children,
  bottomContent,
  visible,
}: {
  children: React.ReactNode;
  bottomContent?: React.ReactNode;
  visible: boolean;
}) {
  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      <div className="pt-6 px-8">
        <Title />
      </div>
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {children}
      </div>
      <div
        className="pb-1 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {bottomContent}
      </div>
      <LegendBar />
    </div>
  );
}
