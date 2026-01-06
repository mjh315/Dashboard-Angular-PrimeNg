import { Component } from '@angular/core';
import { StatsWidget } from './components/statswidget/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { ActivitiesOfTheLastMonthComponent } from "./components/activities-of-the-last-month/activities-of-the-last-month";
import { CalendarChart } from "./components/calendar-chart/calendar-chart";
import { AvrageNoeTest } from "./components/avrage-noe-test/avrage-noe-test";

@Component({
    selector: 'app-dashboard',
    standalone: true, // <-- This is the fix! 
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, ActivitiesOfTheLastMonthComponent, CalendarChart, AvrageNoeTest],
    template: `
<div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />
            <div class="col-span-12 xl:col-span-6">
                <app-avrage-noe-test />
                <app-activities-of-the-last-month />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-noe-test-avrage-widget />
                <app-recent-sales-widget />
            </div>
            <!-- <app-calendar-chart /> -->
        </div>
    `
})
export class Dashboard { }
