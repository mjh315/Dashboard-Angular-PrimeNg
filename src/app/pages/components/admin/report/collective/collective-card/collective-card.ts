import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { TransformedKarnameRes } from '../collective';
import { ReportStylingService } from '../../../../../services/reports/report-styling.service'; // مسیر را تنظیم کنید

@Component({
  selector: 'app-collective-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, ProgressBarModule],
  templateUrl: './collective-card.html',
  styleUrls: ['./collective-card.scss']
})
export class CollectiveCard implements AfterViewInit {
  @Input() row!: TransformedKarnameRes;
  @ViewChild('progressBar') progressBar: any; // دسترسی به نوار پیشرفت

  constructor(private reportStylingService: ReportStylingService) {}

  ngAfterViewInit(): void {
    // اعمال مستقیم رنگ به نوار پیشرفت بعد از رندر شدن
    if (this.progressBar) {
      const color = this.reportStylingService.getProgressBarColor(this.row.nomreh);
      this.progressBar.el.nativeElement.querySelector('.p-progressbar-value').style.backgroundColor = color;
    }
  }

  getScoreSeverity(status: string | null): string {
    return this.reportStylingService.getScoreSeverity(status);
  }
    getProgressBarColor(nomreh: number): string {
    return this.reportStylingService.getProgressBarColor(nomreh);
  }
}