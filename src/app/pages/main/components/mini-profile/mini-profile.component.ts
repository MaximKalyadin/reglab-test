import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { User } from '@core/data-contracts/models';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-mini-profile',
    standalone: true,
    imports: [Button, RouterLink],
    templateUrl: './mini-profile.component.html',
    styleUrl: './mini-profile.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniProfileComponent {
    @Input({ required: true }) user: User | null = null;
    @Output() logoutEvent = new EventEmitter<void>();

    protected logout(): void {
        this.logoutEvent.emit();
    }
}
