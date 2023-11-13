//Chamada da funcao

function iniciarListenersUploadUnico() {

	listenerDoUpload('Comprovante',"ComprovanteEndereco");	
	
}

function listenerDoUpload(idAux, nomeArquivo){
	
	var loading = FLUIGC.loading(window);
	
	$('[name^=btnAddAnexo' + idAux + ']').fileupload({
		
        dataType: 'json',
        
        start: () => {
            loading.show();
        },
        
        done: (e, data) => {

	        var url
	         
	        if (data.result) {
	            
	        	var chapa = document.getElementById('CHAPA').value;
	        	var ano = new Date().getFullYear();
	        	
	        	var file = data.files[0];
	        	var extensao = data.files[0].name.split(".")[1]
	        	var idPastaGed = document.getElementById('IDPASTAGED').value;
	        	var nomeArquivo = chapa + " - Comprovante endereço - " + ano+"."+extensao;
	        	
	        	
	        	salvarGedWs(idPastaGed, nomeArquivo, file, idAux);
	        	
	        }

        },
        
        fail: (e, data) => {
        	console.log('FALHA'); console.log(e); console.log(data);
        },
        
        stop: () => {
        	loading.hide();
        }
    });
	

	var idDocumentAux = document.getElementById('hid_documentId' + idAux);
	var modoFormulario = dadosModoNumeroAtividade().modoFormulario

	if(idDocumentAux.value == "" || modoFormulario == "VIEW") {
		document.getElementById('visualizar' + idAux).style.display = "none";
		document.getElementById('btnDwAnexo' + idAux).style.display = "none";
		document.getElementById('deletar' + idAux).style.display = "none";
	}
	
}

function visualizarDocumentUnico(e) {
	
	var idDocument = e.nextElementSibling.value;
	var link = gerarLinkArquivoUnico(idDocument);
	window.open(link);
	
}



function gerarLinkArquivoUnico(idDoc) {
	
    var link;
    var url = '/api/public/2.0/documents/getDownloadURL/' + idDoc;
    var obj = {};
    var params = JSON.stringify(obj);

    $.ajax(url, {
        async: false,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        //data: params,

        success: function (data) {
            link = data.content;
        },
        error: function (e) {
            console.log(e);
        }
    });

    return link;
}


function baixarArquivoUnico(e) {
	
	var idDocument = e.parentElement.previousElementSibling.childNodes[3].value;
    var url = gerarLinkArquivo(idDocument);
    e.href = url;
    
}

const showButtonsUnico = (type) => {
	
	$('#visualizar' + type ).parent().siblings().find('span').show('slow');
    $('#visualizar' + type ).parent().siblings().find('a').show('slow');
	
	if(dadosModoNumeroAtividade().numeroAtividade == "5") {
		$('#visualizar' + type ).show('slow');
	} 
}

const hideButtonsUnico = (type) => {
	
	$('#visualizar' + type ).parent().siblings().find('span').hide('slow');
    $('#visualizar' + type ).parent().siblings().find('a').hide('slow');
	
	if(dadosModoNumeroAtividade().numeroAtividade == "5") {
		$('#visualizar' + type ).hide('slow');
	}
}

function openDocument(e) {
	
	var docVersion = 1000;
	var docId = e.nextElementSibling.value;
	
    var parentOBJ;

    if (window.opener) {
        parentOBJ = window.opener.parent;
    } else {
        parentOBJ = parent;
    }

    var cfg = {
        url: "/ecm_documentview/documentView.ftl",
        maximized: true,
        title: "Visualizador de Documentos",
        callBack: function () {
            parentOBJ.ECM.documentView.getDocument(docId, docVersion);
        },
        customButtons: []
    };
    
    parentOBJ.ECM.documentView.panel = parentOBJ.WCMC.panel(cfg);
    
}








function buscarAjustarPastaGed(){

	
	var idPastaGed = document.getElementById("IDPASTAGED").value
	
	if(idPastaGed != "")
		return
	
	
	var codigoColigada = document.getElementById('CODCOLIGADA').value;
	var codigoFilial = document.getElementById('CODREGIONAL').value;
	var siglaFilial = document.getElementById('SIGLAFILIAL').value;
	var chapa = document.getElementById('CHAPA').value;
	var funcionario = document.getElementById('FUNCIONARIO').value;
	
	var path = [];

	//primeiro nivel
	var empresa = { 2: 'TELEMONT', 3: 'PERSONAL' }[codigoColigada];
	path.push(empresa);
	
	//segundo nivel
	path.push("ARQUIVO DIGITAL");
	
	//terceiro nivel
	var padraoRegional = ('0000' + codigoFilial).substr(-3) + ". " + siglaFilial
	path.push(padraoRegional);
	
	//Quarto nivel
	var padraoFuncionario = chapa + " - " +  funcionario;
	path.push(padraoFuncionario);
	
	//Quinto nivel
	path.push("ADMISSÃO");
	
    //var path = ["TELEMONT", "ARQUIVO DIGITAL", "001. MTZ", "123463 - JOAO TESTE", "ADMISSÃO"];
    var pathString = JSON.stringify(path);
    
    var constraints = []
	constraints.push(DatasetFactory.createConstraint('PATHSTRING', pathString, pathString, ConstraintType.MUST, true))
	constraints.push(DatasetFactory.createConstraint('userSecurityId', "integrador", "integrador", ConstraintType.MUST, true))
     
    var dataset = DatasetFactory.getDataset('ds_BuscaCriaPathGed', null, constraints, null)
    var idPastaGed = dataset.values[0]['IDPASTAGED'];
    
    document.getElementById("IDPASTAGED").value = idPastaGed;
    
}

function salvarGedWs(idPastaGed, nomeArquivo, file, idAux){
	
	new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    }).then(arquivoBase64 => {
    	
    	var constraints = []
        
    	constraints.push(DatasetFactory.createConstraint('idPastaGed', idPastaGed, idPastaGed, ConstraintType.MUST, true))
    	constraints.push(DatasetFactory.createConstraint('nomeArquivo', nomeArquivo, nomeArquivo, ConstraintType.MUST, true))
    	constraints.push(DatasetFactory.createConstraint('arquivoBase64', arquivoBase64, arquivoBase64, ConstraintType.MUST, true))
    	
        var dataset = DatasetFactory.getDataset('dsSalvaDocGED', null, constraints, null)
    	
        console.log("retornoDataset");
    	var idDocumento = dataset.values[0]['idDocumento']
    	
    	$('#nomeArquivo' + idAux).val(nomeArquivo);
        $('#hid_documentId' + idAux).val(idDocumento);

        showButtonsUnico(idAux);
        
        FLUIGC.toast({
            title: 'Sucesso: ',
            message: 'Arquivo ' + nomeArquivo + ' salvo com sucesso.',
            type: 'success'
        });
        
    });

}


function apagarGedWs(oElement) {

    try {

    	var idAux = oElement.id.replace("deletar","")
		var idDocumento = document.getElementById("hid_documentId"+idAux).value
    
		var constraints = []
    	constraints.push(DatasetFactory.createConstraint('idDocumento', idDocumento, idDocumento, ConstraintType.MUST, true))
        var dataset = DatasetFactory.getDataset('dsDeleteDocGED', null, constraints, null)

        if(dataset.values[0]["RETORNO"] == "apagou") {
        	document.getElementById("nomeArquivo"+idAux).value = "";
        	document.getElementById("hid_documentId"+idAux).value = "";
        	FLUIGC.toast({title: 'Sucesso: ', message: "Arquivo deletado", type: 'success'});
        	
        	hideButtonsUnico(idAux);
        	
        } 
        
    } catch(e){
        console.log("ErroAoApagarArquivo: " + e)
        FLUIGC.toast({title: 'Erro: ', message: "Erro ao apagar arquivo", type: 'danger'})
        
    }  
    
}