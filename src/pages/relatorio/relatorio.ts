import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataUtil } from '../../util/data-util';
import { DAOLancamentos } from '../../dao/dao-lancamentos';

@Component({
    selector: 'page-relatorio',
    templateUrl: 'relatorio.html'
})
export class RelatorioPage {
    listaContas;
    entradaSaida;
    daoLancamentos;
    dataUtil;
    dataFiltro;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.daoLancamentos = new DAOLancamentos();
        this.dataFiltro = navParams.get("parametro");
        this.entradaSaida = "entrada";
        this._getList(this.entradaSaida);
    }

    _getList(entradaSaida) {
        this.dataUtil = new DataUtil();

        let dataInicio = this.dataUtil.getFirstDay(this.dataFiltro);
        let dataFim = this.dataUtil.getLastDay(this.dataFiltro);

        this.daoLancamentos.getListGroupByConta(dataInicio, dataFim, entradaSaida).then((listaContas) => {
            this.listaContas = listaContas;
            this._calcPercentual();
        });
    }

    onSelect(entradaSaida) {
        this._getList(entradaSaida);
    }

    _calcTotal() {
        let total = 0;

        for(let i = 0; i < this.listaContas.length; i++) {
            total += this.listaContas[i].saldo;
        }

        return total;
    }

    _calcPercentual() {
        let total = this._calcTotal();
        for(let i = 0; i < this.listaContas.length; i++) {
            this.listaContas[i].percentual = (this.listaContas[i].saldo / total) * 100;
        }
    }
}
