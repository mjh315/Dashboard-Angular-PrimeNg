// bestsellingwidget.ts (نام پیشنهادی: noe-test-avrage-widget.component.ts)

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Subscription } from 'rxjs';
import { NoeTestAvrageService } from '../../../services/dashboard/noe-test-avrage.service';
import { GetNoeTestAvragesDto } from '../../../models/noe-test-avrage.model';

@Component({
    standalone: true,
    selector: 'app-noe-test-avrage-widget',
    imports: [CommonModule, ButtonModule, MenuModule], 
    template: `
    
    <div class="card mb-8!" dir="rtl">
    
    <div class="flex justify-between items-center mb-6">
        <div class="font-semibold text-xl">میانگین نمره انواع تست‌ها</div>
        <div>
            <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
            <p-menu #menu [popup]="true" [model]="items"></p-menu>
        </div>
    </div>
    
    <ul class="list-none p-0 m-0">
        
        <ng-container *ngIf="loading">
            <li *ngFor="let item of [1,2,3,4]" 
                class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 p-2">
                
                <div class="flex items-center">
                    <div class="h-4 w-4 rounded-full bg-surface-200 dark:bg-surface-600 mr-3 animate-pulse"></div> 
                    
                    <div>
                        <div class="h-4 w-40 rounded bg-surface-200 dark:bg-surface-600 mb-1 animate-pulse"></div>
                        <div class="h-3 w-24 rounded bg-surface-200 dark:bg-surface-600 mt-1 animate-pulse"></div>
                    </div>
                </div>
                
                <div class="mt-2 md:mt-0 flex items-center" dir="ltr">
                    <div class="h-2 w-24 rounded-full bg-surface-200 dark:bg-surface-600 animate-pulse"></div>
                    <div class="h-4 w-10 rounded bg-surface-200 dark:bg-surface-600 ml-4 animate-pulse"></div>
                </div>
            </li>
        </ng-container>
        
        <ng-container *ngIf="!loading">
            <ng-container *ngFor="let noeTest of noeTestAvrages; let i = index">
                <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-3 p-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer"
                    (click)="toggleDetails(noeTest.noeTestId)">
                    
                    <div class="flex items-center">
                        <i class="pi pi-chevron-left text-muted-color ml-3 transition-transform duration-300"
                           [class.rotate-90]="noeTest.noeTestId === expandedNoeTestId"></i>
                           
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mb-1 md:mb-0">
                                {{ noeTest.noeTestName }}
                            </span>
                            <div class="mt-1 text-muted-color text-sm">
                                {{ noeTest.itemArzyabiAvrage.length }} آیتم
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-2 md:mt-0 flex items-center"  dir="ltr">
                        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                            <div [class]="getProgressBarColor(i)" class="h-full" [style.width.%]="noeTest.avrage"></div>
                        </div>
                        
                        <span [class]="getAvrageTextColor(i)" class="ml-4 font-medium">
                            {{ noeTest.avrage | number:'1.0-2' }}
                        </span>
                        <span class="text-muted-color text-sm ml-1">%</span>
                    </div>
                </li>
                
                <div *ngIf="noeTest.noeTestId === expandedNoeTestId" 
                     class="ml-8 border-r-2 border-surface-200 dark:border-surface-600 pr-3 pb-3 transition-all duration-300 ease-in-out overflow-hidden">
                    
                    <ul class="list-none p-0 m-0">
                        <li *ngFor="let item of noeTest.itemArzyabiAvrage; let j = index"
                            class="flex justify-between items-center py-2 border-b border-surface-200 dark:border-surface-700 last:border-b-0">
                            
                            <div class="text-surface-700 dark:text-surface-300 text-sm font-light">
                                {{ item.temArzyabiName }}
                            </div>
                            
                            <div class="flex items-center" dir="ltr">
                                 <div class="bg-surface-200 dark:bg-surface-600 rounded-full overflow-hidden w-16" style="height: 6px">
                                    <div [class]="getProgressBarColor(i)" class="h-full" [style.width.%]="item.avrage"></div>
                                </div>
                                <span [class]="getAvrageTextColor(i)" class="ml-3 text-sm font-medium">
                                    {{ item.avrage | number:'1.0-2' }}
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </ng-container>

            <li *ngIf="noeTestAvrages.length === 0" class="text-center py-4 text-muted-color">
                داده‌ای برای نمایش میانگین تست‌ها وجود ندارد.
            </li>
        </ng-container>
    </ul>
</div>`,
    providers: [NoeTestAvrageService]
})
export class BestSellingWidget implements OnInit, OnDestroy {
    
    noeTestAvrages: GetNoeTestAvragesDto[] = [];
    private subscription: Subscription = new Subscription();
    
    // فیلد جدید برای مدیریت وضعیت بارگذاری
    loading: boolean = true; 
    
    expandedNoeTestId: string | null = null; 
    
    private colors = ['bg-orange-500', 'bg-cyan-500', 'bg-pink-500', 'bg-green-500', 'bg-purple-500', 'bg-teal-500'];
    private textColors = ['text-orange-500', 'text-cyan-500', 'text-pink-500', 'text-green-500', 'text-purple-500', 'text-teal-500'];


    constructor(private noeTestAvrageService: NoeTestAvrageService) {}

    ngOnInit(): void {
        this.loadNoeTestAvrages();
    }

    loadNoeTestAvrages(): void {
        this.loading = true; // شروع بارگذاری
        this.subscription.add(
            this.noeTestAvrageService.getNoeTestAvrages().subscribe({
                next: (response) => {
                    if (response.isSuccess && response.data) {
                        this.noeTestAvrages = response.data;
                    }
                    this.loading = false; // پایان موفقیت آمیز بارگذاری
                },
                error: (err) => {
                    console.error('Failed to load Noe Test Avrages:', err);
                    this.loading = false; // پایان بارگذاری حتی در صورت خطا
                }
            })
        );
    }
    
    toggleDetails(noeTestId: string): void {
        if (this.expandedNoeTestId === noeTestId) {
            this.expandedNoeTestId = null; 
        } else {
            this.expandedNoeTestId = noeTestId; 
        }
    }
    
    getProgressBarColor(index: number): string {
        return this.colors[index % this.colors.length];
    }
    
    getAvrageTextColor(index: number): string {
        return this.textColors[index % this.textColors.length];
    }


    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // بخش منو
    menu: any = null;

    items = [
        { label: 'Refresh', icon: 'pi pi-fw pi-refresh' },
        { label: 'View Details', icon: 'pi pi-fw pi-search' }
    ];
}