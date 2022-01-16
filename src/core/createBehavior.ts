import { Information, UpdateInformation } from './types';

export interface BehaviorTest {
  (key: string): boolean;
}

export interface StartBehavior {
  (): void;
}

export interface StopBehavior {
  (): void;
}

export interface SetValueCallback<T> {
  (value: T, key: string): void;
}

export interface Behavior {
  setValueCallback?: SetValueCallback<any>;
  updateInformation?: UpdateInformation<any>;
}

export interface GetBehavior<T> {
  (key: string): {
    setValueCallback: SetValueCallback<T>;
    updateInformation: UpdateInformation<any>;
  };
}

export interface BehaviorWithTest<T> {
  test: BehaviorTest;
  behavior: T;
}

function createSetValueCallback<T>(
  key: string,
  setValueCallbackArray: BehaviorWithTest<SetValueCallback<any>>[],
) {
  return (value: T) => {
    setValueCallbackArray.forEach(({ test, behavior }) => {
      if (test(key)) {
        behavior(value, key);
      }
    });
  };
}
function createUpdateInformation<T>(
  key: string,
  updateInformationArray: BehaviorWithTest<UpdateInformation<any>>[],
) {
  return (information: Information, value: T) => {
    updateInformationArray.forEach(({ test, behavior }) => {
      if (test(key)) {
        behavior(information, value);
      }
    });
  };
}

function createBehaviorStore() {
  const setValueCallbackArray: BehaviorWithTest<SetValueCallback<any>>[] = [];
  const updateInformationArray: BehaviorWithTest<UpdateInformation<any>>[] = [];

  function getBehavior<T>(key: string) {
    return {
      setValueCallback: createSetValueCallback<T>(key, setValueCallbackArray),
      updateInformation: createUpdateInformation<T>(
        key,
        updateInformationArray,
      ),
    };
  }

  function createBehavior(
    test: BehaviorTest,
    behavior: Behavior,
  ): [StartBehavior, StopBehavior] {
    let isAlive = false;
    const nextTest = function (key: string) {
      if (isAlive) {
        return test(key);
      }
      return false;
    };
    if (behavior.setValueCallback !== undefined) {
      setValueCallbackArray.push({
        test: nextTest,
        behavior: behavior.setValueCallback,
      });
    }
    if (behavior.updateInformation !== undefined) {
      updateInformationArray.push({
        test: nextTest,
        behavior: behavior.updateInformation,
      });
    }

    function startBehavior() {
      isAlive = true;
    }
    function stopBehavior() {
      isAlive = false;
    }
    return [startBehavior, stopBehavior];
  }

  return { getBehavior, createBehavior };
}

const { getBehavior, createBehavior } = createBehaviorStore();

export { getBehavior, createBehavior };
