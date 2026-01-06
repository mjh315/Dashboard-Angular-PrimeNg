// app.component.ts
import { Component } from '@angular/core';
import { CustomDatepickerComponent } from './custom-datepicker/custom-datepicker';
import { CommonModule } from '@angular/common';
import { DatepickerDirective } from './datepicker';

@Component({
  selector: 'app-ddd-root',
  standalone: true,
  imports: [CustomDatepickerComponent, CommonModule,DatepickerDirective],
  templateUrl: './date-picker-demo.html',
  // styleUrls: ['./appddd.component.css']
})
export class Appddd {
  myDate: Date | null = new Date();

  onDateChange(newDate: Date): void {
    this.myDate = newDate;
    console.log('New Date Selected:', newDate);
  }
}