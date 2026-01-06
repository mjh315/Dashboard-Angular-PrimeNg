import { Component, Input, OnChanges } from '@angular/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

import { CommonModule } from '@angular/common';
import { TransformedKarnameRes } from '../individual';


@Component({
  selector: 'app-individual-chart',
  standalone: true,
  imports: [NgxEchartsModule, CommonModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts }
    }
  ],
  templateUrl: './individual-chart.html',
  styleUrl: './individual-chart.scss'
})
export class IndividualChart implements OnChanges {
  @Input() data: TransformedKarnameRes[] = [];
  chartOptions: any;

  ngOnChanges() {
    if (this.data?.length) {
        const grouped = this.groupByTest();
        this.chartOptions = {
            title: { text: 'میانگین نمره بر اساس نوع تست', textStyle: { color: '#3c4bcaff', fontFamily: "ir" } },
            tooltip: {},
            // Move grid settings here, at the root level of the options object
            grid: {
                width: 300, 
                left: 50
            },
            xAxis: { type: 'category', data: Object.keys(grouped) },
            yAxis: { type: 'value', max: 100 },
            series: [
                {
                    colorBy: "data",
                    name: 'میانگین نمره',
                    label: {
                        fontFamily: "ir"
                    },
                    type: 'bar',
                    barWidth: "50%",
                    barMaxWidth: "80",
                    data: Object.values(grouped),
                    itemStyle: { color: '#3c4bcaff', barBorderRadius: [10, 10, 0, 0] }
                }
            ]
        };
    }
}

  private groupByTest(): Record<string, number> {
    const map: Record<string, number[]> = {};
    this.data.forEach(item => {
      if (item.titleNoeTest) {
        const key = item.titleNoeTest;
        if (!map[key]) {
          map[key] = [];
        }
        map[key].push(item.nomreh);
      }
    });

    const avgMap: Record<string, number> = {};
    for (const key in map) {
      const avg = map[key].reduce((a, b) => a + b, 0) / map[key].length;
      avgMap[key] = Math.round(avg * 100) / 100;
    }
    return avgMap;
  }
}