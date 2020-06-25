import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-accountview',
  templateUrl: './accountview.component.html',
  styleUrls: ['./accountview.component.scss']
})
export class AccountviewComponent implements OnInit {
  @Input() node: any
  @Output() close = new EventEmitter<boolean>()

  constructor() {}

  ngOnInit(): void {}

  closeInfobox() {
    this.close.emit(true)
  }

  expandAccountDetails() {
    console.log('Account details', this.node)
  }
}
