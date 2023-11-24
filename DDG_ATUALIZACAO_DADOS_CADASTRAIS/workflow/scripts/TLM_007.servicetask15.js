function servicetask15(attempt, message) {

	log.info("TLM_007 - Inicio Integracao - " + hAPI.getCardValue("PROTOCOLO"))

	var codColigada = hAPI.getCardValue("CODCOLIGADA");
	var dadosFopFuncData = gerarFopFuncData();
	var dataServerName = 'RHUPESSOADATA';
	var parametros = [codColigada, dataServerName, JSON.stringify(dadosFopFuncData)];
	log.info('*-*-*-*-*-*-*-*TLM_007 PPESSOA: ' + JSON.stringify(dadosFopFuncData));

	var saveRecord = DatasetFactory.getDataset('ds_RMSaveRecordRetornoSimples', parametros, null, null);
	if (saveRecord.getValue(0, 'ERRO') != '0') {
		throw String(saveRecord.getValue(0, 'DETALHES'))
	}

}

function gerarFopFuncData() {

	var cidadeAux = new String(hAPI.getCardValue("ZOOMMUNICIPIO")).toUpperCase();
	cidadeAux = cidadeAux.split(' - ')[1];

	var PPESSOA = {};

	PPESSOA.CODIGO = new String(hAPI.getCardValue("CODPESSOA")).toUpperCase();
	PPESSOA.EMAILPESSOAL = new String(hAPI.getCardValue("EMAIL")).toUpperCase();

	// Verifica se o CODTIPORUA não está vazio antes de adicioná-lo ao objeto
	var CODTIPORUA = new String(hAPI.getCardValue("CODTIPORUA")).toUpperCase();
	if (CODTIPORUA != "") {
		PPESSOA.CODTIPORUA = CODTIPORUA;
	}

	var RUA = new String(hAPI.getCardValue("RUA")).toUpperCase();
	if (RUA != "") {
		PPESSOA.RUA = RUA;
	}

	var NUMERO = new String(hAPI.getCardValue("NUMERO")).toUpperCase();
	if (NUMERO != "") {
		PPESSOA.NUMERO = NUMERO;
	}

	var CODTIPOBAIRRO = new String(hAPI.getCardValue("CODTIPOBAIRRO")).toUpperCase();
	if (CODTIPOBAIRRO != "") {
		PPESSOA.CODTIPOBAIRRO = CODTIPOBAIRRO;
	}

	var BAIRRO = new String(hAPI.getCardValue("BAIRRO")).toUpperCase();
	if (BAIRRO != "") {
		PPESSOA.BAIRRO = BAIRRO;
	}

	var COMPLEMENTO = new String(hAPI.getCardValue("COMPLEMENTO")).toUpperCase();
	if (COMPLEMENTO != "") {
		PPESSOA.COMPLEMENTO = COMPLEMENTO;
	}

	var CEP = new String(hAPI.getCardValue("CEP")).toUpperCase();
	if (CEP != "") {
		PPESSOA.CEP = CEP;
	}

	var IDPAIS = new String(hAPI.getCardValue("CODCOLIGADA")).toUpperCase();
	if (IDPAIS != "") {
		PPESSOA.IDPAIS = IDPAIS;
	}

	var ESTADO = new String(hAPI.getCardValue("CODESTADO")).toUpperCase();
	if (ESTADO != "") {
		PPESSOA.ESTADO = ESTADO;
	}

	var CODMUNICIPIO = new String(hAPI.getCardValue("CODMUNICIPIO")).toUpperCase();
	if (CODMUNICIPIO != "") {
		PPESSOA.CODMUNICIPIO = CODMUNICIPIO;
	}

	var TELEFONE2 = new String(hAPI.getCardValue("CELULAR")).toUpperCase();
	if (TELEFONE2 != "") {
		PPESSOA.TELEFONE2 = TELEFONE2;
	}

	var CIDADE = cidadeAux;
	if (CIDADE != "") {
		PPESSOA.CIDADE = CIDADE;
	}

	// var PPESSOA = {

	// 	CODIGO: new String(hAPI.getCardValue("CODPESSOA")).toUpperCase(),
	// 	CODTIPORUA: new String(hAPI.getCardValue("CODTIPORUA")).toUpperCase(),
	// 	RUA: new String(hAPI.getCardValue("RUA")).toUpperCase(),
	// 	NUMERO: new String(hAPI.getCardValue("NUMERO")).toUpperCase(),
	// 	CODTIPOBAIRRO: new String(hAPI.getCardValue("CODTIPOBAIRRO")).toUpperCase(),
	// 	BAIRRO: new String(hAPI.getCardValue("BAIRRO")).toUpperCase(),
	// 	COMPLEMENTO: new String(hAPI.getCardValue("COMPLEMENTO")).toUpperCase(),
	// 	CEP: new String(hAPI.getCardValue("CEP")).toUpperCase(),
	// 	IDPAIS: new String(hAPI.getCardValue("CODCOLIGADA")).toUpperCase(),
	// 	ESTADO: new String(hAPI.getCardValue("CODESTADO")).toUpperCase(),
	// 	CODMUNICIPIO: new String(hAPI.getCardValue("CODMUNICIPIO")).toUpperCase(),
	// 	/* TELEFONE1: new String(hAPI.getCardValue("TELEFONE")).toUpperCase().replace(/[^0-9]/g, ""), */ //campo ramovido conforme solicitação TLMT00060601
	// 	TELEFONE2: new String(hAPI.getCardValue("CELULAR")).toUpperCase().replace(/[^0-9]/g, ""),
	// 	EMAILPESSOAL: new String(hAPI.getCardValue("EMAIL")).toUpperCase(),
	// 	CIDADE: cidadeAux

	// }

	return PPESSOA
}