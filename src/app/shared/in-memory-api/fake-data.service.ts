import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ISubject } from 'src/app/subject/models/subject';
import { ISimpleDropdownItem } from '../models/simple-dropdown-item';
import { ISubjectPermission } from 'src/app/subject/models/subject-permission';
import { IBaseExtract } from 'src/app/statement-base/models/base-extract';
import { IBaseItem } from 'src/app/statement-base/models/base-item';

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
    ];

    let personTypes: ISimpleDropdownItem[] = [
        {
            id: 1,
            name: 'Fizička osoba'
        },
        {
            id: 2,
            name: 'Pravna osoba'
        }
    ];

    let identificationTypes: ISimpleDropdownItem[] = [
        {
            id: 1,
            name: 'OIB'
        },
        {
            id: 2,
            name: 'JMBAG'
        },
        {
            id: 3,
            name: 'MBS'
        }
    ];

    let baseItems: IBaseItem[] = [
        {
            ID: 1,
            Osoba: {
                OsobaID: 1,
                Naziv: 'Matija Matijić',
                TipOsobe: {
                    id: 1,
                    name: 'Fizička osoba'
                },
                IdBroj: 45311924532,
                VrstaIdBroja: {
                    id: 1,
                    name: 'OIB'
                }
            },
            UvezeneIzliste: 2,
            BrojTransakcija: '355 (210/150)',
            IznosTransakcija: '225 550 412 HRK (200.000 HRK/55.432 HRK)'
        },
        {
            ID: 2,
            Osoba: {
                OsobaID: 2,
                Naziv: 'Ivica Ivić',
                TipOsobe: {
                    id: 2,
                    name: 'Pravna osoba'
                },
                IdBroj: 23291391293,
                VrstaIdBroja: {
                    id: 2,
                    name: 'JMBAG'
                }
            },
            UvezeneIzliste: 0,
            BrojTransakcija: '155 (109/89)',
            IznosTransakcija: '87 550 412 HRK (123.000 HRK/40.432 HRK)'
        }
    ];

    return {
        subjects, 
        subjectStatuses, 
        subjectPermissions, 
        baseExtracts, 
        personTypes, 
        identificationTypes,
        baseItems
    };
  }
}