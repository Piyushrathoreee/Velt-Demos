"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useVeltCrdtStore } from "@veltdev/crdt-react";
import type { DrawingElement } from "./types";

type ElementMap = Record<string, DrawingElement>;

export function useWhiteboardStore() {
  const { value, update } = useVeltCrdtStore<ElementMap>({
    id: "whiteboard-elements",
    type: "map",
    initialValue: {},
  });

  const elements: DrawingElement[] = useMemo(
    () => Object.values(value ?? {}).sort((a, b) => a.id.localeCompare(b.id)),
    [value],
  );

  const valueRef = useRef<ElementMap>(value ?? {});

  useEffect(() => {
    valueRef.current = value ?? {};
  }, [value]);

  const addElement = useCallback(
    (el: DrawingElement) => {
      update({ ...valueRef.current, [el.id]: el });
    },
    [update],
  );

  const updateElement = useCallback(
    (el: DrawingElement) => {
      update({ ...valueRef.current, [el.id]: el });
    },
    [update],
  );

  const deleteElement = useCallback(
    (id: string) => {
      const next = { ...valueRef.current };
      delete next[id];
      update(next);
    },
    [update],
  );

  return { elements, addElement, updateElement, deleteElement, rawMap: value };
}
