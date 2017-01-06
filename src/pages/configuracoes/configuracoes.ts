import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { DAOContas } from '../../dao/dao-contas';
import { DAOLancamentos } from '../../dao/dao-lancamentos';
import { Toast } from 'ionic-native';

@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html'
})
export class ConfiguracoesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {

  }

  ResetarBase() {
      let prompt = this.alertCtrl.create({
          title: 'Confirma exclusão?',
          message:'Gostaria realmente de excluir o conteúdo de todas as tabelas do sistema? Não será possível reverter a operação!',
          buttons: [{
              text: 'Não',
              handler: () => {}
          }, {
              text:'Sim',
              handler: () => {
                  let daoContas = new DAOContas();
                  let daoLancamentos = new DAOLancamentos();
                  daoContas.resetAll();
                  daoLancamentos.resetAll();
          
                  Toast.show("Registros excluído com sucesso!", '5000', 'bottom').subscribe(
                      toast => {
                          console.log(toast);
                      });
                }
            }]
        });
        prompt.present();
    }
}
