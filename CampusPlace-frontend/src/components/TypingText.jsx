import { useEffect, useState } from "react";

const phrases = [
  "Unlock your Ultimate Potential",
  "Crack Your Dream Job Faster",
  "Build Your Future with AI 🚀",
];

export default function TypingText() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (index === phrases.length) return;

    if (subIndex === phrases[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1200);
      return;
    }

    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
      setText(phrases[index].substring(0, subIndex));
    }, deleting ? 40 : 70);

    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting]);

  return (
    <h1 className="hero-title">
  {text.includes("Ultimate Potential") ? (
    <>
      Unlock your{" "}
      <span className="gradient-text">Ultimate Potential</span>
    </>
  ) : (
    text
  )}
  <span className="cursor">|</span>
</h1>
  );
}