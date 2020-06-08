import { Injectable } from '@angular/core';

@Injectable()
export class LocalStoreSubjectService {
    public readonly identifire = 'subject_id';

    public applicationActions: string;
    constructor() {
        this.checkSubject();
    }

    checkSubject() {
        if (!this.hasToken()) {
            localStorage[this.identifire] = null;
        }
    }

    hasToken() {
        const token = localStorage[this.identifire];
        if (token == 'null' || token == null) {
            return null;
        }
        return token;
    }

    setToken(authData) {
        localStorage[this.identifire] = authData;
    }
}
