export interface OnValue {
  (): void;
}

export interface UseValue<T> {
  (): T;
}

export interface SetValueAction<T> {
  (currentValue: T): T;
}

export interface SetValueWithMapperAction<T, U = T> {
  (currentValue: T): U;
}

export interface SetValue<T> {
  (next: T | SetValueAction<T>, payload?: MapperPayload): void;
}

export interface SetValueWithMapper<T, U = T> {
  (next: U | SetValueWithMapperAction<T, U>, payload?: MapperPayload): void;
}

export interface GetValue<T> {
  (): T;
}

export interface MapperPayload extends Record<string, any> {
  action?: string;
}

export interface Mapper<T, U = T> {
  (next: U, current: T, payload?: MapperPayload): T;
}

export interface CreateStoreOption {
  key?: string;
}

export interface CreateStoreOptionWithMapper<T, U = T> {
  key?: string;
  mapper: Mapper<T, U>;
}

export interface LazyIntializedValue<T> {
  (): T;
}

export interface Information {
  key: string;
  transactionId: number;
  activated: boolean;
  updated: Date | null;
  payload: MapperPayload | null;
}

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

export interface UpdateInformation<T> {
  (information: Information, value: T): void;
}

export interface Behavior {
  setValueCallback?: SetValueCallback<any>;
  updateInformation?: UpdateInformation<any>;
}

export interface GetBehavior<T> {
  (key: string): {
    setValueCallback: SetValueCallback<T>;
    updateInformation: UpdateInformation<T>;
  };
}

export interface BehaviorWithTest<T> {
  test: BehaviorTest;
  behavior: T;
}

export interface Query<T> {
  (): T;
}

export interface AsyncQuery<T> {
  (): Promise<T>;
}
