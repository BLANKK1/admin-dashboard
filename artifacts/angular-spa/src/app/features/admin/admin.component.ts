import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { AuditService } from '../../core/services/audit.service';
import { RecordsService } from '../../core/services/records.service';
import { User } from '../../core/models/user.model';
import { AuditEntry } from '../../core/models/audit-entry.model';
import { AppRecord } from '../../core/models/record.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  showForm = false;
  editingUser: User | null = null;
  successMessage = '';
  errorMessage = '';
  deleteConfirm: string | null = null;

  activeTab: 'users' | 'records' | 'audit' = 'users';

  auditEntries: AuditEntry[] = [];
  isLoadingAudit = false;

  allRecords: AppRecord[] = [];
  isLoadingRecords = false;
  recordsError = '';
  togglingRecordId: string | null = null;

  userForm!: FormGroup;
  currentUser!: User;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private fb: FormBuilder,
    private auditService: AuditService,
    private recordsService: RecordsService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.currentUser!;
    this.initForm();
    this.loadUsers();
  }

  setTab(tab: 'users' | 'records' | 'audit'): void {
    this.activeTab = tab;
    if (tab === 'audit' && this.auditEntries.length === 0) {
      this.loadAuditLog();
    }
    if (tab === 'records' && this.allRecords.length === 0) {
      this.loadAllRecords();
    }
  }

  loadAuditLog(): void {
    this.isLoadingAudit = true;
    this.auditService.getAuditEntries().subscribe({
      next: (entries) => {
        this.auditEntries = entries;
        this.isLoadingAudit = false;
      },
      error: () => {
        this.isLoadingAudit = false;
      },
    });
  }

  refreshAudit(): void {
    this.loadAuditLog();
  }

  loadAllRecords(): void {
    this.isLoadingRecords = true;
    this.recordsError = '';
    this.recordsService.getAllRecordsAdmin().subscribe({
      next: (recs) => {
        this.allRecords = recs;
        this.isLoadingRecords = false;
      },
      error: () => {
        this.recordsError = 'Failed to load records.';
        this.isLoadingRecords = false;
      },
    });
  }

  toggleAccess(record: AppRecord): void {
    const newLevel: 'all' | 'admin' = record.accessLevel === 'all' ? 'admin' : 'all';
    this.togglingRecordId = record.id;
    this.recordsService.updateAccessLevel(record.id, newLevel).subscribe({
      next: (updated) => {
        const idx = this.allRecords.findIndex((r) => r.id === record.id);
        if (idx !== -1) {
          this.allRecords = [
            ...this.allRecords.slice(0, idx),
            updated,
            ...this.allRecords.slice(idx + 1),
          ];
        }
        this.togglingRecordId = null;
        this.successMessage = `"${updated.title}" is now ${newLevel === 'all' ? 'Public' : 'Restricted'}.`;
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: () => {
        this.togglingRecordId = null;
        this.errorMessage = 'Failed to update access level.';
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }

  get publicCount(): number {
    return this.allRecords.filter((r) => r.accessLevel === 'all').length;
  }

  get restrictedCount(): number {
    return this.allRecords.filter((r) => r.accessLevel === 'admin').length;
  }

  getActionLabel(action: string): string {
    const labels: Record<string, string> = {
      login: 'Login',
      logout: 'Logout',
      user_create: 'User Created',
      user_update: 'User Updated',
      user_delete: 'User Deleted',
      record_access_update: 'Access Changed',
    };
    return labels[action] ?? action;
  }

  getActionBadgeClass(action: string): string {
    if (action === 'login') return 'badge--success';
    if (action === 'logout') return 'badge--muted';
    if (action === 'user_create') return 'badge--primary';
    if (action === 'user_update') return 'badge--teal';
    if (action === 'user_delete') return 'badge--danger';
    if (action === 'record_access_update') return 'badge--accent';
    return 'badge--muted';
  }

  formatTime(ts: string): string {
    const d = new Date(ts);
    const now = Date.now();
    const diff = now - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    return d.toLocaleDateString();
  }

  initForm(user?: User): void {
    this.userForm = this.fb.group({
      userId: [user?.userId ?? '', [Validators.required, Validators.minLength(3)]],
      name: [user?.name ?? '', [Validators.required, Validators.minLength(2)]],
      email: [user?.email ?? '', [Validators.required, Validators.email]],
      role: [user?.role ?? 'general', [Validators.required]],
      department: [user?.department ?? '', [Validators.required]],
      status: [user?.status ?? 'active', [Validators.required]],
      password: [
        '',
        user ? [] : [Validators.required, Validators.minLength(6)],
      ],
    });
    if (user) {
      this.userForm.get('userId')?.disable();
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load users.';
        this.isLoading = false;
      },
    });
  }

  openAddForm(): void {
    this.editingUser = null;
    this.initForm();
    this.showForm = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  openEditForm(user: User): void {
    this.editingUser = user;
    this.initForm(user);
    this.showForm = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingUser = null;
  }

  isInvalid(field: string): boolean {
    const c = this.userForm.get(field);
    return !!(c?.invalid && c.touched);
  }

  submitForm(): void {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) return;

    const raw = this.userForm.getRawValue() as Partial<User> & { password?: string };

    if (this.editingUser) {
      const payload: Partial<User> & { password?: string } = {
        name: raw.name,
        email: raw.email,
        role: raw.role,
        department: raw.department,
        status: raw.status,
      };
      if (raw.password) payload.password = raw.password;

      this.userService.updateUser(this.editingUser.id, payload).subscribe({
        next: () => {
          this.successMessage = `User "${raw.name}" updated successfully.`;
          this.showForm = false;
          this.loadUsers();
        },
        error: (err: { error?: { message?: string } }) => {
          this.errorMessage = err.error?.message ?? 'Failed to update user.';
        },
      });
    } else {
      this.userService.createUser(raw as Partial<User> & { password: string }).subscribe({
        next: () => {
          this.successMessage = `User "${raw.name}" created successfully.`;
          this.showForm = false;
          this.loadUsers();
        },
        error: (err: { error?: { message?: string } }) => {
          this.errorMessage = err.error?.message ?? 'Failed to create user.';
        },
      });
    }
  }

  confirmDelete(userId: string): void {
    this.deleteConfirm = userId;
  }

  cancelDelete(): void {
    this.deleteConfirm = null;
  }

  deleteUser(user: User): void {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.successMessage = `User "${user.name}" deleted.`;
        this.deleteConfirm = null;
        this.loadUsers();
      },
      error: (err: { error?: { message?: string } }) => {
        this.errorMessage = err.error?.message ?? 'Failed to delete user.';
        this.deleteConfirm = null;
      },
    });
  }

  getRoleBadge(role: string): string {
    return role === 'admin' ? 'badge--accent' : 'badge--primary';
  }

  getStatusBadge(status: string): string {
    return status === 'active' ? 'badge--success' : 'badge--muted';
  }

  isSelf(user: User): boolean {
    return user.id === this.currentUser.id;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter((n) => n.length > 0)
      .map((n) => n[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  get currentUserInitials(): string {
    return this.getInitials(this.currentUser.name);
  }
}
