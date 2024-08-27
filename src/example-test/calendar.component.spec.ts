import {
    ComponentFixture,
    TestBed,
    tick,
    fakeAsync,
} from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { TranslocoModule } from '@ngneat/transloco';
import { MaterialModule } from '@material/material.module';
import { MaterialClientService } from '@material/data-services/material-client.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { format } from 'date-fns';
import { CalendarDay } from '@shared/components/calendar/calendar';
import { firstValueFrom, of } from 'rxjs';
import { ChangeDetectionStrategy, Component } from '@angular/core';

describe('CalendarComponent', () => {
    let component: CalendarComponent<string>;
    let fixture: ComponentFixture<CalendarComponent<string>>;
    let nativeElement: HTMLElement;

    const testDate = new Date(2022, 1, 1);

    const materialServiceMock = {
        getLanguage: () => of({}),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CalendarComponent],
            imports: [
                TranslocoModule,
                MaterialModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
            ],
            providers: [
                {
                    provide: MaterialClientService,
                    useValue: materialServiceMock,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CalendarComponent<string>);
        component = fixture.componentInstance;
        component.date = undefined;
        component.minDate = undefined;
        component.contextGetterCallback = () => null;
        component.weekdays = [];
        fixture.detectChanges();
        nativeElement = fixture.debugElement.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('method "todayString" should have format date "LLLL yyyy"', () => {
        component.date = testDate;
        fixture.detectChanges();
        const result = 'February 2022';
        expect(component.todayString).toBe(result);
        const h3 = nativeElement.querySelector('h3')!;
        expect(h3.textContent).toContain(result);
    });

    it('should display count days of week', () => {
        const divs = fixture.debugElement.query(By.css('.days')).children;
        expect(divs.length).toEqual(7);
    });

    it('array weekdays should structure of Weekday', () => {
        const mockDays = [
            { full: 'Monday', abbr: 'Mo' },
            { full: 'Tuesday', abbr: 'Tu' },
            { full: 'Wednesday', abbr: 'We' },
            { full: 'Thursday', abbr: 'Th' },
            { full: 'Friday', abbr: 'Fr' },
            { full: 'Saturday', abbr: 'Sa' },
            { full: 'Sunday', abbr: 'Su' },
        ];
        expect(component.weekdays).toEqual(mockDays);
    });

    it('should change action', fakeAsync(() => {
        const result = 'today';
        firstValueFrom(component.action).then((action) => {
            expect(action).toBe(result);
        });
        component.date = testDate;
        const divToday = nativeElement.querySelector(
            '.today'
        ) as HTMLButtonElement;
        divToday.click();
        tick();
    }));

    it('should click button prevMonth', fakeAsync(() => {
        component.date = testDate;
        fixture.detectChanges();
        const divPrev = nativeElement.querySelector('.dprev') as HTMLDivElement;
        divPrev.click();
        tick();
        const prev = component.todayString;
        expect(prev).toBe('January 2022');
        const h3 = nativeElement.querySelector('h3')!;
        expect(h3.textContent).toContain('January 2022');
    }));

    it('should click button nextMonth', fakeAsync(() => {
        component.date = testDate;
        fixture.detectChanges();
        const divNext = nativeElement.querySelector('.dnext') as HTMLDivElement;
        divNext.click();
        tick();
        const next = component.todayString;
        expect(next).toBe('March 2022');
        let h3 = nativeElement.querySelector('h3')!;
        expect(h3.textContent).toContain('March 2022');
    }));

    it('method contextGetterCallback should be work out correctly', () => {
        const dayContext = {
            value: new Date(),
            name: '',
            outsideOfBounds: true,
        };
        expect(component.contextGetterCallback(dayContext)).toBeNull();
        component.contextGetterCallback = () => 'test';
        fixture.detectChanges();
        expect(component.contextGetterCallback(dayContext)).toBe('test');
    });

    it('should click button today', fakeAsync(() => {
        component.date = testDate;
        fixture.detectChanges();
        const divToday = nativeElement.querySelector(
            '.today'
        ) as HTMLButtonElement;
        divToday.click();
        tick();
        const today = component.todayString;
        const mock = format(new Date(), 'LLLL yyyy');
        expect(today).toBe(mock);
    }));
});

@Component({
    selector: 'app-test-template',
    template: `<app-calendar
        [date]="testDate"
        (daySelected)="daySelectedHandler($event)"
    >
        <ng-template dayTemplate let-dayContext>
            <ng-container>
                <div style="width: 100px">test</div>
            </ng-container>
        </ng-template>
    </app-calendar>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestTemplateComponent {
    protected testDate = new Date(2022, 1, 1);
    daySelected: CalendarDay | null = null;
    protected daySelectedHandler(event: CalendarDay): void {
        this.daySelected = event;
    }
}

describe('TestTemplateComponent', () => {
    let component: TestTemplateComponent;
    let fixture: ComponentFixture<TestTemplateComponent>;
    let nativeElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestTemplateComponent, CalendarComponent],
            imports: [TranslocoModule, MaterialModule, HttpClientTestingModule],
        });
        fixture = TestBed.createComponent(TestTemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        nativeElement = fixture.debugElement.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should choose first day in calendar', fakeAsync(() => {
        expect(component.daySelected).toBeNull();
        const mockCalendarDay = {
            value: new Date('2021-12-26T00:00:00'),
            name: '26',
            outsideOfBounds: false,
        };
        const divPrev = <HTMLDivElement>nativeElement.querySelector('.dprev');
        divPrev.click();
        tick();
        const dayDiv = nativeElement.querySelector('.day') as HTMLDivElement;
        dayDiv.click();
        tick();
        expect(component.daySelected).toEqual(mockCalendarDay);
    }));
});
