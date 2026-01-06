import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddFirefighterRequest {
    name_Family: string;
    nationalId: string;
    personnelCode: string;
    mobileNumber: string;
    birthDate: string;
    organizationalPostId: string;
    rankId: string;
    workExperienceId: string;
    levelId: string;
    isInShift: boolean;
    isActive: boolean;
    shiftId: string;
}

export interface EditFirefighterRequest extends AddFirefighterRequest {
    firefighterId: string;
}

export interface FirefighterListItem {
    firefighterId: string;
    name_Family: string;
    nationalId: string;
    personnelCode: string;
    mobileNumber: string;
    birthDate: string;
    organizationalPostName: string;
    rankName: string;
    workExperienceName: string;
    levelName: string;
    isInShift: boolean;
    isActive: boolean;
    shiftId: string;
    shiftName: string;
}

export interface EditFirefighterListItem extends FirefighterListItem {
    organizationalPostId: string;
    rankId: string;
    workExperienceId: string;
    levelId: string;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    isSuccess: boolean;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class FirefighterService {
    private baseUrl = 'https://physicalfitnesspanelapi.algacall.ir/api/Firefighters';

    constructor(private http: HttpClient) { }

    addFirefighter(payload: AddFirefighterRequest): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/add`, payload);
    }

    listFirefighters(): Observable<ApiResponse<FirefighterListItem[]>> {
        return this.http.get<ApiResponse<FirefighterListItem[]>>(`${this.baseUrl}/list`);
    }

    editFirefighter(payload: EditFirefighterRequest): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/edit`, payload,  { headers: { 'Content-Type': 'application/json' }});
    }

    deleteFirefighter(id: string): Observable<ApiResponse<boolean>> {
        return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/delete/${id}`);
    }

    getFirefighterById(id: string): Observable<ApiResponse<EditFirefighterListItem>> {
        return this.http.get<ApiResponse<EditFirefighterListItem>>(`${this.baseUrl}/get/${id}`);
    }
}