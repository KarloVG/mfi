import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReactiveFormValidatorService {
    
  /* after view init! validator*/
  setValidatorAfterViewInit(formGroup: FormGroup, newValue, formControl: string) {
    formGroup.get(formControl).setValidators([Validators.required]);
    formGroup.patchValue({
      [formControl]: newValue
    });
    formGroup.get(formControl).updateValueAndValidity();
  }

  /* remove validator */
  removeValidatorAfterViewInit(formGroup: FormGroup, newValue, formControl: string) {
    formGroup.get(formControl).clearValidators();
    formGroup.patchValue({
      [formControl]: newValue
    });
    formGroup.get(formControl).updateValueAndValidity();
  }
}
