//CFG...
//Os IDs podem nao estar na ordem pois depende da ordem que as atividades foram criadas no diagrama
var CfgDeAtividadesDiagramaParaPaineisFormulario = {

    //Padrao
    idAtividadeNoDiagrama: {
        descricaoNoDiagrama: "...",
        idPainelFormulario: "..",
    },

    //Atividade Inicial
    0: {
        descricaoNoDiagrama: "O Processo e o Número Processo ainda não existem, trata-se da etapa inicial (bolinha verde)",
        idPainelFormulario: "painel_tela01, painel_tela02",
        resumido: "Abertura",
    },

    4: {
        descricaoNoDiagrama: "O Processo e o Número Processo já existem, trata-se da etapa inicial (bolinha verde)",
        idPainelFormulario: "painel_tela01, painel_tela02",
        resumido: "Abertura",
    },

    5: {
        descricaoNoDiagrama: "Validação / Aprovação",
        idPainelFormulario: "painel_tela01, painel_tela02, painel_tela03",
        resumido: "Aprovação",
    },
    
    12: {
        descricaoNoDiagrama: "Ajuste",
        idPainelFormulario: "painel_tela01, painel_tela02",
        resumido: "Ajuste",
    },
    
    17: {
        descricaoNoDiagrama: "Análise de Erro",
        idPainelFormulario: "painel_tela01, painel_tela02, painel_tela03, painel_tela04",
        resumido: "Erro",
    },
    
    27: {
        descricaoNoDiagrama: "Análise de Erro (Histórico)",
        idPainelFormulario: "painel_tela01, painel_tela02, painel_tela03, painel_tela05",
        resumido: "Erro",
    },
    
    7: {
        descricaoNoDiagrama: "Fim",
        idPainelFormulario: "painel_tela01, painel_tela02, painel_tela03",
        resumido: "Fim",
    },
    
    37: {
        descricaoNoDiagrama: "Fim",
        idPainelFormulario: "painel_tela01, painel_tela02, painel_tela03",
        resumido: "Fim",
    },

}

//MODO, NUMERO, E ATIVIDADE
async function ajustarExibicaoFormulario() {

    var dados = dadosModoNumeroAtividade();

    if (dados.modoFormulario == "VIEW") {

    	document.getElementById("painel_tela01").classList.toggle("toggleHidden");
    	document.getElementById("painel_tela02").classList.toggle("toggleHidden");
    	
    	ocultarBotoesAnexo();
    	
    } else {
    	
		//Funcao principal que exibe a tela
        var painel = encontrarPainelAtividade(dados.numeroAtividade);


        
		//Funcoes de Tela
        regraExibirAlertaAjuste();
        
        //Outras funcoes/regras
        regraCarregarDadosUsuario();
        regraCarregarAtividade();
        buscarDadosFilial();
        buscarAjustarPastaGed();

        regraGrupoAprovacao();
        
      	//regraDesabilitarCamposAprovacao();
      	
        //Adiciona Listener Upload
        iniciarListenersUploadUnico();
        regraDesabilitarAceiteDuranteAprovacao();
        regraExibirVisualizarAnexoValidacao();
        regraCaracteres();
        
    	exibirPaineisEspecificos(painel);
        
    }

}

function dadosModoNumeroAtividade() {

    var modoFormulario = getModoFormulario();
    var numeroProcesso = getNumeroProcesso();
    var numeroAtividade = getNumeroAtividade();

    var dados = {
        modoFormulario: modoFormulario,
        numeroProcesso: numeroProcesso,
        numeroAtividade: numeroAtividade
    }

    return dados;
}

//ENCONTRA O PAINEL DE UMA ATIVIDADE
function encontrarPainelAtividade(atividade) {
    return CfgDeAtividadesDiagramaParaPaineisFormulario[atividade].idPainelFormulario
}

//EXIBE PAINEL ESPECIFICO
function exibirPaineisEspecificos(idsPaineis) {

    var idsPaineisAux = idsPaineis.split(", ");

    idsPaineisAux.forEach(idPainel => {

        //document.getElementById(idPainel).style.display = "block";
        document.getElementById(idPainel).classList.toggle("toggleHidden");

    })

}

function regraCarregarAtividade() {
	
	var dados = dadosModoNumeroAtividade();
	var numeroAtividade = dados.numeroAtividade;
	var atividade = CfgDeAtividadesDiagramaParaPaineisFormulario[dados.numeroAtividade]['resumido']
	
	definirConteudoCampo('ATIVIDADE', atividade)
	definirConteudoCampo('NUMEROATIVIDADE', numeroAtividade)
	
}


function regraCarregarDadosUsuario() {
    
	var dados = dadosModoNumeroAtividade();
	
	if (dados.numeroAtividade != 0) {
		return
	}
	
	//Se precisar, refatorar para um contexto maior
	var usuario = regraDebug();
	
	console.log("vai buscar dados usuario...");
    var dadosUsuarioRm = consultaDadosUsuarioRm(usuario);
    
    console.log("carregando dados usuario...");
    definirConteudoCampo('COLIGADA', dadosUsuarioRm['COLIGADA'])
    definirConteudoCampo('CODCOLIGADA', dadosUsuarioRm['CODCOLIGADA'])
    
    definirConteudoCampo('REGIONAL', dadosUsuarioRm['FILIAL'])
    definirConteudoCampo('CODREGIONAL', dadosUsuarioRm['CODFILIAL'])
    
    definirConteudoCampo('CHAPA', dadosUsuarioRm['CHAPA'])
    definirConteudoCampo('FUNCIONARIO', dadosUsuarioRm['NOME'])
   
    
}

const consultaDadosUsuarioRm = (chapaUsuario) => {
	
	console.log("buscando dados usuario...");
	
	
	//A matricula do usuario no fluig e a chapa no RM são iguais
	//var usuarioAtual = getUsuarioAtual();

	//Para Testes
    //var usuarioAtual = "157425";
	
	//Usada a mesma regra do processo de cadastro de dependentes
	//var coligadaUsuarioAtual = getEmailUsuarioAtual().split('@')[1].startsWith('telemont') ? '2' : '3';
	
	
	
	//Usuario Fluig para pegar a Coligada	
	var constraints = []
	constraints.push(DatasetFactory.createConstraint('login', chapaUsuario, chapaUsuario, ConstraintType.MUST, true))
	var dadosUsuarioFluig = DatasetFactory.getDataset('colleague', null, constraints, null);
	
	var coligadaUsuarioAtual = dadosUsuarioFluig.values[0]['currentProject'] == "PERSONAL" ? "3" : "2";
	
	//Usuario para pegar os dados
	var constraints = []
	constraints.push(DatasetFactory.createConstraint('CHAPA_N', chapaUsuario, chapaUsuario, ConstraintType.MUST, true))
	var dadosUsuarioRm = DatasetFactory.getDataset('ds_RMConsulta', ['DS.FLUIG.00.019A', '0', 'P'], constraints, null);
	var dadosUsuarioRmColigada = dadosUsuarioRm.values.filter(dados => dados["CODCOLIGADA"]==coligadaUsuarioAtual)
	
	if(dadosUsuarioRmColigada.length == 0) {
		throw "Erro ao buscar usuario";
	}
	
	document.getElementById("CODPESSOA").value = dadosUsuarioRmColigada[0]['CODPESSOA'];
	
	return dadosUsuarioRmColigada[0]
	
}

function regraExibirAlertaAjuste(){
    
	var dados = dadosModoNumeroAtividade();
	
	if(dados.numeroAtividade == "12") {
		var alerta = document.getElementById('alertaAjuste');   
	    alerta.innerHTML = "AJUSTE!: " + document.getElementById("AJUSTE").value;
	    alerta.classList.add("bg-danger");
	}
    
}

function regraGrupoAprovacao() {
	
	var dados = dadosModoNumeroAtividade();
	
	if (dados.numeroAtividade != 0) {
		return
	}
	
	var codColigada = document.getElementById("CODCOLIGADA").value
	var codFilial = document.getElementById("CODREGIONAL").value
	
	console.log("Filtro dsCrudDDGVinculoFilialGrupo que retorna grupo de aprovadores do colaborador: " + codColigada + "/" + codFilial);
	var c1 = DatasetFactory.createConstraint('codigoColigada', codColigada, codColigada, ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint('codigoFilial', codFilial, codFilial, ConstraintType.MUST);
	var c3 = DatasetFactory.createConstraint('userSecurityId', 'integrador', 'integrador', ConstraintType.MUST);
	var constraints = new Array(c1, c2, c3);
	var dataset = DatasetFactory.getDataset('dsCrudDDGVinculoFilialGrupo', null, constraints, null);
	var grupo = dataset.values[0]["codigoGrupoFluig"];

	document.getElementById("GRUPOAPROVACAO").value = "Pool:Group:" + grupo
	console.log("Executei dsCrudDDGVinculoFilialGrupo. Grupo aprovador: " + grupo);
	
}

function regraGrupoDebug() {
	
	 	//var grupoAdmin = "NDP_MATRIZ";
		var grupoAdmin = "DEBUG_TLM007";
	 	
	 	var usuarioAtual = getUsuarioAtual();
	 	
	    var args = [
	        DatasetFactory.createConstraint("colleagueGroupPK.colleagueId", usuarioAtual, usuarioAtual, ConstraintType.MUST),
	        DatasetFactory.createConstraint("colleagueGroupPK.groupId", grupoAdmin, grupoAdmin, ConstraintType.MUST)
	    ];

	    var dsAdmin = DatasetFactory.getDataset("colleagueGroup", ['colleagueGroupPK.colleagueId'], args, null);

	    if (dsAdmin && dsAdmin.values.length > 0) {
	    	return true
	    }
	    
	    return false
	
}

function regraDebug(){
	
	//DEBUG INICIO
	var usuarioAdmin = regraGrupoDebug();
	
	if(usuarioAdmin == true) {
		
		var querUsarDebug = confirm("Iniciar acesso Administrador?");
		
		if(querUsarDebug) {
			
			var usuario = prompt("Digite a chapa do usuário");
			
		} else {
			
			var usuario = getUsuarioAtual();
			
		}
		
	} else {
		
		var usuario = getUsuarioAtual();
		
	}
	
	return usuario;
	
}



function buscarDadosFilial(codigoColigada, codigoFilial) {
  
	var codigoColigada = document.getElementById('CODCOLIGADA').value;
	var codigoFilial = document.getElementById('CODREGIONAL').value;
	
    var constraint = [];
    constraint.push(DatasetFactory.createConstraint('CODCOLIGADARESCISAO', codigoColigada, codigoColigada, ConstraintType.MUST));
    constraint.push(DatasetFactory.createConstraint('CODFILIALRESCISAO', codigoFilial, codigoFilial, ConstraintType.MUST));
    constraint.push(DatasetFactory.createConstraint('userSecurityId', 'integrador', 'integrador', ConstraintType.MUST));
    
    var dsBuscarDadosFilial = DatasetFactory.getDataset('ds_BuscarDadosFilial', null, constraint, null);
    
    var siglaRegional = dsBuscarDadosFilial.values[0]['REGIONAL'];
	
    document.getElementById("SIGLAFILIAL").value =  siglaRegional;
    	
}


function regraCaracteres(){
	
	var campos = ["RUA", "COMPLEMENTO", "BAIRRO"];
	
	campos.forEach(campo => {
		document.getElementById(campo).onkeypress = function(e) {
		    var chr = String.fromCharCode(e.which);
		    var valor = document.getElementById(campo).value.toString()
		    console.log(valor.length);
		    if ("1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM ".indexOf(chr) < 0)
		      return false;
		    else if (valor.length>39)
		    	return false;
		};
	})
	
}

function ocultarBotoesAnexo(){
	
	document.querySelectorAll('[data-ocultarqdoview]').forEach(e=>{
		e.style.display = 'none'
	})
	
}

function regraDesabilitarAceiteDuranteAprovacao(){

	var dados = dadosModoNumeroAtividade();
	var numeroAtividade = dados.numeroAtividade;

	if(numeroAtividade != 0 && numeroAtividade != 4 && numeroAtividade != 12) {
		document.getElementsByClassName("modal-footer")[0].style["pointer-events"] = "none"
	}

}

function regraExibirVisualizarAnexoValidacao() {
	
	if(dadosModoNumeroAtividade().numeroAtividade == "5") {
		document.getElementById('visualizarComprovante').parentElement.style="display: "
	}
	
}