import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenStorageService } from './services/token-storage.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
  isLoggedIn = false;

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {
    this.updateLoginStatus();

    // Listen for route changes to update login status
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLoginStatus();
    });
  }

  updateLoginStatus() {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    // If not logged in and not on login/register page, redirect to login
    const currentUrl = this.router.url;
    if (!this.isLoggedIn && currentUrl !== '/login' && currentUrl !== '/register') {
      this.router.navigate(['/login']);
    }
    // If logged in and on login/register page, redirect to home
    else if (this.isLoggedIn && (currentUrl === '/login' || currentUrl === '/register')) {
      this.router.navigate(['/home']);
    }
  }

  logout() {
    this.tokenStorage.signOut();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
