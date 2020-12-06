import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {takeUntil} from 'rxjs/operators';
import {AlertType} from '../../../../shared/interfaces';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  public text: string;
  public type: AlertType;
  private unsubscribeAll$ = new Subject();

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.setAlert();
  }

  private setAlert(): void {
    this.alertService.alert$
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(alert => {
      this.type = alert.type;
      this.text = alert.text;

      this.removeAlert();
      });
  }

  private removeAlert(): void {
    setTimeout(() => {
      this.text = '';
    }, 3000);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }
}
