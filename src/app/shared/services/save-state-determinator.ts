import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SaveStateDeterminator {

  // action
  private determinator = new BehaviorSubject({osobaID: null, izvodID: null});
  osobaAndIzvod = this.determinator.asObservable();
  constructor() { }

  changeOsobaOrIzvod(object) {
    this.determinator.next(object)
  }
}