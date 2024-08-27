import {
    getDaysForMonth,
    getDaysForWeek,
    getMonthsName,
    getToday,
} from '@shared/components/calendar/calendar';
import { enUS } from 'date-fns/locale';
import { TestBed } from '@angular/core/testing';

interface ICalendar {
    value: Date;
    name: string;
    outsideOfBounds: boolean;
}

describe('Functions for calendar', () => {
    const testDate = new Date(2022, 0, 31);
    const mockArray = (): Array<Array<ICalendar>> => {
        const array: Array<Array<ICalendar>> = [];
        const date: Date = new Date(2022, 0, 31);
        for (let i = 0; i < 6; i++) {
            const row: Array<ICalendar> = [];
            for (let j = 0; j < 7; j++) {
                row.push({
                    value: new Date(date),
                    name: date.getDate().toString(),
                    outsideOfBounds: false,
                });
                date.setDate(date.getDate() + 1);
            }
            array.push(row);
        }
        return array;
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({}).compileComponents();
    });

    it('method getDaysForMonth', () => {
        let mockResult = mockArray().map((value) => {
            return [...value];
        });

        mockResult.forEach((value) => {
            value.forEach((el) => {
                el.outsideOfBounds = false;
            });
        });

        const arrayResultWithoutOptions = getDaysForMonth(new Date(2022, 1, 3));
        expect(arrayResultWithoutOptions).toEqual(mockResult);
        const arrayResult = getDaysForMonth(new Date(2022, 1, 3), {
            predicate: () => false,
        });

        mockResult.forEach((value) => {
            value.forEach((el) => {
                el.outsideOfBounds = true;
            });
        });

        expect(arrayResult).toEqual(mockResult);
    });

    it('method getMonthsName', () => {
        const mockResultWithoutOptions = [
            {
                name: 'Январь',
                value: 0,
                outsideOfBounds: false,
            },
            {
                name: 'Февраль',
                value: 1,
                outsideOfBounds: false,
            },
            {
                name: 'Март',
                value: 2,
                outsideOfBounds: false,
            },
            {
                name: 'Апрель',
                value: 3,
                outsideOfBounds: false,
            },
            {
                name: 'Май',
                value: 4,
                outsideOfBounds: false,
            },
            {
                name: 'Июнь',
                value: 5,
                outsideOfBounds: false,
            },
            {
                name: 'Июль',
                value: 6,
                outsideOfBounds: false,
            },
            {
                name: 'Август',
                value: 7,
                outsideOfBounds: false,
            },
            {
                name: 'Сентябрь',
                value: 8,
                outsideOfBounds: false,
            },
            {
                name: 'Октябрь',
                value: 9,
                outsideOfBounds: false,
            },
            {
                name: 'Ноябрь',
                value: 10,
                outsideOfBounds: false,
            },
            {
                name: 'Декабрь',
                value: 11,
                outsideOfBounds: false,
            },
        ];
        const resultWithoutOptions = getMonthsName(testDate);
        expect(resultWithoutOptions).toEqual(mockResultWithoutOptions);
        const mokResult = [
            {
                name: 'January',
                value: 0,
                outsideOfBounds: true,
            },
            {
                name: 'February',
                value: 1,
                outsideOfBounds: true,
            },
            {
                name: 'March',
                value: 2,
                outsideOfBounds: true,
            },
            {
                name: 'April',
                value: 3,
                outsideOfBounds: true,
            },
            {
                name: 'May',
                value: 4,
                outsideOfBounds: true,
            },
            {
                name: 'June',
                value: 5,
                outsideOfBounds: true,
            },
            {
                name: 'July',
                value: 6,
                outsideOfBounds: true,
            },
            {
                name: 'August',
                value: 7,
                outsideOfBounds: true,
            },
            {
                name: 'September',
                value: 8,
                outsideOfBounds: true,
            },
            {
                name: 'October',
                value: 9,
                outsideOfBounds: true,
            },
            {
                name: 'November',
                value: 10,
                outsideOfBounds: true,
            },
            {
                name: 'December',
                value: 11,
                outsideOfBounds: true,
            },
        ];
        const result = getMonthsName(testDate, {
            locale: enUS,
            predicate: () => false,
        });
        expect(result).toEqual(mokResult);
    });

    it('method getToday should equal new Date()', () => {
        expect(getToday()).toEqual(new Date());
    });

    it('method getDaysForWeek should return array CalendarDay', () => {
        let mockResult = [...mockArray()[0]];

        mockResult = mockResult.map((value) => {
            value.outsideOfBounds = false;
            return value;
        });

        const arrayCalendarDayWithoutOptions = getDaysForWeek(testDate);
        expect(arrayCalendarDayWithoutOptions).toEqual(mockResult);
        const arrayCalendarDay = getDaysForWeek(testDate, {
            locale: enUS,
            predicate: () => false,
        });

        mockResult = mockResult.map((value) => {
            value.outsideOfBounds = true;
            return value;
        });

        expect(arrayCalendarDay).toEqual(mockResult);
    });
});
