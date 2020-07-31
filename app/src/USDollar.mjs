/**
 * Created by Hunter on 5/26/2018.
 */

export default class USDollar extends Number {
    constructor(...args) {
        super(...args);
    }

    toString() {
        //  Multiply by 100 (convert to cents) to work with integers
        let v = Math.round(this.valueOf()*100);

        let sym = USDollar.CURRENCY_SYMBOL;

        //  Unique zero-value case requires no further formatting
        if(v === 0)
            return `${sym}0.00`;

        //  Convert to string for formatting
        let str = v.toString();

        //  Replace minus (-) sign with parenthesis if value is negative
        let p = ['', ''];
        if(v < 0) {
            str = str.replace('-', '');
            p = ['(', ')'];
        }

        //  Pad with zeros to two decimal places
        if(Math.abs(v)<10) {
            str = `0${str}`;
        }

        //  Left-pad with a zero if necessary
        //    - Must check absolute value
        if(Math.abs(v) < 100)
            return `${p[0]}${sym}0.${str}${p[1]}`;

        //  Insert a decimal point before the final two digits
        return `${p[0]}${sym}${str.slice(0, -2)}.${str.slice(-2)}${p[1]}`;
    }
    toJSON() {
        return this.valueOf();
    }
}
USDollar.CURRENCY_SYMBOL = '$';