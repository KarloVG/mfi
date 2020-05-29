import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-import-file',
  templateUrl: './modal-import-file.component.html',
  styleUrls: ['./modal-import-file.component.scss']
})
export class ModalImportFileComponent implements OnInit {

  constructor(
    private modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  exitModal(): void {
    this.modal.dismiss();
  }


}
