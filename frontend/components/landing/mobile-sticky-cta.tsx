"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SPRING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export function MobileStickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past Hero (approx 600px)
      setShow(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9990] p-4 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 lg:hidden transition-transform duration-500 ease-out ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ transitionTimingFunction: SPRING }}
    >
      <div className="flex gap-3 max-w-md mx-auto">
        <Link
          href="/register"
          className="flex-1 bg-gray-900 text-white font-semibold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/contact"
          className="flex-none bg-gray-100 text-gray-900 font-semibold h-12 px-5 rounded-xl flex items-center justify-center hover:bg-gray-200 active:scale-[0.98] transition-transform"
        >
          Demo
        </Link>
      </div>
    </div>
  );
}
