import { Information } from './core/createStore';

declare global {
  interface Window {
    __METHODJS_DEV_TOOLS_WORKER__?: {
      updateStoreInformation: (information: Information, value: any) => void;
    };
  }
}
