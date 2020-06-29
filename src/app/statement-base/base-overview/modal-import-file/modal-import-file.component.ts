import { Component, OnInit, Input, ViewChild, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ValidationTemplateService } from '../../services/validation-template.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ImportFileService } from '../../services/import-file.service';

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

  @Input() peopleOnSubject: ISimpleDropdownItem[] = [];

  importFromFileGroup: FormGroup = this.formBuilder.group({
    template: [null],
    person: [null, Validators.required]
  })

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item(0);
    this.fileInput = file;
  }

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private modal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private validationTemplateService: ValidationTemplateService,
    private importService: ImportFileService
  ) { }

  ngOnInit(): void {
    this.importService.tryoutGet(1).subscribe(data=>{
      console.log(data)
    })

    this.validationTemplates = [
      {
        id: 1,
        name: 'template_example.jsonc'
      }
    ];
    // this.getValidationTemplates();
  }

  ngOnDestroy(): void { }

  exitModal(): void {
    this.modal.close(false);
  }

  setFileName(evt) {
    console.log('tutu', evt)
  }

  getValidationTemplates() {
    this.validationTemplateService.getTemplates().pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.validationTemplates = data;
      }
    )
  }

  onSubmit() {
    if (this.fileInput) {
      if (this.importFromFileGroup.invalid) {
        return;
      } else {
        this.isLoadingResponse = true;
        console.log('usao')
        this.importService.validateFile(this.fileInput, this.template.value).subscribe(data => {
          console.log(data)
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
                console.log(element.errors)
              }
              if (element.extract && element.extract.length) {
                this.extracts = element.extract;
              }
              if(JSON.stringify(element) === JSON.stringify(array[array.length - 1]) ) {
                console.log(element)
                this.isLoadingResponse = false;
                if(this.errors.length == 0) {
                  console.log(this.importSuccess)
                  const modalResponse = {
                    personId: this.person.value,
                    extracts: this.extracts}
                  this.modal.close(modalResponse)
                }
              }
            }
          );
        })
        // u error() od observabla nedostaje importSuccess = false!!!
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
  get person(): AbstractControl {
    return this.importFromFileGroup.get('person');
  }
}
