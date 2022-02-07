import { createBehavior } from '../core/createBehavior';
import { BehaviorTest, SetValueCallback } from '../core/types';

export function createBasicLogBehavior(test?: BehaviorTest) {
  const setValueCallback: SetValueCallback<any> = function (
    next,
    key,
    prev,
    payload?,
  ) {
    console.groupCollapsed(`@methodjs/store: ${key}`);
    console.log('prev', prev);
    console.log('next', next);
    if (payload !== undefined) {
      const { action, ...cargo } = payload;
      if (Object.keys(cargo).length > 0) {
        console.log(payload.action, cargo);
      } else {
        console.log(payload.action);
      }
    }
    console.groupEnd();
  };
  const nextTest = test === undefined ? () => true : test;
  return createBehavior(nextTest, {
    setValueCallback,
  });
}
