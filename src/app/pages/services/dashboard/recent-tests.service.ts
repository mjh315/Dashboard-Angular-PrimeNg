// src/app/services/recent-tests.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecentTestsResponse } from '../../models/recent-test.model';

@Injectable({
    providedIn: 'root'
})
export class RecentTestsService {
    private apiUrl = 'https://physicalfitnesspanelapi.algacall.ir/api/Dashboard/GetRecentTests';

    constructor(private http: HttpClient) {}

    getRecentTests(): Observable<RecentTestsResponse> {
        const body = {
            pageNumber: 0,
            pageSize: 30, // 30 عدد برای نمایش در جدول
            searchTerm: "",
            searchFields: [],
            additionalFilters: {}
        };

        // در صورت نیاز به هدرهای خاص، آنها را تنظیم کنید.
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json-patch+json',
                'accept': '*/*'
            })
        };

        return this.http.post<RecentTestsResponse>(this.apiUrl, body, httpOptions);
    }
}