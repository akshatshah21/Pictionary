import { useState, useEffect } from "react";

export default function SecondsTimer({ onComplete, duration, effects }) {
  // function parse(count) {
  //   const minutes = Math.floor(count / 60);
  //   const seconds = count % 60;
  //   return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
  //     2,
  //     "0"
  //   )}`;
  // }

  const [counter, setCounter] = useState(duration);

  useEffect(() => {
    let timeout;
    if (counter > 0) {
      timeout = setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      onComplete();
      setCounter(0);
    }

    if (effects && counter in effects) {
      for (const effect of effects[counter]) {
        effect();
      }
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [counter, onComplete, effects]);

  return counter;
}
