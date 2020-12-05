import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Post} from '../../shared/interfaces';
import {PostsService} from '../../shared/posts.service';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private postsService: PostsService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.setForm();
  }

  private setForm(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      text: new FormControl(null, [Validators.required]),
      author: new FormControl(null, [Validators.required])
    });
  }

  public submit(): void {
    if (this.form.valid) {

      const post: Post = {
        title: this.form.value.title,
        text: this.form.value.text,
        author: this.form.value.author,
        date: new Date()
      };

      this.postsService.createPost(post).subscribe(() => {
        this.form.reset();
        this.alertService.success('Post was created');
      });
    }
  }
}
