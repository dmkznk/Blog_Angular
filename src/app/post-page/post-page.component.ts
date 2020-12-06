import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {PostsService} from '../shared/posts.service';
import {Post} from '../shared/interfaces';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {

  public post$: Observable<Post>;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
    ) { }

  ngOnInit(): void {
   this.post$ = this.route.params
     .pipe(switchMap((params: Params) => {
      return this.postsService.getPostsById(params.id);
     }));
  }
}
