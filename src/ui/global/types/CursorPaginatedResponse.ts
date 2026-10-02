export interface CursorPaginatedResponse<T> {
    data: T[];
    meta: {
        limit: number;
    };
}