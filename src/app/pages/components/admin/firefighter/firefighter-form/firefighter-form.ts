import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirefighterService } from '../../../../services/users/firefighter/firefighter.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from "primeng/button";
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { PostSazmaniService } from '../../../../services/lookups/post-sazmani.service';
import { DarajeService } from '../../../../services/lookups/daraje.service';
import { SabegheKarService } from '../../../../services/lookups/sabeghe-kar.service';
import { LevelService } from '../../../../services/lookups/level.service';
import { ChangeDetectorRef } from '@angular/core';
import { ShiftService } from '../../../../services/lookups/shift.service';
import { DatepickerDirective } from '../../aaap/datepicker';

@Component({
    imports: [
        FormsModule, InputTextModule, ButtonModule, SelectButtonModule, SelectModule,
        PasswordModule, RadioButtonModule, CardModule, ReactiveFormsModule,
        FloatLabelModule, CheckboxModule, DatepickerDirective
    ],
    selector: 'app-firefighter-form',
    templateUrl: './firefighter-form.html',
    styleUrls: ['./firefighter-form.scss']
})
export class FirefighterFormComponent implements OnInit {
    firefighterForm!: FormGroup;
    editingId: string | null = null;
    isEdit = false;
    loading = false;
    myDate: Date | null = null;

    organizationalPosts: { label: string; value: string }[] = [];
    shifts: { label: string; value: string }[] = [];
    ranks: { label: string; value: string }[] = [];
    workExperiences: { label: string; value: string }[] = [];
    levels: { label: string; value: string }[] = [];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private firefighterService: FirefighterService,
        private shiftService: ShiftService,
        private postSazmaniService: PostSazmaniService,
        private darajeService: DarajeService,
        private sabegheKarService: SabegheKarService,
        private levelService: LevelService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.loadLookups();

        this.editingId = this.route.snapshot.paramMap.get('id');
        if (this.editingId) {
            this.isEdit = true;
            this.loadFirefighterData(this.editingId);
        }
    }

    initForm() {
        this.firefighterForm = this.fb.group({
            name_Family: ['', Validators.required],
            nationalId: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            personnelCode: ['', Validators.required],
            mobileNumber: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
            birthDate: ['', Validators.required],
            organizationalPostId: [null, Validators.required],
            rankId: [null, Validators.required],
            workExperienceId: [null, Validators.required],
            levelId: [null, Validators.required],
            shiftId: [null, Validators.required],
            isInShift: [false, Validators.required],
            isActive: [true, Validators.required]
        });
    }

    loadLookups() {
        this.shiftService.getAll().subscribe(res => {
            if (res.isSuccess) {
                this.shifts = res.data.map(item => ({ label: item.display, value: item.id }));
                this.cd.detectChanges();
            }
        });

        this.postSazmaniService.getAll().subscribe(res => {
            if (res.isSuccess) {
                this.organizationalPosts = res.data.map(item => ({ label: item.display, value: item.id }));
                this.cd.detectChanges();
            }
        });

        this.darajeService.getAll().subscribe(res => {
            if (res.isSuccess) {
                this.ranks = res.data.map(item => ({ label: item.display, value: item.id }));
                this.cd.detectChanges();
            }
        });

        this.sabegheKarService.getAll().subscribe(res => {
            if (res.isSuccess) {
                this.workExperiences = res.data.map(item => ({ label: item.display, value: item.id }));
                this.cd.detectChanges();
            }
        });

        this.levelService.getAll().subscribe(res => {
            if (res.isSuccess) {
                this.levels = res.data.map(item => ({ label: item.display, value: item.id }));
                this.cd.detectChanges();
            }
        });
    }

    loadFirefighterData(id: string) {
        this.firefighterService.getFirefighterById(id).subscribe(res => {
            if (res.isSuccess) {
                const data = res.data;
                this.firefighterForm.patchValue({ ...data }); // API میلادی

                // ساخت myDate از رشته میلادی
                const { year, month, day } = this.splitDate(data.birthDate);
                this.myDate = new Date(year, month - 1, day);

                // تاخیر کوتاه برای اجرای updateInputValue دایرکتیو
                setTimeout(() => {
                    const birthCtrl = this.firefighterForm.get('birthDate');
                    birthCtrl?.setValue(birthCtrl.value);
                });
            }
        });
    }

    onDatePicked(date: Date) {
        this.myDate = date;
        // ذخیره میلادی در FormControl
        const gYear = date.getFullYear();
        const gMonth = String(date.getMonth() + 1).padStart(2, '0');
        const gDay = String(date.getDate()).padStart(2, '0');
        this.firefighterForm.get('birthDate')?.setValue(`${gYear}-${gMonth}-${gDay}`);
    }

    splitDate(dateStr: string) {
        const parts = dateStr.split('-');
        return {
            year: Number(parts[0]),
            month: Number(parts[1]),
            day: Number(parts[2])
        }
    }

    save() {
        if (this.firefighterForm.invalid || this.loading) return;

        this.loading = true;
        const formData = this.firefighterForm.value;

        if (this.isEdit) {
            const payload = { ...formData, firefighterId: this.editingId };
            this.firefighterService.editFirefighter(payload).subscribe({
                next: () => {
                    this.loading = false;
                    this.router.navigate(['/firefighters']);
                },
                error: () => { this.loading = false; }
            });
        } else {
            this.firefighterService.addFirefighter(formData).subscribe({
                next: () => {
                    this.loading = false;
                    this.router.navigate(['/firefighters']);
                },
                error: () => { this.loading = false; }
            });
        }
    }

    cancel() {
        this.router.navigate(['/firefighters']);
    }
}
