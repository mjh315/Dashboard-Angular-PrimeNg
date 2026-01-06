import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddArzyabRequest {
    name_Family: string;
    nationalId: string;
    username: string;
    organizationalPost: string;
    staffNumber: string;
    mobileNumber: string;
    password: string;
    status: string;
}

export interface EditArzyabRequest extends AddArzyabRequest {
    idArzyab: string;
}


export interface EditArzyabListItem {
    idArzyab: string;
    name_Family: string;
    nationalId: string;
    username: string;
    organizationalPostName: string;
    organizationalPostId: string;
    staffNumber: string;
    mobileNumber: string;
    isActive: boolean;
}

export interface ArzyabListItem {
    idArzyab: string;
    name_Family: string;
    nationalId: string;
    username: string;
    organizationalPostName: string;
    staffNumber: string;
    mobileNumber: string;
    isActive: boolean;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    isSuccess: boolean;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class ArzyabService {
    private baseUrl = 'https://physicalfitnesspanelapi.algacall.ir/api/Arzyab';

    constructor(private http: HttpClient) { }

    addArzyab(payload: AddArzyabRequest) {
        return this.http.post<ApiResponse<boolean>>(
            `${this.baseUrl}/addArzyab`,
            payload,
            { headers: { 'Content-Type': 'application/json-patch+json' } }
        );
    }

    listArzyab(): Observable<ApiResponse<ArzyabListItem[]>> {
        return this.http.get<ApiResponse<ArzyabListItem[]>>(`${this.baseUrl}/list`);
    }

    editArzyab(payload: EditArzyabRequest) {
        return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/edit`, payload);
    }

    deleteArzyab(id: string) {
        return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/delete/${id}`);
    }

    getArzyabById(id: string) {
        return this.http.get<ApiResponse<EditArzyabListItem>>(
            `https://physicalfitnesspanelapi.algacall.ir/api/Arzyab/getArzyab/${id}`
        );
    }
}
