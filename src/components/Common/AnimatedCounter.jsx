/* ============================================================
   src/components/Common/AnimatedCounter.jsx
   Counts a number up from 0 (or previous value) to target.
   Uses requestAnimationFrame for buttery smooth animation.
   ============================================================ */
import React, { useEffect, useRef, useState } from "react";

/**
 * AnimatedCounter
 * @param {number}  value      - target number to animate to
 * @param {number}  duration   - animation duration in ms (default 900)
 * @param {Function} formatter - optional formatter fn (default: toLocaleString)
 */
function AnimatedCounter({ value, duration = 900, formatter }) {
  const [display, setDisplay] = useState(0);
  const prevRef    = useRef(0);
  const frameRef   = useRef(null);
  const startRef   = useRef(null);

  useEffect(() => {
    const start    = prevRef.current;
    const end      = value;
    const diff     = end - start;

    /* Skip animation for very small changes */
    if (Math.abs(diff) < 1) {
      setDisplay(end);
      return;
    }

    startRef.current = null;

    function tick(timestamp) {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed  = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      /* Ease-out cubic */
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + diff * eased;

      setDisplay(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(end);
        prevRef.current = end;
      }
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  const formatted = formatter
    ? formatter(display)
    : Math.round(display).toLocaleString("en-IN");

  return <span>{formatted}</span>;
}

export default AnimatedCounter;
