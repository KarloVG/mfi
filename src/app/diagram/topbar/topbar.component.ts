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

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  @Input() addUserAction: any

  @Input() usersList: Users[]
  typesList: Types[]

  selectedUser: Users = <Users>{}
  selectedType: Types = <Types>{}

  constructor() {
    this.typesList = [
      {
        id: 'sviracuni',
        title: 'Svi računi odabrane osobe'
      }
    ]
    this.selectedType = this.typesList[0]
  }

  ngOnInit(): void {
    this.selectedUser = this.usersList[0]
  }

  addUser() {
    this.addUserAction(parseInt(this.selectedUser.id, 10), this.selectedType.id)
  }
}
