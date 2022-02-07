import {
  Behavior,
  BehaviorTest,
  BehaviorWithTest,
  Information,
  MapperPayload,
  SetValueCallback,
  StartBehavior,
  StopBehavior,
  UpdateInformation,
} from './types';

function createSetValueCallback<T>(
  key: string,
  setValueCallbackArray: BehaviorWithTest<SetValueCallback<any>>[],
) {
  return (next: T, prev: T, payload?: MapperPayload) => {
    setValueCallbackArray.forEach(({ test, behavior }) => {
      if (test(key)) {
        behavior(next, key, prev, payload);
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
