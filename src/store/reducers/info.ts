import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { fetchApp } from 'store/actions/app';
import { FetchStatus } from 'types/api';
import { AptosTokens, EthereumTokens } from 'types/enums';

export interface InfoState {
    fetchStatus: FetchStatus;
    error: unknown;
    info: null | any;
    aptosCurrentPrice: number | null;
    moverPrice: Record<EthereumTokens | AptosTokens, number> | null;
    moverSold: number | null;
    chartParams: {
        start_value: string;
        curve_factor: string;
        end_factor: string;
        log_base: string;
    } | null;
}

const initialState: InfoState = {
    fetchStatus: FetchStatus.INITIAL,
    error: null,
    info: null,
    aptosCurrentPrice: null,
    moverPrice: null,
    moverSold: null,
    chartParams: null,
};

export const infoSlice = createSlice<InfoState, SliceCaseReducers<InfoState>>({
    name: 'info',
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

            state.info = {
                cohorts_info: payload.cohorts_info.sort((a: any, b: any) => a.number - b.number),
                market_metrics: payload.market_metrics,
            };
            state.aptosCurrentPrice = payload.usd_apt;
            state.moverSold = payload.mover_sold;
            state.moverPrice = payload.mover_price;
            state.chartParams = payload.price_curve;
        });

        builder.addCase(fetchApp.rejected, (state, { payload }) => {
            state.fetchStatus = FetchStatus.ERROR;
            state.error = payload;
        });
    },
});

export const infoReducer = infoSlice.reducer;
