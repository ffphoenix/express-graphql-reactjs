/**
 * Calculate request summ.
 * 
 * @param {object} item 
 * @returns 
 * @memberof PropertyRequests
 */
export function summRentalCalculate(item) {
    let sum = 0;

    const perStaySum = item.number_of_nights * item.rate_per_night;

    const guestSum = item.additional_guests_fee_per_night * item.number_of_nights;

    const cleaningSum = item.cleaning_fee_per_night * item.number_of_nights;

    sum = perStaySum + (item.tax * perStaySum / 100) + guestSum + cleaningSum;
    const totalSum =  sum ? sum.toFixed(2) : 0;

    sum = item.tax * totalSum / 100;
    const taxSum = sum ? sum.toFixed(2) : 0

    sum = totalSum - taxSum;
    const subtotalSumm = sum ? sum.toFixed(2) : 0;

    return {
        perStaySum: perStaySum,
        guestSum: guestSum,
        cleaningSum: cleaningSum,
        totalSum: totalSum,
        subtotalSumm: subtotalSumm,
        taxSum: taxSum
    }
}