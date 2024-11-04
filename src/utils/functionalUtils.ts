import type { Result } from "../types";

export const pipe = <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T =>
    fns.reduce((acc, fn) => fn(acc), value);

export const compose = <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T =>
    fns.reduceRight((acc, fn) => fn(acc), value);

export const tap = <T>(fn: (arg: T) => void) =>
  (value: T): T => {
    fn(value);
    return value;
  };

export const tryCatch = <T, E = Error>(
  fn: () => T,
  errorHandler: (error: unknown) => E
): Result<T, E> => {
  try {
    return { ok: true, value: fn() };
  } catch (error) {
    return { ok: false, error: errorHandler(error) };
  }
};
