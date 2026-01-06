import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { AuthGuard } from './core/guards/auth-guard';
import { Login } from './pages/components/admin/login/login';
import { Dashboard } from './pages/components/dashboard/dashboard';
import { Arzyab } from './pages/components/admin/arzyab/arzyab';
import { Individual } from './pages/components/admin/report/individual/individual';
import { Collective } from './pages/components/admin/report/collective/collective';
import { ArzyabList } from './pages/components/admin/arzyab/arzyab-list/arzyab-list';
import { ArzyabForm } from './pages/components/admin/arzyab/arzyab-form/arzyab-form';
import { FirefighterFormComponent } from './pages/components/admin/firefighter/firefighter-form/firefighter-form';
import { FirefighterComponent } from './pages/components/admin/firefighter/firefighter';



export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
            { path: 'individual', component: Individual, canActivate: [AuthGuard] },
            { path: 'collective', component: Collective, canActivate: [AuthGuard] },

            // 👇 مدیریت ارزیاب‌ها
            { path: 'arzyab', component: Arzyab, canActivate: [AuthGuard] },
            { path: 'arzyab/add', component: ArzyabForm, canActivate: [AuthGuard] },
            { path: 'arzyab/edit/:id', component: ArzyabForm, canActivate: [AuthGuard] },
            { path: 'firefighters', component: FirefighterComponent },
            { path: 'firefighters/add', component: FirefighterFormComponent },
            { path: 'firefighters/edit/:id', component: FirefighterFormComponent }
        ]
    },
    // { path: 'dashboard', canActivate: [AuthGuard] },
    { path: 'login', component: Login },
    { path: '**', redirectTo: '/notfound' },
];
