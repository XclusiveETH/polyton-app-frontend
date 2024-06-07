import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { fetchApp } from 'store/actions/app';
import { fetchTimers } from 'store/actions/timers';
import { FetchStatus } from 'types/api';

export interface TimersState {
    fetchStatus: FetchStatus;
    error: unknown;
    timers: null | any;
}

const initialState: TimersState = {
    fetchStatus: FetchStatus.INITIAL,
    error: null,
    timers: null,
};

export const timersSlice = createSlice<TimersState, SliceCaseReducers<TimersState>>({
    name: 'timers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchApp.pending, (state) => {
            state.fetchStatus = FetchStatus.FETCHING;
            state.error = null;
        });

        builder.addCase(fetchApp.fulfilled, (state, { payload }) => {
            state.fetchStatus = FetchStatus.FETCHED;
            state.error = null;

            state.timers = payload.timers;
        });

        builder.addCase(fetchApp.rejected, (state, { payload }) => {
            state.fetchStatus = FetchStatus.ERROR;
            state.error = payload;
        });
    },
});

export const timersReducer = timersSlice.reducer;
