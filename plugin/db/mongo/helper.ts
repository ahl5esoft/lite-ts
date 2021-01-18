export const docPK = '_id';

export const modelPK = 'id';

export function toDoc(entry: any): any {
    return Object.keys(entry).reduce((memo, r): any => {
        if (r != modelPK)
            memo[r] = entry[r];

        return memo;
    }, {
        _id: entry[modelPK]
    });
}

export function toEntries(docs: any[]): any[] {
    return docs.map((r): any => {
        return Object.keys(r).reduce((memo, cr): any => {
            if (cr != docPK)
                memo[cr] = r[cr];

            return memo;
        }, {
            id: r[docPK]
        });
    });
}
