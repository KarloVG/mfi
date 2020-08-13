import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {SubjectService} from 'src/app/shared/services/subject.service'
import {SubjectApiService} from 'src/app/subject/services/subject.service'
import {BaseService} from 'src/app/statement-base/services/base.service'
import { VisualisationToolbarService } from '../../services/visualisation-toolbar.service';
import { IOsobaDropdown } from '../../models/osoba-dropdown';

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

  typesList: Types[]
  usersList: IOsobaDropdown[] = [];

  selectedUser: IOsobaDropdown;
  selectedType: Types = <Types>{}
  subjectId: number

  constructor(
    private subjectService: SubjectService,
    private visualisationService: VisualisationToolbarService
  ) {
    this.typesList = [
      { id: 'sviracuni', title: 'Svi računi odabrane osobe' }
    ]
    this.selectedType = this.typesList[0]
  }

  ngOnInit(): void {
    this.subjectId = +this.subjectService.hasToken();
    this.visualisationService.getOsobaDropdown().subscribe(
      data => {
        this.usersList = data;
        this.selectedUser = this.usersList[0];
      }
    )
  }

  addUser() {
    this.addUserAction(this.selectedUser.osobaID, this.selectedType.id)
  }
}
