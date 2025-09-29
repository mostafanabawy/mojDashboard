import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
    moduleId: module.id,
    selector: 'footer',
    templateUrl: './footer.html',
})
export class FooterComponent {
    currYear: number = new Date().getFullYear();
    store: any;
    constructor(
        private storeData: Store<any>
    ) {
        this.initStore();
    }
    initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }
    ngOnInit() { }
}
