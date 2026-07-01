import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  form: any = {
    username: null,
    firstName: null,
    lastName: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    const { username, firstName, lastName, password } = this.form;

    if (!username || !firstName || !lastName || !password) {
      this.errorMessage = 'All fields are required';
      this.isSignUpFailed = true;
      return;
    }

    console.log('Sending registration data:', { username, firstName, lastName, password });

    this.authService.register(username, firstName, lastName, password).subscribe({
      next: (response: string) => {
        console.log('Registration success - Response:', response);

        // The response is a string like "User registered successfully"
        if (response && response.includes('successfully')) {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.errorMessage = '';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = response || 'Registration failed';
          this.isSignUpFailed = true;
        }
      },
      error: (err: any) => {
        console.error('=== REGISTRATION ERROR ===');
        console.error('Full error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error error:', err.error);

        // If status is 200 but there's a parsing error, the user was likely created
        if (err.status === 200) {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.errorMessage = '';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = err.error || 'Registration failed. Please try again.';
          this.isSignUpFailed = true;
          this.isSuccessful = false;
        }
      }
    });
  }
}
