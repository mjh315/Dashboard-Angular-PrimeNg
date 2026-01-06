import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import moment from 'moment-jalaali'; // moment-jalaali برای تبدیل تاریخ‌ها و عنوان لازم است

@Component({
  selector: 'app-calendar-chart',
  standalone: true,
  imports: [NgxEchartsModule],
  template: `<div echarts [options]="chartOption" style="width: 900px !important; height: 300px;" class="echarts-container"></div>`,
  styles: [`
    .echarts-container {
      width: 100%;
      height: 300px; /* ارتفاع را می‌توانید به دلخواه تنظیم کنید */
    }
  `]
})
export class CalendarChart implements OnInit {

  chartOption!: echarts.EChartsOption;

  ngOnInit(): void {
    // تنظیم moment برای استفاده از اعداد و تقویم فارسی
    moment.loadPersian({ usePersianDigits: true, dialect: 'persian' });
    
    // سال شمسی فعلی برای عنوان (مثلاً: 1404)
    const yearJalali = moment().format('jYYYY'); 
    // سال میلادی فعلی برای range تقویم (مثلاً: '2025')
    const yearGregorian = new Date().getFullYear().toString();

    this.chartOption = {
      title: {
        top: 0,
        left: 'center',
        text: `نمودار فعالیت سال ${yearJalali}`,
        textStyle: {
          fontFamily: 'Vazirmatn' // فونت مناسب برای عنوان
        }
      },
      tooltip: {
        position: 'top',
        // تبدیل تاریخ میلادی به شمسی برای نمایش در tooltip
        formatter: (p: any) => {
          const gregorianDate = echarts.time.format(p.data[0], '{yyyy}-{MM}-{dd}', false);
          const jalaaliDate = moment(gregorianDate, 'YYYY-MM-DD').format('jYYYY/jMM/jDD');
          return `${jalaaliDate}: ${p.data[1]}`;
        },
        textStyle: {
          fontFamily: 'Vazirmatn' // فونت مناسب برای tooltip
        }
      },
      visualMap: {
        min: 0,
        max: 10000,
        type: 'piecewise', // برای نمایش بازه های رنگی مجزا
        orient: 'horizontal',
        left: 'center',
        top: 45, // کمی پایین تر از عنوان
        inRange: {
          color: ['#c6e48b', '#7bc96f', '#239a3b', '#196127'] // طیف رنگی سبز
        },
        textStyle: {
          fontFamily: 'Vazirmatn'
        }
      },
      // استفاده از آبجکت تنها (نه آرایه) که مشکل را حل کرد
      calendar: {
        top: 120,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        // range حتما باید میلادی باشد
        range: yearGregorian, 
        itemStyle: {
          borderWidth: 0.5,
          borderColor: '#fff'
        },
        yearLabel: { show: false },

        // --- بخش اصلی شمسی‌سازی ---
        monthLabel: {
          nameMap: [
            'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
            'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
          ],
          align: 'center',
          fontFamily: 'Vazirmatn'
        },
        dayLabel: {
          firstDay: 6, // شروع هفته از شنبه
          nameMap: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'], // یکشنبه تا شنبه
          fontFamily: 'Vazirmatn'
        }
        // -------------------------
      },
      // استفاده از آبجکت تنها (نه آرایه)
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        // تابع تولید داده مجازی برای سال میلادی مشخص شده
        data: this.getVirtualData(yearGregorian)
      }
    };
  }

  /**
   * این تابع داده‌های مجازی برای یک سال میلادی کامل تولید می‌کند
   * @param year سال میلادی به صورت رشته (e.g., '2025')
   * @returns آرایه‌ای از داده‌ها برای سری نمودار
   */
  getVirtualData(year: string): Array<[string, number]> {
    const date = +echarts.time.parse(year + '-01-01');
    const end = +echarts.time.parse((+year + 1) + '-01-01');
    const dayTime = 3600 * 24 * 1000;
    const data: Array<[string, number]> = [];
    for (let time = date; time < end; time += dayTime) {
      data.push([
        echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
        Math.floor(Math.random() * 10000)
      ]);
    }
    return data;
  }
}
