/**
 * 用户随机种子
 */
export class UserRandSeed {
    /**
     * 用户ID
     */
    public id: string;
    /**
     * 种子, { 场景: 种子 }
     */
    public seed: { [scene: string]: string };
}