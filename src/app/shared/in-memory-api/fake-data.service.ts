import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ISubject } from 'src/app/subject/models/subject';
import { ISimpleDropdownItem } from '../models/simple-dropdown-item';
import { ISubjectPermission } from 'src/app/subject/models/subject-permission';

export class FakeDataService implements InMemoryDbService {
  createDb() {
    let subjects: ISubject[] = [
        {
            PredmetID: 1,
            BrojPredmeta: '1234-567-8910',
            NazivPredmeta: 'Test predmet 1',
            DatumOtvaranja: new Date(),
            StatusPredmeta: 1,
            Napomena: 'Nema napomene za navedeni predmet'
        }
    ];
    let subjectStatuses: ISimpleDropdownItem[] = [
        {
            id: 1,
            name: 'Priprema'
        },
        {
            id: 2,
            name: 'Otvoren'
        },
        {
            id: 3,
            name: 'Zatvoren'
        },
        {
            id: 4,
            name: 'Arhiviran'
        }
    ];

    let subjectPermissions: ISubjectPermission[] = [
        {
            ID: 1,
            Ime: 'Matija',
            Prezime: 'Matijić',
            Email: 'matija.matijic@gmail.com',
            Flag: false,
        },
        {
            ID: 2,
            Ime: 'Ivan',
            Prezime: 'Ivić',
            Email: 'ivan.ivic@gmail.com',
            Flag: false,
        },
        {
            ID: 3,
            Ime: 'Darko',
            Prezime: 'Darkić',
            Email: 'darko.darkic@gmail.com',
            Flag: false,
        },
        {
            ID: 4,
            Ime: 'Miro',
            Prezime: 'Mirić',
            Email: 'miro.miric@gmail.com',
            Flag: false,
        },
    ];

    return {subjects, subjectStatuses, subjectPermissions};
  }
}