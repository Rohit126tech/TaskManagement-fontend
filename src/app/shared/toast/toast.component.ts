import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { Toast } from '../../core/models/toastmodel';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
constructor(public toastService: ToastService) {}

  getTypeClass(toast: Toast): string {
    return `toast-${toast.type}`;
  }
}
