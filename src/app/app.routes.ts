import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/container/main/main.component';
import { AuthGuard } from '@core/guards/guards';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'Chat',
    },
    {
        path: 'Chat',
        loadComponent: () =>
            import('./pages/main/container/main/main.component').then(
                m => m.MainComponent
            ),
        canMatch: [AuthGuard],
    },
    {
        path: 'user',
        loadChildren: () =>
            import('./pages/profile/profile.routes').then(m => m.profileRoute),
        canMatch: [AuthGuard],
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./pages/authorization/authorization.routes').then(
                m => m.authorizationRoutes
            ),
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '',
    },
];
