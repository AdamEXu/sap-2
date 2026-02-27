"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import SlideLayout from "./components/SlideLayout";
import WealthBar from "./components/WealthBar";
import PercentageRow from "./components/PercentageRow";
import { GROUPS, SOCIALISM, EXTREME, ACTUAL } from "./lib/constants";

const FADE_MS = 250;

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [visible, setVisible] = useState(true);
  const [userGuess, setUserGuess] = useState([...SOCIALISM]);
  const transitioning = useRef(false);

  const sum = userGuess.reduce((a, b) => a + b, 0);

  const goTo = useCallback(
    (next: number) => {
      if (transitioning.current) return;
      if (next < 0 || next > 6) return;
      if (next === slide) return;
      transitioning.current = true;
      setVisible(false);
      setTimeout(() => {
        setSlide(next);
        setVisible(true);
        setTimeout(() => {
          transitioning.current = false;
        }, FADE_MS);
      }, FADE_MS);
    },
    [slide]
  );

  const advance = useCallback(() => {
    if (slide === 3 && sum !== 100) return;
    goTo(slide + 1);
  }, [slide, sum, goTo]);

  const goBack = useCallback(() => {
    goTo(slide - 1);
  }, [slide, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        goBack();
        return;
      }
      if (e.key === "Enter") {
        if (
          slide === 3 &&
          document.activeElement?.tagName === "INPUT"
        ) {
          (document.activeElement as HTMLElement).blur();
          return;
        }
        advance();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [advance, goBack, slide]);

  const updateGuess = (index: number, value: string) => {
    const num = value === "" ? 0 : parseInt(value, 10);
    if (isNaN(num) || num < 0 || num > 100) return;
    setUserGuess((prev) => {
      const next = [...prev];
      next[index] = num;
      return next;
    });
  };

  // Build bottom content (percentage rows above legend bar)
  let bottomContent: React.ReactNode = null;
  if (slide === 1) {
    bottomContent = <PercentageRow values={SOCIALISM} />;
  } else if (slide === 2) {
    bottomContent = <PercentageRow values={EXTREME} />;
  } else if (slide === 3) {
    bottomContent = (
      <GuessInputs values={userGuess} onChange={updateGuess} />
    );
  } else if (slide === 4) {
    bottomContent = <PercentageRow values={userGuess} />;
  } else if (slide === 5) {
    bottomContent = (
      <div className="flex flex-col gap-0.5">
        <PercentageRow values={SOCIALISM} />
        <PercentageRow values={EXTREME} />
        <PercentageRow values={userGuess} />
        <PercentageRow values={ACTUAL} />
      </div>
    );
  }

  return (
    <SlideLayout bottomContent={bottomContent} visible={visible}>
      {slide === 0 && <StartSlide />}
      {slide === 1 && <SocialismSlide />}
      {slide === 2 && <ExtremeSlide />}
      {slide === 3 && <GuessSlide values={userGuess} sum={sum} />}
      {slide === 4 && <YourGuessSlide values={userGuess} />}
      {slide === 5 && <ResultsSlide userGuess={userGuess} />}
      {slide === 6 && <EndSlide />}
    </SlideLayout>
  );
}

function StartSlide() {
  return (
    <p className="font-[family-name:var(--font-bodoni)] text-4xl md:text-5xl text-center">
      Press return to begin.
    </p>
  );
}

function SocialismSlide() {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-6">
      <h2 className="font-[family-name:var(--font-bodoni)] text-4xl md:text-5xl font-bold text-center">
        This is socialism:
      </h2>
      <WealthBar values={SOCIALISM} />
      <p className="font-[family-name:var(--font-bodoni)] text-2xl md:text-3xl text-center">
        All wealth groups have equal distributions of wealth.
      </p>
    </div>
  );
}

function ExtremeSlide() {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-6">
      <h2 className="font-[family-name:var(--font-bodoni)] text-4xl md:text-5xl font-bold text-center">
        An extreme example:
      </h2>
      <WealthBar values={EXTREME} />
      <p className="font-[family-name:var(--font-bodoni)] text-2xl md:text-3xl text-center">
        Most wealth is concentrated into the 20th percentile.
      </p>
    </div>
  );
}

function GuessSlide({
  values,
  sum,
}: {
  values: number[];
  sum: number;
}) {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-6">
      <div className="flex items-baseline gap-6 w-full justify-center">
        <h2 className="font-[family-name:var(--font-bodoni)] text-4xl md:text-5xl font-bold text-center">
          Your turn:
        </h2>
        <span
          className={`font-[family-name:var(--font-bodoni)] text-2xl font-bold ${
            sum === 100 ? "text-black" : "text-red-500"
          }`}
        >
          Sum: {sum}%
        </span>
      </div>
      <WealthBar values={values} />
      <p className="font-[family-name:var(--font-bodoni)] text-2xl md:text-3xl text-center">
        What do you think the actual distribution was in 2026?
      </p>
      {sum !== 100 && (
        <p className="text-red-500 font-[family-name:var(--font-bodoni)] text-lg">
          Values must sum to 100 to continue.
        </p>
      )}
    </div>
  );
}

function GuessInputs({
  values,
  onChange,
}: {
  values: number[];
  onChange: (index: number, value: string) => void;
}) {
  return (
    <div className="flex w-full">
      {values.map((value, i) => (
        <div key={i} className="flex-1 flex justify-center">
          <input
            type="number"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onChange(i, e.target.value)}
            className="w-20 h-12 text-center text-xl font-bold font-[family-name:var(--font-bodoni)] border-2 border-black bg-[#f6f6f6] rounded-none outline-none focus:border-4"
            style={{ color: GROUPS[i].color }}
          />
        </div>
      ))}
    </div>
  );
}

function YourGuessSlide({ values }: { values: number[] }) {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-6">
      <h2 className="font-[family-name:var(--font-bodoni)] text-4xl md:text-5xl font-bold text-center">
        Your guess:
      </h2>
      <WealthBar values={values} />
      <p className="font-[family-name:var(--font-bodoni)] text-2xl md:text-3xl text-center">
        Let&apos;s see how close you got to the actual numbers...
      </p>
    </div>
  );
}

function ResultsSlide({ userGuess }: { userGuess: number[] }) {
  const rows = [
    { label: "Socialism:", values: SOCIALISM },
    { label: "Extreme example:", values: EXTREME },
    { label: "Your guess:", values: userGuess },
    { label: "Actual numbers:", values: ACTUAL },
  ];

  return (
    <div className="w-full max-w-5xl flex flex-col items-center gap-4">
      <div className="w-full flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-4">
            <span className="font-[family-name:var(--font-bodoni)] text-xl md:text-2xl font-bold text-right w-52 shrink-0">
              {row.label}
            </span>
            <div className="flex-1">
              <WealthBar values={row.values} height="h-10" />
            </div>
          </div>
        ))}
      </div>
      <p className="font-[family-name:var(--font-bodoni)] text-2xl md:text-3xl text-center mt-2">
        The wealth gap is worse than the extreme example.
      </p>
    </div>
  );
}

function EndSlide() {
  return (
    <p className="font-[family-name:var(--font-bodoni)] text-4xl md:text-5xl text-center">
      Thank you for playing.
    </p>
  );
}
