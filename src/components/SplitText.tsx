import { useSprings, animated } from "@react-spring/web";
import { useEffect, useRef, useState, memo, useMemo } from "react";

interface SplitTextProps {
  text?: string;
  className?: string;
  delay?: number;
  animationFrom?: { opacity: number; transform: string };
  animationTo?: { opacity: number; transform: string };
  easing?: (t: number) => number;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "right" | "center" | "justify" | "initial" | "inherit";
  onLetterAnimationComplete?: () => void;
}

// Memoized letter component for better performance
const AnimatedLetter = memo(({ style, letter }: { style: any; letter: string }) => (
  <animated.span style={style}>{letter}</animated.span>
));

// Memoized word component
const Word = memo(({ word, wordIndex, springs, startIndex }: { 
  word: string[]; 
  wordIndex: number; 
  springs: any[];
  startIndex: number;
}) => (
  <span
    key={`word-${wordIndex}`}
    style={{ display: "inline-block", marginRight: "0.25em" }}
  >
    {word.map((letter, letterIndex) => {
      const springIndex = startIndex + letterIndex;
      return (
        <AnimatedLetter
          key={`letter-${wordIndex}-${letterIndex}`}
          style={springs[springIndex]}
          letter={letter}
        />
      );
    })}
  </span>
));

const SplitText: React.FC<SplitTextProps> = memo(({
  text = "",
  className = "",
  delay = 100,
  animationFrom = { opacity: 0, transform: "translate3d(0,40px,0)" },
  animationTo = { opacity: 1, transform: "translate3d(0,0,0)" },
  easing = (t: number): number => t,
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  // Memoize the words and letters to prevent recalculation on re-renders
  const { words, letters, startIndices } = useMemo(() => {
    const parsedWords = text.split(" ").map((w) => w.split(""));
    const allLetters = parsedWords.flat();
    
    // Pre-calculate start indices for each word to avoid recalculation in render
    const indices: number[] = [];
    let currentIndex = 0;
    parsedWords.forEach(word => {
      indices.push(currentIndex);
      currentIndex += word.length;
    });
    
    return { words: parsedWords, letters: allLetters, startIndices: indices };
  }, [text]);

  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);
  const animationCompleted = useRef(false);

  // Optimize intersection observer to reduce CPU usage
  useEffect(() => {
    if (!ref.current || animationCompleted.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin }
    );

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);

  const handleAnimationRest = () => {
    animatedCount.current += 1;
    if (
      animatedCount.current === letters.length &&
      onLetterAnimationComplete && 
      !animationCompleted.current
    ) {
      animationCompleted.current = true;
      onLetterAnimationComplete();
    }
  };

  // Use a more efficient spring configuration
  const springs = useSprings(
    letters.length,
    letters.map((_, i) => ({
      from: animationFrom,
      to: inView ? animationTo : animationFrom,
      delay: inView ? Math.min(i * delay, 1500) : 0, // Cap maximum delay to prevent excessive animations
      config: { 
        tension: 300, 
        friction: 20,
        mass: 1,
        duration: 500, 
        easing 
      },
      onRest: handleAnimationRest,
      immediate: !inView, // Skip animations when not in view
    }))
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{ textAlign, display: "flex", flexWrap: "wrap" }}
    >
      {words.map((word, wordIndex) => (
        <Word 
          key={`word-${wordIndex}`}
          word={word} 
          wordIndex={wordIndex} 
          springs={springs} 
          startIndex={startIndices[wordIndex]}
        />
      ))}
    </div>
  );
});

export default SplitText;
