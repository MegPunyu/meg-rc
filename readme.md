# RadixConverter
A simple radix converter.

## Features
Converts any radix to any radix.

## Installation
```shell
npm install meg-rc
```

## Usage
### decimal <-> base 52
```javascript
import RadixConverter from "meg-rc";

const numerals  = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const converter = new RadixConverter(numerals);

converter.fromDecimal(123456789);  // 8m0Kx
converter.intoDecimal("8m0Kx");    // 123456789
```

### base 7 <-> base 3
```javascript
import RadixConverter from "meg-rc";

const base7 = new RadixConverter("0123456");
const base3 = new RadixConverter("012");

let a = base7.fromDecimal(12345);     // 12345(10) => 50664(7)
let b = base7.convertInto(base3)(a);  // 50664(7) => 121221020(3)
let c = base3.intoDecimal(b);         // 121221020(3) => 12345(10)
```

### base 9 <-> base 4 (variant)
```javascript
import RadixConverter from "meg-rc";

const base9 = new RadixConverter("012345678");
const base4 = new RadixConverter("four");

let a = base9.fromDecimal(6789);      // 6789(10) => 10273(9)
let b = base4.convertFrom(base9)(a);  // 10273(9) => ouuufoo(4)
let c = base4.intoDecimal(b);         // ouuufoo(4) => 6789(10)

base4.intoDecimal("fouuufoo");  // 6789
```

### Reuse of converter (base 6 -> base 8)
```javascript
import RadixConverter from "meg-rc";

const base6 = new RadixConverter("012345");
const base8 = new RadixConverter("01234567");
 
const convert68 = base6.convertInto(base8);  // base 6 => base 8 conversion function
 
let a = base6.fromDecimal(1357);  // 1357(10) => 10141(6)
let b = base6.fromDecimal(2468);  // 2468(10) => 15232(6)
 
a = convert68(a);  // 10141(6) => 2515(8)
b = convert68(b);  // 15232(6) => 4644(8)
 
base8.intoDecimal(a);  // 2515(8) => 1357(10)
base8.intoDecimal(b);  // 4644(8) => 2468(10)
```