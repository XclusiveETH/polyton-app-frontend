import { configureStore, ThunkDispatch, CombinedState, AnyAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { reducers } from 'store/reducers';

export const store = configureStore({
  reducer: reducers
})

export type State = ReturnType<typeof store.getState>;
export type Action = typeof store.dispatch;

export const useAppDispatch = (): ThunkDispatch<CombinedState<State>, null, AnyAction> => useDispatch<Action>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;