export interface ITimepickerDate {
    id: number,
    name: string;
}

export const MONTHS: ITimepickerDate[] = [
    { id: 1, name: 'Siječanj' },
    { id: 2, name: 'Veljača' },
    { id: 3, name: 'Ožujak' },
    { id: 4, name: 'Travanj' },
    { id: 5, name: 'Svibanj' },
    { id: 6, name: 'Lipanj' },
    { id: 7, name: 'Kolovoz' },
    { id: 8, name: 'Rujan' },
    { id: 9, name: 'Listopad' },
    { id: 10, name: 'Studeni' },
    { id: 11, name: 'Prosinac' }
];

export const YEARS: ITimepickerDate[] = [
    { id: 2020, name: '2020.' },
    { id: 2019, name: '2019.' },
    { id: 2018, name: '2018.' },
    { id: 2017, name: '2017.' },
    { id: 2016, name: '2016.' }
];