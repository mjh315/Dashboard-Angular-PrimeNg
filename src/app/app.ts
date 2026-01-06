import { Component, LOCALE_ID, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CalendarChart } from "./pages/components/dashboard/components/calendar-chart/calendar-chart";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, CalendarChart],
    templateUrl: './app.html'
})
export class AppComponent {


}
