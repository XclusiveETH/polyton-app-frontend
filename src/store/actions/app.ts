import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAppRequest } from "api/app";

export const fetchApp = createAsyncThunk("@app/fetch", async () => {
    return await fetchAppRequest();
})