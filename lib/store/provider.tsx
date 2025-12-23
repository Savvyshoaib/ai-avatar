'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { setStore } from './storeRef';
import { fetchAvatarDetails } from './slices/avatarSlice';
import { getStoredUserName } from '@/lib/utils/userStorage';

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
    const store = storeRef.current;
    if (!store) return;

    // Set store reference for axios interceptors
    setStore(store);

    const userName = getStoredUserName();
    if (!userName) return;

    const state = store.getState();
    const alreadyFetched =
      state.avatar.detailsFetched &&
      state.avatar.lastFetchedHandle === userName;

    if (!alreadyFetched) {
      store.dispatch(fetchAvatarDetails(userName));
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}

