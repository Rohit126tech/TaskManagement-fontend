import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-loginform',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.css',
})
export class LoginformComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        //save token
        localStorage.setItem('token', res.token);

        // optional user data
        localStorage.setItem('user', JSON.stringify(res.user));
        
        this.toastService.success('Login successful!');
        if(res.user.role=="admin"){
          this.router.navigate(['/adminpanel']);
        }
        else{ this.router.navigate(['/taskview']);}
       
      },
      error: (err: any) => {
  this.isLoading = false;

  const msg = err?.error?.message;

  switch (msg) {
    case 'Invalid credentials':
      this.toastService.error('Wrong email or password');
      break;

    case 'User not found':
      this.toastService.error('Account does not exist');
      break;

    default:
      this.toastService.error(msg || 'Login failed');
  }
}
    });
  }
}
