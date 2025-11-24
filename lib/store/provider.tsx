'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { setStore } from './storeRef';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | undefined>(undefined);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  useEffect(() => {
    // Set store reference for axios interceptors
    if (storeRef.current) {
      setStore(storeRef.current);
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}

