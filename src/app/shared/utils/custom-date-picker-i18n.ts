import { Injectable, LOCALE_ID, Inject } from "@angular/core";
import { NgbDatepickerI18n, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  I18N_VALUES = {
    'hr': {
      weekdays: ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'],
      months: ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro'],
    }
  };

  constructor(
    @Inject(LOCALE_ID) private locale: string
  ) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return this.I18N_VALUES['hr'].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return this.I18N_VALUES['hr'].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
