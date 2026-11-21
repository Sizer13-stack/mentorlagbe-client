"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.getAttribute("data-theme") === "mentordark"), []);
  const toggle = () => {
    const next = dark ? "mentor" : "mentordark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setDark(!dark);
  };
  return (
    <button onClick={toggle} aria-label="Toggle dark mode" className={`btn btn-ghost btn-circle btn-sm ${className}`}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
