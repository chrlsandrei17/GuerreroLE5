import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Post } from '../../models/post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-posts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-posts.component.html',
})
export class ListPostsComponent implements OnInit {
  posts: Post[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    console.log('Fetching posts from API...');

    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    const timestamp = new Date().getTime();
    this.http.get<any[]>(`http://localhost:5033/api/Post/list?t=${timestamp}`, { headers })
      .subscribe({
        next: (data) => {
          console.log('Raw data from backend:', data);

          if (data && Array.isArray(data)) {
            console.log('Number of posts received:', data.length);

            this.posts = data.map(item => {
              return {
                id: item.id || 0,
                title: item.title || 'No Title',
                content: item.content || 'No Content',
                author: item.username || item.userName || 'Unknown',
                datePosted: item.createdAt ? new Date(item.createdAt) : new Date()
              };
            });

            console.log('Mapped posts:', this.posts);
            console.log('Posts count:', this.posts.length);

            this.loading = false;
            this.cdr.detectChanges();
          } else {
            console.error('Data is not an array:', data);
            this.posts = [];
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Error fetching posts:', error);
          this.posts = [];
          this.loading = false;
        }
      });
  }

  navigateToPost(id: number): void {
    console.log('Navigating to post with ID:', id);
    // Navigate to the post detail page
    this.router.navigate(['/posts', id]);
  }
}
