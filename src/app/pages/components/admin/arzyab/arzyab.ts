import { Component } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-arzyab',
  imports: [InputTextModule, SelectButtonModule, SelectModule, PasswordModule, RadioButtonModule, CardModule, ReactiveFormsModule, FloatLabelModule],
  templateUrl: './arzyab.html',
  styleUrl: './arzyab.scss'
})
export class Arzyab {


  stateOptions: any[] = [{ label: 'فعال', value: 'active' }, { label: 'غیر فعال', value: 'inactive' }];

  value: string = 'off';


  arzyabForm!: FormGroup;
  // یک آرایه برای گزینه‌های dropdown ایجاد کنید
  organizationalPosts = [
    { label: 'مدیر', value: 'مدیر' },
    { label: 'کارشناس ارشد', value: 'کارشناس ارشد' },
    { label: 'کارشناس', value: 'کارشناس' }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.arzyabForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nationalId: ['', Validators.required],
      username: ['', Validators.required],
      organizationalPost: [null, Validators.required],
      staffNumber: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      password: ['', Validators.required],
      status: ['active', Validators.required]
    });
  }

  onSubmit() {
    if (this.arzyabForm.valid) {
      console.log('Form Submitted!', this.arzyabForm.value);
      // در اینجا می‌توانید داده‌ها را به سرویس خود ارسال کنید (مثلاً از طریق یک API)
    } else {
      console.log('Form is invalid.');
      // می‌توانید فیلدهایی که اعتبار ندارند را مشخص کنید
    }
  }
}
