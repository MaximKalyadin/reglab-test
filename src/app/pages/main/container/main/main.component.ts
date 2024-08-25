import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MainClientService } from '../../data-services/main-client.service';
import { MainStoreService } from '../../data-services/main-store.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Channel, Message, User } from '@core/data-contracts/models';
import { MiniProfileComponent } from '../../components/mini-profile/mini-profile.component';
import { UsersComponent } from '../../components/users/users.component';
import { ListChannelsComponent } from '../../components/list-channels/list-channels.component';
import { DialogModule } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CreateChannelForm } from '../../models/types';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChatComponent } from '../../components/chat/chat.component';
import { Messages } from 'primeng/messages';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        CommonModule,
        MiniProfileComponent,
        UsersComponent,
        ListChannelsComponent,
        DialogModule,
        Button,
        InputTextModule,
        ReactiveFormsModule,
        MultiSelectModule,
        ProgressSpinnerModule,
        ChatComponent,
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MainClientService, MainStoreService],
})
export class MainComponent implements OnInit {
    protected readonly user$: Observable<User | null>;
    protected readonly users$: Observable<User[]>;
    protected readonly isLoadingCreateUser$: Observable<boolean>;
    protected readonly isLoadingCreateChannel$: Observable<boolean>;
    protected readonly channels$: Observable<Channel[]>;
    protected readonly selectedChannels$: Observable<Channel | null>;
    protected readonly messages$: Observable<Message[]>;
    protected dialogVisible = false;

    protected readonly createChannelForm: CreateChannelForm;

    constructor(private readonly store: MainStoreService) {
        this.user$ = store.user$;
        this.users$ = store.users$;
        this.isLoadingCreateUser$ = store.isLoadingCreateUser$;
        this.isLoadingCreateChannel$ = store.isLoadingCreateChannel$;
        this.channels$ = store.channels$;
        this.selectedChannels$ = store.selectedChannels$;
        this.createChannelForm = store.createChannelForm;
        this.messages$ = store.messages$;
    }

    ngOnInit() {
        this.store.getUsers();
        this.store.getUserChannel();
    }

    protected logout(): void {
        this.store.logout();
    }

    protected addUser(): void {
        this.store.addUser();
    }

    protected newChannel(): void {
        this.dialogVisible = true;
    }

    protected selectedChannel(channel: Channel): void {
        this.store.seSelectedChannel(channel);
    }

    protected saveChannel(): void {
        this.store.addChannel();
    }

    protected sendMessage(message: string): void {}
}
