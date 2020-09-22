import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-save-state',
  templateUrl: './modal-save-state.component.html',
  styleUrls: ['./modal-save-state.component.scss']
})
export class ModalSaveStateComponent implements OnInit {

  @Input() componentName;
  constructor(
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }
}
