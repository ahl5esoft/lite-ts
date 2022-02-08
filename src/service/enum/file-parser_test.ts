import { deepStrictEqual } from 'assert';

import { EnumFileParser as Self } from './file-parser';
import { Mock } from '..';
import { IOFactoryBase, IOFileBase } from '../..';

describe('src/service/enum/parser.ts', () => {
    describe('.parse<T>(text: string)', () => {
        it('ok', async () => {
            const mockIOFactory = new Mock<IOFactoryBase>();
            const self = new Self(mockIOFactory.actual);

            const mockFile = new Mock<IOFileBase>();
            const filePath = 'file-path';
            mockIOFactory.expectReturn(
                r => r.buildFile(filePath),
                mockFile.actual
            );

            mockFile.expectReturn(
                r => r.readString(),
                `/**
* 枚举对象
*/
enum ValueType {
    /**
    * [isReplace]登录时间
    */
    loginOn = 1,
    /**
    * [dailyTime=3]每日登录次数
    */
    dailyLoginCount = 2,
    /**
    * 每日登录次数更新时间
    */
    dailyLoginCountModifiedOn = 3,
    /**
    * [ex='str']字符串
    */
    str = 4
}`
            );

            const res = await self.parse(filePath);
            deepStrictEqual(res, [{
                isReplace: true,
                text: '登录时间',
                value: 1
            }, {
                dailyTime: 3,
                text: '每日登录次数',
                value: 2
            }, {
                text: '每日登录次数更新时间',
                value: 3
            }, {
                ex: 'str',
                text: '字符串',
                value: 4
            }]);
        });

        it('多个标签', async () => {
            const mockIOFactory = new Mock<IOFactoryBase>();
            const self = new Self(mockIOFactory.actual);

            const mockFile = new Mock<IOFileBase>();
            const filePath = 'file-path';
            mockIOFactory.expectReturn(
                r => r.buildFile(filePath),
                mockFile.actual
            );

            mockFile.expectReturn(
                r => r.readString(),
                `/**
* 枚举对象
*/
enum ValueType {
    /**
    * [dailyTime=3][isGm][isReplace][ex='str']登录时间
    */
    loginOn = 1,
}`
            );

            const res = await self.parse(filePath);
            deepStrictEqual(res, [{
                dailyTime: 3,
                ex: 'str',
                isGm: true,
                isReplace: true,
                text: '登录时间',
                value: 1
            }]);
        });
    });
});