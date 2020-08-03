import { Injectable } from '@angular/core';

@Injectable()
export class SubjectService {
    public readonly subjectIdentifier = 'subject_id';

    public applicationActions: string;
    constructor() {
        this.checkSubject();
    }

    checkSubject() {
        if (!this.hasToken()) {
            localStorage[this.subjectIdentifier] = null;
        }
    }

    hasToken() {
        const token = localStorage[this.subjectIdentifier];
        if (token == 'null' || token == null) {
            return null;
        }
        return token;
    }

    setToken(authData) {
        localStorage[this.subjectIdentifier] = authData;
    }
}
