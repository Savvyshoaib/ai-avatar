# Redux Toolkit Setup

Yeh folder Redux Toolkit ka complete setup hai Next.js App Router ke liye.

## Folder Structure

```
lib/store/
├── store.ts          # Store configuration
├── hooks.ts          # Typed hooks (useAppDispatch, useAppSelector)
├── provider.tsx      # Redux Provider component (Client Component)
├── slices/           # Redux slices folder
│   └── exampleSlice.ts
└── README.md
```

## Usage

### 1. Store Provider
Store Provider already `app/layout.tsx` mein add ho chuka hai.

### 2. Using Redux in Components

#### Client Component mein use karein:

```tsx
'use client';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { increment, decrement, setMessage } from '@/lib/store/slices/exampleSlice';

export default function MyComponent() {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.example.value);
  const message = useAppSelector((state) => state.example.message);

  return (
    <div>
      <p>Value: {value}</p>
      <p>Message: {message}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(setMessage('New Message'))}>
        Change Message
      </button>
    </div>
  );
}
```

### 3. Naya Slice Banana

1. `lib/store/slices/` folder mein naya file banayein (e.g., `userSlice.ts`)
2. Slice create karein:

```tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  email: string;
}

const initialState: UserState = {
  name: '',
  email: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    clearUser: (state) => {
      state.name = '';
      state.email = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
```

3. `lib/store/store.ts` mein reducer add karein:

```tsx
import userReducer from './slices/userSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      example: exampleReducer,
      user: userReducer, // Add here
    },
  });
};
```

## Important Notes

- Redux Provider ek Client Component hai (`'use client'` directive ke saath)
- Server Components mein directly Redux use nahi kar sakte
- Agar server component se data chahiye, to client component bana kar use karein
- `useAppDispatch` aur `useAppSelector` hooks use karein (plain hooks ki jagah) - yeh typed hain

