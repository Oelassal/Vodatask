import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of, shareReplay} from 'rxjs';
import {PostModel} from '../components/shared/models/Post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsCache$: { [userId: number]: Observable<PostModel[]> } = {};
  constructor(private http: HttpClient) {}

  getPostsByUserId(userId: number): Observable<PostModel[]> {

    if (!this.postsCache$[userId]) {
      this.postsCache$[userId] = this.http
        .get<PostModel[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        .pipe(
          map((posts) => {
            // You can also store the data if needed in an array or map
            return posts;
          }),
          catchError((error) => {
            console.error('Error fetching posts:', error);
            return of([]);
          }),
          shareReplay(1)
        );
    }

    return this.postsCache$[userId]; // Return the cached observable
  }

  // A method to clear cache if needed
  clearPostsCache(userId: number): void {
    delete this.postsCache$[userId];
  }
}
