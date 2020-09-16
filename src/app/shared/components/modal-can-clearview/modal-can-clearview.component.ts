import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-can-clearview',
  templateUrl: './modal-can-clearview.component.html',
  styleUrls: ['./modal-can-clearview.component.scss']
})
export class ModalCanClearViewComponent implements OnInit {

  @Input() subjectName;
  constructor(
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {}
}
