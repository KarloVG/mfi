import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ISimpleDropdownItem } from '../../models/simple-dropdown-item';

@Component({
  selector: 'app-modal-filter',
  templateUrl: './modal-filter.component.html',
  styleUrls: ['./modal-filter.component.scss']
})
export class ModalFilterComponent implements OnInit {

  filterFormGroup: FormGroup = this.formBuilder.group({
    Naziv: '',
    NazivB: '',
    BrojRacuna: '',
    BrojRacunaB: '',
    Banka: null,
    BankaB: null,
    Drzava: null,
    DrzavaB: null
  });

  banks: ISimpleDropdownItem[] = [];
  countries: ISimpleDropdownItem[] = [];
  
  constructor(
    public modal: NgbActiveModal,
    private formBuilder: FormBuilder
    ) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
  }

}
