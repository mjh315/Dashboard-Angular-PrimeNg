import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'خانه',
                items: [
                    { label: 'پیشخوان', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'ارزیاب', icon: 'pi pi-fw pi-users', routerLink: ['/ش'] },
                    { label: 'گزارشات', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/ش'],
                        items:[{
                            label: 'جامع', icon:'', routerLink: ['/']
                        }]
                     },
                    { label: 'آتش‌نشان', icon: 'pi pi-fw pi-home', routerLink: ['/س'] },
                    { label: 'نتایج', icon: 'pi pi-fw pi-home', routerLink: ['/ی'] },
                ]
            }
        ];
    }
}
