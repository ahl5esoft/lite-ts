import 'reflect-metadata';

import { deepStrictEqual, strictEqual } from 'assert';

import * as Self from './decorator';
import { tables, defines } from './defines';

@Self.Table('users')
class User {
    @Self.Field('id')
    public id: string;
}

describe('src/model/sequelize/decorator.ts', () => {
    describe('Table', () => {
        it('ok', async () => {
            strictEqual(tables[User.name], 'users');
            deepStrictEqual(defines[User.name], {
                id: {
                    allowNull: false,
                    type: 'id'
                }
            });
        });
    });
});