import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ISubject } from 'src/app/subject/models/subject';
import { ISimpleDropdownItem } from '../models/simple-dropdown-item';
import { ISubjectPermission } from 'src/app/subject/models/subject-permission';
import { IBaseExtract } from 'src/app/statement-base/models/base-extract';

export class FakeDataService implements InMemoryDbService {
  createDb() {
    let subjects: ISubject[] = [
        {
            PredmetID: 1,
            BrojPredmeta: '1234-567-8910',
            NazivPredmeta: 'Test predmet 1',
            DatumOtvaranja: new Date(),
            StatusPredmeta: 1,
            Napomena: 'Nema napomene za navedeni predmet',
            DozvoljeniKorisnici: [
                {
                    ID: 15,
                    Ime: 'David',
                    Prezime: 'Corona',
                    Flag: false,
                    Email: 'david.corona@gmail.com',
                    isAdalUser: true
                }
            ]
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

    let baseExtracts: IBaseExtract[] = [
        {
            IzvodID: 1,
            PredmetID: 1,
            OsobaID: 12,
            BrojRacuna: '123-456-123',
            DatumVrijemeOd: new Date(),
            DatumVrijemeDo: new Date(), 
            DatumVrijemeUvoza: new Date(), 
            BrojTransakcija: 321,
            BrojIsplata: 21, 
            Racun: '543-321-23', 
            IznosTransakcija: 21,
            IznosUplata: 59123921,
            IznosIsplata: 2312312,
            HashDatoteke: '#123123',  
            HashAlgoritam : '#321321'
        }
    ]

    return {subjects, subjectStatuses, subjectPermissions, baseExtracts};
  }
}