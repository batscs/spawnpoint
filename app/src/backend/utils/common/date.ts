export default class DateTimeUtils {

    // Parses a date string in the format yyyy-mm-dd to a Date object
    static parseDate(dateStr: string): Date {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day); // Month is 0-indexed in Date object
    }

    // Compares two date strings in the format yyyy-mm-dd
    // Returns -1 if dateStr1 < dateStr2, 1 if dateStr1 > dateStr2, and 0 if they are equal
    static compareDates(dateStr1: string, dateStr2: string): number {
        const date1 = DateTimeUtils.parseDate(dateStr1);
        const date2 = DateTimeUtils.parseDate(dateStr2);

        if (date1 < date2) {
            return -1;
        } else if (date1 > date2) {
            return 1;
        } else {
            return 0;
        }
    }
}
