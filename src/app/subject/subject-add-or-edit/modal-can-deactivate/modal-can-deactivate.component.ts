import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-can-deactivate',
  templateUrl: './modal-can-deactivate.component.html',
  styleUrls: ['./modal-can-deactivate.component.scss']
})
export class ModalCanDeactivateComponent implements OnInit {

  @Input() subjectName;
  constructor(
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
