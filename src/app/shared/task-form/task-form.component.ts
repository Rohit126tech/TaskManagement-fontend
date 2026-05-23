import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../core/models/taskmodel';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
 @Input() task: Task | null = null;
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  taskForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.taskForm = this.fb.group({
      title: [this.task?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [this.task?.description || '', [Validators.required]],
      priority: [this.task?.priority || 'Medium', [Validators.required]],
      status: [this.task?.status || 'Todo', [Validators.required]],
      dueDate: [this.task?.dueDate || '', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.submit.emit(this.taskForm.value);
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
