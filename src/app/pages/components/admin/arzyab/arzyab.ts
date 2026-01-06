import { ChangeDetectorRef, Component } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { ArzyabListItem, ArzyabService } from '../../../services/users/arzyab/arzyab.service';
import { OrganizationalPostService } from '../../../services/lookups/organizational-post.service';
import { TableModule } from 'primeng/table';
import { ArzyabList } from "./arzyab-list/arzyab-list";

@Component({
  selector: 'app-arzyab',
  imports: [TableModule, InputTextModule, ButtonModule, SelectButtonModule, SelectModule, PasswordModule, RadioButtonModule, CardModule, ReactiveFormsModule, FloatLabelModule, ArzyabList],
  templateUrl: './arzyab.html',
  styleUrl: './arzyab.scss'
})
export class Arzyab {
 
}
