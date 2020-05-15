import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ISubject } from 'src/app/subject/models/subject';
import { ISimpleDropdownItem } from '../models/simple-dropdown-item';

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
    ]
    return {subjects, subjectStatuses};
  }
}