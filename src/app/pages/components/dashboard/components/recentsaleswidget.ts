// src/app/components/recent-sales-widget/recentsaleswidget.ts
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // **جدید: برای [(ngModel)] در MultiSelect**
import { RippleModule } from 'primeng/ripple';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RecentTest } from '../../../models/recent-test.model';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';

// **تغییرات برای PrimeNG V20+**
// وارد کردن مستقیم کامپوننت‌ها به جای ماژول‌ها یا از مسیرهای جدید
import { SelectModule } from 'primeng/select'; // **واردات مستقیم**
import { MultiSelectModule } from 'primeng/multiselect'; // **واردات مستقیم**
import { RecentTestsService } from '../../../services/dashboard/recent-tests.service';
import { FloatLabelModule } from 'primeng/floatlabel';


// تعریف ساختار Column
interface Column {
    field: string;
    header: string;
    width: string;
    isFilterable: boolean;
    filterType: 'text' | 'dropdown';
}


@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    // به‌روزرسانی imports با حذف ماژول‌های قدیمی و اضافه کردن Dropdown و MultiSelect
    imports: [
        CommonModule,
        FormsModule, // اضافه شدن برای MultiSelect
        TableModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        FloatLabelModule,
        SelectModule, // **استفاده از کامپوننت**
        MultiSelectModule // **استفاده از کامپوننت**
    ],
    template: `<div class="card p-5 bg-white rounded-lg mb-5!" dir="rtl">
    <div class="flex flex-col justify-between items-start  mb-4 border-b pb-4">
        <div class="font-semibold text-xl">تست‌های اخیر</div>

        
        <div class="flex flex-row items-center  sm:space-y-0 sm:space-x-4 sm:space-x-reverse w-full sm:w-auto mt-3">
        



            <p-floatlabel variant="on" class="m-0" style="margin-right: 0;">
                <input pInputText 
                            type="text" 
                            (input)="onGlobalFilter(dt, $event)"  />
                <label for="on_label">جستجوی کلی..</label>
            </p-floatlabel>


            <p-multiSelect 
            class="mr-3"
                [options]="cols" 
                [(ngModel)]="selectedColumns" 
                optionLabel="header"
                selectedItemsLabel="{0} ستون انتخاب شده"
                [style]="{'min-width': '200px'}"
                placeholder="انتخاب ستون‌ها"
                display="chip"
            ></p-multiSelect>
        </div>
    </div>

    <div *ngIf="loading" class="animate-pulse space-y-4">
        <div class="h-8 bg-gray-200 rounded"></div>
        <div class="h-8 bg-gray-200 rounded w-5/6"></div>
        <div class="h-8 bg-gray-200 rounded w-4/6"></div>
        <div class="h-8 bg-gray-200 rounded w-5/6"></div>
        <div class="h-8 bg-gray-200 rounded w-3/6"></div>
    </div>
    
    <p-table 
        [customSort]="true"
        *ngIf="!loading" 
        #dt 
        [value]="recentTests" 
        [paginator]="true" 
        [rows]="5" 
        [rowsPerPageOptions]="[5, 10, 20]" 
        [globalFilterFields]="['titleFireFighter', 'titleItemArzyabi', 'titleNoeTest', 'titleShift', 'titleArzyab']"
        [filterDelay]="0"
        [tableStyle]="{'min-width': '50rem'}"
        responsiveLayout="scroll"
        styleClass="p-datatable-gridlines p-datatable-sm"
    >
        <ng-template pTemplate="header">
            <tr>
                <ng-container *ngFor="let col of selectedColumns">
                    <th [pSortableColumn]="col.field" 
                        [style.width]="col.width" 
                        class="text-right whitespace-nowrap"
                        pResizableColumn
                    >
                        {{ col.header }}
                        <p-sortIcon [field]="col.field"></p-sortIcon>
                    </th>
                </ng-container>
            </tr>
            <tr>
                <ng-container *ngFor="let col of selectedColumns">
                    <th [style.width]="col.width">
                        <ng-container [ngSwitch]="col.field">
                            <p-select *ngSwitchCase="'titleNoeTest'" 
                                [options]="uniqueNoeTestValues" 
                                placeholder="نوع تست"
                                (onChange)="dt.filter($event.value, col.field, 'equals')"
                                [showClear]="true"
                                optionLabel="label" 
                                optionValue="value"
                                [style]="{'width': '100%'}"
                            ></p-select>

                            <p-select *ngSwitchCase="'titleShift'" 
                                [options]="uniqueShiftValues" 
                                placeholder="شیفت"
                                (onChange)="dt.filter($event.value, col.field, 'equals')"
                                [showClear]="true"
                                optionLabel="label" 
                                optionValue="value"
                                [style]="{'width': '100%'}"
                            ></p-select>

                            <input *ngSwitchDefault 
                                pInputText 
                                type="text" 
                                (input)="dt.filter($any($event.target).value, col.field, 'contains')" 
                                placeholder="جستجو..."
                                class="p-column-filter w-full"
                            />
                        </ng-container>
                    </th>
                </ng-container>
            </tr>
        </ng-template>
        
        <ng-template pTemplate="body" let-test>
            <tr class="hover:bg-gray-50">
                <ng-container *ngFor="let col of selectedColumns">
                    <td class="text-gray-700">
                        {{ test[col.field] }}
                    </td>
                </ng-container>
            </tr>
        </ng-template>
        
        <ng-template pTemplate="emptymessage">
            <tr>
                <td [attr.colspan]="selectedColumns.length" class="text-center py-4 text-gray-500">
                    موردی یافت نشد.
                </td>
            </tr>
        </ng-template>
    </p-table>
</div>`,
    providers: [RecentTestsService]
})

export class RecentSalesWidget implements OnInit {
    recentTests: RecentTest[] = [];
    loading: boolean = true;

    uniqueShiftValues: { label: string, value: string }[] = [];
    uniqueNoeTestValues: { label: string, value: string }[] = [];

    cols!: Column[];
    selectedColumns!: Column[];

    @ViewChild('dt') dt!: Table;

    constructor(private recentTestsService: RecentTestsService, private cd: ChangeDetectorRef) {
        this.cols = [
            { field: 'titleFireFighter', header: 'نام آتش‌نشان', width: '20%', isFilterable: true, filterType: 'text' },
            { field: 'titleItemArzyabi', header: 'نام تست', width: '25%', isFilterable: true, filterType: 'text' },
            { field: 'titleNoeTest', header: 'نوع تست', width: '20%', isFilterable: true, filterType: 'dropdown' },
            { field: 'titleShift', header: 'شیفت', width: '10%', isFilterable: true, filterType: 'dropdown' },
            { field: 'titleArzyab', header: 'ارزیاب', width: '15%', isFilterable: true, filterType: 'text' },
            { field: 'nomreh', header: 'نمره', width: '10%', isFilterable: true, filterType: 'text' },
        ];
        this.selectedColumns = this.cols;
    }

    ngOnInit() {
        this.loading = true;
        this.recentTestsService.getRecentTests().subscribe({
            next: (response) => {
                if (response.isSuccess && response.data?.items) {
                    this.recentTests = response.data.items;

                    this.extractUniqueFilterValues(this.recentTests);

                    this.loading = false;
                    this.cd.detectChanges();
                } else {
                    console.error('API call failed or returned empty data:', response.message);
                    this.loading = false;
                }
            },
            error: (err) => {
                console.error('Error fetching recent tests:', err);
                this.loading = false;
            }
        });
    }

    extractUniqueFilterValues(data: RecentTest[]) {
        const shifts = [...new Set(data.map(item => item.titleShift))];
        this.uniqueShiftValues = shifts.map(s => ({ label: s, value: s }));

        const noeTests = [...new Set(data.map(item => item.titleNoeTest))];
        this.uniqueNoeTestValues = noeTests.map(t => ({ label: t, value: t }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}