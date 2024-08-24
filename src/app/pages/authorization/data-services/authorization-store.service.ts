import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { AuthorizationClientService } from './authorization-client.service';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthForm } from '../models/types';
import { AuthService } from '@core/services/auth.service';
import { UsersRequest } from '@core/data-contracts/models';
import { Router } from '@angular/router';

interface State {
    isLoading: boolean;
}

const defaultState: State = {
    isLoading: false,
};

@Injectable()
export class AuthorizationStoreService extends ComponentStore<State> {
    readonly authForm: AuthForm = new FormGroup({
        username: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        password: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    readonly isLoading$: Observable<boolean> = this.select(
        state => state.isLoading
    );

    constructor(
        private readonly client: AuthorizationClientService,
        private readonly auth: AuthService,
        private readonly router: Router
    ) {
        super(defaultState);
    }

    signIn = this.effect((action$: Observable<UsersRequest>) => {
        return action$.pipe(
            switchMap(action => {
                if (!action.username || !action.password) {
                    return EMPTY;
                }

                this.patchState({
                    isLoading: true,
                });

                return this.client.getUser(action).pipe(
                    catchError(err => {
                        this.patchState({
                            isLoading: false,
                        });
                        this.authForm.setErrors({ error: true });
                        return EMPTY;
                    })
                );
            }),
            tap(users => {
                this.patchState({
                    isLoading: false,
                });
                if (!users.length) {
                    this.authForm.setErrors({ error: true });
                } else {
                    this.auth.setUser(users[0]);
                    this.router.navigateByUrl('/Chat');
                }
            })
        );
    });
}
