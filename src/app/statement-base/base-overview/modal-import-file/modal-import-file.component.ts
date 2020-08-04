import { Component, OnInit, Input, ViewChild, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { IOsobaDropdown } from '../../models/osoba-dropdown';
import { BaseService } from '../../services/base.service';
import { FinancijskaTransakcijaService } from '../../services/financijska-transakcija.service';

@Component({
  selector: 'app-modal-import-file',
  templateUrl: './modal-import-file.component.html',
  styleUrls: ['./modal-import-file.component.scss']
})
export class ModalImportFileComponent implements OnInit, OnDestroy {

  isLoadingResponse: boolean = false;
  importSuccess: boolean = true;
  fileName: string;
  validationTemplates: ISimpleDropdownItem[] = [];
  fileInput: File;
  errors: any[] = [];
  extracts: any[] = [];
  errorName: string = '';

  osobeNaPredmetu: IOsobaDropdown[] = [];

  importFromFileGroup: FormGroup = this.formBuilder.group({
    template: [null],
    osoba: [null, Validators.required]
  })

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item(0);
    this.fileInput = file;
  }

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private modal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private financijskaTransakcijaService: FinancijskaTransakcijaService,
    private baseService: BaseService
  ) { }

  ngOnInit(): void {
    this.dohvatiOsobeNaPredmetu();
    this.dohvatiTemplate();
    // this.validationTemplates = [
    //   {
    //     id: 1,
    //     name: 'template_example.jsonc'
    //   }
    // ];

  }

  ngOnDestroy(): void { }

  exitModal(): void {
    this.modal.close(false);
  }

  setFileName(evt) {
    console.log('tutu', evt)
  }

  dohvatiTemplate() {
    this.financijskaTransakcijaService.getTemplates().pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.validationTemplates = data;
        console.log('dohT', this.validationTemplates)
      }
    )
  }

  dohvatiOsobeNaPredmetu() {
    this.baseService.getOsobeDropdown().subscribe( data=>{
      this.osobeNaPredmetu = data;
    });
  }

  onSubmit() {
    console.log('SBX', this.importFromFileGroup.value)
    if (this.fileInput) {
      if (this.importFromFileGroup.invalid) {
        return;
      } else {
        this.isLoadingResponse = true;
        this.financijskaTransakcijaService.validateFile(this.osoba.value,this.fileInput, this.template.value).subscribe(data => {
          data.forEach(
            (element, index,array) => {
              if (element.errors && element.errors.length) {
                this.importSuccess = false;
                element.errors.forEach(el => {
                  this.errorName += `${el.name}
 `;
                })
                this.errors.push({
                  name: this.errorName,
                  rowId: index
                });
                console.warn('ERRX', element.errors)
              }
              if (element.extract && element.extract.length) {
                this.extracts = element.extract;
              }
              if(JSON.stringify(element) === JSON.stringify(array[array.length - 1]) ) {
                console.log('SX1-elm', element)
                this.isLoadingResponse = false;
                if(this.errors.length == 0) {
                  console.log('SX2-importSuccess', this.importSuccess)
                  const modalResponse = {
                    personId: this.osoba.value,
                    extracts: this.extracts}
                  this.modal.close(modalResponse)
                }
              }
            }
          );
        })
      }
    } else {
      return;
    }
  }

  onFileInput(event: Event) {
    if(event && (<HTMLInputElement>event.target).files) {
      this.fileInput = (<HTMLInputElement>event.target).files[0]
    }
  }

  get template(): AbstractControl {
    return this.importFromFileGroup.get('template');
  }
  get osoba(): AbstractControl {
    return this.importFromFileGroup.get('osoba');
  }
}
