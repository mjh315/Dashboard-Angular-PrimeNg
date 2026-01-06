import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { CommonModule } from '@angular/common';
import { TransformedKarnameRes } from '../collective';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { HttpClientModule } from '@angular/common/http';
import { ReportService } from '../../../../../services/reports/report.service';

/**
 * @description کامپوننت نمایش نمودار برای کارنامه گروهی.
 * این کامپوننت با استفاده از کتابخانه Echarts و قابلیت "Drilldown" (عمق‌نمایی)، داده‌های کارنامه را به صورت تعاملی نمایش می‌دهد.
 * کاربران می‌توانند از نمای کلی شیفت‌ها به جزئیات تست‌ها، افراد و در نهایت نمرات تاریخی یک فرد خاص بروند.
 */
@Component({
  selector: 'app-collective-chart',
  standalone: true,
  imports: [NgxEchartsModule, CommonModule, ButtonModule, RippleModule, HttpClientModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts }
    },
    ReportService
  ],
  templateUrl: './collective-chart.html',
  styleUrl: './collective-chart.scss'
})
export class CollectiveChart implements OnChanges {
  /**
   * داده‌های کارنامه که از کامپوننت والد دریافت می‌شوند.
   * @type {TransformedKarnameRes[]}
   * @Input
   */
  @Input() data: TransformedKarnameRes[] = [];

  /**
   * دسترسی به رفرنس DOM نمودار برای عملیاتی مانند گرفتن تصویر.
   * @type {ElementRef}
   * @ViewChild
   */
  @ViewChild('chartInstance') chartInstance!: ElementRef;

  /**
   * پیکربندی و آپشن‌های نمودار Echarts.
   * این شیء به صورت پویا بر اساس سطح Drilldown به‌روز می‌شود.
   * @type {any}
   */
  chartOptions: any;

  /**
   * وضعیت Drilldown: آیا کاربر در سطح اول (نمایش تست‌های یک شیفت) قرار دارد؟
   * @type {boolean}
   */
  isDrilldown: boolean = false;

  /**
   * وضعیت Drilldown: آیا کاربر در سطح دوم (نمایش نمرات فردی در یک تست) قرار دارد؟
   * @type {boolean}
   */
  isIndividualDrilldown: boolean = false;

  /**
   * وضعیت Drilldown: آیا کاربر در سطح سوم (نمایش جزئیات نمرات تاریخی یک فرد) قرار دارد؟
   * @type {boolean}
   */
  isDetailedDrilldown: boolean = false;
  
  /**
   * نام شیفت انتخاب شده در سطح اول Drilldown.
   * @type {string | null}
   */
  selectedShift: string | null = null;
  
  /**
   * شناسه شیفت انتخاب شده در سطح اول Drilldown.
   * @type {string | null}
   */
  selectedShiftId: string | null = null;
  
  /**
   * عنوان تست انتخاب شده در سطح دوم Drilldown.
   * @type {string | null}
   */
  selectedTest: string | null = null;
  
  /**
   * شناسه تست انتخاب شده در سطح دوم Drilldown.
   * @type {string | null}
   */
  selectedTestId: string | null = null;

  /**
   * نام آتش‌نشان انتخاب شده در سطح سوم Drilldown.
   * @type {string | null}
   */
  selectedFirefighterName: string | null = null;
  
  /**
   * شناسه آتش‌نشان انتخاب شده در سطح سوم Drilldown.
   * @type {string | null}
   */
  selectedFirefighterId: string | null = null;
  
  /**
   * شناسه آیتم ارزیابی انتخاب شده در سطح سوم Drilldown.
   * @type {string | null}
   */
  selectedItemArzyabiId: string | null = null;
  
  /**
   * لیستی از شیفت‌های منحصر به فرد موجود در داده‌ها.
   * @type {string[]}
   */
  visibleShifts: string[] = [];

  /**
   * لیستی از تست‌های منحصر به فرد موجود در داده‌ها.
   * @type {string[]}
   */
  visibleTests: string[] = [];
  
  /**
   * متد lifecycle هوک که با هر بار تغییر در ورودی `@Input() data` فراخوانی می‌شود.
   * این متد تمام وضعیت‌های Drilldown را به حالت اولیه برمی‌گرداند و نمودار را به‌روزرسانی می‌کند.
   */
  ngOnChanges() {
    this.isDrilldown = false;
    this.isIndividualDrilldown = false;
    this.isDetailedDrilldown = false;
    this.selectedShift = null;
    this.selectedShiftId = null;
    this.selectedTest = null;
    this.selectedTestId = null;
    this.selectedFirefighterName = null;
    this.selectedFirefighterId = null;
    this.selectedItemArzyabiId = null;
    
    // دریافت لیست‌های منحصر به فرد برای شیفت‌ها و تست‌ها
    this.visibleShifts = this.getUniqueShifts(this.data);
    this.visibleTests = this.getUniqueTests(this.data);
    
    // به‌روزرسانی نمودار برای نمایش حالت اولیه
    this.updateChart();
  }
  
  /**
   * لیست شیفت‌های منحصر به فرد را از داده‌ها استخراج می‌کند.
   * @param {TransformedKarnameRes[]} data داده‌های کارنامه.
   * @returns {string[]} آرایه‌ای از نام شیفت‌های منحصر به فرد.
   */
  getUniqueShifts(data: TransformedKarnameRes[]): string[] {
    const shifts = [...new Set(data.map(item => item.nameShift).filter(name => name !== null) as string[])];
    return shifts.sort();
  }

  /**
   * لیست تست‌های منحصر به فرد را از داده‌ها استخراج می‌کند.
   * @param {TransformedKarnameRes[]} data داده‌های کارنامه.
   * @returns {string[]} آرایه‌ای از عنوان تست‌های منحصر به فرد.
   */
  getUniqueTests(data: TransformedKarnameRes[]): string[] {
    const tests = [...new Set(data.map(item => item.titleNoeTest).filter(name => name !== null) as string[])];
    return tests.sort();
  }

  /**
   * بررسی می‌کند که آیا یک آیتم خاص (شیفت یا تست) باید نمایش داده شود یا خیر.
   * (این متد در حال حاضر استفاده نمی‌شود ولی برای قابلیت فیلترکردن پویا مفید است.)
   * @param {string} itemName نام آیتم.
   * @param {string[]} visibleItems آرایه‌ای از آیتم‌های قابل مشاهده.
   * @returns {boolean}
   */
  isItemVisible(itemName: string, visibleItems: string[]): boolean {
    return visibleItems.includes(itemName);
  }

  /**
   * وضعیت نمایش یک شیفت خاص را در نمودار تغییر می‌دهد.
   * (این متد در حال حاضر استفاده نمی‌شود.)
   * @param {string} shiftName نام شیفت.
   */
  toggleShift(shiftName: string): void {
    const index = this.visibleShifts.indexOf(shiftName);
    if (index > -1) {
      this.visibleShifts.splice(index, 1);
    } else {
      this.visibleShifts.push(shiftName);
    }
    this.updateChart();
  }

  /**
   * وضعیت نمایش یک تست خاص را در نمودار تغییر می‌دهد.
   * (این متد در حال حاضر استفاده نمی‌شود.)
   * @param {string} testName نام تست.
   */
  toggleTest(testName: string): void {
    const index = this.visibleTests.indexOf(testName);
    if (index > -1) {
      this.visibleTests.splice(index, 1);
    } else {
      this.visibleTests.push(testName);
    }
    this.updateChart();
  }
  
  /**
   * رویداد کلیک روی نمودار را مدیریت می‌کند و Drilldown را انجام می‌دهد.
   * بر اساس سطح فعلی، به سطح بعدی می‌رود و مقادیر مورد نیاز را ذخیره می‌کند.
   * @param {any} event شیء رویداد کلیک Echarts.
   */
  onChartClick(event: any) {
    if (!this.isDrilldown) {
      // سطح اول: از نمای کلی به نمای شیفت‌ها برو.
      this.isDrilldown = true;
      this.selectedShift = event.name;
      this.selectedShiftId = event.data.shiftId;
    } else if (this.isDrilldown && !this.isIndividualDrilldown) {
      // سطح دوم: از نمای شیفت به نمای تست‌ها برو.
      this.isIndividualDrilldown = true;
      this.selectedTest = event.name;
      this.selectedTestId = event.data.testId;
    } else if (this.isIndividualDrilldown && !this.isDetailedDrilldown) {
      // سطح سوم: از نمای تست به نمای نمرات یک فرد خاص برو.
      this.isDetailedDrilldown = true;
      this.selectedFirefighterName = event.name;
      this.selectedFirefighterId = event.data.firefighterId;
      this.selectedTestId = event.data.testId;
      this.selectedItemArzyabiId = event.data.itemArzyabiId;
    } else if (this.isDetailedDrilldown) {
      // در عمیق‌ترین سطح، کلیک تأثیری ندارد.
      return;
    }
    this.updateChart();
  }

  /**
   * کاربر را به سطح Drilldown قبلی برمی‌گرداند.
   * این متد با کلیک روی دکمه "بازگشت" فراخوانی می‌شود.
   */
  goBack() {
    if (this.isDetailedDrilldown) {
      this.isDetailedDrilldown = false;
      this.selectedFirefighterName = null;
      this.selectedFirefighterId = null;
      this.selectedItemArzyabiId = null;
    } else if (this.isIndividualDrilldown) {
      this.isIndividualDrilldown = false;
      this.selectedTest = null;
      this.selectedTestId = null;
    } else if (this.isDrilldown) {
      this.isDrilldown = false;
      this.selectedShift = null;
      this.selectedShiftId = null;
    }
    this.updateChart();
  }

  /**
   * متد اصلی برای به‌روزرسانی نمودار بر اساس سطح Drilldown فعلی.
   * این متد داده‌ها را فیلتر و گروه‌بندی کرده و سپس `chartOptions` را تنظیم می‌کند.
   */
  private updateChart() {
    // اگر داده‌ای وجود نداشته باشد، نمودار را خالی کن.
    if (!this.data?.length) {
      this.chartOptions = null;
      return;
    }

    let chartData: any[] = [];
    let chartLabels: string[] = [];
    let chartTitle: string = '';
    let barCategoryGap: string | number = '20%';
    let barWidth: string | number = "50%";
    let axisLabel: any = { rotate: 0, fontFamily: 'ir' };

    // حالت سوم: نمایش جزئیات نمرات تاریخی یک فرد خاص
    if (this.isDetailedDrilldown && this.selectedFirefighterId && this.selectedTestId && this.selectedItemArzyabiId) {
      const filteredData = this.data.filter(
        item => item.tFirefightersId === this.selectedFirefighterId &&
          item.tLNoeTestId === this.selectedTestId &&
          item.tLItemsArzyabiId === this.selectedItemArzyabiId
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      

      chartLabels = filteredData.map(item => item.date?.split('T')[0]?.replace(/-/g, '/')).filter((name): name is string => name !== null);
      chartData = filteredData.map(item => ({ value: item.nomreh, itemArzyabiId: item.tLItemsArzyabiId }));
      chartTitle = `نمرات آیتم‌های تست ${this.selectedTest} برای ${this.selectedFirefighterName}`;
      barCategoryGap = '20%';
      barWidth = "50%";
      axisLabel = {
        fontFamily: 'ir',
        interval: 0,
      };

      // پیکربندی نمودار میله‌ای و خطی برای نمایش روند نمرات
      this.chartOptions = {
        title: { text: chartTitle, textStyle: { color: '#3c4bcaff', fontFamily: "ir" } },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const item = params[0];
            const testDate = item.name.trim() !== '' ? item.name : 'Unknown';
            const score = item.value != null ? item.value.toFixed(2) : 'N/A';
            return `تاریخ تست: ${testDate}<br/>نمره: ${score}`;
          },
        },
        legend: {
          data: ['نمره میله‌ای', 'روند نمره'],
          orient: 'vertical',
          right: '0%',
          top: 'center',
          type: 'scroll',
          textStyle: { fontFamily: 'ir' },
        },
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicInOut',
        xAxis: {
          type: 'category',
          data: chartLabels,
          axisLabel: axisLabel,
          axisTick: { alignWithLabel: true }
        },
        yAxis: {
          type: 'value',
          max: "100",
          nameTextStyle: {
            fontFamily: "ir"
          },
          axisLabel: {
            formatter: (value: number) => this.toPersianNumber(value),
            fontFamily: "ir"
          }
        },
        series: [
          {
            name: 'نمره میله‌ای',
            type: 'bar',
            data: chartData.map(d => d.value),
            itemStyle: { color: '#3c4bcaff', barBorderRadius: [10, 10, 0, 0] }
          },
          {
            name: 'روند نمره',
            type: 'line',
            smooth: true,
            data: chartData.map(d => d.value),
            itemStyle: { color: '#006400' }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: 0
          },
          {
            type: 'slider',
            xAxisIndex: 0,
            show: true,
            height: 20,
            bottom: 20
          }
        ],
        grid: {
          right: "15%",
          show: true,
          bottom: 75
        }
      };
      return;
    } 
    // حالت دوم: نمایش نمرات فردی در یک تست خاص
    else if (this.isIndividualDrilldown && this.selectedTestId) {
      const filteredData = this.data.filter(
        item => item.tLNoeTestId === this.selectedTestId && item.tShiftId === this.selectedShiftId
      );

      const groupedChartData = this.prepareGroupedData(filteredData);
      
      // اگر فقط یک آیتم وجود داشت، به صورت خودکار به سطح بعدی Drilldown برو.
      if (groupedChartData.series.length === 1 && groupedChartData.series[0].data.length === 1) {
        const singleItemData = groupedChartData.series[0].data[0];
        if (singleItemData) {
          this.isDetailedDrilldown = true;
          this.selectedFirefighterName = groupedChartData.xAxisLabels[0];
          this.selectedFirefighterId = singleItemData.firefighterId;
          this.selectedTestId = singleItemData.testId;
          this.selectedItemArzyabiId = singleItemData.itemArzyabiId;
          this.updateChart();
          return;
        }
      }

      chartLabels = groupedChartData.xAxisLabels;
      chartTitle = `نمرات انفرادی برای تست: ${this.selectedTest}`;
      barCategoryGap = '20%';
      barWidth = "50%";
      axisLabel = {
        fontFamily: 'ir',
        interval: 0,
      };

      // پیکربندی نمودار میله‌ای گروهی
      this.chartOptions = {
        title: { text: chartTitle, textStyle: { color: '#3c4bcaff', fontFamily: "ir" } },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: any) => {
            const seriesName = params[0].seriesName;
            const firefighterName = params[0].name;
            const scores = params.map((item: any) => `${item.marker}${item.seriesName}: ${item.value != null ? item.value.toFixed(2) : 'N/A'} نمره`).join('<br/>');
            return `${firefighterName}<br/>${scores}`;
          }
        },
        legend: {
          data: groupedChartData.series.map(s => s.name),
          orient: 'vertical',
          right: '0%',
          top: 'center',
          type: 'scroll',
          textStyle: { fontFamily: 'ir' },
        },
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicInOut',
        xAxis: {
          type: 'category',
          data: chartLabels,
          axisLabel: axisLabel,
          axisTick: { alignWithLabel: true }
        },
        yAxis: {
          type: 'value', max: "100", nameTextStyle: {
            fontFamily: "ir"
          },
          axisLabel: {
            formatter: (value: number) => this.toPersianNumber(value),
            fontFamily: "ir"
          }
        },
        series: groupedChartData.series,
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: 0
          },
          {
            type: 'slider',
            xAxisIndex: 0,
            show: true,
            height: 20,
            bottom: 20
          }
        ],
        grid: {
          right: "15%",
          show: true,
          bottom: 75
        }
      };
      return;
    } 
    // حالت اول: نمایش میانگین نمرات تست‌ها برای یک شیفت خاص
    else if (this.isDrilldown && this.selectedShiftId) {
      const filteredData = this.data.filter(item => item.tShiftId === this.selectedShiftId);
      const dataToChart = this.groupByTest(filteredData);
      
      // اگر فقط یک تست وجود داشت، به صورت خودکار به سطح بعدی Drilldown برو.
      if (Object.keys(dataToChart).length === 1) {
        const singleTestId = dataToChart[Object.keys(dataToChart)[0]].testId;
        const singleTestName = Object.keys(dataToChart)[0];

        this.isIndividualDrilldown = true;
        this.selectedTestId = singleTestId;
        this.selectedTest = singleTestName;
        this.updateChart();
        return;
      }

      chartLabels = Object.keys(dataToChart);
      chartData = Object.values(dataToChart);
      chartTitle = `میانگین نمره تست‌ها برای شیفت: ${this.selectedShift}`;
      barCategoryGap = '20%';
      barWidth = "50%";
      
      // پیکربندی نمودار میله‌ای ساده
      this.chartOptions = {
        title: { text: chartTitle, textStyle: { color: '#3c4bcaff', fontFamily: "ir" } },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const item = params[0];
            if (item.value == null || isNaN(item.value)) {
              return '';
            }
            return `${item.name}: ${item.value.toFixed(2)} نمره`;
          },
        },
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicInOut',
        xAxis: {
          type: 'category',
          data: chartLabels,
          axisLabel: axisLabel,
          axisTick: { alignWithLabel: true }
        },
        yAxis: {
          type: 'value', max: "100",
          nameTextStyle: {
            fontFamily: "ir"
          },
          axisLabel: {
            formatter: (value: number) => this.toPersianNumber(value),
            fontFamily: "ir"
          }
        },
        series: [
          {
            name: 'میانگین نمره',
            type: 'bar',
            barCategoryGap: barCategoryGap,
            barWidth: barWidth,
            barMaxWidth: "80",
            data: chartLabels.map(key => ({ name: key, value: dataToChart[key].value, testId: dataToChart[key].testId })),
            itemStyle: { color: '#3c4bcaff', barBorderRadius: [10, 10, 0, 0] }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: 0
          },
          {
            type: 'slider',
            xAxisIndex: 0,
            show: true,
            height: 20,
            bottom: 20
          }
        ],
        grid: {
          right: "15%",
          show: true,
          bottom: 75
        }
      };
      return;
    } 
    // حالت اولیه (نمای کلی): نمایش میانگین نمره کل بر اساس شیفت
    else {
      const { chartLabels: shifts, chartSeries, shiftTotalAverages } = this.prepareStackedData(this.data);
      chartTitle = 'میانگین نمره بر اساس شیفت';
      axisLabel = {
        fontFamily: 'ir',
        interval: 0
      }
      
      if (chartSeries.length > 0) {
        chartSeries.forEach(series => {
            series.itemStyle = {
                borderRadius: [10, 10, 0, 0],
            };
        });
        chartSeries[chartSeries.length - 1].itemStyle = {
          barBorderRadius: [10, 10, 0, 0],
        };
      }

      // پیکربندی نمودار میله‌ای Stacked Bar
      this.chartOptions = {
        title: { text: chartTitle, textStyle: { color: '#3c4bcaff', fontFamily: "ir" } },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const shiftName = params[0].name;
            const totalScore = params.reduce((sum: number, item: any) => sum + item.value, 0);
            let tooltipContent = `${shiftName} (میانگین کل: ${totalScore.toFixed(2)})<br/>`;
            params.forEach((item: any) => {
                tooltipContent += `${item.marker} ${item.seriesName}: ${item.value.toFixed(2)}<br/>`;
            });
            return tooltipContent;
          },
        },
        legend: {
          data: chartSeries.map((s: any) => s.name),
          orient: 'vertical',
          right: '5%',
          top: 'center',
          type: 'scroll',
          textStyle: { fontFamily: 'ir' },
        },
        emphasis: {
          focus: 'none'
        },
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicInOut',
        xAxis: {
          type: 'category',
          data: shifts,
          axisLabel: axisLabel,
          axisTick: { alignWithLabel: true }
        },
        yAxis: {
          type: 'value', max: "100",
          nameTextStyle: {
            fontFamily: "ir"
          },
          axisLabel: {
            formatter: (value: number) => this.toPersianNumber(value),
            fontFamily: "ir"
          }
        },
        series: chartSeries,
        grid: {
          right: "15%",
          show: true,
          bottom: 75,
          containLabel: true
        }
      };
    }
  }

  /**
   * داده‌ها را بر اساس شیفت گروه‌بندی کرده و میانگین نمره هر شیفت را محاسبه می‌کند.
   * @private
   * @param {TransformedKarnameRes[]} data
   * @returns {Record<string, { value: number, shiftId: string }>}
   */
  private groupByShift(data: TransformedKarnameRes[]): Record<string, { value: number, shiftId: string }> {
    const map: Record<string, number[]> = {};
    const shiftInfo: Record<string, string> = {};
    data.forEach(item => {
      if (item.nameShift) {
        const key = item.nameShift;
        if (!map[key]) {
          map[key] = [];
        }
        map[key].push(item.nomreh);
        shiftInfo[key] = item.tShiftId;
      }
    });

    const avgMap: Record<string, { value: number, shiftId: string }> = {};
    for (const key in map) {
      const avg = map[key].reduce((a, b) => a + b, 0) / map[key].length;
      avgMap[key] = {
        value: Math.round(avg * 100) / 100,
        shiftId: shiftInfo[key]
      };
    }
    return avgMap;
  }

  /**
   * داده‌ها را بر اساس نوع تست گروه‌بندی کرده و میانگین نمره هر تست را محاسبه می‌کند.
   * @private
   * @param {TransformedKarnameRes[]} data
   * @returns {Record<string, { value: number, testId: string }>}
   */
  private groupByTest(data: TransformedKarnameRes[]): Record<string, { value: number, testId: string }> {
    const map: Record<string, number[]> = {};
    const testInfo: Record<string, string> = {};
    data.forEach(item => {
      if (item.titleNoeTest) {
        const key = item.titleNoeTest;
        if (!map[key]) {
          map[key] = [];
        }
        map[key].push(item.nomreh);
        testInfo[key] = item.tLNoeTestId;
      }
    });

    const avgMap: Record<string, { value: number, testId: string }> = {};
    for (const key in map) {
      const avg = map[key].reduce((a, b) => a + b, 0) / map[key].length;
      avgMap[key] = {
        value: Math.round(avg * 100) / 100,
        testId: testInfo[key]
      };
    }
    return avgMap;
  }

  /**
   * داده‌ها را برای نمایش در نمودار میله‌ای گروهی (Grouped Bar Chart) آماده می‌کند.
   * این متد میانگین نمرات هر فرد برای آیتم‌های ارزیابی مختلف را محاسبه می‌کند.
   * @private
   * @param {TransformedKarnameRes[]} data
   * @returns {{ xAxisLabels: string[], series: any[] }}
   */
  private prepareGroupedData(data: TransformedKarnameRes[]): { xAxisLabels: string[], series: any[] } {
    const firefighters = [...new Set(data
      .map(item => item.nameFamilyAtashNeshan)
      .filter((name): name is string => name !== null)
    )];

    const testItems = [...new Set(data.map(item => item.titleItemsArzyabi))];

    const series = testItems.map(testItem => {
      const seriesData = firefighters.map(firefighter => {
        const filteredItems = data.filter(d => d.nameFamilyAtashNeshan === firefighter && d.titleItemsArzyabi === testItem);
        if (filteredItems.length > 0) {
          const sum = filteredItems.reduce((acc, curr) => acc + curr.nomreh, 0);
          const avg = sum / filteredItems.length;
          const firstItem = filteredItems[0];
          return {
            value: Math.round(avg * 100) / 100,
            firefighterId: firstItem.tFirefightersId,
            testId: firstItem.tLNoeTestId,
            itemArzyabiId: firstItem.tLItemsArzyabiId
          };
        }
        return null;
      });
      return {
        name: testItem,
        type: 'bar',
        data: seriesData,
        itemStyle: { barBorderRadius: [10, 10, 0, 0] },
      };
    });

    return {
      xAxisLabels: firefighters,
      series: series
    };
  }

  /**
   * داده‌ها را برای نمایش در نمودار میله‌ای Stacked Bar آماده می‌کند.
   * این متد میانگین نمرات هر نوع تست را در هر شیفت محاسبه کرده و مقادیر را برای نمودار Stacked Scale می‌کند.
   * @private
   * @param {TransformedKarnameRes[]} data
   * @returns {{ chartLabels: string[], chartSeries: any[], shiftTotalAverages: Record<string, { value: number, shiftId: string }> }}
   */
  private prepareStackedData(data: TransformedKarnameRes[]): { chartLabels: string[], chartSeries: any[], shiftTotalAverages: Record<string, { value: number, shiftId: string }> } {
    const shifts = [...new Set(data.map(item => item.nameShift).filter(name => name !== null) as string[])].sort();
    const testTypes = [...new Set(data.map(item => item.titleNoeTest).filter(name => name !== null) as string[])].sort();

    // میانگین نمرات کل هر شیفت را محاسبه کن
    const shiftTotalAverages = this.groupByShift(data);
    
    // میانگین نمرات هر نوع تست در هر شیفت را محاسبه کن
    const testTypeAverages = testTypes.reduce((acc, testType) => {
        acc[testType] = shifts.reduce((shiftAcc, shift) => {
            const filteredItems = data.filter(item => item.titleNoeTest === testType && item.nameShift === shift);
            if (filteredItems.length > 0) {
                const sum = filteredItems.reduce((s, item) => s + item.nomreh, 0);
                const avg = sum / filteredItems.length;
                shiftAcc[shift] = Math.round(avg * 100) / 100;
            } else {
                shiftAcc[shift] = 0;
            }
            return shiftAcc;
        }, {} as Record<string, number>);
        return acc;
    }, {} as Record<string, Record<string, number>>);

    // مجموع میانگین نمرات هر نوع تست در هر شیفت را محاسبه کن (برای Scaling)
    const shiftSumOfTestTypeAvgs = shifts.reduce((acc, shift) => {
      const sum = testTypes.reduce((s, testType) => s + (testTypeAverages[testType]?.[shift] || 0), 0);
      acc[shift] = sum;
      return acc;
    }, {} as Record<string, number>);
    

    // سری داده‌ها را برای نمودار Stacked آماده کن
    const chartSeries = testTypes.map(testType => {
      const seriesData = shifts.map(shift => {
        const testTypeAvg = testTypeAverages[testType]?.[shift] || 0;
        const totalShiftAvg = shiftTotalAverages[shift]?.value || 0;
        const sumOfAllTestTypeAvgs = shiftSumOfTestTypeAvgs[shift] || 0;
        
        // Scaling: مقدار نمره هر تست را متناسب با میانگین کل شیفت تنظیم کن
        const scaledValue = sumOfAllTestTypeAvgs > 0 ? (testTypeAvg / sumOfAllTestTypeAvgs) * totalShiftAvg : 0;
        
        console.log(testTypeAvg)
        console.log(totalShiftAvg)
        const item = data.find(d => d.nameShift === shift && d.titleNoeTest === testType);
        
        return {
          value: testTypeAvg,
          originalValue: totalShiftAvg,
          shiftId: item?.tShiftId,
          name: shift,
          testId: item?.tLNoeTestId
        };
      });

      return {
        name: testType,
        type: 'bar',
        // stack: 'total', // برای روی هم قرار گرفتن میله‌ها
        // emphasis: {
        //   focus: 'series'
        // },
        data: seriesData,
      };
    });

    return {
      chartLabels: shifts,
      chartSeries: chartSeries,
      shiftTotalAverages: shiftTotalAverages
    };
  }
  
  /**
   * نمودار را به صورت یک فایل تصویری PNG دانلود می‌کند.
   * واترمارک را به صورت موقت به نمودار اضافه کرده، سپس تصویر را گرفته و واترمارک را حذف می‌کند.
   */
  exportChartAsImage() {
    if (this.chartInstance) {
      const echartsInstance = echarts.getInstanceByDom(this.chartInstance.nativeElement);
      if (echartsInstance) {
        const watermarkOption = {
          graphic: [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              z: 100,
              style: {
                text: 'واترمارک شما',
                font: '20px ir',
                fill: 'rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
                textVerticalAlign: 'middle',
              },
            }
          ]
        };
        echartsInstance.setOption(watermarkOption);

        const url = echartsInstance.getDataURL({
          pixelRatio: 2,
          backgroundColor: '#fff',
        });

        echartsInstance.setOption({ graphic: [] });

        const a = document.createElement('a');
        a.download = 'chart.png';
        a.href = url;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    }
  }

  /**
   * یک عدد را به فرمت فارسی (با ارقام فارسی) تبدیل می‌کند.
   * @private
   * @param {number | string} n عدد ورودی.
   * @returns {string} عدد تبدیل شده به فارسی.
   */
  private toPersianNumber(n: number | string): string {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
  }
}