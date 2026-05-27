import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { RecordsService } from '../../core/services/records.service';
import { User } from '../../core/models/user.model';
import { AppRecord, RecordsResponse } from '../../core/models/record.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  user!: User;
  records: AppRecord[] = [];
  recordsMeta: RecordsResponse['meta'] | null = null;

  delayMs = 0;
  isLoadingRecords = false;
  recordsLoaded = false;
  loadError = '';
  loadDuration = 0;
  private loadStartTime = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    private recordsService: RecordsService,
  ) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser!;
    this.loadRecords();
  }

  get userInitials(): string {
    return this.user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  get adminRecordCount(): number {
    return this.records.filter((r) => r.accessLevel === 'admin').length;
  }

  get publishedCount(): number {
    return this.records.filter((r) => r.status === 'published').length;
  }

  loadRecords(): void {
    this.isLoadingRecords = true;
    this.loadError = '';
    this.loadStartTime = Date.now();

    this.recordsService
      .getRecords(this.delayMs)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoadingRecords = false;
          this.loadDuration = Date.now() - this.loadStartTime;
          this.recordsLoaded = true;
        }),
      )
      .subscribe({
        next: (res) => {
          this.records = res.records;
          this.recordsMeta = res.meta;
        },
        error: (err: { error?: { message?: string } }) => {
          this.loadError = err.error?.message || 'Failed to load records.';
        },
      });
  }

  logout(): void {
    this.auth.logout();
  }

  getPriorityClass(priority: string): string {
    const map: Record<string, string> = {
      high: 'badge--danger',
      medium: 'badge--warning',
      low: 'badge--muted',
    };
    return map[priority] ?? 'badge--muted';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      published: 'badge--success',
      draft: 'badge--warning',
      archived: 'badge--muted',
    };
    return map[status] ?? 'badge--muted';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
