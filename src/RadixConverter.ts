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
    public readonly numerals: string;

    /**
     * Object storing pairs of numbers and their values.
     */
    public readonly numeral_values: { [numeral: string]: number };

    /**
     * Constructor. 
     * 
     * @param numerals Sequence of numerals used to represent an base n number.
     * @example
     * const base16 = new RadixConverter("0123456789abcdef");
     */
    public constructor(numerals: string) {
        this.radix = numerals.length;
        this.numerals = numerals;
        this.numeral_values = {};

        numerals.split("").forEach((e, i) => this.numeral_values[e] = i);
    }

    /**
     * Converts a decimal number to a base n number. 
     * 
     * @param num a decimal number
     * @example
     * const base16 = new RadixConverter("0123456789abcdef");
     * base16.fromDecimal(10);  // "a"
     */
    public fromDecimal(num: number): string {
        let result = "";
        let d: number = Math.floor(+num);

        if (!Number.isFinite(d)) {
            throw new Error(`invalid number: ${num}`);
        }

        do {
            result = this.numerals[d % this.radix] + result;
            d = Math.floor(d / this.radix);
        } while (d !== 0);

        return result;
    }

    /**
     * Converts a base n number to a decimal number. 
     * 
     * @param num a base n number
     * @example
     * const base16 = new RadixConverter("0123456789abcdef");
     * base16.intoDecimal("a");  // 10
     */
    public intoDecimal(num: string): number {
        const len: number = num.length;
        let result = 0;

        for (let i = 0; i < len; ++i) {
            const d: number = this.numeral_values[num[i]];

            if (d === void 0) {
                throw new Error(`invalid numeral: ${num[i]}`);
            }

            result += d * this.radix ** (len - i - 1);
        }

        return result;
    }

    /**
     * Returns a base n to base n' converter
     * 
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
     * Returns a base n' to base n converter
     * 
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
