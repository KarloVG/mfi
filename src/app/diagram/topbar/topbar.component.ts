import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {SubjectService} from 'src/app/shared/services/subject.service'
import {SubjectApiService} from 'src/app/subject/services/subject.service'

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
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  @Input() addUserAction: any
  @Input() expandViewAction: any
  @Input() contractViewAction: any
  @Input() usersImportList: Users[]
  typesList: Types[]
  usersList: Users[]

  moduleName: string = 'Diagram financijskih transakcija';
  moduleFontIcon = 'fas fa-sitemap';

  selectedUser: UsersSelection = <UsersSelection>{}
  selectedType: Types = <Types>{}

  subjectId: number

  constructor(
    private activatedRoute: ActivatedRoute,
    private subjectService: SubjectService,
    private subjectApiService: SubjectApiService,
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
    this.subjectApiService.getSubjectById(this.subjectId).subscribe(
      data => {
        console.log('GOT', data)
      },
      err => {
        console.warn('ERR', err)
      }
    )
    */
    this.usersList = this.usersImportList.map(obj => ({...obj}))
    this.selectedUser = this.usersList.map(usr => { return { id: usr.id, name: usr.name + ' (OIB: ' + usr.oib + ')' }})[0]
  }

  addUser() {
    this.addUserAction(parseInt(this.selectedUser.id, 10), this.selectedType.id)
  }
}
