export class RadixConverter {
    public readonly radix: number;
    public readonly numerals: string;
    public readonly numeral_values: { [numeral: string]: number };

    public constructor(numerals: string) {
        this.radix = numerals.length;
        this.numerals = numerals;
        this.numeral_values = {};
        numerals.split("").forEach((e, i) => this.numeral_values[e] = i);
    }

    /* Converts a decimal number to a base n number. */
    public fromDecimal(num: number): string {
        let result: string = "";
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

    /* Converts a base n number to a decimal number. */
    public intoDecimal(num: string): number {
        const len: number = num.length;
        let result: number = 0;

        for (let i = 0; i < len; ++i) {
            const d: number = this.numeral_values[num[i]];

            if (d === void 0) {
                throw new Error(`invalid numeral: ${num[i]}`);
            }

            result += d * this.radix ** (len - i - 1);
        }

        return result;
    }

    /* Returns a base n to base n' converter (e.g. base2.convertInto(base16)("1110") === "e" ). */
    public convertInto(converter: RadixConverter): (num: string) => string {
        return num => converter.fromDecimal(this.intoDecimal(num));
    }

    /* Returns a base n' to base n converter (e.g. base16.convertInto(base2)("e") === "1110" ). */
    public convertFrom(converter: RadixConverter): (num: string) => string {
        return converter.convertInto(this);
    }
}
