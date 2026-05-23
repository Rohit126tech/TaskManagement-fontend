
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserTaskService {

  private baseUrl = 'https://taskmanagement-backend-xjzw.onrender.com/users';

  constructor(private http: HttpClient) {}

  // GET ALL USERS
  getAllUsers(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // GET TASKS OF PARTICULAR USER
  getUserTasks(userId: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/${userId}/tasks`
    );
  }
  updateTaskStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/status`, { status });
  }
}

