export const OVERVIEW_COLUMNS: any[] = [
    {
        name: 'Br.', prop: 'index', sortable: true, width: 50        
    },
    {
        name: 'Ime / Naziv vlasnika računa', prop: 'Naziv', sortable: true, width: 150        
    },
    {
        name: 'Broj uvezenih računa', prop: 'UvezeneIzliste', sortable: true, width: 150        
    },
    {
        name: 'Ukupan broj transakcija', prop: 'BrojTransakcija', sortable: true, width: 150
    },
    {
        name: 'Ukupan iznos transakcija', prop: 'IznosTransakcija', sortable: true, width: 120
    }
];
 
export const EXPANDED_COLUMNS: any[] = [
    {
        name: 'Izvor', prop: 'index', sortable: true, width: 50        
    },
    {
        name: 'SWIFT/BIC', prop: 'action1', sortable: true, width: 50        
    },
    {
        name: 'Broj računa', prop: 'action1', sortable: true, width: 150        
    },
    {
        name: 'Datum uvoza', prop: 'text', sortable: true, width: 150        
    },
    {
        name: 'Ime / Naziv vlasnika računa', prop: 'action1', sortable: true, width: 150        
    },
    {
        name: 'Izvod OD', prop: 'link', sortable: true, width: 150
    },
    {
        name: 'Izvod DO', prop: 'link', sortable: true, width: 150
    },
    {
        name: 'Br. transakcija (U/I)', prop: 'link', sortable: true, width: 150
    },
    {
        name: 'Iznos transakcija (U/I)', prop: 'link', sortable: true, width: 150
    },
]