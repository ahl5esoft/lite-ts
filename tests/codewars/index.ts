import { deepStrictEqual } from 'assert';

function parseMolecule(formula) {
    let counters = {};
    formula.replace(/\((\w+)\)(\d+)/g, (_, el, n) => {
        let bf = [];
        for (let i = 0; i < n; i++) {
            bf.push(el);
        }
        return bf.join('');
    }).replace(/\[(\w+)\](\d+)/g, (_, el, n) => {
        let bf = [];
        for (let i = 0; i < n; i++) {
            bf.push(el);
        }
        return bf.join('');
    }).replace(/\{(\w+)\}(\d*)/g, (_, el, n) => {
        let bf = [];
        for (let i = 0; i < (n || 1); i++) {
            bf.push(el);
        }
        return bf.join('');
    }).replace(/([A-Z][a-z]*)(\d*)/g, (_, el, n) => {
        if (!counters[el])
            counters[el] = 0;

        counters[el] += parseInt(n) || 1;
    });

    return counters;
}

describe('codewars', () => {
    it('ok', () => {
        deepStrictEqual(
            parseMolecule('As2{Be4C5[BCo3(CO2)3]2}4Cu5'),
            { As: 2, Be: 16, C: 44, B: 8, Co: 24, O: 48, Cu: 5 }
        );
    });
});