import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private baseUrl = 'https://taskmanagement-backend-xjzw.onrender.com/tasks';

  constructor(private http: HttpClient) {}

  // Create Task
  createTask(payload: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    assignedTo?: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}`, payload);
  }

  // Get all tasks
  getAllTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Get task by id
  getTaskById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Update task
  updateTask(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  // Delete task
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Update only status
  updateTaskStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/status`, { status });
  }
}