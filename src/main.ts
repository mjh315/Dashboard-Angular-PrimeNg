import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthTokenInterceptor } from './app/pages/interceptors/auth-token-interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
// import 'zone.js';

bootstrapApplication(AppComponent, appConfig
  
  
//   {
//   providers: [
//     provideRouter(routes), // اگر از Routing استفاده می‌کنید
//     provideHttpClient(
//       withInterceptors([AuthTokenInterceptor])
//     )
//   ]
// }


).catch(err => console.error(err));