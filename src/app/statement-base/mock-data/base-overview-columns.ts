export const OVERVIEW_COLUMNS: any[] = [
    {
        name: 'Ime / Naziv vlasnika računa', prop: 'Osoba.Naziv', sortable: true, width: 150        
    },
    {
        name: 'Broj uvezenih računa', prop: 'UvezeneIzliste', sortable: true, width: 150        
    },
    {
        name: 'Ukupan broj transakcija (U/I)', prop: 'BrojTransakcija', sortable: true, width: 150
    },
    {
        name: 'Ukupan iznos transakcija (U/I)', prop: 'IznosTransakcija', sortable: true, width: 120
    }
];
 
export const EXPANDED_COLUMNS: any[] = [
    {
        name: 'Izvor', prop: 'Izvor', sortable: true, width: 50        
    },
    {
        name: 'SWIFT/BIC', prop: 'SWIFT', sortable: true, width: 50        
    },
    {
        name: 'Broj računa', prop: 'BrojRacuna', sortable: true, width: 50        
    },
    {
        name: 'Datum uvoza', prop: 'DatumUvoza', sortable: true, width: 50        
    },
    {
        name: 'Ime / Naziv vlasnika računa', prop: 'Naziv', sortable: true, width: 50        
    },
    {
        name: 'Izvod OD', prop: 'IzvodOd', sortable: true, width: 50
    },
    {
        name: 'Izvod DO', prop: 'IzvodDo', sortable: true, width: 50
    },
    {
        name: 'Br. transakcija (U/I)', prop: 'BrTransakcija', sortable: true, width: 50
    },
    {
        name: 'Iznos transakcija (U/I)', prop: 'IznosTransakcija', sortable: true, width: 50
    },
]