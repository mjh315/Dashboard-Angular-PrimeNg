// src/app/services/dashboard-data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// فرض بر این است که مدل‌های بالا را import می‌کنید
import { ApiResponse, DashboardWidgetsData } from '../../models/dashboard-data.model';
import { ActivitiesOfTheLastMonthDto } from '../../models/activities.model';
import { AvrageNoeTestDto } from '../../models/noe-test-quarter-average.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardDataService {

    private apiUrl = 'https://physicalfitnesspanelapi.algacall.ir/api/Dashboard';

    constructor(private http: HttpClient) { }

    getWidgetsData(): Observable<ApiResponse<DashboardWidgetsData>> {
        // چون متد GET است، نیازی به ارسال بدنه (Body) نیست.
        return this.http.get<ApiResponse<DashboardWidgetsData>>(`${this.apiUrl}/GetWidgetsData`);
    }


    /**
     * دریافت فعالیت‌های ماه اخیر
     */
    getActivitiesOfTheLastMonth(): Observable<ApiResponse<ActivitiesOfTheLastMonthDto>> {
        const url = `${this.apiUrl}/GetActivitiesOfTheLastMonth`;
        return this.http.get<ApiResponse<ActivitiesOfTheLastMonthDto>>(url);
    }


        /**
     * دریافت میانگین نمره انواع تست در ۴ سه‌ماهه گذشته
     */
    getAvrageNoeTestInQuarters(): Observable<ApiResponse<AvrageNoeTestDto[]>> {
        const url = `${this.apiUrl}/GetAvrageNoeTestInQuarters`; 
        return this.http.get<ApiResponse<AvrageNoeTestDto[]>>(url);
    }
}