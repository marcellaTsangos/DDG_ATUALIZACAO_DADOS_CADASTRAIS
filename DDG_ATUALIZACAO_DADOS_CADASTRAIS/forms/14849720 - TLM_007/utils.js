//INSTANCIA OS SWITCHERS DO FLUIG
function instanciarSwitchers() {
	
	var switchers = ["painelFuncionarioInterno", "painelComissao","painelBonusAnual","painelPrevEmBudget",
	                 "painelNotebook", "painelCelular", "painelCarro", "painelEstacionamento", "painelAprovGestorIme",
	                 "painelAprovCfo","painelAprovDirRh","painelVagaFechada", "painelSolicitarAumento",
	                 ,"painelTiCiente","painelNovaPosicao","painelEncerrar"]
	
	switchers.forEach((switcher) => {
	
		FLUIGC.switcher.enable('#'+switcher);
		
	})
	
}

//INSTANCIA OS VALORES MONETARIOS DA CLASSE ".ValoresInteirosItens"
function instanciarValoresMonetarios() {
	
	$(".ValoresInteirosItens").maskMoney({
        prefix: "",
        decimal: "",
        thousands: "",
        allowZero: true,
        precision: 0
    });
	
	$(".ValoresMonetariosItens").maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: ".",
        allowZero: true
    });
	
	$(".ValoresDecimaisItens").maskMoney({
        prefix: "",
        decimal: ",",
        thousands: ".",
        allowZero: true
    });
	
	$(".ValoresDecimaisItensNegativo").maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: ".",
        allowNegative: true,
        allowZero: true
    });
	
}

function instanciarValoresMonetariosPaiFilho(idCampo, idLinha) {

	$("#" + idCampo + "___" + idLinha).maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: ".",
        allowZero: true
    });
	
}

function instanciarValoresDecimaisPaiFilho(idCampo, idLinha) {

	$("#" + idCampo + "___" + idLinha).maskMoney({
		prefix: "",
        decimal: ",",
        thousands: ".",
        allowZero: true
    });
	
}


//INSTANCIA AS DATAS DO FLUIG
function instanciarDatas() {
	
	var dados = dadosModoNumeroAtividade()
	
	var datasEtapa0ou4 = ["dataSaida", "dataChegada"];
	var datasIntegracao = ["emissaoIntegracao", "vencimentoIntegracao"];
	
	if(dados.numeroAtividade == 0 || dados.numeroAtividade == 4) {
		datasEtapa0ou4.forEach((data)=> {
			window[data] = FLUIGC.calendar('#' + data);
		})
	}
	
	if(dados.numeroAtividade == 18) {
		datasIntegracao.forEach((data)=> {
			window[data] = FLUIGC.calendar('#' + data);
		})
	}
	
	
	
}

function instanciaDataPaiFilho(idCampo, idLinha) {
	var id = idCampo + '___' + idLinha;
	window[id] = FLUIGC.calendar('#' + id);
}

function parseReal(valor) {
	
	if(isNaN(valor))
		return "R$ 0,00"
		
	return tratarEspaco(parseFloat(valor).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));	
	
}

function moneyParseFloat(valor, sinalSifrao) {

	valor = valor.replace(sinalSifrao, "")
    valor = valor.replace(/\./g,'');
	valor = valor.replace(',', '.')
	
    valor = parseFloat(valor);
	
	if(isNaN(valor))
		valor = 0.0;
	
    return valor;
    
}

function parseMilhar(valor) {
	
	if(isNaN(valor))
		return valor
		
	return parseFloat(valor).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}).substr(3);
	
}


function milharParseFloat(valor) {

    valor = valor.replace(/\./g,'');
	valor = valor.replace(',', '.')
	
    valor = parseFloat(valor);
	
	if(isNaN(valor))
		valor = 0.0;
	
    return valor;
    
}

function valorAmericanoParaFloat(valor) {

    valor = valor.replace(/\,/g,'');
    valor = parseFloat(valor);
	
	if(isNaN(valor))
		valor = 0.0;
	
    return valor;
    
}


const definirConteudoCampo = (idCampo, conteudo) => {

	var oElement = document.getElementById(idCampo);
	
	oElement.value = conteudo;
	oElement.dispatchEvent(new Event('change'));
	
	return oElement; 
	
}

const buscarConteudoCampo = (idCampo) => {

	return document.getElementById(idCampo).value 
	
} 

const tratarEspaco = (texto) => {
	
	return texto.replace(/\s/g, ' ');
	
}

const inverterData = (data) => {

    var dataAux = data.split("/");

    return dataAux[2]+'/'+dataAux[1]+'/'+dataAux[0];
    
}

const tratarDistanciaApiGoogleDistanceMatrix = (distancia) => {
	
	var distanciaAux = distancia.split(" ")[0];
	
	var distanciaFloat = valorAmericanoParaFloat(distanciaAux);
	
	return parseFloat(distanciaFloat);
	
}

function createConstraint(nomeConstraint = "", valueConstraint = "") {
  return {
    "_field": nomeConstraint,
    "_initialValue": valueConstraint,
    "_finalValue": valueConstraint,
    "_type": 1,
    "_likeSearch": false
  }
}










