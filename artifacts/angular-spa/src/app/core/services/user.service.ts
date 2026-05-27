import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<{ users: User[] }>(this.base)
      .pipe(map((res) => res.users));
  }

  createUser(data: Partial<User> & { password: string }): Observable<User> {
    return this.http
      .post<{ user: User }>(this.base, data)
      .pipe(map((res) => res.user));
  }

  updateUser(id: string, data: Partial<User> & { password?: string }): Observable<User> {
    return this.http
      .put<{ user: User }>(`${this.base}/${id}`, data)
      .pipe(map((res) => res.user));
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
