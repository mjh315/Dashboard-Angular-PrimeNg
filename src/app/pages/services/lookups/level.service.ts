import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LookupItem {
  id: string;
  display: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  isSuccess: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class LevelService {
  private baseUrl = 'https://physicalfitnesspanelapi.algacall.ir/api/Level';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<LookupItem[]>> {
    return this.http.get<ApiResponse<LookupItem[]>>(`${this.baseUrl}/GetAll`);
  }
}