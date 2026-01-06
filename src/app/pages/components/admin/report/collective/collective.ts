import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CollectiveTable } from './collective-table/collective-table';
import { CollectiveChart } from './collective-chart/collective-chart';
import { ReportService, ApiResponse, GetKarnameReq, GetKarnameRes, GetLookupsRes, PrimeNgOption, LookupItemArzyabi } from '../../../../services/reports/report.service';
import { finalize } from 'rxjs';

// اینترفیس جدید برای داده‌های تبدیل شده
export interface TransformedKarnameRes {
    addTestEntityId: string;
    tLNoeTestId: string;
    titleNoeTest: string | null;
    tLItemsArzyabiId: string;
    titleItemsArzyabi: string | null;
    tLVaziyatNomrehId: string;
    titleVaziyatNomreh: string | null;
    tShiftId: string;
    nameShift: string | null;
    tFirefightersId: string;
    nameFamilyAtashNeshan: string | null;
    tArzyabId: string;
    nameFamily: string | null;
    tAllTestId: string;
    nomreh: number;
    date: string;

}

@Component({
    selector: 'app-collective',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FloatLabelModule,
        ButtonModule,
        SelectModule,
        DatePickerModule,
        CollectiveTable,
        CardModule,
        SelectButtonModule,
        CollectiveChart
    ],
    templateUrl: './collective.html',
    styleUrl: './collective.scss'
})
export class Collective implements OnInit {

    viewMode: 'table' | 'chart' = 'table';
    viewOptions = [
        { label: 'جدول', value: 'table' },
        { label: 'نمودار', value: 'chart' }
    ];

    arzyabForm!: FormGroup;
    karnameData: TransformedKarnameRes[] = [];
    isLoading: boolean = false;

    noeTests: PrimeNgOption[] = [];
    itemArzyabiesAll: LookupItemArzyabi[] = [];
    itemArzyabies: PrimeNgOption[] = [];


    constructor(private fb: FormBuilder, private reportService: ReportService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.arzyabForm = this.fb.group({
            fromDate: [null],
            noeTestId: [null, Validators.required],
            toDate: [null],
            itemArzyabiId: [null, Validators.required]
        });

        this.loadLookups();

        this.arzyabForm.get('noeTestId')?.valueChanges.subscribe(noeTestId => {
            const itemControl = this.arzyabForm.get('itemArzyabiId');

            if (noeTestId === 'ALL') {
                this.itemArzyabies = [];
                this.arzyabForm.patchValue({ itemArzyabiId: null });
                itemControl?.clearValidators();
            } else if (!noeTestId) {
                this.itemArzyabies = [];
                this.arzyabForm.patchValue({ itemArzyabiId: null });
                itemControl?.setValidators(Validators.required);
            } else {
                this.itemArzyabies = this.itemArzyabiesAll.filter(i => i.noeTestId === noeTestId).map(i => ({ label: i.display, value: i.id }));
                this.arzyabForm.patchValue({ itemArzyabiId: null });
                itemControl?.setValidators(Validators.required);
            }
            itemControl?.updateValueAndValidity();
        });
    }

    loadLookups() {
        this.isLoading = true; // در ابتدای درخواست، isLoading را true کن
        this.reportService.getLookups()
            .pipe(finalize(() => {
                this.isLoading = false; // در نهایت (چه موفق و چه ناموفق)، isLoading را false کن
                this.cdr.detectChanges(); // از آنجایی که تغییرات خارج از lifecycle هستند، باید آن را به صورت دستی تشخیص دهیم
            }))
            .subscribe(res => {
                if (res?.isSuccess) {
                    this.noeTests = [
                        { label: 'همه', value: 'ALL' },
                        ...res.data.noeTests.map(x => ({ label: x.display, value: x.id }))
                    ];
                    this.itemArzyabiesAll = res.data.itemArzyabies;
                }
            });
    }

    onSubmit() {
        if (this.arzyabForm.valid) {
            this.isLoading = true;
            const payload = {
                shiftId: null,
                firefighterId: null,
                itemArzyabieId: this.arzyabForm.value.itemArzyabiId
            };

            this.reportService.getKarname(payload)
                .pipe(finalize(() => {
                    this.isLoading = false;
                }))
                .subscribe(res => {
                    if (res?.isSuccess) {
                        this.karnameData = res.data.map(this.transformToCamelCase);
                        this.cdr.detectChanges();
                    }
                });
        }
    }

    private transformToCamelCase(obj: GetKarnameRes): TransformedKarnameRes {
        return {
            addTestEntityId: obj.add_TestEntityId,
            tLNoeTestId: obj.t_L_Noe_Test_ID,
            titleNoeTest: obj.title_Noe_Test,
            tLItemsArzyabiId: obj.t_L_Items_Arzyabi_ID,
            titleItemsArzyabi: obj.title_Items_Arzyabi,
            tLVaziyatNomrehId: obj.t_L_Vaziyat_Nomreh_ID,
            titleVaziyatNomreh: obj.title_Vaziyat_Nomreh,
            tShiftId: obj.t_Shift_ID,
            nameShift: obj.name_Shift,
            tFirefightersId: obj.t_Firefighters_ID,
            nameFamilyAtashNeshan: obj.name_Family_Atash_Neshan,
            tArzyabId: obj.t_Arzyab_ID,
            nameFamily: obj.name_Family,
            tAllTestId: obj.t_All_Test_ID,
            nomreh: obj.nomreh,
            // نگاشت فیلد تاریخ
            date: obj.date
        };
    }
}