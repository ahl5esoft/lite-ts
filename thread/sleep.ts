export async function sleep(ms: number): Promise<void> {
    return new Promise(s => {
        setTimeout(() => {
            s();
        }, ms);
    });
}
