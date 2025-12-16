
const Billion = 1000000000;
const Million = 1000000;
const Thousand = 1000;

const BillionSymbol = 'B';
const MillionSymbol = 'M';
const ThousandSymbol = 'K';

export const shortFormat = (num = 0.0, currencySymbol = '') => {
    if (num < Thousand) {
        return currencySymbol + num.toFixed(0);
    }

    if (num < Million) {
        let fmtNum = (num / Thousand).toFixed(1);

        if (fmtNum.includes('.0')) {
            fmtNum = (num / Thousand).toFixed(0);
        }

        return currencySymbol + fmtNum + ThousandSymbol;
    }

    if (num < Billion) {
        let fmtNum = (num / Million).toFixed(1);

        if (fmtNum.includes('.0')) {
            fmtNum = (num / Million).toFixed(0);
        }

        return currencySymbol + fmtNum + MillionSymbol;
    }

    let fmtNum = (num / Billion).toFixed(1);

    if (fmtNum.includes('.0')) {
        fmtNum = (num / Billion).toFixed(0);
    }

    return currencySymbol + fmtNum + BillionSymbol;
};
