import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // 1. این را وارد کنید

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config'; // add this
import Aura from '@primeng/themes/aura'; // add this
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // 1. این را وارد کنید
import { MessageService } from 'primeng/api';
import { AuthGuard } from './core/guards/auth-guard';
import { authTokenInterceptor } from './core/interceptor/auth-interceptor';


// --- این بخش‌ها را اضافه کنید ---
import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
// ---------------------------------


export const appConfig: ApplicationConfig = {
  providers: [
    provideEchartsCore({ echarts }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAnimations(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    providePrimeNG({           // add this
      theme: {
        preset: Aura, // Pass the Aura object directly
        options: {
          prefix: 'p',
          colorScheme: 'light' // Configure light mode here
          /* You can also set the primary color, e.g., primary: 'indigo' */
        }
      },
      // add this
    }),                        // add this
    provideHttpClient(
      withInterceptors([authTokenInterceptor]) // Use the function name here
    ),
    MessageService,
    AuthGuard
  ]
};
