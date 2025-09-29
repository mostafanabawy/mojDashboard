import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppService } from '../service/app.service';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '../types/auth.types';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app-layout.html',
})
export class AppLayout {
    store!: AppState;
    showTopButton = false;
    constructor(public translate: TranslateService, public storeData: Store<AppState>, private service: AppService, public router: Router) {
        this.initStore();
    }
    headerClass = '';
    ngOnInit() {
        this.initAnimation();
        this.toggleLoader();
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                this.showTopButton = true;
            } else {
                this.showTopButton = false;
            }
        });
        this.storeData.dispatch({ type: 'toggleRTL', payload: 'rtl' });

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if (event.urlAfterRedirects === '/dashboard-slider') {
                    this.storeData.dispatch({ type: 'toggleSidebar', payload: false });
                }
            });

        /* if(this.store.auth.user?.role == 'Manager'){
            this.router.navigate(['/real-estate-brokerage'])
        } */
    }

    ngOnDestroy() {
        window.removeEventListener('scroll', () => { });
    }

    initAnimation() {
        this.service.changeAnimation();
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.service.changeAnimation();
            }
        });

        const ele: any = document.querySelector('.animation');
        ele.addEventListener('animationend', () => {
            this.service.changeAnimation('remove');
        });
    }

    toggleLoader() {
        this.storeData.dispatch({ type: 'toggleMainLoader', payload: true });
        setTimeout(() => {
            this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
        }, 1000);
    }

    async initStore() {
        this.storeData
            .select((d) => ({
                index: d.index,
                auth: d.auth
            }))
            .subscribe((d) => {
                this.store = d;
            });
    }

    goToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    
}
