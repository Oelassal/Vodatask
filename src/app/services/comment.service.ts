import { Injectable } from '@angular/core';
import {catchError, map, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CommentModel} from '../components/shared/models/Comment.model';
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private commentsCache: { [postId: number]: CommentModel[] } = {};

  constructor(private http: HttpClient) {}

  getCommentsByPostId(postId: number): Observable<CommentModel[]> {
    if (this.commentsCache[postId]) {
      return of(this.commentsCache[postId]);
    }

    // IF COMMENT NOT CACHED, THEN CALL THE API
    return this.http
      .get<CommentModel[]>(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
      .pipe(
        map((comments) => {
          this.commentsCache[postId] = comments;
          return comments;
        }),
        catchError((error) => {
          console.error('Error fetching comments:', error);
          return of([]);
        })
      );
  }
}
