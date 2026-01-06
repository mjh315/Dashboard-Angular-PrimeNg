import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { CardModule } from 'primeng/card';

// 🟩 اضافه‌شده: moment-jalaali برای تبدیل تاریخ‌ها
import moment from 'moment-jalaali';

// فعال‌کردن پشتیبانی از تقویم شمسی
moment.loadPersian({ dialect: 'persian-modern' });



// تعریف ساختار داده‌های ورودی
interface FireFighterDetail {
    fireFighterId: string;
    name: string;
    date_Tavalod: string;
    date_Create: string;
}

interface StatsData {
    numberOfFireFighters: number;
    numberOfLastJoined: number;
    fireFighters: FireFighterDetail[];
}

@Component({
    standalone: true,
    selector: 'app-new-firefighters-card',
    imports: [CommonModule, CardModule],
    styles: [`
        /* تعریف ارتفاع ثابت برای بخش چرخشی برای جلوگیری از پرش عناصر زیرین (CLS) */
        .rotating-content-area {
            min-height: 48px; /* ارتفاع کافی برای نگهداری محتوا و پدینگ */
            padding-bottom: 20px; /* فضای پایین برای دات‌ها */
            margin-top: 4rem;
        }
        
        /* ظرف نوار پیشرفت: برای قرار دادن در پایین محتوای چرخشی */
        .progress-bar-wrapper {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px; 
            background-color: var(--surface-300, #cccccc); 
            z-index: 1; 
        }
        
        /* نوار پیشرفت متحرک */
        .progress-bar {
            height: 100%;
            background-color: var(--primary-color, #1e90ff); 
            width: 0%; 
        }
        
        /* انیمیشن شمارش معکوس (۶ ثانیه) */
        .animate-progress {
            animation: countdown 6000ms linear forwards;
        }

        @keyframes countdown {
            0% { width: 0%; } 
            100% { width: 100%; } 
        }

        /* انیمیشن اصلی محتوا (Fade-in با کمی Scale) - برای نام و تاریخ تولد */
        .fade-in-content {
            animation: fastFadeIn 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        @keyframes fastFadeIn {
            0% { opacity: 0; transform: scale(0.98); }
            100% { opacity: 1; transform: scale(1); }
        }
    `],
    template: `
        <div dir="rtl" class="card mb-5 p-0 h-[13rem]"  style="padding-bottom: 0.768rem; padding-right: 0; padding-left: 0;"
             (mouseenter)="stopRotation()" 
             (mouseleave)="startRotation()">

            <!-- بخش ثابت: تعداد کل آتش‌نشان‌ها و آیکون -->
            <div class="flex justify-between mb-10" style="padding-right: 2rem; padding-left: 2rem;">
                <div>
                    <!-- تعداد کل آتش‌نشان‌ها -->
                    <span class="block text-muted-color font-medium mb-3">تعداد آتش‌نشان‌ها</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                        {{ statsData?.numberOfFireFighters }} آتش‌نشان                   <span class="text-primary font-medium text-base">
                    ({{ statsData?.numberOfLastJoined }} جدید)
                    </span>
                    </div>
                </div>
                <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" 
                     style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-users text-cyan-500 text-xl"></i>
                </div>
            </div>
            
            <!-- بخش متحرک: نمایش آتش‌نشان‌های جدید -->
            <div class=" relative rotating-content-area justify-content-center rounded-lg flex flex-row items-center shadow-lg overflow-hidden" style=" justify-content: center;">

                <!-- Progress Bar Wrapper -->
                <div class="progress-bar-wrapper">
                    <!-- Progress Bar Element -->
                    <div *ngIf="isProgressBarVisible"
                         class="progress-bar animate-progress"
                         [style.animationPlayState]="isRotating ? 'running' : 'paused'"
                         (animationend)="handleAnimationEnd()">
                    </div>
                </div>

                <!-- محتوای چرخشی آتش‌نشان جدید -->
                <div *ngIf="isContentVisible && currentFireFighter" class="fade-in-content">

                    <div class="text-muted-color">
                         {{ currentFireFighter.name }} - تاریخ تولد: {{ currentFireFighter.date_Tavalod | date:'yyyy/MM/dd' }}
                    </div>
                    <!-- نشانگرهای چرخشی (Dots) -->
                    <div class="flex justify-center relative " style="top: 10px;">
                        <div *ngFor="let fireFighter of statsData?.fireFighters; let i = index" 
                             class="mx-1 cursor-pointer rounded-full h-2 w-2"
                             [ngClass]="{'bg-primary': i === currentIndex, 'bg-surface-300': i !== currentIndex}"
                             (click)="goToFireFighter(i)">
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `
})
export class FireFighterStatsCardComponent implements OnInit, OnDestroy {

    @Input() data?: StatsData;

    statsData: StatsData | undefined;
    currentFireFighter: FireFighterDetail | null = null;
    currentIndex: number = 0;

    isProgressBarVisible: boolean = true;
    isRotating: boolean = true;
    isContentVisible: boolean = true;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        if (this.data) {
            this.statsData = {
                ...this.data,
                fireFighters: this.data.fireFighters.map(f => ({
                    ...f,
                    date_Tavalod: moment(f.date_Tavalod).format('jYYYY/jMM/jDD'),
                    date_Create: moment(f.date_Create).format('jYYYY/jMM/jDD')
                }))
            }; if (this.statsData.fireFighters && this.statsData.fireFighters.length > 0) {
                this.currentFireFighter = this.statsData.fireFighters[this.currentIndex];
                this.startNewAnimationCycle();
            }
        }
    }

    goToFireFighter(index: number) {
        if (!this.statsData || !this.statsData.fireFighters || index === this.currentIndex) return;

        this.stopRotation();
        this.currentIndex = index;

        this.animateContentChange(() => {
            this.currentFireFighter = this.statsData!.fireFighters[this.currentIndex];
            this.startNewAnimationCycle();
        });
    }

    handleAnimationEnd() {
        if (!this.isRotating || !this.statsData || !this.statsData.fireFighters || this.statsData.fireFighters.length === 0) return;

        // به آیتم بعدی بروید
        this.currentIndex = (this.currentIndex + 1) % this.statsData.fireFighters.length;

        this.animateContentChange(() => {
            this.currentFireFighter = this.statsData!.fireFighters[this.currentIndex];
            this.startNewAnimationCycle();
        });
    }

    private startNewAnimationCycle() {
        this.isRotating = false;
        this.isProgressBarVisible = false;

        setTimeout(() => {
            this.isProgressBarVisible = true;
            this.isRotating = true;
            this.cdr.detectChanges();
        }, 1);
    }

    private animateContentChange(callback: () => void) {
        this.isContentVisible = false;

        setTimeout(() => {
            callback();
            this.isContentVisible = true;
            this.cdr.detectChanges();
        }, 10);
    }

    startRotation() {
        this.isRotating = true;
    }

    stopRotation() {
        this.isRotating = false;
    }

    ngOnDestroy() { }
}
