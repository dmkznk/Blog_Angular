import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  private returnUrl: string;
  private unSubscribeAll = new Subject();
  public form: FormGroup;
  public submitted = false;
  public loginMessage: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
    ) { }

  ngOnInit(): void {
    this.setForm();
    this.createLoginMessage();
  }

  private setForm(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  public submit(): void {
   if (this.form.valid) {
     this.submitted = true;
     this.login();
   }
  }

  private login(): void {
    const {email, password} = this.form.value;

    this.authService.login({email, password}).subscribe(() => {
      this.redirectAfterLogin();
      this.form.reset();
    }).add(() => this.submitted = false);
  }

  private createLoginMessage(): void {
    this.route.queryParams
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe((params: Params) => {

        if (params.pleaseLogin) {
          this.loginMessage = 'Please login';
        } else if (params.authFailed) {
          this.loginMessage = 'The session is over, please login again';
        }

        this.returnUrl = params?.returnUrl;
      });
  }

  private redirectAfterLogin(): void {
    this.returnUrl
      ? this.router.navigate([this.returnUrl])
      : this.router.navigate(['/admin', 'dashboard']);
  }

  ngOnDestroy(): void {
    this.unSubscribeAll.next();
    this.unSubscribeAll.complete();
  }
}
