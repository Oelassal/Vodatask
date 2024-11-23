import {TestBed} from '@angular/core/testing';

import {CommentService} from './comment.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CommentModel} from '../components/shared/models/Comment.model';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService],
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch comments from the API if not cached', (done) => {
    const postId = 1;
    const mockComments: CommentModel[] = [
      { postId, id: 1, name: 'Test Comment', email: 'test@example.com', body: 'This is a test comment' },
    ];

    service.getCommentsByPostId(postId).subscribe((comments) => {
      expect(comments).toEqual(mockComments);
      done();
    });

    const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);
  });

  it('should return cached comments if available', (done) => {
    const postId = 2;
    const cachedComments: CommentModel[] = [
      { postId, id: 1, name: 'Cached Comment', email: 'cached@example.com', body: 'This is a cached comment' },
    ];

    (service as any).commentsCache[postId] = cachedComments;
    service.getCommentsByPostId(postId).subscribe((comments) => {
      expect(comments).toEqual(cachedComments);
      done();
    });
    httpMock.expectNone(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
  });

  it('should handle errors gracefully and return an empty array', (done) => {
    const postId = 3;

    service.getCommentsByPostId(postId).subscribe((comments) => {
      expect(comments).toEqual([]);
      done();
    });

    const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    expect(req.request.method).toBe('GET');
    req.flush('Error fetching comments', { status: 500, statusText: 'Server Error' });
  });
});
