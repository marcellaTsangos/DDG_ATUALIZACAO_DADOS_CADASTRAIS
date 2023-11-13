function setSelectedZoomItem(selectedItem) {

	var idCampo = selectedItem.inputName;
	var seq = idCampo.split("___")[1];

	if(idCampo.indexOf('ZOOMESTADO') != -1) {
		document.getElementById("CODESTADO").value = selectedItem.CODETD;
		reloadMunicipio(seq);
	}
	
	if(idCampo.indexOf('ZOOMMUNICIPIO') != -1) {
		document.getElementById("CODMUNICIPIO").value = selectedItem.CODMUNICIPIO;
	}
	
	if(idCampo.indexOf('ZOOMTIPOBAIRRO') != -1) {
		document.getElementById("CODTIPOBAIRRO").value = selectedItem.CODIGO;
	}
	
	if(idCampo.indexOf('ZOOMTIPORUA') != -1) {
		document.getElementById("CODTIPORUA").value = selectedItem.CODIGO;
	}
	
}

function removedZoomItem(removedItem) {

	 var idCampo = removedItem.inputName;
	 var seq = idCampo.split("___")[1];
	 
	 if(idCampo.indexOf('ZOOMESTADO') != -1) 
		limparEstado(idCampo);
	
	 if(idCampo.indexOf('ZOOMMUNICIPIO') != -1) 
		limparMunicipio(idCampo);
	
	 if(idCampo.indexOf('ZOOMTIPOBAIRRO') != -1)
		document.getElementById("CODTIPOBAIRRO").value = "";
	 
	 if(idCampo.indexOf('ZOOMTIPORUA') != -1)
		document.getElementById("CODTIPORUA").value = "";
	 
	 
}

function limparEstado(origem) {
	
	var campo = "ZOOMESTADO";
	var campoCodigo = "CODESTADO";
	
	var origemAux = origem.split("___")[0];
	var seq = origem.split("___")[1];
	
	var refCampo = !seq ? campo : campo + "___" + seq
	var refCampoCodigo = !seq ? campoCodigo : campoCodigo + "___" + seq
	
	document.getElementById(refCampoCodigo).value = "";
	window[refCampo].clear();
	
	if(origemAux != campo) {
		reloadBanco(seq);
	}
	
	//Limpa o Filho;
	limparMunicipio(origem);
	
}

function limparMunicipio(origem) {
	
	var campo = "ZOOMMUNICIPIO";
	var campoCodigo = "CODMUNICIPIO";
	
	var origemAux = origem.split("___")[0];
	var seq = origem.split("___")[1];
	
	var refCampo = !seq ? campo : campo + "___" + seq
	var refCampoCodigo = !seq ? campoCodigo : campoCodigo + "___" + seq
	
	document.getElementById(refCampoCodigo).value = "";
	window[refCampo].clear();
	
	if(origemAux != campo) {
		reloadMunicipio(seq);
	}
	
	//Limpa o Filho;
	//limparFilho(origem);
	
	//Regras Especificas
	
}

function reloadMunicipio(seq) {
	
	var campo = "ZOOMMUNICIPIO";
	var campoCodigo = "CODMUNICIPIO";
	
	var refCampo = !seq ? campo : campo + "___" + seq
	var refCampoCodigo = !seq ? campoCodigo : campoCodigo + "___" + seq
	
	var nomeConstraint = "CODETDMUNICIPIO"
	var valorParaConstraint = document.getElementById("CODESTADO").value;
	
    //reloadZoomFilterValues(refCampo, nomeConstraint+", "+valorParaConstraint);
    
    reloadZoomFilterValues(refCampo, nomeConstraint+","+valorParaConstraint)
}



