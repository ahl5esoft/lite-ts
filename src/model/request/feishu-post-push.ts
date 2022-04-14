import { IsBoolean, IsOptional, IsUrl, IsUUID, Length, Max, Min } from 'class-validator';

/**
 * 超链接
 */
class A {
    /**
     * 连接
     */
    @IsUrl()
    public href: string;
    /**
     * 标签
     */
    public tag: 'a';
    /**
     * 文本
     */
    @Length(1, 32)
    public text: string;
}

/**
 * 某人
 */
class At {
    /**
     * 标签
     */
    public tag: 'at';
    /**
     * 用户id
     */
    @Length(1, 128)
    public user_id: string;
    /**
     * 用户名
     */
    @IsOptional()
    @Length(1, 64)
    public user_name?: string;
}

/**
 * 图片
 */
class Image {
    /**
     * 片唯一标识
     */
    @IsUUID()
    public image_key: string;
    /**
     * 标签
     */
    public tag: 'img';
    /**
     * 高度, 默认: 300
     */
    @IsOptional()
    @Max(3096)
    @Min(8)
    public height?: number;
    /**
     * 宽度, 默认: 300
     */
    @IsOptional()
    @Max(3096)
    @Min(8)
    public width?: number;
}

/**
 * 文本
 */
class Text {
    /**
     * 标签
     */
    public tag: 'text';
    /**
     * 文本
     */
    @Length(1, 8000)
    public text: string;
    /**
     * 是否escape
     */
    @IsBoolean()
    @IsOptional()
    public un_escape?: boolean;
}

/**
 * 飞书富文本推送
 */
export type FeishuPostPush = A | At | Image | Text;