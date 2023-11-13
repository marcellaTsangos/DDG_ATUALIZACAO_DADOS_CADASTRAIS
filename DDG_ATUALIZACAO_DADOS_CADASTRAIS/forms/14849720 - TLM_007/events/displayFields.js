function displayFields(form,customHTML){
	
	var modoFormulario = form.getFormMode();
	var numeroProcesso = getValue('WKNumProces');	
	var numeroAtividade = getValue('WKNumState');
	var usuario =  getValue("WKUser");
	
	var constraints = [];
	constraints.push(DatasetFactory.createConstraint('colleaguePK.colleagueId', usuario, usuario, ConstraintType.MUST));
    var dadosUsuarioFluig = DatasetFactory.getDataset("colleague", null, constraints, null);
    var emailUsuario = dadosUsuarioFluig.getValue(0, "mail");
    
	customHTML.append("<script>function getModoFormulario(){ return '" + modoFormulario + "'}</script>");
	customHTML.append("<script>function getNumeroProcesso(){ return " + numeroProcesso + "}</script>");
	customHTML.append("<script>function getNumeroAtividade(){ return " + numeroAtividade + "}</script>");
	customHTML.append("<script>function getUsuarioAtual(){ return '" + usuario + "'}</script>");
	customHTML.append("<script>function getEmailUsuarioAtual(){ return '" + emailUsuario + "'}</script>");

}