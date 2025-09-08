import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { AuthGuard } from './core/guards/auth-guard';
import { Login } from './pages/components/admin/login/login';
import { Dashboard } from './pages/components/dashboard/dashboard';



export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard , canActivate: [AuthGuard] },
        ]
    },
    // { path: 'dashboard', canActivate: [AuthGuard] },
    { path: 'login', component: Login },
    { path: '**', redirectTo: '/notfound' },
];
