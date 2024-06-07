import { combineReducers } from "@reduxjs/toolkit";
import { userReducer as user } from './user';
import { timersReducer as timers } from './timers';
import { infoReducer as info } from './info';

export const reducers = combineReducers({
    timers,
    user,
    info
})