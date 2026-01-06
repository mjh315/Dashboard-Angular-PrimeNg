import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

// تعریف ساختار داده آتش‌نشان برای ورودی (Input)
interface FireFighterData {
    id: string;
    name: string;
    shiftId: string;
    shiftName: string;
    avrage: number;
}

@Component({
    standalone: true,
    selector: 'app-auto-rotating-card',
    imports: [CommonModule, CardModule],
    styles: [`
        /* تعریف ارتفاع ثابت برای کارت برای جلوگیری از پرش عناصر زیرین (CLS) */
        #target-card {
            min-height: 140px; /* ارتفاع کافی برای نگهداری محتوا و پدینگ */
        }
    
        /* ظرف نوار پیشرفت: برای قرار دادن در پایین کارت */
        .progress-bar-wrapper {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px; /* ضخامت نوار */
            background-color: var(--surface-300, #cccccc); /* رنگ زمینه نوار غیرفعال */
            z-index: 1; /* اطمینان از قرارگیری بالای محتوا */
        }
        
        /* نوار پیشرفت متحرک */
        .progress-bar {
            height: 100%;
            background-color: var(--primary-color, #1e90ff); /* رنگ نوار فعال */
            width: 0%; /* شروع از ۰٪ عرض (برای پر شدن) */
        }
        
        /* تعریف انیمیشن شمارش معکوس (۶ ثانیه) */
        .animate-progress {
            animation: countdown 6000ms linear forwards;
        }

        @keyframes countdown {
            0% { width: 0%; } /* شروع از صفر */
            100% { width: 100%; } /* پر شدن کامل */
        }

        /* کانتینر اصلی محتوا */
        .animated-content-container {
            /* فقط به عنوان یک Wrapper برای انیمیشن و مدیریت *ngIf باقی می‌ماند */
        }

        /* انیمیشن اصلی محتوا (Fade-in با کمی Scale) */
        .fade-in-content {
            animation: fastFadeIn 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        @keyframes fastFadeIn {
            0% { opacity: 0; transform: scale(0.98); }
            100% { opacity: 1; transform: scale(1); }
        }

        /* انیمیشن محتوای ثانویه (Fade-in با تأخیر) */
        .fade-in-secondary {
            animation: slowFadeIn 300ms ease-out 100ms forwards;
            opacity: 0; /* برای اطمینان از مخفی بودن قبل از انیمیشن */
        }

        @keyframes slowFadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
    `],
    template: `
        <!-- ویجت بهترین آتش‌نشان -->
        <!-- کلاس 'relative' برای موقعیت‌دهی مطلق دات‌ها و نوار پیشرفت الزامی است -->
        <div dir="rtl" class="relative p-card-content">
            
            <div id="target-card" class="card mb-0 relative overflow-hidden h-[13rem] " 
            (mouseenter)="stopRotation()" 
            (mouseleave)="startRotation()">


                <div class="progress-bar-wrapper">

                    <div *ngIf="isProgressBarVisible"
                         class="progress-bar animate-progress "
                         [style.animationPlayState]="isRotating ? 'running' : 'paused'"
                         (animationend)="handleAnimationEnd()">
                    </div>
                </div>

                <div *ngIf="isContentVisible" class="animated-content-container">
                    
                    <div class="flex justify-between mb-4 fade-in-content">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">بهترین آتش‌نشان</span>
                            <div class="text-surface-900 dark:text-surface-0 font-bold text-xl">{{ currentFireFighter?.name }}</div>
                        </div>
                        <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" 
                             style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-user text-blue-500 text-xl"></i> 
                        </div>
                    </div>
                    
                    <div class="fade-in-secondary">
                        <span class="text-primary font-medium">{{ currentFireFighter?.shiftName }}</span>
                        <span class="text-muted-color"> - میانگین امتیاز: </span>
                        <span class="text-surface-900 dark:text-surface-0 font-medium">{{ currentFireFighter?.avrage | number:'1.0-2' }}</span>
                    </div>
                </div>
                
            </div>
            
            <div class="flex justify-center absolute left-0 right-0" style="bottom: 15px;">
                <div *ngFor="let fireFighter of fireFightersData; let i = index" 
                     class="mx-1 cursor-pointer rounded-full h-2 w-2"
                     [ngClass]="{'bg-primary': i === currentIndex, 'bg-surface-300': i !== currentIndex}"
                     (click)="goToFireFighter(i)">
                </div>
            </div>
            
        </div>
    
    `
})
export class AutoRotatingCard implements OnInit, OnDestroy {

    // دریافت داده‌ها به عنوان ورودی از کامپوننت والد
    @Input() fireFightersData: FireFighterData[] = [];

    currentFireFighter: FireFighterData | null = null;
    currentIndex: number = 0;

    isProgressBarVisible: boolean = true;
    isRotating: boolean = true;
    isContentVisible: boolean = true;

    private readonly UPDATE_INTERVAL_MS = 6000;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        if (this.fireFightersData.length > 0) {
            // ۱. مقداردهی اولیه محتوا (آتش‌نشان اول)
            this.currentFireFighter = this.fireFightersData[this.currentIndex];

            // ۲. شروع چرخه انیمیشن
            this.startNewAnimationCycle();
        }
    }

    goToFireFighter(index: number) {
        if (index === this.currentIndex) return; // اگر همان آیتم کلیک شد، کاری نکن

        // ۱. توقف انیمیشن CSS فعلی
        this.stopRotation();

        // ۲. به‌روزرسانی اندیس
        this.currentIndex = index;

        // ۳. شروع انتقال انیمیشن محتوا
        this.animateContentChange(() => {
            // محتوا را پس از انیمیشن تغییر محو شدن به‌روزرسانی کنید
            this.currentFireFighter = this.fireFightersData[this.currentIndex];

            // ۴. ریست قطعی انیمیشن نوار پیشرفت و شروع چرخه جدید
            this.startNewAnimationCycle();
        });

        this.cdr.detectChanges();
    }

    handleAnimationEnd() {
        if (!this.isRotating || this.fireFightersData.length === 0) return;

        // ۱. به آیتم بعدی بروید
        this.currentIndex = (this.currentIndex + 1) % this.fireFightersData.length;

        // ۲. شروع انتقال انیمیشن محتوا
        this.animateContentChange(() => {
            // محتوا را پس از انیمیشن محو شدن به‌روزرسانی کنید
            this.currentFireFighter = this.fireFightersData[this.currentIndex];

            // ۳. شروع چرخه انیمیشن نوار پیشرفت جدید
            this.startNewAnimationCycle();
        });

        this.cdr.detectChanges();
    }

    private startNewAnimationCycle() {
        // ۱. توقف: isRotating = false
        this.isRotating = false;

        // ۲. ریست DOM (حذف کامل نوار پیشرفت از DOM)
        this.isProgressBarVisible = false;

        // ۳. شروع مجدد: با یک تأخیر بسیار کوتاه (1 میلی‌ثانیه) نوار را دوباره به DOM اضافه کن و انیمیشن را شروع کن
        setTimeout(() => {
            this.isProgressBarVisible = true;
            this.isRotating = true; // شروع انیمیشن
            this.cdr.detectChanges();
        }, 1);
    }

    private animateContentChange(callback: () => void) {
        // ۱. محتوا را مخفی کنید (برای شروع انیمیشن Fade-in جدید)
        this.isContentVisible = false;

        // ۲. اجرای تابع کال‌بک (به‌روزرسانی داده‌ها)
        setTimeout(() => {
            callback();

            // ۳. محتوا را دوباره مرئی کنید (شروع انیمیشن Fade-in)
            this.isContentVisible = true;
            this.cdr.detectChanges();
        }, 10); // تأخیر کم برای ریست انیمیشن
    }

    startRotation() {
        this.isRotating = true;
    }

    stopRotation() {
        this.isRotating = false;
    }

    ngOnDestroy() {
        // در این مثال تایمر جاوا اسکریپتی استفاده نمی‌شود، اما اگر استفاده می‌شد اینجا باید پاک می‌شد.
    }
}