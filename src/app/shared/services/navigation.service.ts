import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStoreSubjectService } from './local-store-subject.service';

export interface IMenuItem {
    name: string
    path: string
    descr: string
    icon: string
    active?: boolean
    visible?: boolean
    disabled: boolean
}

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor(
        private localStoreService: LocalStoreSubjectService
    ) { }

    getDefaultMenu(): IMenuItem[] {
        return [
            {
                name: 'predmet',
                path: '/subject/' + this.localStoreService.hasToken(),
                descr: 'Predmet',
                icon: 'fa-folder-open',
                active: false,
                visible: true,
                disabled: false,
            },
            {
                name: 'izvodi',
                path: '/statement-base/overview',
                descr: 'Baza izvoda',
                icon: 'fa-database',
                active: false,
                visible: true,
                disabled: false,
            },
            {
                name: 'tablice',
                path: '/table/overview',
                descr: 'Tablica',
                icon: 'fa-table',
                active: false,
                visible: true,
                disabled: false,
            },
            {
                name: 'grafovi',
                path: '/diagram/overview',
                descr: 'Dijagram',
                icon: 'fa-sitemap',
                active: false,
                visible: true,
                disabled: false,
            },
            {
                name: 'tijek',
                path: '/flow/overview',
                descr: 'Tijek',
                icon: 'fa-clock',
                active: false,
                visible: true,
                disabled: false,
            },
            {
                name: 'mapa',
                path: '/map/overview',
                descr: 'Mapa',
                icon: 'fa-map',
                active: false,
                visible: true,
                disabled: false,
            },
            {
                name: 'graf',
                path: '/chart/overview',
                descr: 'Graf',
                icon: 'fa-chart-pie',
                active: false,
                visible: true,
                disabled: false,
            }
        ];
    }

    emptyMenu: IMenuItem[] = [];
    menuItems = new BehaviorSubject<IMenuItem[]>(this.emptyMenu);
    menuItems$ = this.menuItems.asObservable();

    publishNavigationChange() {
        if (this.localStoreService.hasToken() == null) {
            this.menuItems.next(this.emptyMenu);
        } else {
            this.menuItems.next(this.getDefaultMenu());
        }
    }
}
