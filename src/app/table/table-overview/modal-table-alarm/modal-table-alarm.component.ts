import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAlarmResponse } from 'src/app/shared/models/alarm-response';
import { IFinancijskaTransakcija } from 'src/app/shared/models/financijska-transakcija';

@Component({
  selector: 'app-modal-table-alarm',
  templateUrl: './modal-table-alarm.component.html',
  styleUrls: ['./modal-table-alarm.component.scss']
})
export class ModalTableAlarmComponent implements OnInit {

  @Input() row:IFinancijskaTransakcija;
  @Input() alarmItems:IAlarmResponse[];
  alarmInformation: IAlarmResponse[] = [];

  constructor(
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.alarmInformation = [];
    this.alarmItems.forEach( (element) => {
      if(this.row.a_RN == element.drugiARN || this.row.b_RN == element.drugiARN
        || this.row.a_NA == element.drugiANA || this.row.b_NA == element.drugiANA
        || this.row.b_ID == element.drugiAID || this.row.a_ID == element.drugiAID)
        {
          console.log(element)
          this.alarmInformation.push(element);
        }
    })
  }

}
