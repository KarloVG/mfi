import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {SubjectService} from 'src/app/shared/services/subject.service'
import {SubjectApiService} from 'src/app/subject/services/subject.service'
import {BaseService} from 'src/app/statement-base/services/base.service'
import { VisualisationToolbarService } from '../../services/visualisation-toolbar.service';
import { IOsobaDropdown } from '../../models/osoba-dropdown';
import { IIzvodDropdown } from '../../models/izvod-dropdown';

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
  @Input() displayType: string // [ chart | diagram | flow | map | table ]
  @Input() addUserAction: any
  @Input() expandViewAction: any
  @Input() contractViewAction: any
  @Input() notificationsAction: any
  @Input() filterAction: any
  @Input() exportAction: any

  @Output() childNotification: EventEmitter<any> = new EventEmitter<any>();

  typesList: Types[]
  osobe: IOsobaDropdown[] = [];
  selectedOsoba: IOsobaDropdown;

  selectedIzvod: IIzvodDropdown;
  izvodi: IIzvodDropdown[] = [];
  subjectId: number

  constructor(
    private subjectService: SubjectService,
    private visualisationService: VisualisationToolbarService
  ) { }

  ngOnInit(): void {
    this.subjectId = +this.subjectService.hasToken();
    this.visualisationService.getOsobaDropdown().subscribe(
      data => {  this.osobe = data;  }
    )
  }

  addUser(): void {
    this.addUserAction(this.selectedOsoba.osobaID, this.selectedIzvod.izvodID)
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

  onChangeActiveIzvod(event) {
    if(event && event.izvodID) {
      this.childNotification.emit({osobaID: this.selectedOsoba.osobaID,izvodID: event.izvodID });
    }
  }

  // outputUserToParentComponent(event): void {
  //   this.activeUser.emit(event);
  // }
}
