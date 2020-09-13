import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private messageSource = new BehaviorSubject(1);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: any): void {
    this.messageSource.next(message);
  }
}
