/** Manipulates Date and Time to make conversions */
export default abstract class DateTimeConverter{

    /** Days of the week string */
    public static readonly days = [
        "Sundays",
        "Mondays",
        "Tuesdays",
        "Wednesdays",
        "Thursdays",
        "Fridays",
        "Saturdays"
    ];

    /**
     * 
     * @param day Day of the week where sunday = 0, saturday = 6
     * @param time Time in format 24h
     * @param UTCOffset UTC offset in format "UTC+x"
     * where x is the UTC offset value
     * @returns Date corresponding to the day in the current week in the local 
     * UTC format
     */
    public static getCurrentWeekDateTime(
        day: number,
        time: string,
        UTCOffset: string): Date {

        let now = new Date();    
        now.setDate(now.getDate() + (7 + day - now.getDay() - 1) % 7 + 1);
        let dt = new Date(
            `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()} ` + 
            `${time}:00 ${UTCOffset}`
        );
        return dt;
    }

    /**
     * Takes in a day as an int and returns its corresponding string
     * ex: 1 returns "Monday"
     * @param string  
     * @returns 
     */
    public static dayIntToString(int: number) {
        return DateTimeConverter.days[int];
    }

    /**
     * Takes in a dat as a string and returns its corresponding integer
     * ex: "Monday" returns 1
     * @param string  
     * @returns 
     */
    public static dayStrToInt(string: string) {
        return DateTimeConverter.days.indexOf(string);
    }

}