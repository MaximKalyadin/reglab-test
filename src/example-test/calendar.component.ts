import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
} from '@angular/core';
import { SiteLanguageService } from '@core/services/site-language.service';
import {
    format,
    addMonths,
    subMonths,
    isToday,
    compareAsc,
    subDays,
    isSameMonth,
} from 'date-fns';
import {
    CalendarDay,
    ECalendarAction,
    getDaysForMonth,
    getWeekDayNames,
    Weekday,
} from './calendar';
import { withChangeDetection } from './change-detection';
import { DayNameTemplateDirective } from './day-name-template.directive';
import { DayTemplateDirective } from './day-template.directive';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent<T> implements OnInit {
    @Input({ required: true })
    set date(value: Date | undefined) {
        this.internalDate = value ?? new Date();
        this.cdRef.detectChanges();
    }

    @Input() minDate?: Date;

    @Input() contextGetterCallback: (day: CalendarDay) => T | null = (
        day: CalendarDay
    ) => null;

    @Output()
    daySelected: EventEmitter<CalendarDay> = new EventEmitter();

    @Output() action: EventEmitter<ECalendarAction> = new EventEmitter();

    @ContentChild(DayTemplateDirective, { read: TemplateRef })
    dayTemplateRef?: TemplateRef<{ $implicit: T | null } | null>;

    @ContentChild(DayNameTemplateDirective, { read: TemplateRef })
    dayNameTemplateRef?: TemplateRef<{ $implicit: T | null } | null>;

    get todayString(): string {
        return format(
            this.internalDate,
            'LLLL yyyy',
            this.siteLanguage.getDateFnsLocaleOptions()
        );
    }

    days: CalendarDay[][] = [];
    @Input() weekdays?: Weekday[] = [];

    private internalDate = new Date();
    private initialDate = new Date();

    constructor(
        private readonly cdRef: ChangeDetectorRef,
        private readonly siteLanguage: SiteLanguageService
    ) {}

    ngOnInit(): void {
        this.initialDate = this.internalDate;
        if (!this.weekdays || !this.weekdays.length) {
            this.fillDateWeekNames();
        }
        this.regenerateDates();
    }

    private fillDateWeekNames(): void {
        this.weekdays = [];
        withChangeDetection(() => {
            const fullWeekdays = [
                ...getWeekDayNames(this.internalDate, {
                    full: true,
                    ...this.siteLanguage.getDateFnsLocaleOptions(),
                }),
            ];
            const abbrWeekdays = [
                ...getWeekDayNames(this.internalDate, {
                    full: false,
                    ...this.siteLanguage.getDateFnsLocaleOptions(),
                }),
            ];

            for (let i = 0; i < fullWeekdays.length; i++) {
                this.weekdays?.push({
                    full: fullWeekdays[i],
                    abbr: abbrWeekdays[i],
                });
            }
        }, this.cdRef);
    }

    protected nextMonth(): void {
        withChangeDetection(() => {
            this.setInternalDate(addMonths(this.internalDate, 1));
            this.regenerateDates();
        }, this.cdRef);
        this.action.emit(ECalendarAction.nextMonth);
    }

    protected prevMonth(): void {
        withChangeDetection(() => {
            this.setInternalDate(subMonths(this.internalDate, 1));
            this.regenerateDates();
        }, this.cdRef);

        this.action.emit(ECalendarAction.prevMonth);
    }

    protected setToday(): void {
        withChangeDetection(() => {
            this.setInternalDate(new Date());
            this.regenerateDates();
        }, this.cdRef);
        this.action.emit(ECalendarAction.today);
    }

    protected selectDay(day: CalendarDay): void {
        this.daySelected.emit(day);
    }

    protected isToday(date: Date): boolean {
        return isToday(date);
    }

    protected isPrevDays(date: Date): boolean {
        return compareAsc(date, subDays(this.initialDate, 1)) < 0;
    }

    protected isSameMonth(date: Date): boolean {
        return isSameMonth(date, this.internalDate);
    }

    private setInternalDate(date: Date) {
        this.internalDate = date;
    }

    private regenerateDates() {
        this.days = getDaysForMonth(this.internalDate, {
            locale: this.siteLanguage.getDateFnsLocale(),
            predicate: (value) => (this.minDate ? value >= this.minDate : true),
        });
    }
}
