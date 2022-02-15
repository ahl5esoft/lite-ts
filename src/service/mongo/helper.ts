/**
 * 实体转doc
 * 
 * @param entry 实体
 */
export function toDoc(entry: any) {
    return Object.keys(entry).reduce((memo, r): any => {
        if (r != 'id')
            memo[r] = entry[r];

        return memo;
    }, {
        _id: entry.id
    });
}

/**
 * 文档转实体
 * 
 * @param docs 文档
 */
export function toEntries(docs: any[]) {
    return docs.map((r): any => {
        return Object.keys(r).reduce((memo, cr): any => {
            if (cr != '_id')
                memo[cr] = r[cr];

            return memo;
        }, {
            id: r._id
        });
    });
}
