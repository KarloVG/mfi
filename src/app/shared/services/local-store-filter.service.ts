import { Injectable } from '@angular/core';

@Injectable()
export class LocalStoreFilterService {
    public readonly isActiveFilter = 'is_filter_active';
    public readonly filterFields = 'filter_fields';

    constructor() {
        this.checkIfActiveFilter();
    }

    checkIfActiveFilter() {
        if (!this.hasToken()) {
            localStorage[this.isActiveFilter] = null;
        }
    }

    hasToken() {
        const isActive = localStorage[this.isActiveFilter];
        if (isActive == 'null' || isActive == null) {
            return null;
        } else {
            return JSON.parse(localStorage[this.filterFields]);
        }
    }

    setFilterToken(isActiveFilter, filterFields) {
        localStorage[this.isActiveFilter] = isActiveFilter;
        localStorage[this.filterFields] = filterFields;
    }
}
