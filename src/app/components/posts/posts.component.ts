import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PostService} from '../../services/post.service';
import {CommentService} from '../../services/comment.service';
import {PostModel} from '../shared/models/Post.model';
import {CommentModel} from '../shared/models/Comment.model';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-posts',
  standalone: false,
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit, OnChanges {
  @Input() userId!: number;
  posts: PostModel[] = [];
  selectedPostComments: { [key: number]: CommentModel[] } = {};
  commentsVisible: { [key: number]: boolean } = {};

  constructor(
    private postService: PostService,
    private commentService: CommentService
  ) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['userId'] && !changes['userId'].firstChange) {
      await this.loadPosts();
    }
  }

  async ngOnInit(): Promise<void> {
    await this.loadPosts();
  }

  async loadPosts(): Promise<void> {
    try {
      if (this.userId) {
        this.posts = await firstValueFrom(this.postService.getPostsByUserId(this.userId));
        this.selectedPostComments = {};
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

 async loadComments(postId: number) {

   if (this.commentsVisible[postId]) {
     this.commentsVisible[postId] = false; // Hide comments
   } else {
     if (!this.selectedPostComments[postId]) {
       this.commentService.getCommentsByPostId(postId).subscribe((comments: CommentModel[]) => {
         this.selectedPostComments[postId] = comments;
         this.commentsVisible[postId] = true;
       });
     } else {
       this.commentsVisible[postId] = true;
     }
   }
 }
}
