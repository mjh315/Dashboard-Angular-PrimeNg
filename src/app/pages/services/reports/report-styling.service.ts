import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportStylingService {

  constructor() { }

  getScoreSeverity(status: string | null): string {
    switch (status) {
      case 'خیلی ضعیف':
        return 'danger';
      case 'ضعیف':
        return 'warn';
      case 'متوسط':
        return 'secondary';
      case 'خوب':
        return 'secondary';
      case 'عالی':
        return 'info';
      default:
        return 'success';
    }
  }

  getProgressBarColor(nomreh: number): string {
    if (nomreh >= 0 && nomreh <= 20) {
      return '#ff0000';
    } else if (nomreh > 20 && nomreh <= 40) {
      return '#ff7f00';
    } else if (nomreh > 40 && nomreh <= 60) {
      return '#ffff00';
    } else if (nomreh > 60 && nomreh <= 80) {
      return '#7fff00';
    } else if (nomreh > 80 && nomreh <= 100) {
      return '#00ff00';
    } else {
      return '#008000';
    }
  }
}