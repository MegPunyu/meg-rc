/**
 * A simple radix converter.
 */
export default class RadixConverter {
    /**
     * Radix to be converted.
     */
    public readonly radix: number;

    /**
     * Sequence of numerals used to represent an base n number.
     */
    public readonly numerals: string[];

    /**
     * Map storing pairs of numbers and their values.
     */
    public readonly numeralValues: Map<string, number>;

    /**
     * Constructor. 
     * 
     * @param numerals Sequence of numerals used to represent an base n number.
     * @example
     * const base16 = new RadixConverter("0123456789abcdef");
     */
    public constructor(numerals: string) {
        this.numerals = [...numerals];
        this.radix = this.numerals.length;
        this.numeralValues = new Map();

        [...numerals].forEach((e, i) => this.numeralValues.set(e, i));
    }

    /**
     * Converts a decimal number to a base n number. 
     * 
     * @param num a decimal number
     * @throws {SyntaxError} if the number is not finite
     * @example
     * const base16 = new RadixConverter("0123456789abcdef");
     * base16.fromDecimal(10);  // "a"
     */
    public fromDecimal(num: number): string {
        let result: string[] = [];
        let d = Math.floor(+num);

        if (!Number.isFinite(d)) {
            throw new SyntaxError(`invalid number: ${num}`);
        }

        do {
            result.push(this.numerals[d % this.radix]);
            d = Math.floor(d / this.radix);
        } while (d !== 0);

        return result.reverse().join("");
    }

    /**
     * Converts a base n number to a decimal number. 
     * 
     * @param num a base n number
     * @throws {SyntaxError} if incorrect numeral is given
     * @example
     * const base16 = new RadixConverter("0123456789abcdef");
     * base16.intoDecimal("a");  // 10
     */
    public intoDecimal(num: string): number {
        return [...num]
            .map((c, i, a) => {
                const d = this.numeralValues.get(c);

                if (d === void 0) {
                    throw new SyntaxError(`invalid numeral: ${c}`);
                }

                return d * this.radix ** (a.length - i - 1);
            })
            .reduce((a, b) => a + b);
    }

    /**
     * Returns a function that converts a number from base n to base n'.
     * 
     * @param converter instance of RadixConverter of the destination radix
     * @example
     * const base16 = new RadixConverter("0123456789abcdef");
     * const base2  = new RadixConverter("01");
     * 
     * base2.convertInto(base16)("1110");  // "e"
     */
    public convertInto(converter: RadixConverter): (num: string) => string {
        return num => converter.fromDecimal(this.intoDecimal(num));
    }

    /**
     * Returns a function that converts a number from base n' to base n.
     * 
     * @param converter instance of RadixConverter of the source radix
     * @example
     * const base16 = new RadixConverter("0123456789abcdef");
     * const base2  = new RadixConverter("01");
     * 
     * base16.convertInto(base2)("e");  // "1110"
     */
    public convertFrom(converter: RadixConverter): (num: string) => string {
        return converter.convertInto(this);
    }
}
