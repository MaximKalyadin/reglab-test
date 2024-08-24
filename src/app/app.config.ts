import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
    PreloadAllModules,
    provideRouter,
    withComponentInputBinding,
    withInMemoryScrolling,
    withPreloading,
    withRouterConfig,
    withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(
            routes,
            withPreloading(PreloadAllModules),
            withComponentInputBinding(),
            withRouterConfig({
                onSameUrlNavigation: 'reload',
            }),
            withViewTransitions(),
            withInMemoryScrolling()
        ),
        provideAnimations(),
        provideHttpClient(),
    ],
};
