import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MainClientService } from '../../data-services/main-client.service';
import { MainStoreService } from '../../data-services/main-store.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Channel, User } from '@core/data-contracts/models';
import { MiniProfileComponent } from '../../components/mini-profile/mini-profile.component';
import { UsersComponent } from '../../components/users/users.component';
import { ListChannelsComponent } from '../../components/list-channels/list-channels.component';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        CommonModule,
        MiniProfileComponent,
        UsersComponent,
        ListChannelsComponent,
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

    constructor(private readonly store: MainStoreService) {
        this.user$ = store.user$;
        this.users$ = store.users$;
        this.isLoadingCreateUser$ = store.isLoadingCreateUser$;
        this.isLoadingCreateChannel$ = store.isLoadingCreateChannel$;
        this.channels$ = store.channels$;
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

    protected newChannel(): void {}

    protected selectedChannel(channel: Channel): void {}
}
