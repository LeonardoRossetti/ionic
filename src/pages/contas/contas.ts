import { Component } from '@angular/core';
import { ModalController, NavController, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { DAOContas } from '../../dao/dao-contas';
import { ModalContasPage } from "../modal-contas/modal-contas";
import { Toast } from 'ionic-native';

@Component({
    selector: 'page-contas',
    templateUrl: 'contas.html'
})
export class ContasPage {

    listContas: Array<any>;

    constructor(
    public modalCtrl: ModalController, 
    public navCtrl: NavController, 
    private daoContas: DAOContas, 
    public actionSheetCtrl: ActionSheetController, 
    public platform: Platform,
    public alertCtrl: AlertController) {
        this.atualizaContas();
    }

  presentActionSheet(conta) {
      let actionSheet = this.actionSheetCtrl.create({
          title: "Modify: '" + conta.descricao + "'",
          cssClass: 'action-sheets-basic-page',
          buttons: [
            {
              text: 'Delete',
              role: 'delete',
              icon: !this.platform.is('ios') ? 'trash' : null,
              handler: () => {
                this.delete(conta);
              }
            },{
              text: 'Edit',
              role: 'editar',
              icon: !this.platform.is('ios') ? 'md-color-palette' : null,
              handler: () => {
                this.edit(conta);
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

  insert(): Promise<any> {
      let modal = this.modalCtrl.create(ModalContasPage);

      modal.onDidDismiss((data) => {
          data && data.descricao != "" && this.daoContas.insert(data).then(() => {
              this.atualizaContas();

              Toast.showShortBottom("Registro inserido com sucesso!").subscribe((toast) => {
                  console.log(toast);
              });
          });
      });

      return modal.present();
  }

  edit(conta): Promise<any> {
      //abre modal de edição de conta
    let modal = this.modalCtrl.create(ModalContasPage, { parametro: conta });

      modal.onDidDismiss((data) => { 
          this.daoContas.edit(data);
          this.atualizaContas();
          
          Toast.show("Registro atualizado com sucesso!", '5000', 'bottom').subscribe(
              toast => {
                  console.log(toast);
              }
          );        
      });
      return modal.present();
  }

  delete(conta) {
      let prompt = this.alertCtrl.create({
          title: 'Confirma exclusão?',
          message:'Gostaria realmente de excluir a conta: ' + conta.descricao + '?',
          buttons: [
            {
                text: 'Não',
                handler: () => {}
            }, {
                text:'Sim',
                handler: () => {
                  this.daoContas.delete(conta);
                  this.atualizaContas();

                  Toast.show("Registro excluído com sucesso!", '5000', 'bottom').subscribe(
                    toast => {
                        console.log(toast);
                    });
                }
            }
          ]
      });
      prompt.present();
      
      //let pos = this.listaContas.indexOf(conta);
      //this.listaContas.splice(pos, 1);
  }

  atualizaContas() {
      //atualiza lista de contas
      this.daoContas.getList().then(contas => {
          this.listContas = contas;
      });
  }
}
