import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, FormsModule ,RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService   // ✅ added
  ) {

    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

 onSubmit() {

  if (this.signupForm.invalid) {
    this.signupForm.markAllAsTouched();
    this.toastService.error('Please fill all required fields');
    return;
  }

  this.isLoading = true;

  this.authService.signUp(this.signupForm.value).subscribe({
    next: (res) => {
      console.log('Signup success', res);
      this.isLoading = false;

      this.toastService.success('Account created successfully!');

      // redirect
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error(err);
      this.isLoading = false;

      this.toastService.error(err?.error?.message || 'Signup failed');
    }
  });
}
}