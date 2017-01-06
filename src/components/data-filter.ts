import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataUtil } from '../util/data-util';

@Component({
    //directives: [IONIC_DIRECTIVES],
    inputs:['startDate'],
    outputs:['changeMonth', 'clickMonth'],
    selector: 'data-filter',
    template: ` <ion-row>
                    <ion-col width-20>
                        <button ion-fab mini (click)="previousMonth()"><ion-icon name="ios-arrow-back"></ion-icon></button>
                    </ion-col>
                    <ion-col width-60>
                        <h3 favorite class="texto-destaque" (click)="executeClickMonth()">{{mesSelecionado}}</h3>
                    </ion-col>
                    <ion-col width-20>
                        <button ion-fab mini (click)="nextMonth()"><ion-icon name="ios-arrow-forward"></ion-icon></button>
                    </ion-col>
                </ion-row>`
})

export class DataFilter {
    startDate:Date;
    mesSelecionado;
    changeMonth;
    clickMonth;

    constructor() {
        this.changeMonth = new EventEmitter();
        this.clickMonth = new EventEmitter();
    }

    executeClickMonth() {
        this.clickMonth.next();
    }

    _executeChangeMonth() {
        this.changeMonth.next(this.startDate);
    }

    _updateMonth(){
        let dataUtil = new DataUtil();
        let ano = this.startDate.getFullYear();
        this.mesSelecionado = dataUtil.getMonthName(this.startDate) + " - " + ano;
        this._executeChangeMonth();
    }

    ngOnInit() {
        this._updateMonth();
    }

    ngOnChanges(changes) {
        this._updateMonth();
    }

    previousMonth() {
        this.startDate.setMonth(this.startDate.getMonth() - 1);
        this._updateMonth();
    }

    nextMonth() {
        this.startDate.setMonth(this.startDate.getMonth() + 1);
        this._updateMonth();
    }
}