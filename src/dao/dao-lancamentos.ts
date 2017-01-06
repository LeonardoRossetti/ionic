import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

@Injectable()
export class DAOLancamentos {

    listaLancamentos = [];
    private db: SQLite;

    constructor() {
        
    }

    private openDatabase(): Promise<SQLite> {
        if (this.db) {
            return Promise.resolve(this.db);
        }

        return SQLite.openDatabase({
            name: 'data.db',
            location: 'default'

        }).then((db: SQLite) => {
            this.db = db;
            db.executeSql('CREATE TABLE IF NOT EXISTS lancamentos(id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                            'descricao TEXT, valor REAL, data INTEGER, conta TEXT, entradaSaida TEXT, pago INTEGER)', {});
            console.log("Tabela 'lancamentos' criada");
            return db;

        }).catch((error) => { 
            console.error('Error opening database: ', error.message);
            return Promise.reject(error);
        });
    }

    resetAll() {
        this.openDatabase().then((db: SQLite) => {
            return db.transaction(function(tx){
                tx.executeSql("DELETE FROM lancamentos"), [], function (tx, data) {
                    console.log("Tabela 'lancamentos' foi apagada!");
                }
            });
        });
    }

    getList(dataInicio, dataFim): Promise<Array<any>> {
        return this.openDatabase().then((db: SQLite) => {
            return new Promise((resolve, reject) => {
                db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM lancamentos WHERE data >= ? and data <= ?",[dataInicio.getTime(), dataFim.getTime()], function(tx, data) {
                        let rows = [];
                        for (let i = 0; i < data.rows.length; i++) {
                            let item = data.rows.item(i);
                            rows[i] = {
                                id: item.id,
                                descricao: item.descricao,
                                valor: item.valor,
                                data: item.data,
                                conta: item.conta,
                                entradaSaida: item.entradaSaida,
                                pago: item.pago
                            };
                        }

                        resolve(rows);
                    });
                });
            });
        });
    }

    insert(lancamento): Promise<any> {
        return  this.openDatabase().then((db: SQLite) => {
            return db.transaction(function(tx) {
                console.log(lancamento);
                return tx.executeSql("INSERT INTO lancamentos (descricao, valor, data, conta, entradaSaida, pago) VALUES (?, ?, ?, ?, ?, ?)", 
                [lancamento.descricao, lancamento.valor, lancamento.data, lancamento.conta, lancamento.entradaSaida, lancamento.pago], function(tx, data) {
                    lancamento.id = data.insertId;
                });
            });
        });
    }    

    edit(lancamento) {
        this.openDatabase().then((db: SQLite)=>{
            return db.transaction(function(tx){
                return tx.executeSql("UPDATE lancamentos SET descricao = ?, valor = ?, data = ?, conta = ?, entradaSaida = ?, pago = ? WHERE id = ?", 
                [lancamento.descricao, lancamento.valor, lancamento.data, lancamento.conta, lancamento.entradaSaida, lancamento.pago, lancamento.id], function(tx, data) {
                    console.log("Lançamento alterado: ", lancamento.id);
                });
            });
        });
    }

    delete(lancamento) {        
        this.openDatabase().then((db: SQLite) => {
            return db.transaction(function(tx) {
                return tx.executeSql("DELETE FROM lancamentos WHERE id = ?", [lancamento.id], function(tx, data) {
                    console.log("Lançamento excluído: ", lancamento.id, " - ", lancamento.descricao);
                });
            });
        });
    }

      getSaldo() {
        return this.openDatabase().then((db: SQLite) => {
            return new Promise((resolve, reject) => {
                db.transaction(function(tx) {
                    tx.executeSql(`
                         SELECT TOTAL(valor) as saldo, entradaSaida FROM lancamentos 
                         where pago = 1 and entradaSaida = 'entrada'
                         UNION
                         SELECT TOTAL(valor) as saldo, entradaSaida FROM lancamentos 
                         where pago = 1 and entradaSaida = 'saida'
                        `,[], function(tx, data) {
                        let saldo = 0;
                        let entrada = 0;
                        let saida = 0;
                        let rows = [];

                        for (let i = 0; i < data.rows.length; i++) {
                            let item = data.rows.item(i);

                            if (item.entradaSaida == "entrada") {
                                entrada += item.saldo;
                            } else {
                                saida += item.saldo;
                            }
                        }
                        rows[0] = { entrada: entrada, saida: saida };
                        resolve(rows);
                    });
                });
            });
        });
    }

    getListGroupByConta(dataInicio, dataFim, entradaSaida) {
        return this.openDatabase().then((db: SQLite) => {
            return new Promise((resolve, reject) => {
                db.transaction(function(tx) {
                    tx.executeSql(`SELECT conta, TOTAL(valor) as saldoConta FROM lancamentos 
                                    WHERE data >= ? and data <= ? and entradaSaida = ? and pago = 1 
                                    GROUP BY conta`,[dataInicio.getTime(), dataFim.getTime(), entradaSaida], function(tx, data) {
                        let lista = [];

                        for (let i = 0; i < data.rows.length; i++) {
                            let item = data.rows.item(i);                            
                            let conta = {
                                conta: item.conta,
                                saldo: item.saldoConta,
                                percentual:0
                            };
                            lista.push(conta);
                        }
                        resolve(lista);
                    });
                });
            });
        });
    }
}

    
    
    
