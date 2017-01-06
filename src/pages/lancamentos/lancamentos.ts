import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, Platform, ActionSheetController, Events } from 'ionic-angular';
import { ModalLancamentosPage } from '../modal-lancamentos/modal-lancamentos';
import { DAOLancamentos } from '../../dao/dao-lancamentos';
import { Toast } from 'ionic-native';
import { DataUtil } from '../../util/data-util';
import { DataFilter } from "../../components/data-filter";
import { RelatorioPage } from '../relatorio/relatorio';
 
@Component({
    selector: 'page-lancamentos',
    templateUrl: 'lancamentos.html',
    entryComponents:[DataFilter]
})

export class LancamentosPage {
    listLancamentos: Array<any>;
    dataFiltro: Date;

    constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    private daoLancamentos: DAOLancamentos,
    public actionSheetCtrl: ActionSheetController, 
    public platform: Platform,
    public alertCtrl: AlertController,
    public events: Events) {
        this.dataFiltro = new Date();
        this.atualizaLancamentos();
    }

    presentActionSheet(lancamento) {
        let actionSheet = this.actionSheetCtrl.create({
        title: "Modify: '" + lancamento.descricao + "'",
        cssClass: 'action-sheets-basic-page',
        buttons: [
            {
                text: 'Delete',
                role: 'delete',
                icon: !this.platform.is('ios') ? 'trash' : null,
                handler: () => {
                  this.delete(lancamento);
                }
            },{
                text: 'Edit',
                role: 'editar',
                icon: !this.platform.is('ios') ? 'md-color-palette' : null,
                handler: () => {
                  this.edit(lancamento);
                }
            },{
                text: 'Cancel',
                role: 'cancel',
                icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {}
            }
          ]
        });
        actionSheet.present();
    }

    insert() {
        let modal = this.modalCtrl.create(ModalLancamentosPage);

        modal.onDidDismiss((data) => {
            data && data.descricao != "" && this.daoLancamentos.insert(data).then(() => {
                this.updateMonth(new Date(data.data));

                Toast.showShortBottom("Registro inserido com sucesso!").subscribe((toast) => {
                    console.log(toast);
                });
            });
        });

        return modal.present();
    }

    edit(lancamento): Promise<any> {
        //abre modal de edição do lançamento
        let modal = this.modalCtrl.create(ModalLancamentosPage, { parametro: lancamento });

        modal.onDidDismiss((data) => { 
            this.daoLancamentos.edit(data);
            this.updateMonth(new Date(data.data));
            
            Toast.show("Registro atualizado com sucesso!", '5000', 'bottom').subscribe(
                toast => {
                    console.log(toast);
                }
            );
        });

        return modal.present();
    }

    delete(lancamento) {
        let prompt = this.alertCtrl.create({
            title: 'Confirma exclusão?',
            message:'Gostaria realmente de excluir o lancamento: ' + lancamento.descricao + '?',
            buttons: [
              {
                  text: 'Não',
                  handler: () => {}
              }, {
                  text:'Sim',
                  handler: () => {
                      this.daoLancamentos.delete(lancamento);
                      this.updateMonth(new Date(lancamento.data));

                    Toast.show("Registro excluído com sucesso!", '5000', 'bottom').subscribe(
                        toast => {
                            console.log(toast);
                        });
                    }
                }
            ]
        });
        prompt.present();
    }

    atualizaLancamentos() {
        let dataUtil = new DataUtil();
        let dataInicio = dataUtil.getFirstDay(this.dataFiltro);
        let dataFim = dataUtil.getLastDay(this.dataFiltro);
        //atualiza lista de lancamentos
        this.daoLancamentos.getList(dataInicio, dataFim).then(lancamentos => {
            this.listLancamentos = lancamentos;
        });
    }

    getDate(lancamento) {
        let dataUtil = new DataUtil();
        return dataUtil.parseString(lancamento.data);
    }

    situacaoLancamento(lancamento) {
        return lancamento.pago ? "Pago" : "Não pago";
    }

    lancamentoEntrada(lancamento) {
        return lancamento.entradaSaida == "entrada";
    }

    updateMonth(data) {
        this.dataFiltro = data;
        this.updateSaldo();
        this.atualizaLancamentos();
    }

    updateSaldo() {
        this.daoLancamentos.getSaldo().then(retorno => {
            console.log("SALDO-> " + (retorno[0].entrada - retorno[0].saida));
            this.events.publish("saldo:updated", retorno[0].entrada - retorno[0].saida);
        });
    }

    paymentButtonText(lancamento) {
        return lancamento.pago ? "Reabrir" : "Pagar";
    }

    changePaymentStatus(lancamento) {
        lancamento.pago = lancamento.pago ? 0 : 1;

        this.daoLancamentos.edit(lancamento);
        this.updateMonth(new Date(lancamento.data));
    }

    onClickMonth() {
        this.navCtrl.push(RelatorioPage, {parametro: this.dataFiltro});
    }
}