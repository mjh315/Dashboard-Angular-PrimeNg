import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { GetKarnameRes } from '../../../../../services/reports/report.service';
import { TransformedKarnameRes } from '../individual';

@Component({
  selector: 'app-individual-table',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './individual-table.html',
  styleUrl: './individual-table.scss'
})
export class IndividualTable {
  @Input() data: TransformedKarnameRes[] = [];
}