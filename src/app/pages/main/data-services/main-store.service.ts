import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { MainClientService } from './main-client.service';
import { AuthService } from '@core/services/auth.service';
import {
    catchError,
    EMPTY,
    map,
    mergeMap,
    Observable,
    switchMap,
    tap,
    withLatestFrom,
} from 'rxjs';
import { Channel, User } from '@core/data-contracts/models';

interface MainState {
    user: User | null;
    users: User[];
    channels: Channel[];
    isLoadingCreateUser: boolean;
    isLoadingCreateChannel: boolean;
}

const defaultState: MainState = {
    user: null,
    users: [],
    channels: [],
    isLoadingCreateUser: false,
    isLoadingCreateChannel: false,
};

@Injectable()
export class MainStoreService extends ComponentStore<MainState> {
    readonly user$: Observable<User | null> = this.select(state => state.user);
    readonly users$: Observable<User[]>;

    readonly isLoadingCreateUser$: Observable<boolean> = this.select(
        state => state.isLoadingCreateUser
    );

    readonly isLoadingCreateChannel$: Observable<boolean> = this.select(
        state => state.isLoadingCreateUser
    );

    readonly channels$: Observable<Channel[]> = this.select(
        state => state.channels
    );

    constructor(
        private readonly client: MainClientService,
        private readonly auth: AuthService
    ) {
        super(defaultState);

        this.effect(() => {
            return this.auth.user$.pipe(
                tap(user => {
                    this.patchState({
                        user: user,
                    });
                })
            );
        });

        this.users$ = this.select(state => state.users).pipe(
            withLatestFrom(this.state$),
            map(([users, state]) => {
                return users.filter(user => user.id !== state.user?.id);
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

    readonly getChannel = this.effect((action$: Observable<number>) => {
        return action$.pipe(
            mergeMap(id => {
                if (!id) {
                    return EMPTY;
                }

                return this.client.getChannel(id).pipe(
                    catchError(err => {
                        return EMPTY;
                    })
                );
            }),
            withLatestFrom(this.state$),
            tap(([channel, state]) => {
                if (channel.length) {
                    this.patchState({
                        channels: [...state.channels, channel[0]],
                    });
                }
            })
        );
    });

    readonly getUserChannel = this.effect((action$: Observable<void>) => {
        return action$.pipe(
            withLatestFrom(this.state$),
            switchMap(([_, state]) => {
                if (!state.user) {
                    return EMPTY;
                }

                return this.client.getUserChannel(state.user.id).pipe(
                    catchError(err => {
                        return EMPTY;
                    })
                );
            }),
            tap(userChannels => {
                userChannels.forEach(value => {
                    this.getChannel(value.channel_id);
                });
            })
        );
    });

    logout(): void {
        this.auth.logout();
    }
}
