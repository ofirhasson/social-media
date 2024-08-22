import { useCallback, useEffect, useRef } from "react";

export const useResizeObserver = (callback: ResizeObserverCallback) => {
  const observer = useRef<ResizeObserver | null>(null);
  const observedElement = useRef<Element | null>(null);

  const observe = useCallback(
    (element: Element | null) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      if (element) {
        observer.current = new ResizeObserver(callback);
        observer.current.observe(element);
        observedElement.current = element;
      }
    },
    [callback]
  );

  useEffect(() => {
    return () => {
      if (observer.current && observedElement.current) {
        observer.current.unobserve(observedElement.current);
      }
    };
  }, []);

  return observe;
};
