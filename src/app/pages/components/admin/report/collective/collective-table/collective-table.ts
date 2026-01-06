import { Component, Input, ViewChild } from '@angular/core';
import { TableModule, Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TransformedKarnameRes } from '../collective';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { CollectiveCard } from '../collective-card/collective-card';

@Component({
  selector: 'app-collective-table',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, IconFieldModule, InputIconModule, ProgressBarModule, TagModule, CardModule, CollectiveCard],
  templateUrl: './collective-table.html',
  styleUrl: './collective-table.scss'
})
export class CollectiveTable {
  @Input() data: TransformedKarnameRes[] = [];
  @ViewChild('dt') dt: Table | undefined;

  getScoreSeverity(status: string | null): string {
    switch (status) {
      case 'خیلی ضعیف':
        return 'danger';
      case 'ضعیف':
        return 'warning';
      case 'متوسط':
        return 'info';
      case 'خوب':
        return 'success';
      case 'عالی':
        return 'success'; // یا 'prime' برای رنگ متفاوت
      default:
        return 'secondary';
    }
  }

  getProgressBarColor(nomreh: number): string {
    if (nomreh >= 0 && nomreh <= 20) {
      return '#ff0000'; // red
    } else if (nomreh > 20 && nomreh <= 40) {
      return '#ff7f00'; // orange
    } else if (nomreh > 40 && nomreh <= 60) {
      return '#ffff00'; // yellow
    } else if (nomreh > 60 && nomreh <= 80) {
      return '#7fff00'; // yellow-green
    } else if (nomreh > 80 && nomreh <= 100) {
      return '#00ff00'; // green
    } else {
      return '#008000'; // dark green for excellent
    }
  }
}