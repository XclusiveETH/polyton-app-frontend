import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTimersRequest } from "api/timers";

export const fetchTimers = createAsyncThunk('@timers/fetch', async () => {
    return await fetchTimersRequest();
});