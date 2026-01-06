import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LookupItem, ApiResponse } from './level.service';

@Injectable({ providedIn: 'root' })
export class ShiftService {
  private baseUrl = 'https://physicalfitnesspanelapi.algacall.ir/api/Shift';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<LookupItem[]>> {
    return this.http.get<ApiResponse<LookupItem[]>>(`${this.baseUrl}/GetAll`);
  }
}