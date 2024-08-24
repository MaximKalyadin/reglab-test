import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { User } from '@core/data-contracts/models';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, Button, ProgressSpinnerModule],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
    @Input({ required: true }) users: User[] | null = [];
    @Input() loading: boolean | null = false;
    @Output() newUser = new EventEmitter<void>();

    protected addUser(): void {
        this.newUser.emit();
    }
}
