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
     * Sequence of numerals ordered by their lengths.
     */
    readonly #orderedNumerals: string[] | null;

    /**
     * Constructor. 
     * 
     * @param numerals Sequence of numerals used to represent an base n number.
     * If string is provided, each character in the string will be numerals.
     * If Array is provided, each element of the sequence will be numerals.
     * @param validateNumerals Varidate numerals if true. Default is true.
     * @throws {TypeError} Throws if empty string is provided as a numeral
     * or there is a combination of numerals that cannot be used together.
     * @throws {SyntaxError} Thrown if the numerals are duplicated.
     * @throws {RangeError} Thrown if the specified radix is invalid or empty strings are provided.
     * @example
     * const base16 = new RadixConverter("0123456789abcdef");
     */
    public constructor(numerals: string | string[], validateNumerals = true) {
        if (Array.isArray(numerals)) {
            this.numerals = numerals.map(e => {
                const numeral = "" + e;

                if (numeral === "") {
                    throw new TypeError("Empty string cannot be a numeral");
                }

                return numeral;
            });

            if (validateNumerals) {
                this.#validateNumerals();
            }

            this.#orderedNumerals = this.numerals.concat().sort((a, b) => b.length - a.length);

        } else {
            this.numerals = [...("" + numerals[0])];

            if (validateNumerals && new Set(this.numerals).size !== this.numerals.length) {
                throw new SyntaxError("Numerals must be unique");
            }

            this.#orderedNumerals = null;
        }

        if (this.numerals.length <= 1) {
            throw new RangeError("Radix must be greater than 2");
        }

        this.radix = this.numerals.length;
        this.numeralValues = new Map();

        this.numerals.forEach((e, i) => this.numeralValues.set(e, i));
    }

    /**
     * Converts a decimal number to a base n number. 
     * 
     * @param num A decimal number.
     * @throws {RangeError} Thrown if the number is not finite.
     * @example
     * const base16 = new RadixConverter("0123456789abcdef");
     * base16.fromDecimal(10);  // "a"
     */
    public fromDecimal(num: number): string {
        let result = "";
        let d = Math.floor(+num);

        if (!Number.isFinite(d)) {
            throw new RangeError(`Invalid number: ${num}`);
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
     * @param num A base n number.
     * @throws {SyntaxError} Thrown if invalid numeral is given.
     * @example
     * const base16 = new RadixConverter("0123456789abcdef");
     * base16.intoDecimal("a");  // 10
     */
    public intoDecimal(num: string): number {
        if (!num) {
            return 0;
        }

        return this.#splitNum(num)
            .map((c, i, a) => {
                const d = this.numeralValues.get(c);

                if (d === void 0) {
                    throw new SyntaxError(`Invalid numeral: ${c}`);
                }

                return d * this.radix ** (a.length - i - 1);
            })
            .reduce((a, b) => a + b);
    }

    /**
     * Returns a function that converts a number from base n to base n'.
     * The returned function can throw errors 
     * in the same way as intoDecimal() and fromDecimal().
     * 
     * @param converter Instance of RadixConverter of the destination radix.
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
     * The returned function can throw errors 
     * in the same way as intoDecimal() and fromDecimal().
     * 
     * @param converter Instance of RadixConverter of the source radix.
     * @example
     * const base16 = new RadixConverter("0123456789abcdef");
     * const base2  = new RadixConverter("01");
     * 
     * base16.convertInto(base2)("e");  // "1110"
     */
    public convertFrom(converter: RadixConverter): (num: string) => string {
        return converter.convertInto(this);
    }

    /**
     * Validates this.numerals.
     */
    #validateNumerals(): void {
        const validate = (str: string, originalStr: string, testStrs: string[]): void => {
            for (const testStr of testStrs) {
                if (str.indexOf(testStr) === 0) {
                    const substr = str.slice(testStr.length);

                    if (substr === "") {
                        throw originalStr === testStr
                            ? new TypeError(`Invalid numerals: ${testStr} is duplicated`)
                            : new TypeError(`Invalid numerals: ${originalStr} and ${testStr} cannot be used together`);

                    } else {
                        validate(substr, originalStr, testStrs);
                    }
                } else if (str !== originalStr && testStr.startsWith(str)) {
                    throw new TypeError(`Invalid numerals: ${originalStr} and ${testStr} cannot be used together`);
                }
            }
        };

        this.numerals.forEach((e, i, a) => {
            const arr = a.concat();
            arr.splice(i, 1);

            validate(e, e, arr);
        });
    }

    /**
     * Splits a string into an array of strings.
     */
    #splitNum(num: string): string[] {
        if (this.#orderedNumerals === null) {
            return [...("" + num)];
        }

        let substr = num;
        const result: string[] = [];

        while (substr.length > 0) {
            let success = false;

            for (const numeral of this.#orderedNumerals) {
                if (substr.startsWith(numeral)) {
                    result.push(numeral);
                    substr = substr.slice(numeral.length);
                    success = true;

                    break;
                }
            }

            if (!success) {
                throw new SyntaxError(`Unknown numerals: ${substr}`);
            }
        }

        return result;
    }
}