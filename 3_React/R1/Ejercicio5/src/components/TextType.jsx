import { useEffect, useMemo, useState } from "react";
import "./TextType.css";

export default function TextType({
  text = [],
  typingSpeed = 75,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = "_",
  deletingSpeed = 50,
}) {
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex] ?? "";
    const isComplete = displayedText === currentText;
    const isEmpty = displayedText.length === 0;
    const delay =
      isComplete && !deleting
        ? pauseDuration
        : deleting
          ? deletingSpeed
          : typingSpeed;

    const timeoutId = window.setTimeout(() => {
      if (isComplete && !deleting) {
        setDeleting(true);
        return;
      }

      if (isEmpty && deleting) {
        setDeleting(false);
        setTextIndex((index) => (index + 1) % texts.length);
        return;
      }

      setDisplayedText((value) =>
        deleting
          ? currentText.slice(0, value.length - 1)
          : currentText.slice(0, value.length + 1),
      );
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [
    deleting,
    deletingSpeed,
    displayedText,
    pauseDuration,
    textIndex,
    texts,
    typingSpeed,
  ]);

  return (
    <span className="text-type">
      {displayedText}
      {showCursor && (
        <span className="text-type__cursor">{cursorCharacter}</span>
      )}
    </span>
  );
}
