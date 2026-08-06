import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  threshold = 0.1,
  rootMargin = "-100px",
  onLetterAnimationComplete,
}) {
  const ref = useRef(null);
  const callbackRef = useRef(onLetterAnimationComplete);
  useEffect(() => {
    callbackRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const characters = [...text].map((character) => {
      const span = document.createElement("span");
      span.className = "split-char";
      span.textContent = character === " " ? "\u00a0" : character;
      return span;
    });
    element.replaceChildren(...characters);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.fromTo(
          characters,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration,
            ease,
            stagger: delay / 1000,
            onComplete: () => callbackRef.current?.(),
            overwrite: "auto",
          },
        );
        observer.disconnect();
      },
      { threshold, rootMargin },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      gsap.killTweensOf(characters);
      element.replaceChildren();
    };
  }, [delay, duration, ease, rootMargin, text, threshold]);
  return (
    <h1 ref={ref} className={`split-parent ${className}`}>
      {text}
    </h1>
  );
}
