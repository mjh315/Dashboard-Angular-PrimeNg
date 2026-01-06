import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesOfTheLastMonthDto, ItemOfActivities } from '../../../../models/activities.model';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { DashboardDataService } from '../../../../services/dashboard/dashboard-data.service';

// تعریف یک تایپ کمکی برای نمایش در فرانت
interface ActivityTab {
  title: string;
  key: keyof ActivitiesOfTheLastMonthDto; // 'today', 'lastDay', 'lastWeek', 'lastMonth'
  data: ItemOfActivities[];
}

@Component({
  standalone: true,
  selector: 'app-activities-of-the-last-month',
  imports: [CommonModule],
  templateUrl: './activities-of-the-last-month.html',
  styleUrls: ['./activities-of-the-last-month.scss']
})
export class ActivitiesOfTheLastMonthComponent implements OnInit {

  activityTabs: ActivityTab[] = [];
  loading = true;
  error = false;
  selectedTabIndex = 0;

  constructor(private dashboardService: DashboardDataService) { }

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.loading = true;
    this.dashboardService.getActivitiesOfTheLastMonth()
      .pipe(
        map(response => response.data),
        catchError(err => {
          console.error('Error loading activities:', err);
          this.error = true;
          this.loading = false;
          // در صورت خطا، یک شیء خالی برمی‌گرداند
          return of({ today: [], lastDay: [], lastWeek: [], lastMonth: [] } as ActivitiesOfTheLastMonthDto);
        })
      )
      .subscribe(data => {
        this.loading = false;
        // تبدیل داده‌های دریافتی به آرایه‌ای از تب‌ها
        this.activityTabs = [
          { title: 'امروز', key: 'today', data: data.today.reverse() }, // reverse برای نمایش جدیدترین‌ها اول
          { title: 'دیروز', key: 'lastDay', data: data.lastDay.reverse() },
          { title: 'هفته اخیر', key: 'lastWeek', data: data.lastWeek.reverse() },
          { title: 'ماه اخیر', key: 'lastMonth', data: data.lastMonth.reverse() },
        ];
        // اگر تبی داده داشت، آن را به عنوان تب پیش‌فرض انتخاب می‌کند
        this.selectedTabIndex = this.activityTabs.findIndex(t => t.data.length > 0) !== -1 ? 
                                this.activityTabs.findIndex(t => t.data.length > 0) : 0;
      });
  }

  // تابع کمکی برای تعیین کلاس رنگ بر اساس نوع فعالیت
  getTypeClass(type: string): string {
    switch (type) {
      case 'جابجایی شیفت':
        return 'bg-yellow-100 text-yellow-800'; // استایل Tailwind
      case 'ارزیابی جدید':
        return 'bg-green-100 text-green-800';
      case 'ارزیاب جدید':
        return 'bg-blue-100 text-blue-800';
      case 'آتشنشان جدید':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}