/* ============================================================
   src/components/Common/LiveClock.jsx
   Isolated clock component — only THIS component re-renders
   every second, not the entire Header tree.
   React.memo prevents parent-triggered re-renders.
   ============================================================ */
import React, { useState, useEffect, memo } from "react";

const LiveClock = memo(function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    /* Update exactly on the next second boundary for accuracy */
    const msToNextSecond = 1000 - (Date.now() % 1000);
    const timeout = setTimeout(() => {
      setNow(new Date());
      /* Then tick every second */
      const interval = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(interval);
    }, msToNextSecond);
    return () => clearTimeout(timeout);
  }, []);

  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  });
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  return (
    <span className="date-chip hide-mobile" title={dateStr}>
      {timeStr}
    </span>
  );
});

export default LiveClock;
