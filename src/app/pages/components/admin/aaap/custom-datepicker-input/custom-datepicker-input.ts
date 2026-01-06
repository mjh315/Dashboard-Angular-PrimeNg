import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomDatepickerComponent } from "../custom-datepicker/custom-datepicker";
import { FormsModule } from '@angular/forms';
import * as jalaali from 'jalaali-js';
import { CommonModule } from '@angular/common';
import { DatepickerDirective } from '../datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  
  selector: 'app-custom-datepicker-input',
  imports: [CommonModule, CustomDatepickerComponent, FormsModule, DatepickerDirective,FloatLabelModule,InputTextModule  
  ],
  templateUrl: './custom-datepicker-input.html',
  styleUrl: './custom-datepicker-input.scss'
})
export class CustomDatepickerInput {
  myDate: Date | null = new Date();


  l(){
    console.log(this.myDate);
  }
}
