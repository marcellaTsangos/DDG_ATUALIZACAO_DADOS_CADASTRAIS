var beforeSendValidate = function (numState, nextState) {
	
	//Dados comuns
	var msg = "";
	var lembrete = "";
	var dados = dadosModoNumeroAtividade();
	var usuarioAtual = getUsuarioAtual();
	
	//Validações
	msg = validarAtividade0ou4(dados, msg);
	msg = validarAtividade5(dados, msg);
	msg = validarAtividade12(dados, msg);
	msg = validarAtividade17(dados, msg);
	
	if(msg != "") {
		Swal.fire({
			icon: "error",
			title: "Campo(s) obrigatórios não preenchido(s)!",
			text: "Campo(s): " + msg
		})
		return false;
	}
	
	//Lembretes
	//lembrete = lembreteAtividade97(dados, lembrete);	
	//lembrete = lembreteAtividade29(dados, lembrete);
	
	if(lembrete != "") {
		Swal.fire({
			icon: "info",
			title: "Isso é apenas um lembrete!",
			html: lembrete
		})
		return false;
	}
}


function isEmpty(valor) {
	if(valor == "" || valor == null || valor == undefined || valor == "undefined") {
		return true;
	} else {
		return false;
	}
}

function validarAtividade0ou4(dados, msg){
	
	if(dados.numeroAtividade == 0 || dados.numeroAtividade == 4) {
		
		// var codTipoRua = document.getElementById("CODTIPORUA").value;
		// if(isEmpty(codTipoRua)) {
		// 	msg = msg + "[TIPO RUA], ";
		// }
		
		// var rua = document.getElementById("RUA").value;
		// if(isEmpty(rua)) {
		// 	msg = msg + "[RUA], ";
		// }
		
		// var numero = document.getElementById("NUMERO").value;
		// if(isEmpty(numero)) {
		// 	msg = msg + "[NUMERO], ";
		// }
		
		// var codTipoBairro = document.getElementById("CODTIPOBAIRRO").value;
		// if(isEmpty(codTipoBairro)) {
		// 	msg = msg + "[TIPO BAIRRO], ";
		// }
		
		// var bairro = document.getElementById("BAIRRO").value;
		// if(isEmpty(bairro)) {
		// 	msg = msg + "[BAIRRO], ";
		// }
		
		// var complemento = document.getElementById("COMPLEMENTO").value;
		// if(isEmpty(complemento)) {
		// 	msg = msg + "[COMPLEMENTO], ";
		// }
		
		// var cep = document.getElementById("CEP").value;
		// if(isEmpty(cep) || cep.length < 9) {
		// 	msg = msg + "[CEP], ";
		// }
		
		// /*
		// var codPais = document.getElementById("CODPAIS").value;
		// if(isEmpty(codPais)) {
		// 	msg = msg + "[PAIS], ";
		// }
		// */

		// var codEstado = document.getElementById("CODESTADO").value;
		// if(isEmpty(codEstado)) {
		// 	msg = msg + "[ESTADO], ";
		// }
		
		// var codMunicipio = document.getElementById("CODMUNICIPIO").value;
		// if(isEmpty(codMunicipio)) {
		// 	msg = msg + "[MUNICIPIO], ";
		// }
		
		// var documentIdComprovante = document.getElementById("hid_documentIdComprovante").value;
		// if(isEmpty(documentIdComprovante)) {
		// 	msg = msg + "[COMPROVANTE], ";
		// }
		
		// var celular = document.getElementById("CELULAR").value;
		// if(isEmpty(celular)) {
		// 	msg = msg + "[CELULAR], ";
		// }
		
		var email = document.getElementById("EMAIL").value;
		if(isEmpty(email)) {
			msg = msg + "[EMAIL], ";
		} else {
			if(email.indexOf("@") == -1 || email.indexOf(".com") == -1) {
				msg = msg + "[VERIFICAR '@' E '.COM' NO EMAIL], ";
			}
		}
		
		var aceiteTermo = document.querySelectorAll("[name=ACEITETERMO]:checked")[0];
		
		if(!aceiteTermo) {
			msg = msg + "[FAVOR ACEITAR O TERMO]";
		} 
		
		
	}

	return msg;
	
}





function validarAtividade5(dados, msg){
	
	if(dados.numeroAtividade == 5) {
		
		var aprovacaoDp = document.querySelectorAll("[name=APROVACAODP]:checked")[0];
		
		if(!aprovacaoDp) {
			msg = msg + "[APROVAÇÃO]";
		} else if(aprovacaoDp.value == "N") {
			var ajuste = document.getElementById('AJUSTE').value
			if(isEmpty(ajuste)){
				msg = msg + "[AJUSTE]";
			}
		}
		
		
		
		
	}

	return msg;
	
}





function validarAtividade12(dados, msg){
	
	if(dados.numeroAtividade == 12) {
		
		// var codTipoRua = document.getElementById("CODTIPORUA").value;
		// if(isEmpty(codTipoRua)) {
		// 	msg = msg + "[TIPO RUA], ";
		// }
		
		// var rua = document.getElementById("RUA").value;
		// if(isEmpty(rua)) {
		// 	msg = msg + "[RUA], ";
		// }
		
		// var numero = document.getElementById("NUMERO").value;
		// if(isEmpty(numero)) {
		// 	msg = msg + "[NUMERO], ";
		// }
		
		// var codTipoBairro = document.getElementById("CODTIPOBAIRRO").value;
		// if(isEmpty(codTipoBairro)) {
		// 	msg = msg + "[TIPO BAIRRO], ";
		// }
		
		// var bairro = document.getElementById("BAIRRO").value;
		// if(isEmpty(bairro)) {
		// 	msg = msg + "[BAIRRO], ";
		// }
		
		// var complemento = document.getElementById("COMPLEMENTO").value;
		// if(isEmpty(complemento)) {
		// 	msg = msg + "[COMPLEMENTO], ";
		// }
		
		// var cep = document.getElementById("CEP").value;
		// if(isEmpty(cep)) {
		// 	msg = msg + "[CEP], ";
		// }
		
		// /*
		// var codPais = document.getElementById("CODPAIS").value;
		// if(isEmpty(codPais)) {
		// 	msg = msg + "[PAIS], ";
		// }
		// */
		
		// var codEstado = document.getElementById("CODESTADO").value;
		// if(isEmpty(codEstado)) {
		// 	msg = msg + "[ESTADO], ";
		// }
		
		// var codMunicipio = document.getElementById("CODMUNICIPIO").value;
		// if(isEmpty(codMunicipio)) {
		// 	msg = msg + "[MUNICIPIO], ";
		// }

		// var celular = document.getElementById("CELULAR").value;
		// if(isEmpty(celular)) {
		// 	msg = msg + "[CELULAR], ";
		// }
	
		var email = document.getElementById("EMAIL").value;
		if(isEmpty(email)) {
			msg = msg + "[EMAIL], ";
		} else {
			if(email.indexOf("@") == -1 || email.indexOf(".com") == -1) {
				msg = msg + "[VERIFICAR '@' E '.COM' NO EMAIL], ";
			}
		}
		
		var aceiteTermo = document.querySelectorAll("[name=ACEITETERMO]:checked")[0];
		
		if(!aceiteTermo) {
			msg = msg + "[FAVOR ACEITAR O TERMO]";
		} 
		
	}

	return msg;
	
}

function validarAtividade17(dados, msg){
	
	if(dados.numeroAtividade == 17) {
		
		var novaIntegracao = document.querySelectorAll("[name=NOVAINTEGRACAO]:checked")[0];
		if(!novaIntegracao) {
			msg = msg + "[NOVA INTEGRAÇÃO]";
		} 

	}

	return msg;
	
}


