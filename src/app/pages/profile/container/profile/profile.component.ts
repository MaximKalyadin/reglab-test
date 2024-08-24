import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProfileClientService } from '../../data-services/profile-client.service';
import { ProfileStoreService } from '../../data-services/profile-store.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        FormsModule,
        InputTextModule,
        Button,
        ReactiveFormsModule,
        AsyncPipe,
        ProgressSpinnerModule,
        RouterLink,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ProfileClientService, ProfileStoreService],
})
export class ProfileComponent {
    protected readonly isLoading$: Observable<boolean>;

    protected readonly username: FormControl<string>;

    constructor(private readonly store: ProfileStoreService) {
        this.username = store.username;
        this.isLoading$ = store.isLoading$;
    }

    protected changeUserName(): void {
        this.store.changeUserName(this.username.value);
    }

    protected logout(): void {
        this.store.logout();
    }
}
