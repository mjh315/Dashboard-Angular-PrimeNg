import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ComponentRef,
  ViewContainerRef
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { CustomDatepickerComponent } from './custom-datepicker/custom-datepicker';
import * as jalaali from 'jalaali-js';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appDatepicker]',
  standalone: true
})
export class DatepickerDirective implements OnInit, OnDestroy {
  @Input('appDatepicker') selectedDate: Date | null = null;
  @Output() dateChange = new EventEmitter<Date>();

  private datepickerComponentRef: ComponentRef<CustomDatepickerComponent> | null = null;
  private subs = new Subscription();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private ngControl: NgControl
  ) {}

  ngOnInit(): void {
    this.renderer.setAttribute(this.el.nativeElement, 'readonly', 'true');

    // هر بار که reactive form مقدار رو تغییر داد، جلالی کن
    if (this.ngControl?.valueChanges) {
      this.subs.add(
        this.ngControl.valueChanges.subscribe(value => {
          // اگر تاریخ به فرمت میلادی (YYYY-MM-DD) اومد، تبدیلش کن
          if (value) {
            const date = this.parseToGregorian(value);
            if (date) this.updateInputValue(date);
          } else {
            this.updateInputValue(null);
          }
        })
      );
    }

    // آپدیت اولیه
    this.updateInputValue(this.selectedDate);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.datepickerComponentRef) {
      this.datepickerComponentRef.destroy();
    }
  }

  @HostListener('click') onClick(): void {
    if (!this.datepickerComponentRef) {
      this.createDatepicker();
    } else {
      this.datepickerComponentRef.destroy();
      this.datepickerComponentRef = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      this.datepickerComponentRef &&
      !this.el.nativeElement.contains(event.target) &&
      !this.datepickerComponentRef.location.nativeElement.contains(event.target)
    ) {
      this.datepickerComponentRef.destroy();
      this.datepickerComponentRef = null;
    }
  }

  private createDatepicker(): void {
    this.datepickerComponentRef = this.viewContainerRef.createComponent(CustomDatepickerComponent);
    const datepickerEl = this.datepickerComponentRef.location.nativeElement;

    const rect = this.el.nativeElement.getBoundingClientRect();
    const isRTL = getComputedStyle(this.el.nativeElement.parentElement as Element).direction === 'rtl';

    this.renderer.appendChild(document.body, datepickerEl);

    this.renderer.setStyle(datepickerEl, 'position', 'absolute');
    this.renderer.setStyle(datepickerEl, 'z-index', '9999');
    this.renderer.setStyle(datepickerEl, 'top', `${rect.top + rect.height + window.scrollY}px`);

    if (isRTL) {
      this.renderer.setStyle(datepickerEl, 'right', `${window.innerWidth - rect.right - window.scrollX}px`);
    } else {
      this.renderer.setStyle(datepickerEl, 'left', `${rect.left + window.scrollX}px`);
    }

    this.datepickerComponentRef.instance.dateSelected.subscribe((date: Date) => {
      this.selectedDate = date;
      this.updateInputValue(date);

      // مقدار میلادی رو داخل کنترل reactive form هم ست می‌کنیم
      if (this.ngControl?.control) {
        const miladiString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        this.ngControl.control.setValue(miladiString, { emitEvent: false });
      }

      this.dateChange.emit(date);
      this.datepickerComponentRef?.destroy();
      this.datepickerComponentRef = null;
    });

    if (this.selectedDate) {
      this.datepickerComponentRef.instance.selectedDate = this.selectedDate;
    }
  }

  private updateInputValue(date: Date | null): void {
    if (date) {
      const jDate = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
      const monthNames = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
      ];
      this.renderer.setProperty(
        this.el.nativeElement,
        'value',
        `${jDate.jd} ${monthNames[jDate.jm - 1]} ${jDate.jy}`
      );
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'value', '');
    }
  }

  private parseToGregorian(value: string): Date | null {
    // اگر مقدار تاریخ میلادی (YYYY-MM-DD) باشه:
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return null;
  }
}
