// age-ranges-widget.ts

import {
  Component, OnDestroy, AfterViewInit, Input,
  ElementRef, ViewChild, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

// تعریف ساختار داده‌های ورودی
interface AgeRangeData {
  numberOfFireFighters: number;
  ageRange: string;
}

// بارگیری کتابخانه ECharts از CDN
declare const echarts: any;

@Component({
  standalone: true,
  selector: 'app-age-ranges-widget',
  imports: [CommonModule, CardModule],
  styleUrl: './age-ranges-widget.scss',
  templateUrl: './age-ranges-widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgeRangesWidget implements AfterViewInit, OnDestroy {

  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @Input() data: AgeRangeData[] = [];

  private chartInstance: any;

  // استفاده از همان تابع بارگذاری ECharts از shifts-widget
  private loadEChartsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof echarts !== 'undefined') {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load ECharts script'));
      document.head.appendChild(script);
    });
  }

  ngAfterViewInit() {
    this.loadEChartsScript()
      .then(() => this.initChart())
      .catch(err => console.error('ECharts loading error:', err));
  }

  private initChart() {
    if (!this.chartContainer || !this.data || this.data.length === 0 || typeof echarts === 'undefined') {
      return;
    }

    const ageRanges = this.data.map(item => item.ageRange);
    const fighterCounts = this.data.map(item => item.numberOfFireFighters);

    // محاسبه max داینامیک با 10٪ حاشیه، min را 0 تنظیم می‌کنیم
    const minValue = 0; // تعداد نمی‌تواند منفی باشد
    const maxValue = Math.max(...fighterCounts);
    const padding = maxValue * 0.1;
    const yMin = 0;
    
    // رُند کردن yMax به نزدیکترین عدد کامل یا مضرب 5 برای نمایش تمیزتر
    let yMax = maxValue + padding;
    yMax = Math.ceil(yMax / 5) * 5; 
    
    // اگر padding نتیجه کوچکتر از 50 داشت، آن را به نزدیکترین عدد کامل رند می‌کنیم
    if (yMax < 50) {
        yMax = Math.ceil(maxValue + padding);
    }
    
    this.chartInstance = echarts.init(this.chartContainer.nativeElement, 'light');

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any[]) => {
          const dataVal = params[0].data.value;
          const name = params[0].name;
          return `
              بازه سنی: ${name}<br/>
              تعداد آتش‌نشان: <b>${dataVal}</b>
          `;
        },
        textStyle: { fontFamily: 'Inter, sans-serif' },
        confine: true
      },
      grid: {
        left: 5,       // حذف فاصله سمت چپ
        right: 0,      // حذف فاصله سمت راست
        top: 8,
        bottom: -15,
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ageRanges,
          axisTick: { alignWithLabel: true },
          axisLabel: {
            color: '#6c757d',
            fontSize: 10
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          min: yMin, // شروع از صفر
          max: yMax, // تنظیم شده با 10% پدینگ
          name: 'تعداد آتش‌نشان',
          nameTextStyle: { color: '#6c757d' },
          axisLabel: { color: '#6c757d', formatter: '{value}' },
          splitLine: { lineStyle: { type: 'dashed', color: '#e9ecef' } }
        }
      ],
      series: [
        {
          name: 'تعداد آتش‌نشان',
          type: 'bar',
          barWidth: '80%', // پهن‌تر کردن ستون
          barCategoryGap: '0%', // حذف فاصله بین دسته‌بندی‌ها
          data: fighterCounts.map(count => ({
            value: count,
            itemStyle: { color: this.getBarColor(count) }
          })),
          itemStyle: { borderRadius: [4, 4, 0, 0] }
        }
      ]
    };

    this.chartInstance.setOption(option);
    window.addEventListener('resize', this.onResize);
  }

  // تعریف رنگ‌ها بر اساس تعداد
  private getBarColor(count: number): string {
    if (count > 20) return '#10b981'; // سبز برای تعداد بالا
    if (count > 15) return '#f59e0b'; // زرد برای تعداد متوسط
    return '#ef4444'; // قرمز برای تعداد کم
  }

  private onResize = () => {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }
}