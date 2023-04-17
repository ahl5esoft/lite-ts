import { Integer } from './integer';

export abstract class MathBase {
    public static ctor = 'MathBase';

    /**
     * |a|
     * @param a 
     */
    public abstract abs(a: Integer): Integer;

    /**
     * a + b
     * @param a 
     * @param b 
     */
    public abstract add(a: Integer, b: Integer): Integer;

    /**
     * a / b
     * @param a 
     * @param b 
     */
    public abstract divide(a: Integer, b: Integer): Integer;

    /**
     * a == b
     * @param a 
     * @param b 
     */
    public abstract eq(a: Integer, b: Integer): boolean;

    /**
     * a >= b
     * @param a 
     * @param b 
     */
    public abstract gte(a: Integer, b: Integer): boolean;

    /**
     * a > b
     * @param a 
     * @param b 
     */
    public abstract gt(a: Integer, b: Integer): boolean;

    /**
     * a < b
     * @param a 
     * @param b 
     */
    public abstract lt(a: Integer, b: Integer): boolean;

    /**
     * a <= b
     * @param a 
     * @param b 
     */
    public abstract lte(a: Integer, b: Integer): boolean;

    /**
     * a % b
     * @param a 
     * @param b 
     */
    public abstract mod(a: Integer, b: Integer): Integer;

    /**
     * a * b
     * @param a 
     * @param b 
     */
    public abstract multiply(a: Integer, b: Integer): Integer;

    /**
     * a ^ b
     * @param a 
     * @param b 
     */
    public abstract pow(a: Integer, b: number): Integer;

    /**
     * a - b
     * @param a 
     * @param b 
     */
    public abstract subtract(a: Integer, b: Integer): Integer;
}