// custom-datepicker.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import * as jalaali from 'jalaali-js';
@Component({
  selector: 'app-custom-datepicker',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, DatePipe], // اصلاح شده
  templateUrl: './custom-datepicker.html',
  styleUrls: ['./custom-datepicker.scss']
})
export class CustomDatepickerComponent {
  @Input() selectedDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();

  currentJalaaliDate: { jy: number, jm: number, jd: number };
  
  // متغیر جدید برای مدیریت حالت نمایش
  viewMode: 'calendar' | 'month-picker' | 'year-picker' = 'calendar';
  // متغیر برای نگهداری محدوده سال‌ها در حالت انتخاب سال
  yearRange: number[] = [];

  jalaaliMonths: string[] = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  jalaaliDaysOfWeek: string[] = [
    'ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'
  ];

  constructor() {
    const today = new Date();
    console.log(today)
    this.currentJalaaliDate = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
    this.generateYearRange();
  }

  // ایجاد محدوده سال‌ها برای نمایش در انتخاب‌گر سال
  generateYearRange(): void {
    const startYear = Math.floor(this.currentJalaaliDate.jy / 12) * 12;
    this.yearRange = Array.from({ length: 12 }, (_, i) => startYear + i);
  }

  // تغییر حالت نمایش به انتخاب‌گر ماه
  showMonthPicker(): void {
    this.viewMode = 'month-picker';
  }

  // تغییر حالت نمایش به انتخاب‌گر سال
  showYearPicker(): void {
    this.viewMode = 'year-picker';
  }
  
  // انتخاب یک ماه از لیست
  selectMonth(monthIndex: number): void {
    this.currentJalaaliDate.jm = monthIndex + 1;
    this.viewMode = 'calendar';
    this.currentJalaaliDate = { ...this.currentJalaaliDate };
  }

  // انتخاب یک سال از لیست
  selectYear(year: number): void {
    this.currentJalaaliDate.jy = year;
    this.viewMode = 'month-picker';
    this.currentJalaaliDate = { ...this.currentJalaaliDate };
  }

  // رفتن به محدوده سال قبل
  previousYears(): void {
    this.currentJalaaliDate.jy -= 12;
    this.generateYearRange();
  }

  // رفتن به محدوده سال بعد
  nextYears(): void {
    this.currentJalaaliDate.jy += 12;
    this.generateYearRange();
  }

  generateCalendar(): (number | null)[][] {
    const calendar: (number | null)[][] = [];
    const { jy, jm } = this.currentJalaaliDate;
    const daysInMonth = jalaali.jalaaliMonthLength(jy, jm);
    const firstDayGregorian = jalaali.toGregorian(jy, jm, 1);
    const firstDayOfWeek = new Date(firstDayGregorian.gy, firstDayGregorian.gm - 1, firstDayGregorian.gd).getDay();

    const days: (number | null)[] = new Array((firstDayOfWeek + 1) % 7).fill(null).concat(
      Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    while (days.length > 0) {
      calendar.push(days.splice(0, 7));
    }
    
    return calendar;
  }

  selectDay(day: number | null): void {
    if (day) {
      const { jy, jm } = this.currentJalaaliDate;
      const gregorianDate = jalaali.toGregorian(jy, jm, day);
      const newDate = new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd);
      this.dateSelected.emit(newDate);
      this.selectedDate = newDate;
    }
  }

  previousMonth(): void {
    if (this.currentJalaaliDate.jm > 1) {
      this.currentJalaaliDate.jm--;
    } else {
      this.currentJalaaliDate.jm = 12;
      this.currentJalaaliDate.jy--;
    }
    this.currentJalaaliDate = { ...this.currentJalaaliDate };
  }

  nextMonth(): void {
    if (this.currentJalaaliDate.jm < 12) {
      this.currentJalaaliDate.jm++;
    } else {
      this.currentJalaaliDate.jm = 1;
      this.currentJalaaliDate.jy++;
    }
    this.currentJalaaliDate = { ...this.currentJalaaliDate };
  }

  isDateSelected(day: number | null): boolean {
    if (day === null || !this.selectedDate) {
      return false;
    }
    const { jy, jm, jd } = jalaali.toJalaali(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, this.selectedDate.getDate());
    return jy === this.currentJalaaliDate.jy && jm === this.currentJalaaliDate.jm && jd === day;
  }
}