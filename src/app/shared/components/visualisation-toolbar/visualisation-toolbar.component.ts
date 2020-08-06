import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {SubjectService} from 'src/app/shared/services/subject.service'
import {SubjectApiService} from 'src/app/subject/services/subject.service'
import {BaseService} from 'src/app/statement-base/services/base.service'

import { DiagramService } from 'src/app/shared/services/diagram.service'

interface Types {
  id: string
  title: string
}
interface Users {
  id: string
  name: string
  oib: string
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
  usersList: Users[]

  selectedUser: UsersSelection = <UsersSelection>{}
  selectedType: Types = <Types>{}
  subjectId: number

  constructor(
    private activatedRoute: ActivatedRoute,
    private subjectService: SubjectService,
    private subjectApiService: SubjectApiService,
    private baseService: BaseService,

    private diaSvc: DiagramService,
  ) {
    this.typesList = [
      { id: 'sviracuni', title: 'Svi računi odabrane osobe' }
    ]
    this.selectedType = this.typesList[0]
  }

  ngOnInit(): void {
    /*
    this.subjectId = +this.subjectService.hasToken()
    console.log('ODX', this.subjectId)
    this.baseService.getOsobeDropdown().subscribe(
      data => {
        console.log('GOT', data)
        this.usersList = this.usersImportList.map(obj => ({...obj}))
      },
      err => {
        console.warn('ERR', err)
      }
    )
    */

    const usersImportList = this.diaSvc.getAllUsers()
    this.usersList = usersImportList.map(obj => ({...obj})) as any
    this.selectedUser = this.usersList.map(usr => { return { id: usr.id, name: usr.name + ' (OIB: ' + usr.oib + ')' }})[0]
  }

  addUser() {
    this.addUserAction(parseInt(this.selectedUser.id, 10), this.selectedType.id)
  }
}
