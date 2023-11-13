function servicetask15(attempt, message) {

	log.info("TLM_007 - Inicio Integracao - " + hAPI.getCardValue("PROTOCOLO"))

    var codColigada = hAPI.getCardValue("CODCOLIGADA");
    var dadosFopFuncData = gerarFopFuncData();
    var dataServerName = 'RHUPESSOADATA';
    var parametros = [codColigada, dataServerName, JSON.stringify(dadosFopFuncData)];
    log.info('*-*-*-*-*-*-*-*TLM_007 PPESSOA: ' + JSON.stringify(dadosFopFuncData));
	
    var saveRecord = DatasetFactory.getDataset('ds_RMSaveRecordRetornoSimples', parametros, null, null);
    if (saveRecord.getValue(0, 'ERRO') != '0'){
    	throw String(saveRecord.getValue(0, 'DETALHES'))
    } 
    
}

function gerarFopFuncData() {

	var cidadeAux = new String(hAPI.getCardValue("ZOOMMUNICIPIO")).toUpperCase();
	cidadeAux = cidadeAux.split(' - ')[1];
	
    var PPESSOA = {
		
		CODIGO: new String(hAPI.getCardValue("CODPESSOA")).toUpperCase() ,
		CODTIPORUA: new String(hAPI.getCardValue("CODTIPORUA")).toUpperCase(),
		RUA: new String(hAPI.getCardValue("RUA")).toUpperCase(),
		NUMERO: new String(hAPI.getCardValue("NUMERO")).toUpperCase(),
		CODTIPOBAIRRO: new String(hAPI.getCardValue("CODTIPOBAIRRO")).toUpperCase(),
		BAIRRO: new String(hAPI.getCardValue("BAIRRO")).toUpperCase(),
		COMPLEMENTO: new String(hAPI.getCardValue("COMPLEMENTO")).toUpperCase(),
		CEP: new String(hAPI.getCardValue("CEP")).toUpperCase(),
		IDPAIS: new String(hAPI.getCardValue("CODCOLIGADA")).toUpperCase(),
		ESTADO: new String(hAPI.getCardValue("CODESTADO")).toUpperCase(),
		CODMUNICIPIO: new String(hAPI.getCardValue("CODMUNICIPIO")).toUpperCase(),
		/* TELEFONE1: new String(hAPI.getCardValue("TELEFONE")).toUpperCase().replace(/[^0-9]/g, ""), */ //campo ramovido conforme solicitação TLMT00060601
		TELEFONE2: new String(hAPI.getCardValue("CELULAR")).toUpperCase().replace(/[^0-9]/g, ""),
		EMAILPESSOAL: new String(hAPI.getCardValue("EMAIL")).toUpperCase(),
		CIDADE: cidadeAux
    	
    }

    return PPESSOA
}