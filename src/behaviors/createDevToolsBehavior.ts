import { createBehavior } from '../core/createBehavior';
import { BehaviorTest, UpdateInformation } from '../core/types';

export function createDevToolsBehavior(test?: BehaviorTest) {
  const updateInformation: UpdateInformation<any> = function (
    information,
    value,
  ) {
    if (
      window.__METHODJS_DEV_TOOLS_WORKER__?.updateStoreInformation !== undefined
    ) {
      window.__METHODJS_DEV_TOOLS_WORKER__.updateStoreInformation(
        information,
        value,
      );
    }
  };
  const nextTest = test === undefined ? () => true : test;
  return createBehavior(nextTest, {
    updateInformation,
  });
}
