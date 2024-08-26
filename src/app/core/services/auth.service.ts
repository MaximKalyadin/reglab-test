import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { User } from '@core/data-contracts/models';
import { Router } from '@angular/router';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

// также использую компонентный стор, чтоб запрашивать данные через эффект и хранить пользователя
interface AuthState {
    user: User | null;
}

const defaultState: AuthState = {
    user: null,
};
@Injectable({
    providedIn: 'root',
})
export class AuthService extends ComponentStore<AuthState> {
    #userKeyInLocalStorage = 'user';

    readonly user$: Observable<User | null> = this.select(state => state.user);

    constructor(
        private readonly router: Router,
        private readonly http: HttpClient
    ) {
        super(defaultState);

        const user = localStorage.getItem('user');
        if (user) {
            this.setUser(JSON.parse(user) as User);
        }
    }

    logout(): void {
        this.patchState({
            user: null,
        });
        const user = localStorage.getItem('user');
        if (user) {
            this.changeUserOnline({
                ...JSON.parse(user),
                is_online: false,
            });
        }
        localStorage.removeItem(this.#userKeyInLocalStorage);
        this.router.navigateByUrl('/login');
    }

    readonly setUser = this.updater((state, user: User | null) => {
        state.user = user;
        localStorage.setItem(this.#userKeyInLocalStorage, JSON.stringify(user));
        return state;
    });

    readonly changeUserOnline = this.effect((action$: Observable<User>) => {
        return action$.pipe(
            switchMap(user => {
                if (!user.id) {
                    return EMPTY;
                }

                return this.http
                    .patch<User>(
                        `${environment.baseUrl}/users/${user.id}`,
                        {
                            is_online: user.is_online,
                        },
                        {}
                    )
                    .pipe(
                        catchError(err => {
                            return EMPTY;
                        })
                    );
            }),
            tap(user => {
                this.setUser(user);
            })
        );
    });
}
