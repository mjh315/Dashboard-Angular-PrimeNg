import { Component } from '@angular/core';
import { FirefighterListComponent } from './firefighter-list/firefighter-list';

@Component({
  selector: 'app-firefighter',
  imports: [FirefighterListComponent],
  templateUrl: './firefighter.html',
//   styleUrl: './firefighter.scss'
})
export class FirefighterComponent {
}