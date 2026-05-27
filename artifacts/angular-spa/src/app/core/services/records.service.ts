import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AppRecord, RecordsResponse } from '../models/record.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecordsService {
  private readonly base = `${environment.apiUrl}/records`;

  constructor(private http: HttpClient) {}

  getRecords(delayMs: number = 0): Observable<RecordsResponse> {
    return this.http.get<RecordsResponse>(`${this.base}?delay=${delayMs}`);
  }

  getAllRecordsAdmin(): Observable<AppRecord[]> {
    return this.http
      .get<{ records: AppRecord[] }>(`${this.base}/all`)
      .pipe(map((r) => r.records));
  }

  updateAccessLevel(
    id: string,
    accessLevel: 'all' | 'admin',
  ): Observable<AppRecord> {
    return this.http
      .patch<{ record: AppRecord }>(`${this.base}/${id}/access`, { accessLevel })
      .pipe(map((r) => r.record));
  }
}
