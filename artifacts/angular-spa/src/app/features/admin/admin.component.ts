import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

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

  userForm!: FormGroup;
  currentUser!: User;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.currentUser!;
    this.initForm();
    this.loadUsers();
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
