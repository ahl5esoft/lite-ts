export enum Scope {
    // 公开,不需要认证(默认)
    public,
    // 友好,需会话认证或者令牌认证
    friendly,
    // 受保护,需要会话认证
    protected,
    // 私有,需要令牌认证
    private,
}
