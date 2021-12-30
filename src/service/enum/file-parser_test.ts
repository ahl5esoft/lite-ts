// import { EnumFileParser as Self } from './file-parser';
// import { Mock } from '..';
// import { IOFactoryBase, IOFileBase } from '../..';

// describe('src/service/enum/parser.ts', () => {
//     describe('.parse<T>(text: string)', () => {
//         it('ok', async () => {
//             const mockIOFactory = new Mock<IOFactoryBase>();
//             const self = new Self(mockIOFactory.actual);

//             const mockFile = new Mock<IOFileBase>();
//             const filePath = 'file-path';
//             mockIOFactory.expectReturn(
//                 r => r.buildFile(filePath),
//                 mockFile.actual
//             );
//             const text = `export enum ValueType {
//     atk = 2, // atk is 攻击力
//     coin = 1, // coin is 金币
//     equipPutOnOn = 3, // equipPutOnOn is 装备穿上时间
// }`;
//             const res = self.parse(text);
//         });
//     });
// });