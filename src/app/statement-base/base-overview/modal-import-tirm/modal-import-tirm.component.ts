import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { ValidationTemplateService } from '../../services/validation-template.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITirmItem } from '../../models/tirm-item';
import { TirmService } from '../../services/tirm.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ITirmFile } from '../../models/tirm-file';
import { ToastrService } from 'ngx-toastr';
import { DateOnlyPipe } from 'src/app/shared/utils/date-pipe';

@Component({
  selector: 'app-modal-import-tirm',
  templateUrl: './modal-import-tirm.component.html',
  styleUrls: ['./modal-import-tirm.component.scss']
})
export class ModalImportTirmComponent implements OnInit, OnDestroy {

  isLoadingResponse: boolean = false;
  isLoadingTable: boolean = true;
  isLoadingSecondTable: boolean = true; 
  isFirstTableSelected: boolean = false;
  importSuccess: boolean = true;
  columns = [];
  selected = [];

  itemsFromTIRM: ITirmItem[] = [];
  filesFromTirm: ITirmFile[] = [];
  validationTemplates: ISimpleDropdownItem[] = [];
  @Input() peopleOnSubject: ISimpleDropdownItem[] = [];

  importFromTIRMGroup: FormGroup = this.formBuilder.group({
    searchValue: '',
    files: [null, Validators.required],
    template: [null, Validators.required],
    person: [null, Validators.required]
  })

  constructor(
    private modal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private validationTemplateService: ValidationTemplateService,
    private tirmService: TirmService,
    private toastrService: ToastrService
  ) {
    this.columns = [
      { name: 'Datoteka', prop: 'Datoteka' },
      { name: 'Izvor', prop: 'Izvor' },
      { name: 'Broj računa', prop: 'BrojRacuna' },
      { 
        name: 'Datum uvoza', 
        prop: 'DatumUvoza',
        pipe: new DateOnlyPipe('en-US')
      },
      { name: 'Ime / Naziv vlasnika', prop: 'Osoba' },
      { name: 'Ukupan broj transakcija', prop: 'UkupanBrTansakcija' },
      { name: 'Ukupan iznos transakcija', prop: 'UkupanIznosTransakcija' },
      {
        prop: 'selected',
        name: 'Odabir',
        sortable: false,
        canAutoResize: false,
        draggable: false,
        resizable: false,
        checkboxable: true,
        width:  70
      },
    ]
  }

  ngOnInit(): void {
    this.getItemsFromTirm();
    this.getValidationTemplates();
  }

  ngOnDestroy(): void { }

  exitModal(): void {
    this.modal.close(false);
  }

  getValidationTemplates() {
    this.validationTemplateService.getTemplates().pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.validationTemplates = data;
      }
    )
  }

  getItemsFromTirm() {
    this.isLoadingTable = true;
    this.tirmService.getTirmItems().pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.itemsFromTIRM = data;
        this.isLoadingTable = false;
      }
    )
  }

  chooseTirmFile(row: ITirmItem) {
    if(row) {
      this.isLoadingSecondTable = true;
      this.isFirstTableSelected = !this.isFirstTableSelected;
      this.tirmService.getTirmFiles().pipe(untilComponentDestroyed(this)).subscribe(
        data => {
          this.filesFromTirm = data;
          this.isLoadingSecondTable = false;
        }
      )
    }
  }

  filterTIRMTable(): void {  }

  removeFilter(): void {  }

  onSelectSecondTable(event): void {
    if(event && event.selected.length) {
      this.importFromTIRMGroup.patchValue({
        files: event.selected
      });
    } else {
      this.importFromTIRMGroup.patchValue({
        files: null
      });
    }
  }

  onSubmit() {
    if(this.importFromTIRMGroup.invalid) {
      if(this.files.invalid) {
        this.toastrService.warning('Odaberi najmanje jednu datoteku koja je preuzeta temeljem odabranog TIRM zahtjeva', 'Pažnja', {
          progressBar: true
        })
      }
      return;
    } else {
      this.isLoadingResponse = true;
      // u error() od observabla nedostaje importSuccess = false!!!
    }
  }

  get files(): AbstractControl {
    return this.importFromTIRMGroup.get('files');
  }
  get template(): AbstractControl {
    return this.importFromTIRMGroup.get('template');
  }
  get person(): AbstractControl {
    return this.importFromTIRMGroup.get('person');
  }
}
