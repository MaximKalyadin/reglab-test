import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { User } from '@core/data-contracts/models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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

    constructor(private readonly router: Router) {
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
        localStorage.removeItem(this.#userKeyInLocalStorage);
        this.router.navigateByUrl('/login');
    }

    readonly setUser = this.updater((state, user: User | null) => {
        state.user = user;
        localStorage.setItem(this.#userKeyInLocalStorage, JSON.stringify(user));
        return state;
    });
}
