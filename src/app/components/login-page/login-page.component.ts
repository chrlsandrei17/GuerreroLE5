import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  onSubmit(): void {
    const { username, password } = this.form;

    if (!username || !password) {
      this.errorMessage = 'Please enter username and password';
      this.isLoginFailed = true;
      return;
    }

    console.log('Attempting login with:', { username });

    this.authService.login(username, password).subscribe({
      next: (data: any) => {
        console.log('Login success - Raw data:', data);

        const token = data.token || data.accessToken || data.access_token;
        const user = data.user || { username: username };

        if (token) {
          console.log('Saving token:', token);
          this.tokenStorage.saveToken(token);
          this.tokenStorage.saveUser(user);

          this.isLoginFailed = false;
          this.isLoggedIn = true;

          // Navigate to home with force refresh
          this.router.navigate(['/home']).then(() => {
            // Use a small delay then reload to ensure everything is loaded
            setTimeout(() => {
              window.location.reload();
            }, 100);
          });
        } else {
          this.errorMessage = 'Invalid response from server - no token received';
          this.isLoginFailed = true;
        }
      },
      error: (err: any) => {
        console.error('Login error:', err);
        this.errorMessage = err.error?.message || err.error || 'Invalid username or password';
        this.isLoginFailed = true;
      }
    });
  }
}
