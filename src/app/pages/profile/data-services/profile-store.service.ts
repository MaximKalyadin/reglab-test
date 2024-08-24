import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { ProfileClientService } from './profile-client.service';
import { FormControl, Validators } from '@angular/forms';
import {
    catchError,
    EMPTY,
    Observable,
    switchMap,
    tap,
    withLatestFrom,
} from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/data-contracts/models';

export interface ProfileState {
    isLoading: boolean;
    user: User | null;
}

const defaultState: ProfileState = {
    isLoading: false,
    user: null,
};

@Injectable()
export class ProfileStoreService extends ComponentStore<ProfileState> {
    readonly username = new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
    });

    readonly isLoading$: Observable<boolean> = this.select(
        state => state.isLoading
    );

    constructor(
        private readonly client: ProfileClientService,
        private readonly authService: AuthService
    ) {
        super(defaultState);

        this.effect(() => {
            return authService.user$.pipe(
                tap(user => {
                    this.patchState({
                        user: user,
                    });
                    this.username.setValue(user?.username || '');
                })
            );
        });
    }

    readonly changeUserName = this.effect((action$: Observable<string>) => {
        return action$.pipe(
            withLatestFrom(this.state$),
            switchMap(([username, state]) => {
                if (!username || !state.user) {
                    return EMPTY;
                }

                this.patchState({
                    isLoading: true,
                });

                return this.client.changeUserName(state.user, username).pipe(
                    catchError(err => {
                        this.username.setErrors({ error: true });
                        this.patchState({
                            isLoading: false,
                        });
                        return EMPTY;
                    })
                );
            }),
            tap(user => {
                this.patchState({
                    isLoading: false,
                });
                this.authService.setUser(user);
            })
        );
    });

    logout(): void {
        this.authService.logout();
    }
}
