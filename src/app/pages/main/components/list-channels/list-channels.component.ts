import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Channel } from '@core/data-contracts/models';

@Component({
    selector: 'app-list-channels',
    standalone: true,
    imports: [],
    templateUrl: './list-channels.component.html',
    styleUrl: './list-channels.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListChannelsComponent {
    @Input({ required: true }) channels: Channel[] = [];
    @Output() newChannel = new EventEmitter<void>();
    @Output() selectChannel = new EventEmitter<Channel>();

    protected chooseChannel(channel: Channel) {
        this.selectChannel.emit(channel);
    }

    protected addChannel(): void {
        this.newChannel.emit();
    }
}
