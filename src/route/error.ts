export class APIError extends Error {
    public constructor(public code: number, message?: string) {
        super(message);
    }
}
