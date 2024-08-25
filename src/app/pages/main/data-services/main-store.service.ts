import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { MainClientService } from './main-client.service';
import { AuthService } from '@core/services/auth.service';
import {
    catchError,
    concatMap,
    EMPTY,
    map,
    mergeMap,
    Observable,
    switchMap,
    tap,
    withLatestFrom,
} from 'rxjs';
import {
    Channel,
    Message,
    User,
    UserChannel,
} from '@core/data-contracts/models';
import { CreateChannelForm } from '../models/types';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface MainState {
    user: User | null;
    users: User[];
    channels: Channel[];
    userChannel: UserChannel[];
    selectedChannel: Channel | null;
    messages: Message[];
    isLoadingCreateUser: boolean;
    isLoadingCreateChannel: boolean;
}

const defaultState: MainState = {
    user: null,
    users: [],
    channels: [],
    userChannel: [],
    messages: [],
    selectedChannel: null,
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

    readonly selectedChannels$: Observable<Channel | null> = this.select(
        state => state.selectedChannel
    );

    readonly messages$: Observable<Message[]> = this.select(
        state => state.messages
    );

    readonly createChannelForm: CreateChannelForm;

    constructor(
        private readonly client: MainClientService,
        private readonly auth: AuthService
    ) {
        super(defaultState);

        this.createChannelForm = new FormGroup({
            users: new FormControl<User[]>([], {
                nonNullable: true,
                validators: [Validators.required],
            }),
            name: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

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

    readonly seSelectedChannel = this.updater((state, channel: Channel) => {
        state.selectedChannel = channel;
        this.getMessages(channel);
        return state;
    });

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

                const id = Math.random();

                return this.client
                    .addNewUser({
                        id: undefined,
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

    readonly getChannel = this.effect((action$: Observable<string>) => {
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

                return this.client.getUserChannel(state.user?.id || '').pipe(
                    catchError(err => {
                        return EMPTY;
                    })
                );
            }),
            tap(userChannels => {
                this.patchState({
                    userChannel: userChannels,
                });
                userChannels.forEach(value => {
                    this.getChannel(value.channel_id);
                });
            })
        );
    });

    readonly addChannel = this.effect((action$: Observable<void>) => {
        return action$.pipe(
            withLatestFrom(this.state$),
            switchMap(([_, state]) => {
                this.patchState({
                    isLoadingCreateChannel: true,
                });

                return this.client
                    .addNewChannel({
                        id: undefined,
                        name: this.createChannelForm.controls.name.value,
                    })
                    .pipe(
                        catchError(err => {
                            this.patchState({
                                isLoadingCreateChannel: false,
                            });
                            return EMPTY;
                        })
                    );
            }),
            withLatestFrom(this.state$),
            tap(([channel, state]) => {
                this.patchState({
                    isLoadingCreateChannel: false,
                    channels: [...state.channels, channel],
                });

                this.createChannelForm.controls.users.value.forEach(user => {
                    this.addUserChannel({
                        channel_id: channel?.id || '',
                        user_id: user?.id || '',
                        id: undefined,
                    });
                });

                this.addUserChannel({
                    channel_id: channel.id || '',
                    user_id: state?.user?.id || '',
                    id: undefined,
                });
            })
        );
    });

    readonly addUserChannel = this.effect(
        (action$: Observable<UserChannel>) => {
            return action$.pipe(
                concatMap(userChannel => {
                    if (!userChannel.channel_id || !userChannel.user_id) {
                        return EMPTY;
                    }
                    this.patchState({
                        isLoadingCreateChannel: true,
                    });
                    return this.client
                        .addNewUSerChannel({
                            ...userChannel,
                        })
                        .pipe(
                            catchError(err => {
                                this.patchState({
                                    isLoadingCreateChannel: false,
                                });
                                return EMPTY;
                            })
                        );
                }),
                withLatestFrom(this.state$),
                tap(([userChannel, state]) => {
                    this.patchState({
                        isLoadingCreateChannel: false,
                        userChannel: [...state.userChannel, userChannel],
                    });
                })
            );
        }
    );

    readonly getMessages = this.effect((action$: Observable<Channel>) => {
        return action$.pipe(
            switchMap(channel => {
                return this.client.getMessages(channel).pipe(
                    catchError(err => {
                        return EMPTY;
                    })
                );
            }),
            tap(messages => {
                this.patchState({
                    messages: messages,
                });
            })
        );
    });

    logout(): void {
        this.auth.logout();
    }
}
