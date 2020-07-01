import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-transactionview',
  templateUrl: './transactionview.component.html',
  styleUrls: ['./transactionview.component.scss']
})
export class TransactionviewComponent implements OnInit {
  @Input() node: any
  @Output() close = new EventEmitter<boolean>()

  constructor() {}
  ngOnInit(): void {}

  closeInfobox() {
    this.close.emit(true)
  }
}
