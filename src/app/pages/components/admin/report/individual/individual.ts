import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { IndividualTable } from './individual-table/individual-table';
import { IndividualChart } from './individual-chart/individual-chart';
import { ReportService, ApiResponse, GetKarnameReq, GetKarnameRes, GetLookupsRes, LookupItem, LookupFirefighter, PrimeNgOption, LookupItemArzyabi } from '../../../../services/reports/report.service';

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
}

@Component({
    selector: 'app-individual',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FloatLabelModule,
        ButtonModule,
        SelectModule,
        SelectModule,
        DatePickerModule,
        IndividualTable,
        CardModule,
        SelectButtonModule,
        IndividualChart
    ],
    templateUrl: './individual.html',
    styleUrl: './individual.scss'
})
export class Individual implements OnInit {

    viewMode: 'table' | 'chart' = 'table';
    viewOptions = [
        { label: 'جدول', value: 'table' },
        { label: 'نمودار', value: 'chart' }
    ];

    arzyabForm!: FormGroup;
    karnameData: TransformedKarnameRes[] = []; // نوع داده به TransformedKarnameRes تغییر کرد

    shifts: PrimeNgOption[] = [];
    firefightersAll: LookupFirefighter[] = [];
    firefighters: PrimeNgOption[] = [];
    noeTests: PrimeNgOption[] = [];
    itemArzyabiesAll: LookupItemArzyabi[] = [];
    itemArzyabies: PrimeNgOption[] = [];


    constructor(private fb: FormBuilder, private reportService: ReportService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        console.log(this.viewMode);
        this.arzyabForm = this.fb.group({
            shiftId: [null, Validators.required],
            firefighterId: [null, Validators.required],
            fromDate: [null],
            noeTestId: [null, Validators.required],
            toDate: [null],
            itemArzyabiId: [null, Validators.required]
        });

        this.loadLookups();

        this.arzyabForm.get('shiftId')?.valueChanges.subscribe(shiftId => {
            if (!shiftId) {
                this.firefighters = [];
                this.arzyabForm.patchValue({ firefighterId: null });
            } else {
                this.firefighters = this.firefightersAll.filter(f => f.shiftId === shiftId).map(f => ({ label: f.display, value: f.id }));
            }
        });

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
        this.reportService.getLookups()
            .subscribe(res => {
                if (res?.isSuccess) {
                    this.shifts = res.data.shifts.map(x => ({ label: x.display, value: x.id }));
                    this.firefightersAll = res.data.firefighters;
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
            const payload: GetKarnameReq = {
                shiftId: this.arzyabForm.value.shiftId,
                firefighterId: this.arzyabForm.value.firefighterId,
                itemArzyabieId: this.arzyabForm.value.itemArzyabiId
            };

            this.reportService.getKarname(payload)
                .subscribe(res => {
                    if (res?.isSuccess) {
                        this.karnameData = res.data.map(this.transformToCamelCase); // اعمال تابع تبدیل
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
            nomreh: obj.nomreh
        };
    }
}