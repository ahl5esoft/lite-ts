import bent from 'bent';

import { BentDefaultRpc as Self } from './default-rpc';
import { enum_ } from '../../model';

describe('src/service/bent/default-rpc.ts', () => {
    describe('.callWithoutThrow<T>(route: string)', () => {
        it('ok', async () => {
            const postFunc = bent('http://127.0.0.1', 'json', 'POST', 200);
            const resp = await new Self(postFunc).setBody({
                id: 'user-id'
            }).callWithoutThrow<any>('/account/get-user');
            console.log(resp);
        });
    });

    it.only('压测', async () => {
        const userIDs = [
        //    '62dcd893eb1d016267c04b2e',
        //    '62d8298fb79d837994c0e2d7',
        //    '62d8d1d5b7d2ac8a6dd154e8',
        //    '62e516e24ba2e1815437d3ca',
        //    '62dcd68f78bde479425f6856',
        //    '62d01e55698a14d7dd69df6b',
        //    '62db985478bde479425eee30',
        //    '62dd31f3eb1d016267c07a82',
        //    '62dd630ef37c06b269e56a47',
        //    '62d98583eb1d016267bf1b1b',
        //    '62d958224ba2e181543433ed',
        //    '62e639d978bde47942621925',
        //    '62de6b79ca5c8218dfef2a55',
        //    '62b8924ca3b3eb0f77a75965',
        //    '62d4d90a1bfaa1b6fab8e384',
        //    '62cf8950e8a129d62cd99e23',
        //    '62e2d2bde8e7a58c594ec888',
        //    '62ddf23aca5c8218dfeef509',
        //    '62dd3f7bf37c06b269e55639',
        //    '62c70a9a9557fdc1eb6339a9',
        //    '62dd5057ca5c8218dfeed623',
        //    '62d566aeb79d837994c021d6',
        //    '62dbe815f37c06b269e4d1c2',
        //    '62de1ef07a23e5e9108f3986',
        //    '62d0d67beecf89e592d83a51',
        //    '62da38c6f37c06b269e42317',
        //    '62e151a04ba2e1815436c96a',
        //    '62c1001ed25fbc011b4a2b04',
        //    '62dcd27aca5c8218dfee9160',
        //    '62d949baf37c06b269e3d5bf',
        //    '62dfb88de8e7a58c594e0787',
        //    '62d004f7698a14d7dd69d337',
        //    '62da0706eb1d016267bf2f5f',
        //    '62dc04950e8193c6f799bdb7',
        //    '62db48edca5c8218dfedf742',
        //    '62ce9822698a14d7dd695c99',
        //    '62d15a94855fe54b7b888056',
        //    '62dbd45e4ba2e18154351d50',
        //    '62e6a10978bde47942624177',
        //    '62b6e54371ec4ff738c093ea',
        //    '62dd8486ca5c8218dfeee8c0',
        //    '62da1beaeb1d016267bf3a5c',
        //    '62d538fcad9c4d0bb1b35a47',
        //    '62e49ed5e8e7a58c594f36a5',
        //    '62de2a59ca5c8218dfef0b5d',
        //    '62b80704956bf9141cf44d7f',
        //    '62e34e1ae8e7a58c594ed9b0',
        //    '62e3ad26ca5c8218dff082b8',
        //    '62dea9a2eb1d016267c0fd63',
        //    '62c3e1c9d25fbc011b4adfdf',
        //    '62e141797a23e5e910901430',
        //    '62e60447e8e7a58c594fb315',
        //    '62cff08ce8a129d62cd9cb88',
        //    '62d7b50a3c5c6fdaee628207',
        //    '62e554277a23e5e910914154',
        //    '62dffeb0ca5c8218dfef9c03',
        //    '62c2d59dd25fbc011b4aa450',
        //    '62df3e727a23e5e9108f8eed',
        //    '62dd18924ba2e18154359820',
        //    '62de85874ba2e1815436164a',
        //    '62cedffceecf89e592d7ae0a',
        //    '62da97e4f37c06b269e4566b',
        //    '62e6654d743da86d2699aca2',
        //    '62e484844ba2e18154378e81',
        //    '62d4c4423c5c6fdaee61b7ac',
        //    '62d4e066b79d837994bfeec8',
        //    '62c46543d25fbc011b4b0af1',
        //    '62dabf2c78bde479425eb6cc',
        //    '62e25f12eb1d016267c1d8d5',
        //    '62da21db4ba2e18154346a03',
        //    '62e3b27beb1d016267c23938',
        //    '62e218ce743da86d26986188',
        //    '62c78c399557fdc1eb634729',
        //    '62d55824a41a21adac62c4ee',
        //    '62db8a86eb1d016267bfc953',
        //    '62d399e7855fe54b7b893bfc',
        //    '62e50fffeb1d016267c2a3e4',
        //    '62df9fccf37c06b269e6075e',
        //    '62e384a5eb1d016267c2245e',
        //    '62e0f448435c8722d27197e4',
        //    '62dcffc6eb1d016267c05f05',
        //    '62de0b4cf37c06b269e588d2',
        //    '62bbd2199787d132c23306cc',
        //    '62dfa10b743da86d2697d207',
        //    '62cfd51ceecf89e592d7ebd0',
        //    '62df4955eb1d016267c11484',
        //    '62982e396d6e120015d266fd',
        //    '62d0049ce8a129d62cd9d664',
        //    '62e668f4eb1d016267c30fa9',
        //    '62d2da7972e72718b7a4972a',
        //    '62cd94cee8a129d62cd923cd',
        //    '62e64723e8e7a58c594fce87',
        //    '62e37048e8e7a58c594ee905',
        //    '62a1980791f2740013f22178',
        //    '62bfd48a65156b84c0112d3a',
        //    '62d1745b855fe54b7b88899b',
        //    '62e11bcdeb1d016267c18d5c',
        //    '62d7b980ad9c4d0bb1b3f959',
        //    '62e28be0eb1d016267c1e86c',
        //    '62d4287aa41a21adac627c96',
        //    '62d33755a41a21adac61e9bb',
        //    '62e28b7178bde479426105b8',
        //    '62c1ba4865156b84c011afca',
        //    '62e61dcaeb1d016267c2ef6a',
        //    '62e514d80e8193c6f79c5761',
        //    '62b5f81f7fd53c2c983524d4',
        //    '62df945c78bde47942604af1',
        //    '62d6c6921bfaa1b6fab9731d',
        //    '62d62faba41a21adac62eb50',
        //    '62b55a3ff5587e4257dfc7d2',
        //    '62c7d72b902fa4469cfc7565',
        //    '62df4411743da86d2697b1a7',
        //    '62e33946ca5c8218dff050cb',
        //    '62dcfb6b0e8193c6f79a0c5c',
        //    '62d3ffd1855fe54b7b8983ff',
        //    '62e207ac78bde4794260d849',
        //    '62e665ce0e8193c6f79cbe69',
        //    '62ac12a27b6c0c001bc6bd16',
        //    '62d1923172e72718b7a42e0a',
        //    '62dcb7270e8193c6f799e9d7',
        //    '62dad2e4eb1d016267bf9ffc',
        //    '62dcf8ea78bde479425f7930',
        //    '62e623214ba2e18154381d53',
        //    '62e23bb77a23e5e91090477c',
        //    '62d12ef672e72718b7a409f2',
        //    '62e261ff4ba2e181543704c8',
        //    '62aea99ae48023001bc42fd0',
        //    '62dc28aeeb1d016267c02303',
        //    '62de5d45eb1d016267c0d851',
        //    '62d95cc3b0faedbb1482ce0a',
        //    '62d3913eb7d2ac8a6dcfc4c3',
        //    '62c7f85a902fa4469cfc813a',
        //    '62bbad543f09dad9b50a0479',
        //    '62e3b0dcf37c06b269e70e1a',
        //    '62c83abe5e4f306e19a60c4a',
        //    '62e3f7c60e8193c6f79c01f8',
        //    '62df9ba94ba2e18154365b34',
        //    '62e62368eb1d016267c2f18b',
        //    '62d0cd42698a14d7dd6a05a5',
        //    '62c6e496637e3757b0d1f151',
        //    '62bf6fbc2cae6a740f8124d0',
        //    '62d57f8eb79d837994c029aa',
        //    '62e0af697a23e5e9108fe723',
        //    '62d7c0233c5c6fdaee6286e3',
        //    '62ddb78578bde479425fbe76',
        //    '62e4d4aa743da86d26992037',
        //    '62e22152e8e7a58c594e9172',
        //    '62d94b804ba2e18154342cca',
        //    '62e4bff2ca5c8218dff0c1e2',
        //    '62b922783317f91737c0f79f',
        //    '62e12511435c8722d271a82c',
        //    '62bd957179b7d28248970827',
        //    '62cd3228698a14d7dd68fa33',
        //    '62e29352435c8722d27204a0',
        //    '62e0a587743da86d2698075b',
        //    '62ca0fe15d74e4084ff8fa35',
        //    '62d1070e855fe54b7b885b91',
        //    '62e62027ca5c8218dff13b5d',
        //    '62b97c7ea3b3eb0f77a774d2',
        //    '62daa8aaf37c06b269e460a5',
        //    '62c16cd079b7d2824897debe',
        //    '62c268b665156b84c011cb20',
        //    '62cd81cfeecf89e592d74a7d',
        //    '62cb9ffba0074085a8d241c2',
        //    '62dcb2ecf37c06b269e50d7c',
        //    '62cc43f3f5f4677efbfc0e1f',
        //    '62dfeb0fca5c8218dfef9563',
        //    '62e641ad435c8722d2731411',
        //    '62de54f14ba2e1815435fd7f',
        //    '62e50e970e8193c6f79c537d',
        //    '62d57bd9a41a21adac62d130',
        //    '62ddf3bb4ba2e1815435d5af',
        //    '62d179223c5c6fdaee609515',
        //    '62c51236bf0d5d7e6f5830e4',
        //    '62c9a5b2427cf03f1bc19827',
        //    '62c801a1902fa4469cfc84c0',
        //    '62b82e99846358c87ee6f954',
        //    '62c57f546e80948ffdf26e94',
        //    '62e37901e8e7a58c594eed11',
        //    '62d564c372e72718b7a58334',
        //    '62d028f896dc346b079a50f8',
        //    '62b2c13170da230013ab14aa',
        //    '62d51fd1855fe54b7b89d01e',
        //    '62b7ff8f846358c87ee6edb2',
        //    '62cfec31eecf89e592d7f74b',
        //    '62e60a217a23e5e9109163d5',
        //    '62e3aad57a23e5e91090b17f',
        //    '62b5bc1f54a11880c12c7dde',
        //    '62d017ab96dc346b079a48b7',
        //    '62e4b6700e8193c6f79c22f2',
        //    '62e3c6940e8193c6f79bf005',
        //    '62e658b4eb1d016267c30883',
        //    '62c988eb5e4f306e19a66a42',
        //    '62d96c9af37c06b269e3e890',
        //    '62c54064bf0d5d7e6f58416d',
        //    '62c2db4cd25fbc011b4aa632',
        //    '62de1072f37c06b269e58ae3',
        //    '62de06af78bde479425fcf30',
        //    '62dd453aca5c8218dfeecf8f',
        //    '62d3902172e72718b7a4cc53',
        //    '62dbb5df78bde479425efcf0',
        //    '62b69260d5ad16f76357734d',
        //    '62e3ee4c0d56190d0db67523',
        //    '62bdc8b12cae6a740f80d9fd',
        //    '62d3af76855fe54b7b894ef5',
        //    '62d12891855fe54b7b886d1b',
        //    '62e13d3778bde4794260b4d0',
        //    '62e5deeb4ba2e18154380339',
        //    '62ddac09f37c06b269e57575',
        //    '62e507b4743da86d26993ce2',
        //    '62daa5d5ca5c8218dfedd411',
        //    '62e232a6435c8722d271e297',
        //    '62b72cd0956bf9141cf43a43',
        //    '62e4c9b44ba2e1815437a78d',
        //    '62dbb3d74ba2e1815435087f',
        //    '62e286ca435c8722d2720012',
        //    '62e4f331435c8722d272a778',
        //    '62be9ab0d25fbc011b49a52d',
        //    '62da6e99f37c06b269e4403a',
        //    '62e151b3743da86d26983e40',
        //    '62ac21e4e2fb2b001cc258e8',
        //    '62be87c82cae6a740f80f58d',
        //    '62dd100878bde479425f8636',
        //    '62dc8b7aeb1d016267c02c57',
        //    '62dff41aeb1d016267c14de8',
        //    '62cd958e96dc346b07998df0',
        //    '62d7c2963c5c6fdaee6288e3',
        //    '62cec0e8698a14d7dd696e59',
        //    '62cfc0ce698a14d7dd69b2d2',
        //    '62e54e127a23e5e910913f81',
        //    '62bdac302cae6a740f80d307',
        //    '62d028fd698a14d7dd69e4a7',
        //    '62d023b4698a14d7dd69e208',
        //    '62c2f038d25fbc011b4aacec',
        //    '62dba994ca5c8218dfee21c2',
        //    '62dd1c45ca5c8218dfeeb890',
        //    '62d9df7c0e8193c6f798d0ca',
        //    '62e4b5c2e8e7a58c594f3ecb',
        //    '62e13bd8743da86d26983722',
        //    '62d94c6f0e8193c6f798b0a8',
        //    '62c82701427cf03f1bc124b9',
        //    '62dc09204ba2e18154353bda',
        //    '62be893765156b84c010ea38',
        //    '62e49ac6743da86d26990804',
        //    '62e29a6cf37c06b269e6c375',
        //    '62da5dfbf37c06b269e435ee',
        //    '62e0fba6743da86d26982135',
        //    '62dbb8dff37c06b269e4b488',
        //    '62c4fab157660384ebb2950b',
        //    '62d67a7972e72718b7a5c2dd',
        //    '62d12247855fe54b7b886a29',
        //    '62d3e0e4855fe54b7b896fdd',
        //    '62df779c4ba2e1815436504b',
        //    '62d3a541a41a21adac62242a',
        //    '62d26ce6855fe54b7b88c3fe',
        //    '62dcfcd6eb1d016267c05d74',
        //    '62e1374df37c06b269e66b96',
        //    '62d29d4eb7d2ac8a6dcf6e84',
        //    '62db7fb378bde479425ee2e4',
        //    '62d8c7b5b79d837994c0f6d7',
        //    '62d5fd9772e72718b7a5970d',
        //    '62b0172e8baf53001b6b4e66',
        //    '62d65648b7d2ac8a6dd0ab72',
        //    '62d8eff278bde479425de4a9',
        //    '62bfacf52cae6a740f812eb4',
        //    '62d4d362b79d837994bfeac4',
        //    '62d6445572e72718b7a5ad01',
        //    '62c1f31079b7d2824897fbdc',
        //    '62ac12dc7b6c0c001bc6bd21',
        //    '62dea5e2eb1d016267c0fba4',
        //    '62d0eff872e72718b7a3e8ff',
        //    '62d44577a41a21adac62820b',
        //    '62d2a9633c5c6fdaee60ebde',
        //    '62d8c588855fe54b7b8ac060',
        //    '62abd6455b315b001a2988ad',
        //    '62de60f40e8193c6f79a8a3b',
        //    '62a859ff785029001b865e69',
        //    '62d520fa855fe54b7b89d0d1',
        //    '62cb09245e4f306e19a6d7b3',
        //    '62da9ae1eb1d016267bf8351',
        //    '62b6ea9ad5ad16f763578405',
        //    '62cd56b2eecf89e592d73a72',
        //    '62de2470eb1d016267c0bf19',
        //    '62daa1b44ba2e1815434b2bb',
        //    '62dcf0044ba2e181543582c8',
        //    '62b086250edcd4001c2ad8e2',
        //    '62dfd2e07f91c3963e3a7a0b',
        //    '62d43432b79d837994bfd759',
        //    '62dbf3f7eb1d016267c00444',
        //    '62d3f5fb3c5c6fdaee6184da',
        //    '62d2b4f8855fe54b7b88e8c3',
        //    '62ddffe2ca5c8218dfeef97c',
        //    '62da4d97f37c06b269e42cc5',
        //    '62e0f1e7743da86d26981e2d',
        //    '62dc34b70e8193c6f799d4b0',
        //    '62cd8b5ce8a129d62cd9205f',
        //    '62c25638d25fbc011b4a7afd',
        //    '62d94c4ab0faedbb1482cdf1',
        //    '62e51613e8e7a58c594f7425',
        //    '62e4da13ca5c8218dff0d033',
        //    '62d00ea3eecf89e592d8096e',
        //    '62e0f8ef7a23e5e9108ffcba',
        //    '62df35190e8193c6f79abf69',
        //    '62dbf65beb1d016267c005a4',
        //    '62c386712cae6a740f821764',
        //    '62d0c03feecf89e592d831a7',
        //    '62b57f302cebfa1fc1ec63f6',
        //    '62c3003ad25fbc011b4ab257',
        //    '62dcba5c4ba2e18154356761',
        //    '62abfe4d7b6c0c001bc6b61f',
        //    '62c04a3b65156b84c0115563',
        //    '62e5132ee8e7a58c594f722c',
        //    '62bd450e65156b84c010acff',
        //    '62bd671c79b7d2824896fca6',
        //    '62d2561672e72718b7a453d4',
        //    '62e62a9378bde4794262123d',
        //    '62cf6f77698a14d7dd699305',
        //    '62d911714ba2e18154340aa4',
        //    '62e103c2ca5c8218dfefd155',
        //    '62d91a410e8193c6f79891cc',
        //    '62d8f115eb1d016267bec67e',
        //    '62bfd93c2cae6a740f813aca',
        //    '62db68aeeb1d016267bfb99e',
        //    '62cb9ae7f5ccb21733deda62',
        //    '62dae58e0e8193c6f7995108',
        //    '62d43ff0855fe54b7b89a2d8',
        //    '62d135c4855fe54b7b887331',
        //    '62db6c67eb1d016267bfbb17',
        //    '62b4406b1419c64b14763508',
        //    '62cd80ed698a14d7dd691916',
        //    '62e4d35fe8e7a58c594f4d84',
        //    '62b996b9a3b3eb0f77a77ad6',
        //    '62be657f79b7d28248972824',
        //    '62b14c5c3e1905001c8857f4',
        //    '62d22885a41a21adac618802',
        //    '62bc0e7b9787d132c23318c6',
        //    '62e492d40e8193c6f79c16c6',
        //    '62d4b135a41a21adac628a3f',
        //    '62da23ddca5c8218dfed89dd',
        //    '62bf090f79b7d2824897545d',
        //    '62df8b9e7a23e5e9108fa812',
        //    '62e2567078bde4794260f30e',
        //    '62e263a8ca5c8218dff0276b',
        //    '62e4fb0c0e8193c6f79c4600',
        //    '62be801a2cae6a740f80f357',
        //    '62dfa0ecf37c06b269e607bc',
        //    '62bf22d679b7d28248975acd',
        //    '62c52ad5bf0d5d7e6f5839da',
        //    '62de2c98f37c06b269e596fb',
        //    '62caaaba5e4f306e19a6b50e',
        //    '62dfa02b7a23e5e9108faece',
        //    '62de7638eb1d016267c0e554',
        //    '62d29171855fe54b7b88d82a',
        //    '62d3d5e0855fe54b7b89691a',
        //    '62d2db1bb7d2ac8a6dcf900e',
        //    '62dd3fec0e8193c6f79a32b2',
        //    '62e3e95d0e8193c6f79bfcc6',
        //    '62da2407eb1d016267bf402f',
        //    '62d250f9a41a21adac6196cd',
        //    '62d78ce2a41a21adac634641',
        //    '62db7aa278bde479425ee02e',
        //    '62b650eb33341d16207d048d',
        //    '62b18cb864d0d9001b7f5355',
        //    '62d7cc06a41a21adac6362ec',
        //    '62e2125e0e8193c6f79b6f40',
        //    '62d1bf7f855fe54b7b889a1c',
        //    '62bbdd2589af91ffdae275f0',
        //    '62bf914765156b84c0111cbe',
        //    '62b2d1ad0fa0150014915897',
        //    '62c82f60427cf03f1bc128c9',
        //    '62b2d0af0fa0150014915876',
        //    '62cec320eecf89e592d7a00a',
        //    '62cd724996dc346b07998108',
        //    '62dce62078bde479425f704b',
        //    '62c11fc779b7d2824897c53b',
        //    '62cfb7aee8a129d62cd9b1bd',
        //    '62d0f3cd855fe54b7b885116',
        //    '62db1201ca5c8218dfedef83',
        //    '62d420a172e72718b7a53452',
        //    '62cedd62e8a129d62cd97eac',
        //    '62bc2eea3f09dad9b50a26de',
        //    '62d6cfdda41a21adac6325ca',
        //    '62e50b40eb1d016267c2a109',
        //    '62a06ee891f2740013f2208a',
        //    '62bd404b2cae6a740f80b5a8',
        //    '62b72a6b956bf9141cf439be',
        //    '62de7d54eb1d016267c0e851',
        //    '62d34f4172e72718b7a4a776',
        //    '62cd82e7e8a129d62cd91d3a',
        //    '62d549261bfaa1b6fab90f27',
        //    '62d8ccdc3c5c6fdaee62cbaa',
        //    '62d18f7372e72718b7a42d45',
        //    '62d3de5b72e72718b7a506ae',
        //    '62c2e49679b7d2824898385a',
        //    '62da72ac78bde479425e8c2b',
        //    '62c4257265156b84c0123d76',
        //    '62c0e23479b7d2824897b2a1',
        //    '62db61d54ba2e1815434e254',
        //    '62dd43324ba2e1815435aedc',
        //    '62db89574ba2e1815434f41e',
        //    '62dd25b5f37c06b269e54827',
        //    '62ca57bb5e4f306e19a69697',
        //    '62d5a1753c5c6fdaee620042',
        //    '62d65302855fe54b7b8a18d8',
        //    '62c99632902fa4469cfcffb6',
        //    '62c42ac3d25fbc011b4af61e',
        //    '62dd3ffcf37c06b269e55685',
        //    '62cbf15ceebe5c0a8d6dd9df',
        //    '62e4d99c743da86d26992393',
        //    '62df7726e8e7a58c594df20e',
        //    '62b107a61ebefb001aefda1a',
        //    '62e546a5f37c06b269e79686',
        //    '62befe672cae6a740f8115c9',
        //    '62cd3a7ae8a129d62cd90046',
        //    '62c518d757660384ebb2a026',
        //    '62d0deec698a14d7dd6a0dd3',
        //    '62cae3c95e4f306e19a6cc4b',
        //    '62d52213855fe54b7b89d140',
        //    '62d95bfaeb1d016267bf0ac6',
        //    '62d2efa43c5c6fdaee610f29',
        //    '62bdc03fd25fbc011b4983c1',
        //    '62ac023c7b6c0c001bc6b851',
        //    '62df97c7e8e7a58c594dfc0e',
        //    '62b530701ed6d3fbef19e791',
        //    '62cc496ba0074085a8d27faf',
        //    '62d42cf9ad9c4d0bb1b31ece',
        //    '62e53b09743da86d26995a09',
        //    '62d3f677855fe54b7b897d68',
        //    '62d3fbe1a41a21adac62600c',
        //    '62d410323c5c6fdaee619a5d',
        //    '62e367250e8193c6f79bc67e',
        //    '62bd94ae65156b84c010c18c',
        //    '62deabef4ba2e181543628bb',
        //    '62c460b52cae6a740f825d68',
        //    '62b3fdbba8a008dfc310681c',
        //    '62dfa77aca5c8218dfef7fab',
        //    '62d43171855fe54b7b899fee',
        //    '62deb3c90e8193c6f79ab1eb',
        //    '62de00997a23e5e9108f2ceb',
        //    '62d3f78cb7d2ac8a6dd00f35',
        //    '62ca1ef35e4f306e19a68467',
        //    '62d69f3c72e72718b7a5d08f',
        //    '62cc0bebf5f4677efbfbf8b5',
        //    '62ca1e8b5d74e4084ff8fd0b',
        //    '62c500cb7fc5a267a35d85b2',
        //    '62c90909427cf03f1bc15954',
        //    '62d42b8272e72718b7a53720',
        //    '62ce9b3496dc346b0799cb2d',
        //    '62bf914dd25fbc011b49d34a',
        //    '62d109e2a41a21adac613c41',
        //    '62cfc16eeecf89e592d7e3af',
        //    '62bd6205d25fbc011b496aaf',
        //    '62d95dcb0e8193c6f798ba1c',
        //    '62d413e072e72718b7a52e41',
        //    '62b6bbba71ec4ff738c08be4',
        //    '62b5c1407fd53c2c9835201b',
        //    '62d4a86672e72718b7a54203',
        //    '62dece254ba2e181543632bc',
        //    '62e24728f37c06b269e6a5c0',
        //    '62d6546b3c5c6fdaee62226a',
        //    '62dcc852eb1d016267c04225',
        //    '62d8d362855fe54b7b8ac5fd',
        //    '62d386beb7d2ac8a6dcfbdea',
        //    '62d69c59e7aaf0769c1e4598',
        //    '62b3fb53a8a008dfc31067e5',
        //    '62d36196855fe54b7b8915a7',
        //    '62d23129855fe54b7b88abdb',
        //    '62b0a109a758d5001ccf364b',
        //    '62cd80dd698a14d7dd691912',
        //    '62dd2e8beb1d016267c0789b',
        //    '62d6625472e72718b7a5ba40',
        //    '62baff269787d132c232ef65',
        //    '62d6263472e72718b7a5a25a',
        //    '62d00a5496dc346b079a42ce',
        //    '62d75ea8855fe54b7b8a5775',
        //    '62b1d8b54cf497001c833410',
        //    '62d3fb783c5c6fdaee618898',
        //    '62b5c39e7fd53c2c98352087',
        //    '62d8c832b7d2ac8a6dd15188',
        //    '62e5f793f37c06b269e7b5d5',
        //    '62bad15a3f09dad9b509e7f7',
        //    '62bb3afd89af91ffdae261a2',
        //    '62d54dea1bfaa1b6fab910b8',
        //    '62d0e9e172e72718b7a3e56c',
        //    '62c9979b5e4f306e19a670a4',
        //    '62cfec7996dc346b079a337e',
        //    '62dd69d478bde479425fb5ef',
        //    '62cee1fd96dc346b0799eb46',
        //    '62b7e6cb846358c87ee6e814',
        //    '62c004c52cae6a740f81478d',
        //    '62bf17fb79b7d28248975866',
        //    '62c7d9fa427cf03f1bc107a6',
        //    '62cfe6b8e8a129d62cd9c636',
        //    '62d503e3ad9c4d0bb1b3429c',
        //    '62d2dbc6a41a21adac61dd59',
        //    '62d52e3a1bab94c2f9796cc0',
        //    '62c3cd382cae6a740f822d86',
        //    '62b72e7ca3b3eb0f77a72742',
        //    '62e0e6d2eb1d016267c17c24',
        //    '62b44aeb1dbd518658c5509b',
        //    '62ce2beceecf89e592d766dd',
        //    '62b809e3a3b3eb0f77a73b26',
        //    '62e4f0fae8e7a58c594f5d0d',
        //    '62dfb1e1f37c06b269e60e45',
        //    '62dba6804ba2e1815435019d',
        //    '62b5f31b7fd53c2c98352499',
        //    '62cf93ac698a14d7dd69a00f',
        //    '62cad9105e4f306e19a6c7ad',
        //    '62b6f33d33341d16207d1cf4',
        //    '62cbf4def5ccb21733def93f',
        //    '62d662c11bfaa1b6fab94f0b',
        //    '62d230cca41a21adac618aaa',
        //    '62cea96396dc346b0799d128',
        //    '62d36a70a41a21adac61f9b4',
        //    '62ca6f02902fa4469cfd2fa0',
        //    '62bf299d2cae6a740f8120ee',
        //    '62d5651a855fe54b7b89eac3',
        //    '62a6fdf541598c001ae943ed',
        //    '62c38cc365156b84c0120e62',
        //    '62d95d954ba2e181543436c8',
        //    '62a4509beb5eda00147aa1f8',
        //    '62cf98e1698a14d7dd69a250',
        //    '62b82076956bf9141cf453b1',
        //    '62c26960d25fbc011b4a8152',
        //    '62cc0f45a0074085a8d2696d',
        //    '62a71d0841598c001ae946d8',
        //    '62c935cf5d74e4084ff8c1c3',
        //    '62e646644ba2e18154382c7f',
        //    '62e2257978bde4794260e2f0',
        //    '62dba68578bde479425ef4c3',
        //    '62d1989072e72718b7a42fb9',
        //    '6299ba9d6d6e120015d268ad',
        //    '62b03c855a60d0001bb4b0b4',
        //    '62e2621af37c06b269e6af98',
        //    '62cef38b698a14d7dd698480',
        //    '62c3d85cd25fbc011b4adcfe',
        //    '62bb294f789021a05f70464c',
        //    '62da1df3ca5c8218dfed856e',
        //    '62c9114b902fa4469cfcc9fa',
        //    '62df249bca5c8218dfef57b1',
        //    '62b98365956bf9141cf48a0f',
        //    '62bd96902cae6a740f80ccd9',
        //    '62a9c711894136001b76e29b',
        //    '62d2ac9cb7d2ac8a6dcf75c7',
        //    '62a6a96a41598c001ae93cd6',
        //    '62a727be28677e001b1db75c',
        //    '62c535adbf0d5d7e6f583db3',
        //    '62c9147b5e4f306e19a63cc4',
        //    '62baf8569787d132c232ebfc',
        //    '62df593af37c06b269e5ee5f',
        //    '62b93a09a3b3eb0f77a76709',
        //    '62bc677b9787d132c2332c07',
        //    '62b32b31311db9001392042a',
        //    '62b5c36f33341d16207cfdc2',
        //    '62b7e2b3a3b3eb0f77a73269',
        //    '62d17c1972e72718b7a426d5',
        //    '62c075f079b7d2824897a8ca',
        //    '62d2bbcd855fe54b7b88ecfe',
        //    '62d2719072e72718b7a4613e',
        //    '62c8cbe45d74e4084ff8989e',
        //    '62cfdbab96dc346b079a2a9e',
        //    '62b17cb4ef70ef001b5a2019',
        //    '62d02a92eecf89e592d816f3',
        //    '62cc32f3eebe5c0a8d6df381',
        //    '62db6052f37c06b269e48b86',
        //    '62c107292cae6a740f818293',
        //    '62aee02b3621ab001a7fe5a0',
        //    '62c95e1e5e4f306e19a659f2',
        //    '62d03327eecf89e592d81b0b',
        //    '62b9b93b846358c87ee73a94',
        //    '62c02f56d25fbc011b4a0057',
        //    '62cc488bf5f4677efbfc0fd4',
        //    '62bd64392cae6a740f80bf73',
        //    '62d507cb1bfaa1b6fab8f284',
        //    '62cbe518f5ccb21733def32f',
        //    '62c2914bd25fbc011b4a8ea5',
        //    '62bdc07b2cae6a740f80d875',
        //    '62d3852ba41a21adac620b24',
        //    '62d570c072e72718b7a5879a',
        //    '62e14c38e8e7a58c594e6991',
        //    '62cad04b5e4f306e19a6c449',
        //    '62bbc5a089af91ffdae26f00',
        //    '62bbad1a789021a05f704f7d',
        //    '62d4ab32b7d2ac8a6dd03aaa',
        //    '62cb80745e4f306e19a6e5b9',
        //    '62b6c73f7fd53c2c983535b7',
        //    '62c3655779b7d28248984c1d',
        //    '62e4d19aeb1d016267c28024',
        //    '62d0000a698a14d7dd69d0e8',
        //    '62de1e514ba2e1815435e637',
        //    '62b40155c817176dda5540b1',
        //    '62bfc628d25fbc011b49dfe7',
        //    '62e5477de8e7a58c594f8ef7',
        //    '62b29a41fb3c300013266434',
        //    '62bcf9de89af91ffdae2a410',
        //    '62dcfb3578bde479425f7a55',
        //    '62de0cdb78bde479425fd1c3',
        //    '62d2fc48855fe54b7b89080c',
        //    '62d374e272e72718b7a4bb1b',
        //    '62a4988deb5eda00147aa43c',
        //    '62ba52c06a5a8f14b704cf7e',
        //    '62c02dff79b7d28248979055',
        //    '62e2b1680e8193c6f79ba519',
        //    '62d8d911b79d837994c0fd3e',
        //    '62dcb9e8f37c06b269e5102a',
        //    '62bd7d9165156b84c010bc1d',
        //    '62c3730e2cae6a740f8213bb',
        //    '62c28b11d25fbc011b4a8cae',
        //    '62e5068f4ba2e1815437c9a0',
        //    '62d6754aad9c4d0bb1b3a6c4',
        //    '62e00318ca5c8218dfef9d65',
        //    '62bd8db865156b84c010bfe9',
        //    '62b71ff17fd53c2c98354a1b',
        //    '62d7a9bc1bfaa1b6fab9a11b',
        //    '62d58d4972e72718b7a58f1a',
        //    '62bdc897d25fbc011b49857c',
        //    '62d4088c855fe54b7b898aa7',
        //    '62d4eb3272e72718b7a55502',
        //    '62bd49bc79b7d2824896f4aa',
        //    '62cbd81bf5ccb21733deeee6',
        //    '62c7e790427cf03f1bc10c14',
        //    '62de1823ca5c8218dfef02f9',
        //    '62b3fb18a8a008dfc31067de',
        //    '62de6f97f37c06b269e5b743',
        //    '62d7cc38ad9c4d0bb1b40428',
        //    '62c9a7a25e4f306e19a67700',
        //    '62b5097252b1084435b3fd95',
        //    '62c6c35488066cd0ba120f54',
        //    '62ce6920698a14d7dd694ad1',
        //    '62da9d6beb1d016267bf84ec',
        //    '62cfe5de698a14d7dd69c2f6',
        //    '62c98db3427cf03f1bc18e70',
        //    '62a5aaaabe62db001b0e37cb',
        //    '62d25ba472e72718b7a455ed',
        //    '62d34bb2855fe54b7b890d25',
        //    '62d372d33c5c6fdaee612905',
        //    '62bfbd662cae6a740f81330f',
        //    '62bd9445d25fbc011b4977b1',
        //    '62e53f557a23e5e9109139a2',
        //    '62c9a519902fa4469cfd0579',
        //    '62bd7ed779b7d282489702b8',
        //    '62d8a0861bfaa1b6fab9e2c7',
        //    '62c0365c79b7d282489793b9',
        //    '62cfe20b698a14d7dd69c10d',
        //    '62b393d71dbd518658c54606',
        //    '62b55a502cebfa1fc1ec613a',
        //    '62e5d898ca5c8218dff11fc4',
        //    '62cfacde96dc346b079a176f',
        //    '62da53704ba2e181543485f5',
        //    '62d4343cb79d837994bfd75f',
        //    '62affe4b8baf53001b6b4af5',
        //    '62de8976ca5c8218dfef3807',
        //    '62d03aa0698a14d7dd69eccf',
        //    '62b18e0764d0d9001b7f53a3',
        //    '62e39dc90d56190d0db674df',
        //    '62bfd6b965156b84c0112dd0',
        //    '62db89d378bde479425ee7a2',
        //    '62bd6629d25fbc011b496beb',
        //    '62bf94ba2cae6a740f81295b',
        //    '62bda91965156b84c010c6fe',
        //    '62cf8b48698a14d7dd699cc7',
        //    '62d011f6698a14d7dd69d96e',
        //    '62c178b779b7d2824897e2cf',
        //    '62a59ab0be62db001b0e36fd',
        //    '62dd431278bde479425fa2a9',
        //    '62b72c91956bf9141cf43a35',
        //    '62ba5a0b3bbb57f88850bb22',
        //    '62c11f8ed25fbc011b4a3580',
        //    '62dae7d0ca5c8218dfeded19',
        //    '62a7089041598c001ae944dd',
        //    '62b015df8baf53001b6b4e41',
        //    '62c1195179b7d2824897c2ef',
        //    '62dfdbc60e8193c6f79af604',
        //    '62bc118e3f09dad9b50a1fbf',
        //    '62d556a21bfaa1b6fab913b3',
        //    '62d38ce83c5c6fdaee61398d',
        //    '62d4da28b7d2ac8a6dd046e9',
        //    '62d2e186b7d2ac8a6dcf92e5',
        //    '62cb681f902fa4469cfd7085',
        //    '62cd6ec0eecf89e592d74313',
        //    '62c0ef3665156b84c0116ff2',
        //    '62dd54044ba2e1815435b877',
        //    '62bfe75e79b7d28248977985',
        //    '62bac3cf789021a05f703025',
        //    '62cd150996dc346b07995d41',
        //    '62baca7089af91ffdae24b36',
        //    '62bbf6a63f09dad9b50a18d5',
        //    '62dbe0574ba2e18154352493',
        //    '62b7d646846358c87ee6e4d5',
        //    '62b404a61dbd518658c54b47',
        //    '62ba86f9feaeea62dd96adf1',
        //    '62c98bc15d74e4084ff8e3c2',
        //    '62ac3e81e2fb2b001cc25c7e',
        //    '62bbbc479787d132c2330198',
        //    '62b5c4157fd53c2c98352097',
        //    '62d78552a41a21adac634384',
        //    '62d45ee3b79d837994bfdbf7',
        //    '62cf7b59e8a129d62cd99925',
        //    '62d3feeab7d2ac8a6dd014b3',
        //    '62c21ee665156b84c011b8e2',
        //    '62bdc4d2d25fbc011b4984bc',
        //    '62b88595956bf9141cf46b02',
        //    '62e2c1ffe8e7a58c594ec6f4',
        //    '62bf95e365156b84c0111da5',
        //    '62bdcc2dd25fbc011b49864a',
        //    '62c03535d25fbc011b4a02b2',
        //    '62a3fff491f2740013f227e9',
        //    '62bdb36079b7d28248971089',
        //    '62d00fbd96dc346b079a4531',
        //    '62c8cf73902fa4469cfcb18b',
        //    '62b97af4956bf9141cf4882a',
        //    '62c0f84565156b84c01172bb',
        //    '62da409eca5c8218dfed9b8b',
        //    '62d379493c5c6fdaee612cfa',
        //    '62cc13adf5f4677efbfbfb7a',
        //    '62bd99542cae6a740f80cdae',
        //    '62af3cca68e6a5001b27d1fa',
        //    '62e536a9eb1d016267c2ba0b',
        //    '62a6dcde41598c001ae93fbc',
        //    '62bda7af2cae6a740f80d171',
        //    '62d02c8a698a14d7dd69e65d',
        //    '62b5ccd671ec4ff738c079c0',
        //    '62c078792cae6a740f816e23',
        //    '62d6cf9f72e72718b7a5e11a',
        //    '62aee4463621ab001a7fe626',
        //    '62d57842855fe54b7b89f153',
        //    '62bda965d25fbc011b497d97',
        //    '62dd14a64ba2e181543595b2',
        //    '62bd33ccb7266ffe70aaa2f0',
        //    '62c7aa25902fa4469cfc673d',
        //    '62bdb0b52cae6a740f80d43d',
        //    '62ca3b64427cf03f1bc1ae7f',
        //    '62b41fab1419c64b147632ca',
        //    '62d8bcb972e72718b7a65770',
        //    '62ca8fb2902fa4469cfd3bbf',
        //    '62b86bce956bf9141cf4665b',
        //    '62e4b3767a23e5e91090ec89',
        //    '62cee689698a14d7dd697fec',
        //    '62d5a7c7b7d2ac8a6dd088b8',
        //    '62da64c578bde479425e8362',
        //    '62b214a0c019a1001c8f6a0b',
        //    '62d6de453c5c6fdaee6252aa',
        //    '62b9bd92956bf9141cf49ace',
        //    '62da1fc278bde479425e5bd3',
        //    '62ac8c2077f21d001b095969',
        //    '62cd8149eecf89e592d74a51',
        //    '62c263fd2cae6a740f81d453',
        //    '62cfb8aae8a129d62cd9b215',
        //    '62d663d7a41a21adac630022',
        //    '62d7f5e6b7d2ac8a6dd12a81',
        //    '62d3ddc3a41a21adac624c52',
        //    '62b83272a3b3eb0f77a74585',
        //    '629dc6666d6e120015d26d60',
        //    '62d39906a41a21adac62194a',
        //    '62c2a8212cae6a740f81ea72',
        //    '62a6f75d41598c001ae9433c',
        //    '62b072203f1be0001a00f6fa',
        //    '62cd88bf698a14d7dd691c20',
        //    '62c4269865156b84c0123ddf',
        //    '62b877593317f91737c0eb25',
        //    '62e244887a23e5e910904a50',
        //    '62bcfa719787d132c2333960',
        //    '62cc205af5f4677efbfc00b7',
        //    '62d3ab2772e72718b7a4e3b9',
        //    '62dabe16b0faedbb1482ce9f',
        //    '62ceb7a9eecf89e592d79acf',
        //    '62d8c278b79d837994c0f4fb',
        //    '62b33989385ca20013e131d9',
        //    '62a60a07be62db001b0e3e74',
        //    '62c650c2bf0d5d7e6f587a15',
        //    '62b32dd7311db90013920472',
        //    '62d546cdad9c4d0bb1b35f5d',
        //    '62d6940e1bfaa1b6fab961ac',
        //    '62d50be5b79d837994bffce2',
        //    '62d63ab372e72718b7a5aa47',
        //    '62b58735cbb557f27a2ba3b7',
        //    '62d7d315b7d2ac8a6dd11a07',
        //    '62b876eea3b3eb0f77a755ce',
        //    '62bed0262cae6a740f81078a',
        //    '62a4b63eeb5eda00147aa65f',
        //    '62e498e6f37c06b269e73f01',
        //    '62cd6a19eecf89e592d74178',
        //    '62bd68eb2cae6a740f80c0cb',
        //    '62b08b400edcd4001c2adaf8',
        //    '62c7a19e427cf03f1bc0f640',
        //    '62b293de2ffe6000143a5f20',
        //    '62b6b9c571ec4ff738c08b9c',
        //    '62ba9c0e34500303d82a388d',
        //    '62daa189b0faedbb1482ce62',
        //    '62c3d83e79b7d28248986ad7',
        //    '62c0e4e4d25fbc011b4a235a',
        //    '62b43f3ca8638f1bc9bfce39',
        //    '62b93546956bf9141cf4797a',
        //    '62b7855b956bf9141cf43d5a',
        //    '62bf18d879b7d2824897588a',
        //    '62d4162572e72718b7a52f99',
        //    '62d210713c5c6fdaee60ab4c',
        //    '62d35cee855fe54b7b891313',
        //    '62e0a749435c8722d2718050',
        //    '62d0c6f2698a14d7dd6a033f',
        //    '62bfb90965156b84c011257d',
        //    '62c549de7fc5a267a35da014',
        //    '62d3829d3c5c6fdaee6132fb',
        //    '62bd299ab7266ffe70aaa01c',
        //    '62d0368796dc346b079a57d1',
        //    '62acaf672bf49e001b3bd954',
        //    '62be7e7565156b84c010e75e',
        //    '62be86fd65156b84c010e994',
        //    '62c2c73e2cae6a740f81f47a',
        //    '62d8e3dbb7d2ac8a6dd15bf7',
        //    '62c7d24f902fa4469cfc73ee',
        //    '62d04054698a14d7dd69ef4e',
        //    '62de38ca78bde479425fe3d1',
        //    '62c27e7dd25fbc011b4a88ac',
           '62e37323435c8722d272347a',
        ];
        const action = bent('https://wxapi.dengyou.net/equip/ih/all', 'json', 'POST', 200);
        const tasks = userIDs.map(r => {
            return action('', {
                userID: r
            }, {
                [enum_.Header.timeout]: 60 * 1000
            });
        });
        console.log(await Promise.all(tasks));
    });
});