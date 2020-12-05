import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from '../../shared/posts.service';
import {Post} from '../../shared/interfaces';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  private unSubscribeAll = new Subject();
  public posts: Array<Post>;
  public searchValue: string;

  constructor(
    private postsService: PostsService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getPosts();
  }

  private getPosts(): void {
    this.postsService.getAllPosts()
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe(posts => {
      this.posts = posts;
    });
  }

  public deletePost(id: string): void {
    this.postsService.deletePost(id)
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.alertService.danger('Post was deleted');
    });
  }

  ngOnDestroy(): void {
    this.unSubscribeAll.next();
    this.unSubscribeAll.complete();
  }
}
