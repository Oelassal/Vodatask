import {TestBed} from '@angular/core/testing';
import {PostService} from './post.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {PostModel} from '../components/shared/models/Post.model';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  const dummyPosts: PostModel[] = [
    { id: 1, userId: 1, title: 'Test Post 1', body: 'This is a test post.' },
    { id: 2, userId: 1, title: 'Test Post 2', body: 'This is another test post.' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService],
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should make an HTTP request and cache the result', () => {
    const userId = 1;
    service.getPostsByUserId(userId).subscribe((posts) => {
      expect(posts).toEqual(dummyPosts);
    });
    const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    req.flush(dummyPosts);

    service.getPostsByUserId(userId).subscribe((posts) => {
      expect(posts).toEqual(dummyPosts);
    });

    httpMock.verify();
  });

  it('should handle errors and return an empty array', () => {
    const userId = 1;

    service.getPostsByUserId(userId).subscribe((posts) => {
      expect(posts).toEqual([]);
    });

    const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    req.error(new ErrorEvent('Network error'));

    httpMock.verify();
  });

  it('should clear the cache for a given userId', () => {
    const userId = 1;
    service.getPostsByUserId(userId).subscribe((posts) => {
      expect(posts).toEqual(dummyPosts);
    });

    const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    req.flush(dummyPosts);

    expect(service['postsCache$'][userId]).toBeTruthy();

    service.clearPostsCache(userId);

    expect(service['postsCache$'][userId]).toBeUndefined();

    httpMock.verify();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
