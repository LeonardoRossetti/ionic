import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { DAOLancamentos } from '../../dao/dao-lancamentos';

@Component({
  selector: 'page-saldo',
  templateUrl: 'saldo.html'
})
export class SaldoPage {
    saldo;

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        public events: Events,
        public daoLancamentos: DAOLancamentos) {
        daoLancamentos.getSaldo().then(retorno => {
            this.saldo = retorno[0].entrada - retorno[0].saida;
        });

        events.subscribe("saldo:updated", (saldo) => {
            this.saldo = parseFloat(saldo);
        });
    }
}
