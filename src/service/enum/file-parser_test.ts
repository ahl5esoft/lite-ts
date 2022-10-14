import { deepStrictEqual } from 'assert';

import { EnumFileParser as Self } from './file-parser';
import { Mock } from '../assert';
import { FileFactoryBase, IFile } from '../../contract';

describe('src/service/enum/parser.ts', () => {
    describe('.parse<T>(text: string)', () => {
        it('ok', async () => {
            const mockFileFactory = new Mock<FileFactoryBase>();
            const self = new Self(mockFileFactory.actual);
            self.stringAttrReg = /^\[(\w+)='([\w-]+)'\]/;

            const mockFile = new Mock<IFile>();
            const filePath = 'file-path';
            mockFileFactory.expectReturn(
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
    str = 4,
    /**
    * [app='recharge-activity']累计充值
    */
    rechargeActivity = 5
}`
            );

            const res = await self.parse(filePath);
            deepStrictEqual(res, [{
                isReplace: true,
                key: 'loginOn',
                text: '登录时间',
                value: 1
            }, {
                dailyTime: 3,
                key: 'dailyLoginCount',
                text: '每日登录次数',
                value: 2
            }, {
                key: 'dailyLoginCountModifiedOn',
                text: '每日登录次数更新时间',
                value: 3
            }, {
                ex: 'str',
                key: 'str',
                text: '字符串',
                value: 4
            }, {
                app: 'recharge-activity',
                key: 'rechargeActivity',
                text: '累计充值',
                value: 5
            }]);
        });

        it('多个标签', async () => {
            const mockFileFactory = new Mock<FileFactoryBase>();
            const self = new Self(mockFileFactory.actual);

            const mockFile = new Mock<IFile>();
            const filePath = 'file-path';
            mockFileFactory.expectReturn(
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
                key: 'loginOn',
                text: '登录时间',
                value: 1
            }]);
        });

        it('对象标签', async () => {
            const mockFileFactory = new Mock<FileFactoryBase>();
            const self = new Self(mockFileFactory.actual);

            const mockFile = new Mock<IFile>();
            const filePath = 'file-path';
            mockFileFactory.expectReturn(
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
     * [anyPet.genus=4][anyPet.grade=100_008]任意品级八属系四宠物
    */
    anyPetGenusDGradeH = 490_052,
}`
            );

            const res = await self.parse(filePath);
            deepStrictEqual(res, [{
                anyPet: {
                    genus: 4,
                    grade: 100_008
                },
                key: 'anyPetGenusDGradeH',
                text: '任意品级八属系四宠物',
                value: 490_052
            }]);
        });
    });
});