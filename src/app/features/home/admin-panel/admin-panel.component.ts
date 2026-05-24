import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

import { Task, TaskStatus } from '../../../core/models/taskmodel';
import { UserTaskService } from '../../../core/services/usertask.service';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent {
  users = signal<any[]>([]);
  userTasks = signal<Task[]>([]);
  tasks = signal<Task[]>([]);
  isLoading = signal(false);
  selectedUser: any = null;
  isDarkMode = false;

  constructor(
    private userTaskService: UserTaskService,
    public authService: AuthService,
    private toastService: ToastService,
    private taskService:TaskService
  ) {}

  ngOnInit() {
    this.loadUsers();

    this.isDarkMode =
      document.documentElement.getAttribute('data-theme') === 'dark';
  }

  //loadusers
  loadUsers() {
    this.isLoading.set(true);

    this.userTaskService.getAllUsers().subscribe({
      next: (res: any) => {
        const onlyUsers = (res.data || []).filter(
          (user: any) => user.role === 'user',
        );

        this.users.set(onlyUsers);

        this.isLoading.set(false);
      },

      error: () => {
        this.toastService.error('Failed to load users');

        this.isLoading.set(false);
      },
    });
  }

  // LOAD USER TASKS

  loadUserTasks(user: any) {
    this.selectedUser = user;

    this.userTaskService.getUserTasks(user._id).subscribe({
      next: (res) => {
        this.userTasks.set(res.data || []);

        this.toastService.success(`${user.name} tasks loaded`);
      },

      error: () => {
        this.toastService.error('Failed to load user tasks');
      },
    });
  }

  // THEME
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    document.documentElement.setAttribute(
      'data-theme',
      this.isDarkMode ? 'dark' : 'light',
    );
  }

  // STATUS CLASS
  getStatusClass(status: TaskStatus): string {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  }


}
