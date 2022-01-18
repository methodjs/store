import { useEffect, useState } from 'react';
import { getBehavior } from './createBehavior';
import {
  CreateStoreOption,
  CreateStoreOptionWithMapper,
  GetValue,
  Information,
  LazyIntializedValue,
  MapperPayload,
  OnValue,
  SetValue,
  SetValueAction,
  SetValueWithMapper,
  SetValueWithMapperAction,
  UseValue,
} from './types';

const INITIALIZE = 'INITIALIZE';

function isSetValueAction<T>(
  next: T | SetValueAction<T>,
): next is SetValueAction<T> {
  if (typeof next === 'function') {
    return true;
  }
  return false;
}

function isSetValueWithMapperAction<T, U>(
  next: U | SetValueWithMapperAction<T, U>,
): next is SetValueWithMapperAction<T, U> {
  if (typeof next === 'function') {
    return true;
  }
  return false;
}

function isCreateStoreOptionWithMapper<T, U>(
  option?: CreateStoreOption | CreateStoreOptionWithMapper<T, U>,
): option is CreateStoreOptionWithMapper<T, U> {
  if (
    option !== undefined &&
    (option as CreateStoreOptionWithMapper<T, U>).mapper !== undefined
  ) {
    return true;
  }
  return false;
}

function isLazyIntializedValue<T>(
  next: T | LazyIntializedValue<T>,
): next is LazyIntializedValue<T> {
  if (typeof next === 'function') {
    return true;
  }
  return false;
}

export function createStore<T>(
  initialValue: T | LazyIntializedValue<T>,
  option?: CreateStoreOption,
): [UseValue<T>, SetValue<T>, GetValue<T>];

export function createStore<T, U = T>(
  initialValue: T | LazyIntializedValue<T>,
  option: CreateStoreOptionWithMapper<T, U>,
): [UseValue<T>, SetValueWithMapper<T, U>, GetValue<T>];

export function createStore<T, U = T>(
  initialValue: T | LazyIntializedValue<T>,
  option?: CreateStoreOption | CreateStoreOptionWithMapper<T, U>,
):
  | [UseValue<T>, SetValue<T>, GetValue<T>]
  | [UseValue<T>, SetValueWithMapper<T, U>, GetValue<T>] {
  let current: T | undefined;
  const key = option?.key || `store-${Math.random()}`;
  const onValueSet: Set<OnValue> = new Set();
  const activatedHookIdSet: Set<string> = new Set();
  let information: Information = {
    key,
    transactionId: 0,
    activated: false,
    updated: null,
    payload: null,
  };

  function getIntializedValue(): T {
    if (isLazyIntializedValue(initialValue)) {
      return initialValue();
    } else {
      return initialValue;
    }
  }

  function updateInformation(next: Partial<Information>) {
    information = { ...information, ...next };
    const behavior = getBehavior(key);
    behavior.updateInformation(information, getValue());
  }

  const getValue: GetValue<T> = function getValue() {
    if (current === undefined) {
      current = getIntializedValue();
      updateInformation({
        transactionId: information.transactionId + 1,
        updated: new Date(),
        payload: { action: INITIALIZE },
      });
      return current;
    } else {
      return current;
    }
  };

  function subscribe(onValue: OnValue) {
    onValueSet.add(onValue);
    function unsubscribe() {
      if (onValueSet.has(onValue)) {
        onValueSet.delete(onValue);
      }
    }
    return unsubscribe;
  }

  function useValue() {
    const [state, setState] = useState<T>(getValue);

    useEffect(() => {
      function onValue() {
        const nextState = getValue();
        setState(nextState);
      }
      // Hook 가 mount 되는 동안, 변경된 값으로 갱신한다.
      onValue();
      const unsubscribe = subscribe(onValue);
      return unsubscribe;
    }, []);

    useEffect(() => {
      const id = `Hook-${Date.now()}`;
      activatedHookIdSet.add(id);
      updateInformation({ activated: true });
      return () => {
        activatedHookIdSet.delete(id);
        if (activatedHookIdSet.size === 0) {
          updateInformation({ activated: false });
        }
      };
    }, []);

    return state;
  }

  function setValueCallback(payload?: MapperPayload) {
    onValueSet.forEach(onValue => onValue());
    updateInformation({
      transactionId: information.transactionId + 1,
      updated: new Date(),
      payload: payload || null,
    });
    const behavior = getBehavior(key);
    behavior.setValueCallback(getValue(), payload);
  }

  if (isCreateStoreOptionWithMapper(option)) {
    const mapper = option.mapper;
    const setValue: SetValueWithMapper<T, U> = function setValue(
      next: U | SetValueWithMapperAction<T, U>,
      payload?: MapperPayload,
    ) {
      const pre = getValue();
      if (isSetValueWithMapperAction(next)) {
        current = mapper(next(pre), pre, payload);
      } else {
        current = mapper(next, pre, payload);
      }
      setValueCallback(payload);
    };
    return [useValue, setValue, getValue];
  } else {
    const setValue: SetValue<T> = function setValue(
      next: T | SetValueAction<T>,
      payload?: MapperPayload,
    ) {
      if (isSetValueAction(next)) {
        current = next(getValue());
      } else {
        current = next;
      }
      setValueCallback(payload);
    };

    return [useValue, setValue, getValue];
  }
}
