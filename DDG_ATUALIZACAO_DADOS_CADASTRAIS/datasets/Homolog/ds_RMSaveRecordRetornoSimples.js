/**
 *
 * @desc        Realiza a inserção ou atualização de itens no RM através do DataServer
 * @copyright   2018 upFlow.me
 * @version     2.0.0
 * @author      Helbert Campos <helbert@upflow.me>
 *
 * @param       {array String} fields - Deve-se informar um array os seguintes valores:
                                        INDEX0 = Cód da Coligada do RM (Ex.: '1');
                                        INDEX1 = Cód do DataServer do RM (Ex.: 'FopFuncData'); ou Cód dataserver;tabela (Ex: 'FopFunc;PFUNC')
                                        INDEX2 = String do JSON que será enviado ao DataServer
 * @param       {array Constraint} constraints - Não utilizado. Informar null
 * @param       {array String} sortFields - Não utilizado. Informar null
 * @return      {dataset} Retorna uma linha com informações da Ordem gravada, ou informações de erro
 *
 */

function createDataset(fields, constraints, sortFields) {
    log.info('uf-log | Chamada do DataSet ds_RMSaveRecord2.js');

    var USUARIO, SENHA, CODCOLIGADA;
    var NOMEDATASERVER, CONTEXTO;
    var DSINFO, PARAMETROS;
    var XML;

    // variaveis do serviço wsDataServer
    var SERVICO = "wsDataServer";
    var CAMINHO_SERVICO = "com.totvs.WsDataServer";
    var CLASSE_SERVICO = "com.totvs.IwsDataServer";

    // dicionário de dataservers suportados pelo script
    var lstDataServers = {
        FOPDEPENDDATA: {
            desc: 'Faz a gravação/edição de dependentes no RM',
            xml: function (info) {

                // EXEMPLO CHAMADA PELO SOAPUI
                // <![CDATA[<FopDepend>
                //     <PFDepend>
                //               <CODCOLIGADA>2</CODCOLIGADA>
                //          <NRODEPEND>-1</NRODEPEND>
                //          <NOME>JOSEANE</NOME>
                //          <CPF>33032893011</CPF>
                //          <SEXO>F</SEXO>
                //          <GRAUPARENTESCO>C</GRAUPARENTESCO>
                //          <ESTADOCIVIL>C</ESTADOCIVIL>
                //          <DTNASCIMENTO>24/02/1997</DTNASCIMENTO>
                //          <CHAPA>037371</CHAPA>
                //     </PFDepend>
                //     <PFDEPENDCOMPL>
                //       <CODCOLIGADA>2</CODCOLIGADA>
                //       <CHAPA>037371</CHAPA>
                //       <NRODEPEND>-1</NRODEPEND>
                //     </PFDEPENDCOMPL>
                //   </FopDepend>]]>

                // monta a base do xml (elementos que não se repetem)
                var _xml = '<FopDepend>';
                //_xml += this.montaXMLMateriaisSchema();

                // adiciona os itens dinamicamente no xml
                // funciona bem quando o xml será 100% do JSON enviado
                _xml += '<PFDEPEND>';
                for (var key in info) {
                    if (typeof info[key] != 'object') _xml += '<' + key + '>' + info[key] + '</' + key + '>';
                }
                _xml += '</PFDEPEND>';

                // faz um loop novamente e resgata apenas os array
                // criando dinamicamente dos filhos
                for (var key in info) {
                    if (typeof info[key] == 'object') {
                        for (var index = 0; index < info[key].length; index++) {

                            // monta a base do item do Movimento em uma
                            // variavel temporária que recebe os valores do item no loop
                            var xml_temp = '<' + key + '>';
                            for (var keychild in info[key][index]) {
                                xml_temp += '<' + keychild + '>' + info[key][index][keychild] + '</' + keychild + '>';
                            }
                            xml_temp += '</' + key + '>';

                            // adiciona as informações do item no xml da ordem
                            _xml += xml_temp;

                        };

                    }
                }

                // adiciona o fechamento do xml
                _xml += '</FopDepend>';

                return _xml;
            },
        },
        FOPFUNCDATA: {
            desc: 'Faz a gravação/edição de funcionários no RM',
            xml: function (info) {
                // monta a base do xml (elementos que não se repetem)
                var _xml = '<FopFunc>';

                // adiciona os itens dinamicamente no xml
                // funciona bem quando o xml será 100% do JSON enviado
                _xml += '<PFUNC>';
                for (var key in info) {
                    if (info[key] == "remove" && key == "CODUSUARIO") {
                        info[key] == "";
                        _xml += '<CODUSUARIO></CODUSUARIO>'; // Remove o Código de Usuário caso requisitado no código 
                    } else {
                        if (typeof info[key] != 'object') _xml += '<' + key + '>' + info[key] + '</' + key + '>';
                    }

                }
                _xml += '</PFUNC>';

                // faz um loop novamente e resgata apenas os array
                // criando dinamicamente dos filhos
                for (var key in info) {
                    if (typeof info[key] == 'object') {
                        for (var index = 0; index < info[key].length; index++) {

                            // monta a base do item do Movimento em uma
                            // variavel temporária que recebe os valores do item no loop
                            var xml_temp = '<' + key + '>';
                            for (var keychild in info[key][index]) {
                                xml_temp += '<' + keychild + '>' + info[key][index][keychild] + '</' + keychild + '>';
                            }
                            xml_temp += '</' + key + '>';

                            // adiciona as informações do item no xml da ordem
                            _xml += xml_temp;

                        };

                    }
                }

                // adiciona o fechamento do xml
                _xml += '</FopFunc>';

                return _xml;
            },
        },
        FOPHSTVALETRDATA: {
            desc: 'Faz a gravação/edição de values no RM',
            xml: function (info) {
                // monta a base do xml (elementos que não se repetem)
                var _xml = '<FopHstValeTr>';

                // adiciona os itens dinamicamente no xml
                // funciona bem quando o xml será 100% do JSON enviado
                for (var arrIdx in info) {
                    _xml += '<PFValeTr>';
                    if (typeof info[arrIdx] == "object") {
                        for (var key in info[arrIdx]) {
                            _xml += "<" + key + ">" + info[arrIdx][key] + "</" + key + ">"
                        }
                    }
                    _xml += '</PFValeTr>';
                }

                // adiciona o fechamento do xml
                _xml += '</FopHstValeTr>';

                return _xml;
            },
        },
        FOPRATEIOTOMADORESSERVICODATA: {
            desc: 'Faz a gravação/edição de values no RM',
            xml: function (info) {
                // monta a base do xml (elementos que não se repetem)
                var _xml = '<FopRateioTomadoresServico>';

                // adiciona os itens dinamicamente no xml
                // funciona bem quando o xml será 100% do JSON enviado
                _xml += '<PFUNC>';
                for (var key in info.PFUNC) {
                    if (typeof info[key] != 'object') _xml += '<' + key + '>' + info.PFUNC[key] + '</' + key + '>';
                }
                _xml += '</PFUNC>';


                
                _xml += '<PFHSTRATEIOTOMADOR>';
                for (var key in info.TOMADORES) {
                    if (typeof info[key] != 'object') _xml += '<' + key + '>' + info.TOMADORES[key] + '</' + key + '>';
                }
                _xml += '</PFHSTRATEIOTOMADOR>';

                // adiciona o fechamento do xml
                _xml += '</FopRateioTomadoresServico>';

                return _xml;
            },
        },
        
        RHUPESSOADATA: {
            desc: 'Faz a gravação/edição de pessoas no RM',
            xml: function (info) {
                // monta a base do xml (elementos que não se repetem)
                var _xml = '<RhuPessoa>';

                // adiciona os itens dinamicamente no xml
                // funciona bem quando o xml será 100% do JSON enviado
                _xml += '<PPESSOA>';
                for (var key in info) {
                    if (info[key] == "remove" && key == "CODUSUARIO") {
                        info[key] == "";
                        _xml += '<CODUSUARIO></CODUSUARIO>'; // Remove o Código de Usuário caso requisitado no código 
                    } else {
                        if (typeof info[key] != 'object') _xml += '<' + key + '>' + info[key] + '</' + key + '>';
                    }

                }
                _xml += '</PPESSOA>';

                // faz um loop novamente e resgata apenas os array
                // criando dinamicamente dos filhos
                for (var key in info) {
                    if (typeof info[key] == 'object') {
                        for (var index = 0; index < info[key].length; index++) {

                            // monta a base do item do Movimento em uma
                            // variavel temporária que recebe os valores do item no loop
                            var xml_temp = '<' + key + '>';
                            for (var keychild in info[key][index]) {
                                xml_temp += '<' + keychild + '>' + info[key][index][keychild] + '</' + keychild + '>';
                            }
                            xml_temp += '</' + key + '>';

                            // adiciona as informações do item no xml da ordem
                            _xml += xml_temp;

                        };

                    }
                }

                // adiciona o fechamento do xml
                _xml += '</RhuPessoa>';

                return _xml;
            },
        },
        
        RHUPESSOADATA: {
            desc: 'Faz a gravação/edição de pessoas no RM',
            xml: function (info) {
                // monta a base do xml (elementos que não se repetem)
                var _xml = '<RhuPessoa>';

                // adiciona os itens dinamicamente no xml
                // funciona bem quando o xml será 100% do JSON enviado
                _xml += '<PPESSOA>';
                for (var key in info) {
                    if (info[key] == "remove" && key == "CODUSUARIO") {
                        info[key] == "";
                        _xml += '<CODUSUARIO></CODUSUARIO>'; // Remove o Código de Usuário caso requisitado no código 
                    } else {
                        if (typeof info[key] != 'object') _xml += '<' + key + '>' + info[key] + '</' + key + '>';
                    }

                }
                _xml += '</PPESSOA>';

                // faz um loop novamente e resgata apenas os array
                // criando dinamicamente dos filhos
                for (var key in info) {
                    if (typeof info[key] == 'object') {
                        for (var index = 0; index < info[key].length; index++) {

                            // monta a base do item do Movimento em uma
                            // variavel temporária que recebe os valores do item no loop
                            var xml_temp = '<' + key + '>';
                            for (var keychild in info[key][index]) {
                                xml_temp += '<' + keychild + '>' + info[key][index][keychild] + '</' + keychild + '>';
                            }
                            xml_temp += '</' + key + '>';

                            // adiciona as informações do item no xml da ordem
                            _xml += xml_temp;

                        };

                    }
                }

                // adiciona o fechamento do xml
                _xml += '</RhuPessoa>';

                return _xml;
            },
        },
        
        FOPHISTORICOENDERDATA: {
            desc: 'Faz a gravação/edição de funcionários no RM',
            xml: function (info) {
                // monta a base do xml (elementos que não se repetem)
                var _xml = '<FopHistoricoEnder>';

                // adiciona os itens dinamicamente no xml
                // funciona bem quando o xml será 100% do JSON enviado
                _xml += '<PFHSTEND>';
                for (var key in info) {
                    if (info[key] == "remove" && key == "CODUSUARIO") {
                        info[key] == "";
                        _xml += '<CODUSUARIO></CODUSUARIO>'; // Remove o Código de Usuário caso requisitado no código 
                    } else {
                        if (typeof info[key] != 'object') _xml += '<' + key + '>' + info[key] + '</' + key + '>';
                    }

                }
                _xml += '</PFHSTEND>';

                // faz um loop novamente e resgata apenas os array
                // criando dinamicamente dos filhos
                for (var key in info) {
                    if (typeof info[key] == 'object') {
                        for (var index = 0; index < info[key].length; index++) {

                            // monta a base do item do Movimento em uma
                            // variavel temporária que recebe os valores do item no loop
                            var xml_temp = '<' + key + '>';
                            for (var keychild in info[key][index]) {
                                xml_temp += '<' + keychild + '>' + info[key][index][keychild] + '</' + keychild + '>';
                            }
                            xml_temp += '</' + key + '>';

                            // adiciona as informações do item no xml da ordem
                            _xml += xml_temp;

                        };

                    }
                }

                // adiciona o fechamento do xml
                _xml += '</FopHistoricoEnder>';

                return _xml;
            },
        },
        
        __GENERIC__: {
            desc: 'Transforma o JSON recebido em XML',
            xml: function (info) {
                var xml = ''
                for(var key in info){
                    var valorKey = info[key]
                    if(typeof valorKey == "string"){
                        xml += '<'+ key + '>' + valorKey + '</'+ key + '>'
                    }else if(valorKey instanceof Array){
                        xml += '<'+ key + '>'
                        for(var i=0;i<valorKey.length;i++){
                            xml += this.xml(valorKey[i])
                        }
                        xml += '</'+ key + '>'
                    }else if(typeof valorKey == "object"){
                        xml += '<'+ key + '>'
                        xml += this.xml(valorKey)
                        xml += '</'+ key + '>'
                    }else{
                        throw "Tipo de dado enviado pelo o JSON desconhecido"
                    }
                }
                return xml
            }
        }
    };

    try {
        // busca usuario de conexao com o RM
        var Connect = DatasetFactory.getDataset("ds_RMConecta", null, null, null);
        USUARIO = Connect.getValue(0, "USUARIORM");
        SENHA = Connect.getValue(0, "SENHARM");
    } catch (e) {
        return exibeErro('Erro ao resgatar usuário do TOTVS RM:  (linha: ' + e.lineNumber + '): ' + e);    // faz a chamada da função que exibe o erro
    }

    // resgata as variaveis passadas através do parâmetro fields do DataSet
    if (fields == null) return exibeErro('Parâmetro fields em branco. Informe o CODCOLIGADA, NOMEDATASERVER, JSON');
    try {

        // ## PASSO: 01
        CODCOLIGADA = fields[0];    // resgata o código de coligada
        if (CODCOLIGADA == undefined) throw 'Informe o CODCOLIGADA corretamente.';

        // ## PASSO: 02
        PARAMETROS = fields[2];		// parêmtros em JSON via string
        if (PARAMETROS == undefined) throw 'Informe os dados via String JSON.';
        PARAMETROS = JSON.parse(PARAMETROS);

        // ## PASSO: 03
        DSINFO = lstDataServers[fields[1]];	// consulta informações do processo informado
        if (DSINFO == undefined) throw 'O Cód do DataServer informado não é suportado pelo Fluig.';
        NOMEDATASERVER = fields[1];       // código/nome do dataserver que será chamado 

        // informativo dos dados recebidos no log
        log.info("uf-log | Dados recebidos para chamada do DataServer:");
        log.info("uf-log | CODCOLIGADA: " + CODCOLIGADA);
        log.info("uf-log | NOMEDATASERVER: " + NOMEDATASERVER);
        log.info("uf-log | JSON: " + fields[2]);

    } catch (e) {
        return exibeErro('Erro nos parâmetros passados através do fields do DataSet (linha: ' + e.lineNumber + '): ' + e);    // faz a chamada da função que exibe o erro
    }

    // cria o XML do dataserver de acordo com o objeto JSON informado
    try {

        XML = DSINFO.xml(PARAMETROS);

    } catch (e) {
        return exibeErro('Erro ao criar XML (linha: ' + e.lineNumber + '): ' + e);    // faz a chamada da função que exibe o erro
    };

    try {

        // monta a requisição ao servidor
        var servico = ServiceManager.getService(SERVICO);
        var instancia = servico.instantiate(CAMINHO_SERVICO);
        var ws = instancia.getRMIwsDataServer();
        var serviceHelper = servico.getBean();
        var properties = {};
        properties["basic.authorization"] = "true";
        properties["basic.authorization.username"] = USUARIO;
        properties["basic.authorization.password"] = SENHA;
        properties["disable.chunking"] = "true";
        properties["log.soap.messages"] = "true";
        properties["receive.timeout"] = "300000";	// timeout em milissegundos
        var authService = serviceHelper.getCustomClient(ws, CLASSE_SERVICO, properties);
        // var authService = serviceHelper.getBasicAuthenticatedClient(ws, CLASSE_SERVICO, USUARIO, SENHA);

        // contexto para chamada do DataServer
        CONTEXTO = 'CODUSUARIO=' + USUARIO + ';CODSISTEMA=T;CODCOLIGADA=' + CODCOLIGADA;

        // informativo da chamada no log
        log.info("uf-log | Dados da chamada ao serviço wsDataServer:");
        log.info("uf-log | NOMEDATASERVER: " + NOMEDATASERVER);
        log.info("uf-log | CONTEXTO: " + CONTEXTO);
        log.info("uf-log | XML: " + XML);

        // faz a chamada para gravação no RM
        var resp = authService.saveRecord(fields[3] || NOMEDATASERVER, XML, CONTEXTO);

        // informativo do resultado da chamada
        log.info("uf-log | Chamada realizada com sucesso.");
        log.info("uf-log | -- Início da resposta: \n" + resp);
        log.info("uf-log | -- Final da resposta");

        // quebra os paragrafos do resultado
        var erro = '1';
        var detalhes = resp.toString();    // resgata todos os detalhes da resposta
        resp = detalhes.split('\r')[0]; // retorna apenas o primeiro paragrafo

        // quando é RHUPESSOADATA, o retorno é apenas o CODPESSOA (não retorna uma valor separado por ';')
        if (NOMEDATASERVER == "RHUPESSOADATA" && parseInt(resp) > 0) {
            erro = '0';
            //resp = resp
        } else if (resp.split(';').length > 1) {
        	// se tiver um ; quer dizer que retornou a chave primária do registro
            // então atualiza a resposta com essa chave na resposta
            erro = '0';
            resp = resp.split(';')[1];
        }      
        
        var dataset = DatasetBuilder.newDataset();	// cria um novo DataSet para resposta
        dataset.addColumn("ERRO");	// 1=Erro na requisição; 0=Requisição realizada com sucesso
        dataset.addColumn("MSG");	// Mensagem curta a ser exibida para o usuário final
        dataset.addColumn("DETALHES");	// Mensagem detalhada a ser analisada pelo administrador
        dataset.addRow(new Array(erro, resp, detalhes));	// cria apenas uma linha com a resposta
        return dataset;	// retorna a resposta do DataSet

    } catch (e) {


        return exibeErro('Erro na chamada do DataServer (linha: ' + e.lineNumber + '): ' + e);    // faz a chamada da função que exibe o erro
    };

}

/**
 * @desc 	Exibe a mensagem de erro do console do Servidor e retorna uma coluna única com o erro para o usuário
 * @param	{string} msg - Mensagem de erro que será gravada no log e exibida ao usuário
 */
function exibeErro(msg) {
    if (msg == null || msg == '') msg = "Erro desconhecido, verifique o log do servidor.";	// se mensagem de erro não foi definida
    var msgErro = msg;	// incrementa a mensagem de erro vinda do código
    log.error('uf-log | ' + msgErro);	// grava log no arquivo 'server.log' do JBOSS
    dataset = DatasetBuilder.newDataset();	// cria um novo DataSet para resposta do erro
    dataset.addColumn("ERRO");	// 1=Erro; 0=Sucesso
    dataset.addColumn("MSG");	// coluna com mensagem do erro
    dataset.addColumn("DETALHES");	// Mensagem detalhada a ser analisada pelo administrador
    dataset.addRow(new Array('1', 'Ocorreu um erro no TOTVS RM', msgErro));	// cria apenas uma linha com a mensagem de erro
    return dataset;	// retorna o erro como resposta do DataSet
}