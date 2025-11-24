import { AppStore } from './store';

// Store reference that can be accessed by axios interceptors
let storeRef: AppStore | null = null;

export const setStore = (store: AppStore) => {
  storeRef = store;
};

export const getStore = (): AppStore | null => {
  return storeRef;
};

