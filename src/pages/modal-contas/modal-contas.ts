import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';


@Component({
    selector: 'page-modal-contas',
    templateUrl: 'modal-contas.html'
})
export class ModalContasPage {
    public parametro:any;
    conta;
    
    constructor(public viewCtrl: ViewController, public params:NavParams) {
        //se o resultado de "params.get("parametro")" for nulo vai buscar {descricao: ""} 
        this.conta = params.get("parametro") || {descricao: ""};
    }

    salvar() {
        this.viewCtrl.dismiss(this.conta);
    }

    cancel() {
        this.viewCtrl.dismiss();
    }
}
