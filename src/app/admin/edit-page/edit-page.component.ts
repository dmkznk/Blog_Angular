import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {PostsService} from '../../shared/posts.service';
import {Post} from '../../shared/interfaces';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  public submitted = false;
  private post: Post;
  private unSubscribeAll = new Subject();
  public form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getPost();
  }

  private getPost(): void {
    this.route.params
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe((params: Params) => {
      this.postsService.getPostsById(params.id)
        .pipe(takeUntil(this.unSubscribeAll))
        .subscribe((post: Post) => {

        this.setForm(post);
        this.post = post;
      });
    });
  }

  private setForm(post: Post): void {
    this.form = new FormGroup({
      title: new FormControl(post.title, Validators.required),
      text: new FormControl(post.text, Validators.required)
    });
  }

  public submit(): void {
    if (this.form.valid) {
      this.submitted = true;

      const updatedPost = {
        ...this.post,
        title: this.form.value.title,
        text: this.form.value.text
      };

      this.postsService.updatePost(updatedPost)
        .pipe(takeUntil(this.unSubscribeAll))
        .subscribe(() => {
          this.alertService.success('Saved');
          this.submitted = false;
      });
    }
  }

  ngOnDestroy(): void {
    this.unSubscribeAll.next();
    this.unSubscribeAll.complete();
  }
}
