import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

// اینترفیس برای قالب مشترک پاسخ‌های API
export interface ApiResponse<T> {
  code: number;
  message: string;
  isSuccess: boolean;
  data: T;
}

// اینترفیس‌های مورد نیاز برای متد getKarname
export interface GetKarnameReq {
    shiftId: string | null;
    firefighterId: string | null;
    itemArzyabieId: string | null;
}

// اینترفیس اصلاح شده بر اساس داده‌های نمونه snake_case
export interface GetKarnameRes {
    add_TestEntityId: string;
    t_L_Noe_Test_ID: string;
    title_Noe_Test: string | null;
    t_L_Items_Arzyabi_ID: string;
    title_Items_Arzyabi: string | null;
    t_L_Vaziyat_Nomreh_ID: string;
    title_Vaziyat_Nomreh: string | null;
    t_Shift_ID: string;
    name_Shift: string | null;
    t_Firefighters_ID: string;
    name_Family_Atash_Neshan: string | null;
    t_Arzyab_ID: string;
    name_Family: string | null;
    t_All_Test_ID: string;
    nomreh: number;
    date: string;
}


// اینترفیس‌های مورد نیاز برای متد getLookups
export interface PrimeNgOption {
  label: string;
  value: string;
}

export interface LookupItem {
  display: string;
  id: string;
}

export interface LookupFirefighter {
    shiftId: string;
    display: string;
    id: string;
}

export interface LookupItemArzyabi {
    noeTestId: string;
    display: string;
    id: string;
}

export interface GetLookupsRes {
    shifts: LookupItem[];
    firefighters: LookupFirefighter[];
    noeTests: LookupItem[];
    itemArzyabies: LookupItemArzyabi[];
}

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getLookups(): Observable<ApiResponse<GetLookupsRes>> {
        return this.http.post<ApiResponse<GetLookupsRes>>(`${this.apiUrl}/Karname/getLookups`, {});
    }

    getKarname(payload: GetKarnameReq): Observable<ApiResponse<GetKarnameRes[]>> {
        return this.http.post<ApiResponse<GetKarnameRes[]>>(`${this.apiUrl}/Karname/getKarnameReq`, payload);
    }
}