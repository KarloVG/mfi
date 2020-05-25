import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-exit-modal',
  templateUrl: './confirm-exit-modal.component.html',
  styleUrls: ['./confirm-exit-modal.component.scss']
})
export class ConfirmExitModalComponent implements OnInit {

  @Output() passEntry: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}