import { Core } from './core';

export function createCore<T>(init: () => T): Core<T>;

export function createCore<T>(init: () => T): Core<T> {
  let current = init();

  function get() {
    return current;
  }

  function set() {}

  return {
    get,
  };
}
