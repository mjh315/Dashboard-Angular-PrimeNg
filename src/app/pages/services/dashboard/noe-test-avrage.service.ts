import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, GetNoeTestAvragesDto } from '../../models/noe-test-avrage.model';

@Injectable({
    providedIn: 'root'
})
export class NoeTestAvrageService {
    // URL را با آدرس API لوکال یا اصلی خود تنظیم کنید
    private apiUrl = 'https://physicalfitnesspanelapi.algacall.ir/api/Dashboard/GetNoeTestAvrages'; 
    // private apiUrl = 'https://physicalfitnesspanelapi.algacall.ir/api/Dashboard/GetNoeTestAvrages'; // (مثال از فایل قبلی)

    constructor(private http: HttpClient) {}

    /**
     * اطلاعات میانگین تست‌ها را از سرور دریافت می‌کند
     * خروجی: Observable<ApiResponse<GetNoeTestAvragesDto[]>>
     */
    getNoeTestAvrages(): Observable<ApiResponse<GetNoeTestAvragesDto[]>> {
        // این یک فراخوانی GET است، بنابراین نیازی به body نیست.
        return this.http.get<ApiResponse<GetNoeTestAvragesDto[]>>(this.apiUrl);
    }
}