export default class DateTimeUtils {

    static parseDate(dateStr: string): Date {
        const [month, day, year] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    static compareDates(dateStr1: string, dateStr2: string): number {
        const date1 = this.parseDate(dateStr1);
        const date2 = this.parseDate(dateStr2);

        if (date1 < date2) {
            return -1; // dateStr1 is smaller
        } else if (date1 > date2) {
            return 1; // dateStr1 is larger
        } else {
            return 0; // both dates are equal
        }
    }
}
