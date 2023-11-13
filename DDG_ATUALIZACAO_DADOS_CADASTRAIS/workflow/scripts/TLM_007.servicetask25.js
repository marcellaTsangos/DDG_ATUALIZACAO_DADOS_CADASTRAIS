function servicetask25(attempt, message) {
	
	//Isso é feito automaticamente pelo proprio RM
	//Portanto está comentado
	//Caso precise, já está pronto, basta descomentar
	
	/*
	log.info("TLM_007 - Inicio Integracao Histórico RM - " + hAPI.getCardValue("PROTOCOLO"))

    var codColigada = hAPI.getCardValue("CODCOLIGADA");
    var dadosPFHSTCPGTO = gerarPFHSTCENDERECO();
    var dataServerName = 'FOPHISTORICOENDERDATA';
    var parametros = [codColigada, dataServerName, JSON.stringify(dadosPFHSTCPGTO)];
    log.info('*-*-*-*-*-*-*-*TLM_005 PFHSTCPGTO: ' + JSON.stringify(dadosPFHSTCPGTO));
	
    var saveRecord = DatasetFactory.getDataset('ds_RMSaveRecordRetornoSimples', parametros, null, null);
    if (saveRecord.getValue(0, 'ERRO') != '0'){
    	throw String(saveRecord.getValue(0, 'DETALHES'))
    }
    */
    
}

function gerarPFHSTCENDERECO() {

	log.info("gerarPFHSTCENDERECO")
	
    var PFHSTEND = {
		
		DTMUDANCA: dataParaRm(),
		CODPESSOA: new String(hAPI.getCardValue("CODPESSOA")),
		CODTIPORUA: new String(hAPI.getCardValue("CODTIPORUA")),
		RUA: new String(hAPI.getCardValue("RUA")),
		NUMERO: new String(hAPI.getCardValue("NUMERO")),
		CODTIPOBAIRRO: new String(hAPI.getCardValue("CODTIPOBAIRRO")),
		BAIRRO: new String(hAPI.getCardValue("BAIRRO")),
		COMPLEMENTO: new String(hAPI.getCardValue("COMPLEMENTO")),
		CEP: new String(hAPI.getCardValue("CEP")),
		IDPAIS: new String(hAPI.getCardValue("CODCOLIGADA")),
		ESTADO: new String(hAPI.getCardValue("CODESTADO")),
		CODMUNICIPIO: new String(hAPI.getCardValue("CODMUNICIPIO")),
		
    }

    return PFHSTEND
}



function dataParaRm(){

	var dataDe = new Date()
	
	log.info("dataDe: "+dataDe)
	
	var dataForm
	
	dataForm = dataDe.toString()
	dataForm = dataForm.split(" ")
	
	var diaForm = dataForm[2]
	var anoForm = dataForm[3]
	
	var mesForm = dataForm[1]
	var hora = dataForm[4]
	
	if(mesForm=="Jan"){
		mesForm="01"
	}
	if(mesForm=="Feb"){
		mesForm="02"
	}
	if(mesForm=="Mar"){
		mesForm="03"
	}
	if(mesForm=="Apr"){
		mesForm="04"
	}
	if(mesForm=="May"){
		mesForm="05"
	}
	if(mesForm=="Jun"){
		mesForm="06"
	}
	if(mesForm=="Jul"){
		mesForm="07"
	}
	if(mesForm=="Aug"){
		mesForm="08"
	}
	if(mesForm=="Sep"){
		mesForm="09"
	}
	if(mesForm=="Oct"){
		mesForm="10"
	}
	if(mesForm=="Nov"){
		mesForm="11"
	}
	if(mesForm=="Dec"){
		mesForm="12"
	}
	
	dataForm = anoForm+"-"+mesForm+"-"+diaForm+"T"+"00:00:00"
	
	log.info("dataForm: "+dataForm)
	
	return dataForm 
	
}
