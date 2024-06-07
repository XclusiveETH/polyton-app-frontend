import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTokenInfoRequest } from "api/info";

export const fetchTokenInfo = createAsyncThunk('@info/fetch', async () => {
    return await fetchTokenInfoRequest();
});