function afterProcessCreate(processId){
	
	// salva o número da solicitação no campo do formulário
	hAPI.setCardValue("PROTOCOLO", processId);
	
    // salva a data no campo do formulário
    var dataAbertura = dataFormatada();
    hAPI.setCardValue('DATAABERTURA', dataAbertura);
	
}

function dataFormatada() {
    var data = new Date(),
        dia = data.getDate(),
        mes = data.getMonth() + 1,
        ano = data.getFullYear(),
        hora = data.getHours(),
        minutos = data.getMinutes(),
        segundos = data.getSeconds();
    
    var dtaHra = '';
    dtaHra += [Number(dia).pad(), Number(mes).pad(), Number(ano).pad()].join('/');
    dtaHra += ' ';
    dtaHra += [Number(hora).pad(), Number(minutos).pad(), Number(segundos).pad()].join(':');
    
    return dtaHra;
}

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}