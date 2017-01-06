import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

@Injectable()
export class DAOContas {

    listaContas = [];
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
            db.executeSql('CREATE TABLE IF NOT EXISTS contas(id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT)', {});
            console.log("Tabela 'contas' criada");
            return db;

        }).catch((error) => { 
            console.error('Error opening database: ', error.message);
            return Promise.reject(error);
        });
    }

    resetAll() {
        this.openDatabase().then((db: SQLite) => {
            return db.transaction(function(tx){
                tx.executeSql("DELETE FROM contas"), [], function (tx, data) {
                    console.log("Tabela 'contas' foi apagada!");
                }
            });
        });
    }

    getList(): Promise<Array<any>> {
        return this.openDatabase().then((db: SQLite) => {
            return new Promise((resolve, reject) => {
                db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM contas",[], function(tx, data) {

                        let rows = [];
                        for (let i = 0; i < data.rows.length; i++) {
                            let item = data.rows.item(i);
                            rows[i] = {
                                id: item.id,
                                descricao: item.descricao
                            };
                        }

                        resolve(rows);
                        /*return data.rows.map(row => {
                            return {
                                
                            };
                        });*/
                    });
                });
            });
        });
    }

    insert(conta): Promise<any> {
        return  this.openDatabase().then((db: SQLite) => {
            return db.transaction(function(tx) {
                return tx.executeSql("INSERT INTO contas (descricao) VALUES (?)", [conta.descricao], function(tx, data) {
                    conta.id = data.insertId;
                });
            });
        });
    }    

    edit(conta) {
        this.openDatabase().then((db: SQLite)=>{
            return db.transaction(function(tx){
                return tx.executeSql("UPDATE contas SET descricao = ? WHERE id = ?", [conta.descricao, conta.id], function(tx, data) {
                    console.log("Conta alterada: ", conta.id);
                });
            });
        });
    }

    delete(conta) {        
        this.openDatabase().then((db: SQLite) => {
            return db.transaction(function(tx) {
                return tx.executeSql("DELETE FROM contas WHERE id = ?", [conta.id], function(tx, data) {
                    console.log("Conta deletada: ", conta.id, " - ", conta.descricao);
                });
            });
        });
    }
}