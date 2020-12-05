import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {AlertInterface} from '../../../shared/interfaces';

@Injectable()
export class AlertService {

  public alert$ = new Subject<AlertInterface>();

  constructor() { }

  public success(text: string): void {
    this.alert$.next({type: 'success', text});
  }

  public warning(text: string): void {
    this.alert$.next({type: 'warning', text});
  }

  public danger(text: string): void {
    this.alert$.next({type: 'danger', text});
  }

}
