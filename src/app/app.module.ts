import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { DAOContas } from '../dao/dao-contas';
import { DAOLancamentos } from '../dao/dao-lancamentos';

import { HomePage } from '../pages/home/home';
import { ContasPage } from '../pages/contas/contas';
import { ModalContasPage } from "../pages/modal-contas/modal-contas";
import { LancamentosPage } from "../pages/lancamentos/lancamentos";
import { ModalLancamentosPage } from "../pages/modal-lancamentos/modal-lancamentos";
import { DataFilter } from "../components/data-filter";
import { SaldoPage } from '../pages/saldo/saldo';
import { RelatorioPage } from '../pages/relatorio/relatorio';
import { ConfiguracoesPage } from '../pages/configuracoes/configuracoes';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ContasPage,
    ModalContasPage,
    LancamentosPage,
    ModalLancamentosPage,
    DataFilter,
    SaldoPage,
    RelatorioPage,
    ConfiguracoesPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ContasPage,
    ModalContasPage,
    LancamentosPage,
    ModalLancamentosPage,
    DataFilter,
    SaldoPage,
    RelatorioPage,
    ConfiguracoesPage
  ],
  providers: [
    DAOContas, 
    DAOLancamentos,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
