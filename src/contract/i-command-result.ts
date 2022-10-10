export interface ICommandResult {
    readonly code: number;
    readonly stdout: string;
    readonly stderr: string;
}