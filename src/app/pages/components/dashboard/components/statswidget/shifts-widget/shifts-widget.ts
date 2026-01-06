import {
  Component, OnDestroy, AfterViewInit, Input,
  ElementRef, ViewChild, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

// تعریف ساختار داده‌های ورودی
interface ShiftAvrage {
  id: string;
  shiftName: string;
  avrage: number;
  numberOfFireFighter: number;
}

// بارگیری کتابخانه ECharts از CDN
declare const echarts: any;

@Component({
  standalone: true,
  selector: 'app-shifts-widget',
  imports: [CommonModule, CardModule],
  styleUrl: './shifts-widget.scss',
  styles: [`

  `],
  templateUrl: './shifts-widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShiftsWidget implements AfterViewInit, OnDestroy {

  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @Input() data: ShiftAvrage[] = [];

  private chartInstance: any;

  constructor() { }

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

    const shiftNames = this.data.map(item => item.shiftName);
    const avrages = this.data.map(item => item.avrage);

    // محاسبه min و max داینامیک با 10٪ حاشیه
    const minValue = Math.min(...avrages);
    const maxValue = Math.max(...avrages);
    const padding = (maxValue - minValue);
    const yMin = minValue - padding;
    const yMax = maxValue + padding;

    this.chartInstance = echarts.init(this.chartContainer.nativeElement, 'light');

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any[]) => {
          const dataVal = params[0].data.value;
          const name = params[0].name;
          const shiftItem = this.data.find(d => d.shiftName === name);
          if (shiftItem) {
            return `
              ${name}<br/>
              میانگین امتیاز: <b>${dataVal.toFixed(2)}</b><br/>
              تعداد آتش‌نشان: ${shiftItem.numberOfFireFighter}
            `;
          }
          return `${name}: ${dataVal}`;
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
          data: shiftNames,
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
          min: yMin,
          max: yMax,
          axisLabel: {
            color: '#6c757d',
            formatter: (value: number) => value.toFixed(2) // 🔹 فقط این خط مهم است
          },
          splitLine: {
            lineStyle: { type: 'dashed', color: '#e9ecef' }
          }
        }
      ],
      series: [
        {
          name: 'میانگین امتیاز',
          type: 'bar',
          barWidth: '40%',
          data: avrages.map(val => ({
            value: parseFloat(val.toFixed(2)),  // دو رقم اعشار دقیق
            itemStyle: { color: this.getBarColor(val) }
          })),
          itemStyle: { borderRadius: [4, 4, 0, 0] }
        }
      ]
    };

    this.chartInstance.setOption(option);
    window.addEventListener('resize', this.onResize);
  }

  private getBarColor(avrage: number): string {
    if (avrage > 50) return '#10b981';
    if (avrage > 20) return '#f59e0b';
    return '#ef4444';
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