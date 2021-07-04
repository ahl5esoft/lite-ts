export class CustomError extends Error {
    public constructor(public code: number, public data?: any) {
        super('');
    }
}
