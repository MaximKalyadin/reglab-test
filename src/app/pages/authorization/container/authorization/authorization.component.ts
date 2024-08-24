import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthorizationClientService } from '../../data-services/authorization-client.service';
import { AuthorizationStoreService } from '../../data-services/authorization-store.service';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Button } from 'primeng/button';
import { Observable } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { AuthForm } from '../../models/types';

@Component({
    selector: 'app-authorization',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        Button,
        ProgressSpinnerModule,
        CommonModule,
    ],
    templateUrl: './authorization.component.html',
    styleUrl: './authorization.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AuthorizationClientService, AuthorizationStoreService],
})
export class AuthorizationComponent {
    protected readonly authForm: AuthForm;

    protected readonly isLoading$: Observable<boolean>;

    constructor(private readonly store: AuthorizationStoreService) {
        this.isLoading$ = store.isLoading$;
        this.authForm = store.authForm;
    }

    protected signIn(): void {
        this.store.signIn(this.authForm.getRawValue());
    }
}
