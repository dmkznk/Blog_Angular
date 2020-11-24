import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from '../../shared/posts.service';
import {Post} from '../../shared/interfaces';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  public posts: Array<Post>;
  public searchValue: string;
  private getPostsSubscription: Subscription;
  private deletePostSubscription: Subscription;

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.getPosts();
  }

  ngOnDestroy(): void {
    if (this.getPostsSubscription) {
      this.getPostsSubscription.unsubscribe();
    }
    if (this.deletePostSubscription) {
      this.deletePostSubscription.unsubscribe();
    }
  }

  private getPosts(): void {
    this.getPostsSubscription = this.postsService.getAllPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  public deletePost(id: string): void {
    this.deletePostSubscription = this.postsService.deletePost(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
    });
  }
}
