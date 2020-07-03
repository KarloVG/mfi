import {Component, OnInit, Input} from '@angular/core';

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
  @Input() usersImportList: Users[]
  typesList: Types[]
  usersList: Users[]

  moduleName: string = 'Diagram financijskih transakcija';
  moduleFontIcon = 'fas fa-sitemap';

  selectedUser: UsersSelection = <UsersSelection>{}
  selectedType: Types = <Types>{}

  constructor() {
    this.typesList = [
      { id: 'sviracuni', title: 'Svi računi odabrane osobe' }
    ]
    this.selectedType = this.typesList[0]
  }

  ngOnInit(): void {
    this.usersList = this.usersImportList.map(obj => ({...obj}))
    this.selectedUser = this.usersList.map(usr => { return { id: usr.id, name: usr.name + ' (OIB: ' + usr.oib + ')' }})[0]
  }

  addUser() {
    this.addUserAction(parseInt(this.selectedUser.id, 10), this.selectedType.id)
  }
}
