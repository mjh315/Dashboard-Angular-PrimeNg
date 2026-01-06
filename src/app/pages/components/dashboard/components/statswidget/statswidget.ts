// statswidget.ts

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
// کامپوننت‌های فرزند
import { AutoRotatingCard } from './auto-rotating-widget/auto-rotating-widget';
import { FireFighterStatsCardComponent } from "./fire-fighter-stats/fire-fighter-stats";
import { ShiftsWidget } from "./shifts-widget/shifts-widget";
import { AgeRangesWidget } from "./age-ranges-widget/age-ranges-widget";
// سرویس جدید
import { DashboardDataService } from '../../../../services/dashboard/dashboard-data.service';
// مدل‌ها
import { Subscription } from 'rxjs';
import { AgeRangeData, FireFighterData, NumberOfFireFightersData, ShiftAvrage } from '../../../../models/dashboard-data.model';


@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule, CardModule, AutoRotatingCard, FireFighterStatsCardComponent, ShiftsWidget, AgeRangesWidget],
    providers: [DashboardDataService],
    template: `
    <div class="contents">
        <ng-container *ngIf="loading; else loadedContent">
            <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                <div class="card h-[13rem] animate-pulse bg-surface-100 dark:bg-surface-700" ></div>
            </div>
             <div class="col-span-12 lg:col-span-6 xl:col-span-3"  >
                <div class="card h-[13rem] animate-pulse bg-surface-100 dark:bg-surface-700"></div>
            </div>
             <div class="col-span-12 lg:col-span-6 xl:col-span-3"  style="height: 182px;">
                <div class="card h-[13rem] animate-pulse bg-surface-100 dark:bg-surface-700"></div>
            </div>
             <div class="col-span-12 lg:col-span-6 xl:col-span-3"  style="height: 182px;">
                <div class="card h-[13rem] animate-pulse bg-surface-100 dark:bg-surface-700"></div>
            </div>
        </ng-container>

        <ng-template #loadedContent>
            <div class="col-span-12 lg:col-span-6 xl:col-span-3 " style="height: 182px;">
                <app-auto-rotating-card [fireFightersData]="bestFireFightersData"></app-auto-rotating-card>
            </div>
            
            <div class="col-span-12 lg:col-span-6 xl:col-span-3" style="height: 182px;">
                <app-new-firefighters-card [data]="numberOfFireFightersData.length > 0 ? numberOfFireFightersData[0] : undefined"></app-new-firefighters-card>
            </div>

            <div class="col-span-12 lg:col-span-6 xl:col-span-3" style="height: 182px;">
                <app-shifts-widget [data]="shiftAvragesData"></app-shifts-widget>
            </div>

            <div class="col-span-12 lg:col-span-6 xl:col-span-3" style="height: 182px;">
                <app-age-ranges-widget [data]="ageRangeData"></app-age-ranges-widget>
            </div>
        </ng-template>
    </div>
    `
})
export class StatsWidget implements OnInit, OnDestroy {

    bestFireFightersData: FireFighterData[] = [];
    shiftAvragesData: ShiftAvrage[] = [];
    ageRangeData: AgeRangeData[] = [];
    numberOfFireFightersData: NumberOfFireFightersData[] = [];

    // تعریف loading اولیه به true
    loading: boolean = true;
    private subscription: Subscription = new Subscription();

    constructor(
        private dashboardDataService: DashboardDataService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadWidgetsData();
    }

    loadWidgetsData(): void {
        this.loading = true;
        this.subscription.add(
            this.dashboardDataService.getWidgetsData().subscribe({
                next: (response) => {
                    if (response.isSuccess && response.data) {
                        const data = response.data;

                        this.bestFireFightersData = data.bestFireFighters;
                        this.shiftAvragesData = data.shiftsAvrages;
                        this.ageRangeData = data.allFireFightersAgeRanges;
                        this.numberOfFireFightersData = data.numberOfFireFighters;
                    }
                    this.loading = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Failed to load Dashboard Widgets Data:', err);
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}