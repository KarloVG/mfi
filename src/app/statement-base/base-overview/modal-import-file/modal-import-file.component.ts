import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ValidationTemplateService } from '../../services/validation-template.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-modal-import-file',
  templateUrl: './modal-import-file.component.html',
  styleUrls: ['./modal-import-file.component.scss']
})
export class ModalImportFileComponent implements OnInit {

  isLoadingResponse: boolean = false;
  fileName: string;
  validationTemplates: ISimpleDropdownItem[] = [];
  @Input() peopleOnSubject: ISimpleDropdownItem[] = [];
  @ViewChild("fileInput") fileInput;

  importFromFileGroup: FormGroup = this.formBuilder.group({
    file: [null, Validators.required],
    template: [null, Validators.required],
    person: [null, Validators.required]
  })

  constructor(
    private modal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private validationTemplateService: ValidationTemplateService 
  ) { }

  ngOnInit(): void {
    this.getValidationTemplates();
  }

  exitModal(): void {
    this.modal.close(false);
  }

  setFileName(evt) {
    console.log('tutu',evt)
  }

  getValidationTemplates() {
    this.validationTemplateService.getTemplates().pipe(take(1)).subscribe(
      data => {
        this.validationTemplates = data;
      }
    )
  }

  onSubmit() {
    if(this.importFromFileGroup.invalid) {
      return;
    } else {
      const a = this.fileInput.nativeElement.files[0];
      this.isLoadingResponse = true;
    }
  }

  get file(): AbstractControl {
    return this.importFromFileGroup.get('file');
  }
  get template(): AbstractControl {
    return this.importFromFileGroup.get('template');
  }
  get person(): AbstractControl {
    return this.importFromFileGroup.get('person');
  }
}
