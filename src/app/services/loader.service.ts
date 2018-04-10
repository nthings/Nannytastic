import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoaderService {
    private subject = new Subject<any>();

    constructor() {
    }

    showLoader() {
        this.subject.next(true);
    }

    hideLoader() {
        this.subject.next(false);
    }

    loaderShouldShow() {
        return this.subject.asObservable();
    }

}
