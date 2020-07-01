import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-userview',
  templateUrl: './userview.component.html',
  styleUrls: ['./userview.component.scss']
})
export class UserviewComponent implements OnInit {
  @Input() node: any
  @Output() close = new EventEmitter<boolean>()

  constructor() {}
  ngOnInit(): void {}

  closeInfobox() {
    this.close.emit(true)
  }
}
