import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecordsResponse } from '../models/record.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecordsService {
  private readonly base = `${environment.apiUrl}/records`;

  constructor(private http: HttpClient) {}

  getRecords(delayMs: number = 0): Observable<RecordsResponse> {
    return this.http.get<RecordsResponse>(`${this.base}?delay=${delayMs}`);
  }
}
