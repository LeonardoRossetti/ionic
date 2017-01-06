export class DataUtil {
    parseData(data) {
        var parts = data.split("-");
        return new Date(parts[0], parts[1]-1, parts[2]);
    }

    parseString(data) {
        return new Date(data).toLocaleDateString();
    }

    formatDate(dataMiliseconds) {
        let data = new Date(dataMiliseconds);
        let inicio = "00";

        let ano = data.getFullYear();
        let mes = (inicio + (data.getMonth() + 1)).slice(-inicio.length);
        let dia = (inicio + (data.getDay() + 1)).slice(-inicio.length);

        return ano+"-"+mes+"-"+dia;
    }

    getMonthName(data) {
        let meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];        
        return meses[data.getMonth()]; 
    }

    getFirstDay(data) {
        let ano = data.getFullYear();
        let mes = data.getMonth();
        return new Date(ano, mes, 1);
    }

    getLastDay(data) {
        let ano = data.getFullYear();
        let mes = data.getMonth() + 1;

        //quando passamos o dia igual a zero o javascript retorna o ultimo dia do mês anterior
        return new Date(ano, mes, 0);
    }
}
