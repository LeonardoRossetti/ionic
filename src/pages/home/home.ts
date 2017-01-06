import { Component } from '@angular/core';
import { LancamentosPage } from '../lancamentos/lancamentos';
import { SaldoPage } from '../saldo/saldo';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    lancamentosRoot = LancamentosPage;
    saldoRoot = SaldoPage;

    constructor(public navCtrl: NavController) {
      
    }
}
