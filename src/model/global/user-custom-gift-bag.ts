/**
 * 用户自选礼包
 */
export class UserCustomGiftBag {
    /**
     * 礼包, { 场景: { 礼包编号: 选择编号 } }
     */
    public giftBag: {
        [scene: string]: {
            [no: number]: number
        }
    }
    /**
     * 用户ID
     */
    public id: string;
}