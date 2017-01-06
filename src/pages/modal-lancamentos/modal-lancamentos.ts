import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { DAOContas } from '../../dao/dao-contas';
import { DataUtil } from '../../util/data-util';

@Component({
    selector: 'page-modal-lancamentos',
    templateUrl: 'modal-lancamentos.html'
})
export class ModalLancamentosPage {
    lancamento;
    contas = null;

    descricao;
    valor;
    data;
    conta;
    entradaSaida;
    pago;

    constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private daoContas: DAOContas) {
        this.daoContas.getList().then(contas => {
            this.contas = contas;
        });

        this.lancamento = navParams.get("parametro") || {};

        this.descricao = this.lancamento.descricao;
        this.valor = this.lancamento.valor;
        this.data = this.getDate(this.lancamento.data);
        this.conta = this.lancamento.conta;
        this.entradaSaida = this.lancamento.entradaSaida;
        this.pago = this.lancamento.pago;
    }

    getDate(data) {
        let dataUtil = new DataUtil();
        return dataUtil.formatDate(data);
    }

    salvar() {
      let dataUtil = new DataUtil;
      let data = dataUtil.parseData(this.data);

      this.lancamento.descricao = this.descricao;
      this.lancamento.valor = parseFloat(this.valor);
      this.lancamento.data = data.getTime();
      this.lancamento.pago = this.pago ? 1 : 0;
      this.lancamento.conta = this.conta;
      this.lancamento.entradaSaida = this.entradaSaida; 

      this.viewCtrl.dismiss(this.lancamento);
    }

    cancel() {
      this.viewCtrl.dismiss();
    }
}
