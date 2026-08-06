import { useEffect, useRef } from "react";

export default function LetterGlitch({
  glitchColors = ["#2b4539", "#61dca3", "#61b3dc"],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789",
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(0);
  const letters = useRef([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef(null);
  const lastGlitch = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;
    const ctx = canvas.getContext("2d");
    context.current = ctx;
    const randomChar = () =>
      characters[Math.floor(Math.random() * characters.length)];
    const randomColor = () =>
      glitchColors[Math.floor(Math.random() * glitchColors.length)];
    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      grid.current = {
        columns: Math.ceil(rect.width / 10),
        rows: Math.ceil(rect.height / 20),
      };
      letters.current = Array.from(
        { length: grid.current.columns * grid.current.rows },
        () => ({
          char: randomChar(),
          color: randomColor(),
          targetColor: randomColor(),
          progress: 1,
        }),
      );
      draw();
    };
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = "16px monospace";
      ctx.textBaseline = "top";
      letters.current.forEach((letter, index) => {
        ctx.fillStyle = letter.color;
        ctx.fillText(
          letter.char,
          (index % grid.current.columns) * 10,
          Math.floor(index / grid.current.columns) * 20,
        );
      });
    };
    const update = () => {
      const amount = Math.max(1, Math.floor(letters.current.length * 0.05));
      for (let i = 0; i < amount; i += 1) {
        const letter =
          letters.current[Math.floor(Math.random() * letters.current.length)];
        if (!letter) continue;
        letter.char = randomChar();
        letter.color = randomColor();
      }
      draw();
    };
    const animate = () => {
      if (Date.now() - lastGlitch.current >= glitchSpeed) {
        update();
        lastGlitch.current = Date.now();
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    lastGlitch.current = Date.now();
    resize();
    animate();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    return () => {
      cancelAnimationFrame(animationRef.current);
      observer.disconnect();
    };
  }, [characters, glitchColors, glitchSpeed, smooth]);
  return (
    <div className="letter-glitch">
      <canvas ref={canvasRef} />
      {outerVignette && <div className="letter-glitch-outer" />}
      {centerVignette && <div className="letter-glitch-center" />}
    </div>
  );
}
