import React, { useState, useEffect, useRef, EffectCallback } from "react";
import useComponentSize, { ComponentSize } from "@rehooks/component-size";

/** useEffect that only runs once, on mount (and returns on unmount) */
export function useMount(cb: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(cb, []);
}

export function useWindowSize(): {
  width: number;
  height: number;
} {
  // (For SSR apps only?) Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

/** track the previous value of a variable */
export const usePrevious = (value) => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
    return () => {
      ref.current = undefined;
    };
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

/**
 * Run an effect, only once, when a condition is met
 * @param callback callback to fire when shouldRun = true
 * @param shouldRun whether we should fire the callback
 * @param dependencies when these change, check again if shouldRun = true
 */
export function useEffectOnce({
  callback,
  shouldRun,
  dependencies,
}: {
  callback: Function;
  shouldRun: boolean;
  dependencies: any[];
}) {
  const didRun = useRef(false);
  let dependenciesToUse = dependencies;

  useEffect(() => {
    if (shouldRun && !didRun.current) {
      // once we fire, cancel the useEffect
      callback();
      didRun.current = true;
      // eslint-disable-next-line
      dependenciesToUse = []; // this line cancels the effect
    }
  }, dependenciesToUse);
}

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// https://github.com/Hermanya/use-interval/blob/master/src/index.tsx
// * not set up to work with delay = 0
/**
 * a dynamic setInterval
 *
 * @param callback function to call on the interval
 * @param delay milliseconds between each call
 * @param immediate should call the callback right away?
 */
export const useInterval = ({
  callback,
  delay,
  immediate = false /* called when mounted if true */,
}: {
  callback: () => void;
  delay: number | null | false;
  immediate: boolean;
}) => {
  const savedCallback = useRef(null as Function | null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
    return () => {
      savedCallback.current = null;
    };
  }, [callback]);

  // Execute callback if immediate is set & delay exists.
  const firstDelayRef = useRef(delay);
  useEffect(() => {
    if (immediate && firstDelayRef.current && savedCallback.current) {
      savedCallback.current();
    }
  }, [immediate]);

  // Set up the interval.
  useEffect(() => {
    if (!delay) {
      return undefined;
    }

    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    let intervalId;

    if (delay !== null) {
      intervalId = setInterval(tick, delay);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [delay]);
};

// source: https://github.com/kentcdodds/react-hooks/blob/main/src/utils.js

/** useLocalStorageState by kentcdodds
 *
 * same as useState, but synchronizes state to window.localStorage
 *
 * @param {String} key The key (name) to set in localStorage for this value
 * @param {Object} defaultValue The value to use, if it's not already in localStorage
 * @param {{serialize: Function, deserialize: Function}} options The serialize and deserialize functions to use (defaults to JSON.stringify and JSON.parse respectively)
 */
export function useLocalStorageState(
  key: string,
  defaultValue: string | Function = "",
  { serialize = JSON.stringify, deserialize = JSON.parse }: any = {}
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage);
    }
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  const prevKeyRef = React.useRef(key);

  React.useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState];
}

/** gives you a ref to put on an element, and tracks the size of that element */
export const useContainerDimensions = () => {
  const ref = useRef();
  const size = useComponentSize(ref);

  return [ref, size] as [React.MutableRefObject<any>, ComponentSize];
};
