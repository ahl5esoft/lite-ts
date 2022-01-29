import { ArrayMinSize, Length } from 'class-validator';

/**
 * excel页签
 */
export class ExcelSheet {
    /**
     * 页签名
     */
    @Length(1, 64)
    public name: string;

    /**
     * 数据行
     */
    @ArrayMinSize(1)
    public rows: any[];
}