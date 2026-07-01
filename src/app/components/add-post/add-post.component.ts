import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-post.component.html',
})
export class AddPostComponent {
  post = {
    title: '',
    content: ''
  };

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  onSubmit(): void {
    const token = this.tokenStorage.getToken();
    console.log('1. Token exists:', !!token);

    if (!token) {
      this.errorMessage = 'You must be logged in to add a post';
      return;
    }

    console.log('2. Post data:', this.post);

    this.isSubmitting = true;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache'
    });

    console.log('3. Headers:', headers);

    this.http.post(
      'http://localhost:5033/api/Post/add',
      {
        Title: this.post.title,
        Body: this.post.content
      },
      { headers, responseType: 'text' }
    ).subscribe({
      next: (response) => {
        console.log('4. SUCCESS - Response:', response);

        this.successMessage = 'Post added successfully!';
        this.isSubmitting = false;
        this.post = { title: '', content: '' };

        setTimeout(() => {
          // Navigate to home with a timestamp to force refresh
          this.router.navigate(['/home']).then(() => {
            // Force reload the page
            window.location.reload();
          });
        }, 1500);
      },
      error: (error) => {
        console.log('4. ERROR - Full error:', error);
        console.log('5. Error status:', error.status);
        console.log('6. Error message:', error.message);
        console.log('7. Error error:', error.error);

        this.errorMessage = 'Error adding post. Check console for details.';
        this.isSubmitting = false;
      }
    });
  }
}
