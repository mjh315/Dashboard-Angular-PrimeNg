import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArzyabService, AddArzyabRequest } from '../../../../services/users/arzyab/arzyab.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from "primeng/button";
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { OrganizationalPostService } from '../../../../services/lookups/organizational-post.service';

@Component({
  imports: [FormsModule,InputTextModule, ButtonModule, SelectButtonModule, SelectModule, PasswordModule, RadioButtonModule, CardModule, ReactiveFormsModule, FloatLabelModule],
  selector: 'app-arzyab-form',
  templateUrl: './arzyab-form.html',
  styleUrls: ['./arzyab-form.scss']
})
export class ArzyabForm implements OnInit {
  arzyabForm!: FormGroup;
  editingId: string | null = null;
  isEdit = false;
  organizationalPosts: { label: string; value: string }[] = [];
  stateOptions: any[] = [{ label: 'فعال', value: '1' }, { label: 'غیر فعال', value: '0' }];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private organizationalPostService: OrganizationalPostService,

    private router: Router,
    private arzyabService: ArzyabService
  ) { }

  ngOnInit(): void {
    this.arzyabForm = this.fb.group({
      name_Family: ['', Validators.required],
      nationalId: ['', Validators.required],
      username: ['', Validators.required],
      organizationalPost: [null, Validators.required],
      staffNumber: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      password: ['', Validators.required],
      status: ['1', Validators.required]
    });

    this.editingId = this.route.snapshot.paramMap.get('id');
    if (this.editingId) {
      this.isEdit = true;
      this.arzyabService.getArzyabById(this.editingId).subscribe(res => {
        if (res.isSuccess) {
          const data = res.data;
          this.arzyabForm.patchValue({
            name_Family: data.name_Family,
            nationalId: data.nationalId,
            username: data.username,
            organizationalPost: data.organizationalPostId,
            organizationalPostId:  data.organizationalPostId,
            staffNumber: data.staffNumber,
            mobileNumber: data.mobileNumber,
            password: '', // رمز رو معمولاً خالی می‌ذاریم
            status: data.isActive
          });
        }
      });
    }

    this.organizationalPostService.getAll().subscribe(res => {
      if (res.isSuccess) {
        this.organizationalPosts = res.data.map(post => ({
          label: post.display,
          value: post.id
        }));
      }
    });


  }

  save() {
    if (this.arzyabForm.invalid) return;

    const formData = this.arzyabForm.value;

    if (this.isEdit) {
      this.arzyabService.editArzyab({ idArzyab: this.editingId, ...formData })
        .subscribe(() => this.router.navigate(['/arzyab']));
    } else {
      var dd: AddArzyabRequest = {
        name_Family: this.arzyabForm.get('name_Family')?.value ?? "",
        mobileNumber: this.arzyabForm.get('mobileNumber')?.value ?? "",
        nationalId: this.arzyabForm.get('nationalId')?.value ?? "",
        organizationalPost: this.arzyabForm.get('organizationalPost')?.value ?? "",
        password: this.arzyabForm.get('password')?.value ?? "",
        staffNumber: this.arzyabForm.get('staffNumber')?.value ?? "",
        status: this.arzyabForm.get('status')?.value ?? "0",
        username: this.arzyabForm.get('username')?.value ?? ""
      };
      this.arzyabService.addArzyab(dd)
        .subscribe(() => this.router.navigate(['/arzyab']));
    }
  }

  cancel() {
    this.router.navigate(['/arzyab']);
  }
}
