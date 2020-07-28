import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable()
export class DateOnlyPipe extends DatePipe {
    public transform(value): any {
      return super.transform(value, 'dd.MM.yyyy');
    }
  }