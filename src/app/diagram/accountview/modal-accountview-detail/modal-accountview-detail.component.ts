import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-accountview-detail',
  templateUrl: './modal-accountview-detail.component.html',
  styleUrls: ['./modal-accountview-detail.component.scss']
})
export class ModalAccountviewDetailComponent implements OnInit {

  isLoading: boolean = true;
  userTransactions: any[] = [];

  constructor(
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.isLoading = false;
  }

}
