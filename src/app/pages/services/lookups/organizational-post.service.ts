import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrganizationalPost {
  id: string;
  display: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  isSuccess: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationalPostService {
  private baseUrl = 'https://physicalfitnesspanelapi.algacall.ir/api/ArzyabPostsazmani';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<OrganizationalPost[]>> {
    return this.http.post<ApiResponse<OrganizationalPost[]>>(
      `${this.baseUrl}/GetAllArzyabPostSazmani`,
      '' // درخواست POST بدون بدنه
    );
  }
}
