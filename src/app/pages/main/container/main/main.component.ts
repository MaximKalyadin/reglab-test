import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MainClientService } from '../../data-services/main-client.service';
import { MainStoreService } from '../../data-services/main-store.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '@core/data-contracts/models';
import { MiniProfileComponent } from '../../components/mini-profile/mini-profile.component';
import { UsersComponent } from '../../components/users/users.component';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [CommonModule, MiniProfileComponent, UsersComponent],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MainClientService, MainStoreService],
})
export class MainComponent implements OnInit {
    protected readonly user$: Observable<User | null>;
    protected readonly users$: Observable<User[]>;
    protected readonly isLoadingCreateUser$: Observable<boolean>;

    constructor(private readonly store: MainStoreService) {
        this.user$ = store.user$;
        this.users$ = store.users$;
        this.isLoadingCreateUser$ = store.isLoadingCreateUser$;
    }

    ngOnInit() {
        this.store.getUsers();
    }

    protected logout(): void {
        this.store.logout();
    }

    protected addUser(): void {
        this.store.addUser();
    }
}
