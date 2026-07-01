import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-detail.component.html',
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  id: number = 0;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = Number(params['id']);
      console.log('=== POST DETAIL PAGE ===');
      console.log('Post ID from URL:', this.id);

      if (this.id > 0) {
        this.fetchPost();
      } else {
        this.error = 'Invalid post ID';
        this.loading = false;
      }
    });
  }

  fetchPost(): void {
    this.loading = true;
    this.error = '';

    const url = `http://localhost:5033/api/Post/details/${this.id}`;
    console.log('Fetching from URL:', url);

    this.http.get<any>(url).subscribe({
      next: (data) => {
        console.log('=== API RESPONSE ===');
        console.log('Raw data:', data);
        console.log('Data keys:', Object.keys(data));
        console.log('Content field exists?', 'content' in data);
        console.log('Content value:', data.content);
        console.log('Content type:', typeof data.content);

        if (data) {
          // ✅ FIXED: Better mapping with more field name options
          this.post = {
            id: data.id || data.postId || 0,
            title: data.title || data.postTitle || 'Untitled',
            content: data.content || data.body || data.text || data.postContent || 'No content available',
            author: data.username || data.userName || data.author || data.createdBy || 'Unknown',
            datePosted: data.createdAt || data.datePosted || data.createdDate ?
              new Date(data.createdAt || data.datePosted || data.createdDate) :
              new Date()
          };

          console.log('=== MAPPED POST ===');
          console.log('Mapped post:', this.post);
          console.log('Content after mapping:', this.post.content);
          console.log('Content length:', this.post.content?.length);

          // ✅ FIXED: Check if content is empty or just whitespace
          if (!this.post.content || this.post.content.trim().length === 0) {
            console.warn('⚠️ Content is empty or whitespace only!');
            this.post.content = 'No content available for this post.';
          }

          this.loading = false;
          this.cdr.detectChanges(); // Force change detection
        } else {
          this.error = 'Post not found';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('=== API ERROR ===');
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Full error:', error);

        if (error.status === 404) {
          this.error = 'Post not found. It may have been deleted.';
        } else if (error.status === 0) {
          this.error = 'Cannot connect to the server. Please check your connection.';
        } else {
          this.error = 'Failed to load post. Please try again.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
