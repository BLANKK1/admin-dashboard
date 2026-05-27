import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuditEntry } from '../models/audit-entry.model';

@Injectable({ providedIn: 'root' })
export class AuditService {
  constructor(private http: HttpClient) {}

  getAuditEntries(): Observable<AuditEntry[]> {
    return this.http
      .get<{ entries: AuditEntry[] }>('/api/audit')
      .pipe(map((r) => r.entries));
  }
}
