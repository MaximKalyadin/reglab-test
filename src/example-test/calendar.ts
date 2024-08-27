import {
    addDays,
    addMonths,
    endOfMonth,
    endOfWeek,
    format,
    getMonth,
    Locale,
    startOfMonth,
    startOfWeek,
    startOfYear,
} from 'date-fns';
import ru from 'date-fns/locale/ru';

const DEFAULT_DATE_PREDICATE = () => true;

export interface CalendarDay {
    value: Date;
    /** Localized name */
    name: string;
    /** If the value did not pass predicate check */
    outsideOfBounds: boolean;
}

export interface Weekday {
    full: string;
    abbr: string;
}

export interface CalendarMonth {
    value: number;
    /** Localized name */
    name: string;
    /** If the value did not pass predicate check */
    outsideOfBounds: boolean;
}

export interface LocaleOptions {
    locale?: Locale;
}

export interface DatePredicateOptions {
    predicate?: DatePredicate;
}

export interface DatePredicate {
    (value: Date): boolean;
}

export enum ECalendarAction {
    nextMonth = 'nextMonth',
    prevMonth = 'prevMonth',
    today = 'today',
}

export function* getWeekDayNames(
    from: Date,
    options?: LocaleOptions & { full?: boolean }
) {
    const weekStartDate = startOfWeek(from, { locale: ru });

    for (let day = 0; day < 7; day++) {
        const name = format(
            addDays(weekStartDate, day),
            options?.full ? 'EEEE' : 'EEEEEE',
            { locale: options?.locale ?? ru }
        );
        if (options?.full) {
            yield name[0].toLocaleUpperCase() + name.slice(1);
        } else {
            yield name;
        }
    }
}

export function getDaysForWeek(
    date: Date,
    options?: LocaleOptions & DatePredicateOptions
): CalendarDay[] {
    if (!options) options = {};
    if (!options.predicate) options.predicate = DEFAULT_DATE_PREDICATE;

    let currentDate = date;
    const week: CalendarDay[] = [];

    for (let day = 0; day < 7; day++) {
        week.push({
            value: currentDate,
            name: format(currentDate, 'd', { locale: options?.locale ?? ru }),
            outsideOfBounds: !options.predicate(currentDate),
        });
        currentDate = addDays(currentDate, 1);
    }
    return week;
}

export function getDaysForMonth(
    from: Date,
    options?: LocaleOptions & DatePredicateOptions
): CalendarDay[][] {
    if (!options) options = {};
    if (!options.predicate) options.predicate = DEFAULT_DATE_PREDICATE;

    const startOfTheSelectedMonth = startOfMonth(from);
    const endOfTheSelectedMonth = endOfMonth(from);
    const startDate = startOfWeek(startOfTheSelectedMonth, {
        locale: options?.locale ?? ru,
    });
    const endDate = endOfWeek(endOfTheSelectedMonth, {
        locale: options?.locale ?? ru,
    });

    let currentDate = startDate;

    const allWeeks: CalendarDay[][] = [];

    while (currentDate <= endDate) {
        allWeeks.push(getDaysForWeek(currentDate, options));
        currentDate = addDays(currentDate, 7);
    }

    if (allWeeks.length === 5) {
        allWeeks.push(getDaysForWeek(currentDate, options));
    }

    return allWeeks;
}

export function getMonthsName(
    start: Date,
    options?: LocaleOptions & DatePredicateOptions
): CalendarMonth[] {
    if (!options) options = {};
    if (!options.predicate) options.predicate = DEFAULT_DATE_PREDICATE;

    const date = startOfYear(start);

    return Array.from({ length: 12 }).map((_, index) => {
        const value = addMonths(date, index);
        const name = format(value, 'LLLL', { locale: options?.locale ?? ru });

        return {
            name: name[0].toLocaleUpperCase() + name.slice(1),
            value: getMonth(value),
            outsideOfBounds: !options!.predicate!(value),
        };
    });
}

export function getToday(): Date {
    return new Date();
}
