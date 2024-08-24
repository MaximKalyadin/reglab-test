import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { MainClientService } from './main-client.service';
import { AuthService } from '@core/services/auth.service';
import {
    catchError,
    EMPTY,
    map,
    Observable,
    switchMap,
    tap,
    withLatestFrom,
} from 'rxjs';
import { User } from '@core/data-contracts/models';

interface MainState {
    users: User[];
    isLoadingCreateUser: boolean;
}

const defaultState: MainState = {
    users: [],
    isLoadingCreateUser: false,
};

@Injectable()
export class MainStoreService extends ComponentStore<MainState> {
    readonly user$: Observable<User | null>;
    readonly users$: Observable<User[]>;

    isLoadingCreateUser$: Observable<boolean> = this.select(
        state => state.isLoadingCreateUser
    );

    constructor(
        private readonly client: MainClientService,
        private readonly auth: AuthService
    ) {
        super(defaultState);

        this.user$ = auth.user$;

        this.users$ = this.select(state => state.users).pipe(
            withLatestFrom(this.user$),
            map(([users, currentUser]) => {
                return users.filter(user => user.id !== currentUser?.id);
            })
        );
    }

    readonly #updateUsersWithNewUser = this.updater((state, user: User) => ({
        ...state,
        users: [...state.users, user],
    }));

    readonly getUsers = this.effect((action$: Observable<void>) => {
        return action$.pipe(
            switchMap(() => {
                return this.client.getUsers().pipe(
                    catchError(err => {
                        this.patchState({
                            users: [],
                        });
                        return EMPTY;
                    })
                );
            }),
            tap(users => {
                this.patchState({
                    users: users,
                });
            })
        );
    });

    readonly addUser = this.effect((action$: Observable<void>) => {
        return action$.pipe(
            withLatestFrom(this.state$),
            switchMap(([_, state]) => {
                this.patchState({
                    isLoadingCreateUser: true,
                });

                const id =
                    Math.max(
                        ...(state.users.map(value => value.id) as number[])
                    ) + 1;

                return this.client
                    .addNewUser({
                        id: id,
                        is_online: false,
                        password: `test${id}`,
                        username: `test${id}`,
                    })
                    .pipe(
                        catchError(err => {
                            this.patchState({
                                isLoadingCreateUser: false,
                            });
                            return EMPTY;
                        })
                    );
            }),
            tap(user => {
                this.patchState({
                    isLoadingCreateUser: false,
                });
                this.#updateUsersWithNewUser(user);
            })
        );
    });

    logout(): void {
        this.auth.logout();
    }
}
