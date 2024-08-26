import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Channel, Message, User } from '@core/data-contracts/models';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [
        InputTextModule,
        PaginatorModule,
        ReactiveFormsModule,
        Button,
        CommonModule,
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
    @Input({ required: true }) channel: Channel | null = null;
    @Input({ required: true }) messages: Message[] | null = [];
    @Input({ required: true }) users: User[] | null = [];
    @Input({ required: true }) user: User | null = null;

    @Output() sendMessage = new EventEmitter<string>();

    protected messageControl: FormControl<string> = new FormControl('', {
        nonNullable: true,
    });

    protected send(): void {
        if (this.messageControl.value) {
            this.sendMessage.emit(this.messageControl.value);
            this.messageControl.setValue('');
        }
    }

    protected getAuthor(message: Message): string {
        const author = this.users?.find(
            value => value.id === message.from_user
        );

        if (author) {
            return author.username;
        }

        return '';
    }

    protected isMy(message: Message): boolean {
        return message.from_user === this?.user?.id;
    }

    protected isNone(currentIndex: number): boolean {
        return !!(
            this.messages &&
            currentIndex > 0 &&
            this.messages[currentIndex].from_user ===
                this.messages[currentIndex - 1].from_user
        );
    }
}
