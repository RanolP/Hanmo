import { useCallback } from "preact/hooks";

export interface LocalStorageOptions<T> {
  stringify(value: T): string;
  parse(s: string | null): T;
}

export interface LocalStorageHandle<T> {
  write(value: T): void;
  reset(): void;
  read(): T;
}

export function useLocalStorage<T>(
  key: string,
  { stringify, parse }: LocalStorageOptions<T>
): LocalStorageHandle<T> {
  const write = useCallback(
    (value: T) => {
      localStorage.setItem(key, stringify(value));
    },
    [key, stringify]
  );

  const reset = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  const read = useCallback(() => {
    const str = localStorage.getItem(key);
    return parse(str);
  }, [key, parse]);

  return { write, reset, read };
}
