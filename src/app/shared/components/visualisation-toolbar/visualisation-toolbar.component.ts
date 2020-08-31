import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {SubjectService} from 'src/app/shared/services/subject.service'
import {SubjectApiService} from 'src/app/subject/services/subject.service'
import {BaseService} from 'src/app/statement-base/services/base.service'
import { VisualisationToolbarService } from '../../services/visualisation-toolbar.service';
import { IOsobaDropdown } from '../../models/osoba-dropdown';
import { IIzvodDropdown } from '../../models/izvod-dropdown';
import { ModalFilterComponent } from '../modal-filter/modal-filter.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStoreFilterService } from '../../services/local-store-filter.service';
import { IFilterCriteria } from '../../models/filter-criteria';

interface Types {
  id: string
  title: string
}
interface Users {
  osobaID: string
  naziv: string
  idBroj: string
  label?: string
  totalIn?: number
  totalOut?: number
}
interface UsersSelection {
  id: string
  name: string
}

@Component({
  selector: 'app-visualisation-toolbar',
  templateUrl: './visualisation-toolbar.component.html',
  styleUrls: ['./visualisation-toolbar.component.scss']
})
export class VisualisationToolbarComponent implements OnInit {
  @ViewChild('visualisationForm') visualisationForm: HTMLFormElement;

  @Input() displayType: string // [ chart | diagram | flow | map | table ]
  @Input() addUserAction: any
  @Input() expandViewAction: any
  @Input() contractViewAction: any
  @Input() notificationsAction: any
  @Input() exportAction: any

  @Output() childNotification: EventEmitter<any> = new EventEmitter<any>();

  typesList: Types[]
  osobe: IOsobaDropdown[] = [];
  selectedOsoba: IOsobaDropdown;

  selectedIzvod: IIzvodDropdown;
  izvodi: IIzvodDropdown[] = [];
  subjectId: number;

  isActiveFilter: boolean = false;
  modalFilterValues: IFilterCriteria;
  
  constructor(
    private subjectService: SubjectService,
    private visualisationService: VisualisationToolbarService,
    private ngbModalService: NgbModal,
    private toastr: ToastrService,
    private localStorageFilterService: LocalStoreFilterService
  ) { }

  ngOnInit(): void {
    this.subjectId = +this.subjectService.hasToken();
    this.visualisationService.getOsobaDropdown().subscribe(
      data => {  this.osobe = data;  }
    )
  }

  passDataToParent() {
    if(this.selectedOsoba && this.selectedOsoba.osobaID) {
      this.childNotification.emit({
          osobaID: this.selectedOsoba.osobaID,
          izvodID: this.selectedIzvod ? this.selectedIzvod.izvodID : null 
      });
    } else {
      this.visualisationForm.form.controls['ctrl'].markAsTouched();
    }
  }

  onChangeActiveOsoba(event): void {
    if(event && event.osobaID) {
      this.selectedIzvod = null;
      this.visualisationService.getIzvodiForOsobaDropdown(event.osobaID).subscribe(
        data => { this.izvodi = data;  }
      )
    } else {
      this.izvodi = [];
      this.selectedIzvod = null;
    }
  }

  filterAction() {
    const modalRef = this.ngbModalService.open(ModalFilterComponent, { size: 'xl', backdrop: 'static', keyboard: false });
    modalRef.result.then((result) => {
      if (result) {
        this.toastr.success('Polja filtera spremljena', 'Uspjeh', {
          progressBar: true
        })
        this.isActiveFilter = true;
      } else if(result == false) {
        this.toastr.warning('Polja filtera su obrisana', 'Pažnja', {
          progressBar: true
        });
        this.isActiveFilter = false;
      } else {
        this.toastr.warning('Polja filtera nisu spremljena/uređena', 'Pažnja', {
          progressBar: true
        })
      }
      this.hasActiveFilter();
    });
  }

  hasActiveFilter() {
    console.log('hAFx', this.localStorageFilterService.hasToken())
    if(this.localStorageFilterService.hasToken()) {
      this.modalFilterValues = JSON.parse(localStorage['filter_fields']);
      this.isActiveFilter = true;
    } else {
      this.modalFilterValues = null;
      this.isActiveFilter = false;
    }
  }
}
