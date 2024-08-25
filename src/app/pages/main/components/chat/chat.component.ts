import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Channel, User } from '@core/data-contracts/models';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [InputTextModule, PaginatorModule, ReactiveFormsModule, Button],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
    @Input({ required: true }) channel: Channel | null = null;
    @Input({ required: true }) messages: Message[] | null = [];
    @Input({ required: true }) users: User[] | null = [];

    @Output() sendMessage = new EventEmitter<string>();

    protected messageControl: FormControl<string> = new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
    });

    protected send(): void {
        if (this.messageControl.value) {
            this.sendMessage.emit(this.messageControl.value);
        }
    }
}
