import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { TaskService } from '../../../core/services/task.service';

import { Task, TaskStatus, TaskPriority } from '../../../core/models/taskmodel';
import { FormsModule } from '@angular/forms';
import { TaskFormComponent } from '../../../shared/task-form/task-form.component';

@Component({
  selector: 'app-taskview',
  standalone: true,
  imports: [CommonModule,FormsModule,TaskFormComponent],
  templateUrl: './taskview.component.html',
  styleUrl: './taskview.component.css'
})
export class TaskviewComponent {

  
  tasks = signal<Task[]>([]);
  isLoading = signal(false);
  name:any;
  searchQuery = signal('');

  statusFilter = signal<TaskStatus | null>(null);
  priorityFilter = signal<TaskPriority | null>(null);

  isModalOpen = false;
  selectedTask: Task | null = null;
 
  isDarkMode = false;

  constructor(
    private taskService: TaskService,
    public authService: AuthService,
    private toastService: ToastService,
  ) {}

  
  ngOnInit() {
    this.loadTasks();
    const data = localStorage.getItem('user'); if(data){ this.name = JSON.parse(data).name; }
    this.isDarkMode =
      document.documentElement.getAttribute('data-theme') === 'dark';
     console.log(this.name);
  }

  //task loading
  loadTasks() {
    this.isLoading.set(true);

    this.taskService.getAllTasks().subscribe({
      next: (res) => {
        this.tasks.set(res.data || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Failed to load tasks');
        this.isLoading.set(false);
      }
    });
  }

  //add/update

handleTaskSubmit(taskData: any) {

  // UPDATE TASK
  if (this.selectedTask && this.selectedTask._id) {

    this.taskService
      .updateTask(this.selectedTask._id, taskData)
      .subscribe({

        next: (res) => {

          const updatedTask = res.data;

          this.tasks.update(tasks =>
            tasks.map(task =>
              task._id === updatedTask._id
                ? updatedTask
                : task
            )
          );

          this.toastService.success(
            res.message || 'Task updated successfully'
          );

          this.closeModal();
        },

        error: () => {
          this.toastService.error('Failed to update task');
        }

      });

  }

  // CREATE TASK
  else {

    this.taskService
      .createTask(taskData)
      .subscribe({

        next: (res) => {

          const newTask = res.data;

          this.tasks.update(tasks => [
            ...tasks,
            newTask
          ]);

          this.toastService.success(
            res.message || 'Task created successfully'
          );

          this.closeModal();
        },

      

      });
  }
}



  //delete tasks
  deleteTask(id: string) {

    if (!confirm('Delete this task?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: (res) => {

        this.tasks.update(list => list.filter(t => t._id !== id));

        this.toastService.success(res.message);
      },
      error: () => this.toastService.error('Delete failed')
    });
  }

  //status update
  updateStatus(task: Task, status: TaskStatus) {

    this.taskService.updateTaskStatus(task._id, status).subscribe({
      next: (res) => {

        const updated = res.data;

        this.tasks.update(list =>
          list.map(t => t._id === updated._id ? updated : t)
        );

        this.toastService.success(res.message);
      },
      error: () => this.toastService.error('Status update failed')
    });
  }

  
  openAddTask() {
    this.selectedTask = null;
    this.isModalOpen = true;
  }

  openEditTask(task: Task) {
    this.selectedTask = task;
    this.isModalOpen = true;
  }

  closeModal() {
    this.selectedTask = null;
    this.isModalOpen = false;
  }

  //theme
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    document.documentElement.setAttribute(
      'data-theme',
      this.isDarkMode ? 'dark' : 'light'
    );
  }

  //filter tasks
  filteredTasks = computed(() => {

    const search = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();

    return this.tasks().filter(task => {

      const matchesSearch =
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search);

      const matchesStatus =
        !status || task.status === status;

      const matchesPriority =
        !priority || task.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  });

  
  getPriorityClass(priority: TaskPriority): string {
    return `priority-${priority.toLowerCase()}`;
  }

  getStatusClass(status: TaskStatus): string {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  }
}
