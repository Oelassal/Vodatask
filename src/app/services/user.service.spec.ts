import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { UserModel } from '../components/shared/models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://jsonplaceholder.typicode.com/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService); // Inject the service
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve users from the API via GET', () => {
    const mockUsers: ({ name: string; id: number; email: string; username: string })[] = [
      { id: 1, name: 'Omar Elassaal', username: 'omar', email: 'omar@example.com' },
      { id: 2, name: 'testing omar', username: 'elassaal', email: 'elassaal@example.com' }
    ];

    // Call the service method
    service.getUsers().subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should handle error gracefully if the API call fails', () => {
    const errorMessage = '404 Not Found';

    // Call the service method
    service.getUsers().subscribe(
      (users) => fail('expected an error, not users'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.message).toContain(errorMessage);
      }
    );

    const req = httpMock.expectOne(apiUrl);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
