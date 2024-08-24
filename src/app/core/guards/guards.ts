import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

export const AuthGuard: CanMatchFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const user = localStorage.getItem('user');
    if (!user) {
        authService.logout();
        return router.parseUrl(`/login`);
    }

    return true;
};
