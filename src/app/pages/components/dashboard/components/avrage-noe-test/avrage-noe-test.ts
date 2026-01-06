// src/app/components/avrage-noe-test/avrage-noe-test.ts (نسخه نهایی با Fake Data)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { finalize } from 'rxjs/operators';
import { AvrageNoeTestDto, Avrages } from '../../../../models/noe-test-quarter-average.model';
import { DashboardDataService } from '../../../../services/dashboard/dashboard-data.service';
import { ApiResponse } from '../../../../models/dashboard-data.model';
import * as echarts from 'echarts';
// فرض می‌کنیم مدل Avrages برای پشتیبانی از camelCase در TS به‌روز شده یا از any استفاده می‌کنیم.

type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-avrage-noe-test',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './avrage-noe-test.html',
  styleUrl: './avrage-noe-test.scss'
})
export class AvrageNoeTest implements OnInit {

  public quarterAverages: AvrageNoeTestDto[] = [];
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public quarterLabels: string[] = ['سه‌ماهه ۴ تا ۲ پیش', 'سه‌ماهه ۳ تا ۱ پیش', 'سه‌ماهه ۲ تا ۰ پیش', 'سه‌ماهه کنونی'];
  public chartOption: EChartsOption = {};

  // **متغیر کنترل:** برای سوئیچ بین داده فیک و واقعی
  private useFakeData = true; // در حالت تست، روی true تنظیم شود

  constructor(private dashboardService: DashboardDataService) { }

  ngOnInit(): void {
    this.loadQuarterAverages();
  }

  loadQuarterAverages(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // **استفاده از داده فیک در حالت تست**
    if (this.useFakeData) {
      // شبیه سازی تاخیر شبکه
      setTimeout(() => {
        this.quarterAverages = this.generateFakeData();
        this.prepareChartOptions();
        this.isLoading = false;
      }, 500);
      return;
    }

    // **فراخوانی داده‌های واقعی (در حالت production)**
    this.dashboardService.getAvrageNoeTestInQuarters().pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response: ApiResponse<AvrageNoeTestDto[]>) => {
        if (response.isSuccess && response.data) {
          this.quarterAverages = response.data;
          this.prepareChartOptions();
        } else {
          this.errorMessage = response.message || 'خطا در دریافت داده‌ها.';
          this.chartOption = {};
        }
      },
      error: (err) => {
        console.error('Error fetching quarter averages:', err);
        this.errorMessage = 'مشکل ارتباط با سرور یا خطای نامشخص.';
        this.chartOption = {};
      }
    });
  }

  /**
   * تولید یک عدد تصادفی بین Min و Max
   */
  private getRandomScore(min: number, max: number): number {
    const score = Math.random() * (max - min) + min;
    // گرد کردن به دو رقم اعشار
    return Math.round(score * 100) / 100;
  }

  /**
   * تولید داده‌های ساختگی شبیه به ساختار AvrageNoeTestDto
   */
  private generateFakeData(): AvrageNoeTestDto[] {
    const titles = [
      'ترکیب بدنی', 'انعطاف ‌پذیری', 'استقامت قلبی - تنفسی', 'قدرت عضلانی',
      'استقامت عضلانی', 'چابکی', 'نیروی انفجاری عضله', 'تعادل', 'سرعت'
    ];

    return titles.map((title, index) => {
      // نمرات بین 58 تا 93
      const avrages: Avrages = {
        averageOne: this.getRandomScore(58, 93),
        averageTwo: this.getRandomScore(58, 93),
        averageThree: this.getRandomScore(58, 93),
        averageFour: this.getRandomScore(58, 93),
      } as any; // Cast به any برای تطابق با camelCase

      return {
        idNoeTest: (index + 1).toString().repeat(8) + '-0000-0000-0000-000000000000', // ID ساختگی
        titleNoeTest: title,
        avrages: avrages
      };
    });
  }

  // **متد استخراج داده (بدون تغییر)**
  getAveragesArray(avrages: Avrages | undefined): number[] {
    if (!avrages) {
      return [0, 0, 0, 0];
    }

    const avr = avrages as any;

    return [
      avr.averageOne,
      avr.averageTwo,
      avr.averageThree,
      avr.averageFour
    ];
  }

  // **متد prepareChartOptions (بدون تغییر)**
  prepareChartOptions(): void {
    if (this.quarterAverages.length === 0) {
      this.chartOption = {};
      return;
    }

    const seriesData: any[] = [];

    this.quarterAverages.forEach((item) => {
      const averages = this.getAveragesArray(item.avrages);

      // نمایش 'ترکیب بدنی' و 'انعطاف ‌پذیری' به صورت Bar، بقیه Line
      const chartType = 'line';

      seriesData.push({
        name: item.titleNoeTest,
        type: chartType,
        data: averages,
        smooth: chartType === 'line',
        yAxisIndex: 0,
      });
    });

    const newChartOptions: EChartsOption = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { data: this.quarterAverages.map(item => item.titleNoeTest), top: 'bottom', right: '10', textStyle: { fontFamily: 'ir' } },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      toolbox: {
        textStyle: {
          fontFamily: 'ir',
        },
        left: "0%",
        feature: {
          textStyle: {
            fontFamily: 'ir',
          },
          saveAsImage: { title: 'ذخیره تصویر' },
          dataZoom: {
            title: { zoom: 'زوم', back: 'بازنشانی زوم' },
            yAxisIndex: 'none'
          },
          dataView: { title: 'نمایش داده', readOnly: true },
          magicType: {
            title: { line: 'نمایش خطی', bar: 'نمایش میله‌ای' }, type: ['line', 'bar']
          },
          restore: { title: 'نمایش داده' },
        }
      },
      xAxis: {
        type: 'category',
        data: this.quarterLabels,
        axisLabel: { rotate: 20, fontFamily: 'ir' }
      },
      yAxis: {
        type: 'value',
        min: 50, // حداقل محور را کمی بالاتر می‌گذاریم تا نمودار شلوغ به نظر نرسد.
        max: 100,
        position: 'right',
        nameTextStyle: {
          fontFamily: "ir"
        }
      },
      series: seriesData
    };

    this.chartOption = newChartOptions;
  }
}