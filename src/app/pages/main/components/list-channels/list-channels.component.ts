import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Channel } from '@core/data-contracts/models';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-list-channels',
    standalone: true,
    imports: [CommonModule, Button, ProgressSpinnerModule],
    templateUrl: './list-channels.component.html',
    styleUrl: './list-channels.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListChannelsComponent {
    @Input({ required: true }) channels: Channel[] | null = [];
    @Output() newChannel = new EventEmitter<void>();
    @Output() selectChannel = new EventEmitter<Channel>();
    @Input() loading: boolean | null = false;

    protected selectedChannel: Channel | null = null;

    protected chooseChannel(channel: Channel) {
        this.selectedChannel = channel;
        this.selectChannel.emit(channel);
    }

    protected addChannel(): void {
        this.newChannel.emit();
    }
}
