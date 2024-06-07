export enum FetchStatus {
    FETCHING = 'FETCHING',
    FETCHED = 'FETCHED',
    ERROR = 'ERROR',
    INITIAL = 'INITIAL',
}

export interface Response {
    statusEnum: 'OK';
    message: 'OK';
}
