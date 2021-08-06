

var listaTarefas = [];
var isEditando = false;

var nFinalizadas = 0;
var nEmAndamento = 0;
var nEmAnalise = 0;

var pAlta = 0;
var pMedia = 0;
var pBaixa = 0;

function salvarTarefas() {
	if (validaInputs()) {
		var tarefa = {};

		tarefa.titulo = document.getElementById("titulo-tarefa").value;
		tarefa.prioridade = document.getElementById("prioridade-tarefa").value;
		tarefa.situacao = document.getElementById("situacao-tarefa").value;
		tarefa.categoria = document.getElementById("categoria-tarefa").value;
		let idTarefa = document.getElementById('id-tarefa').value;

		/* Caso nao tenha o id criar novo*/
		if (idTarefa == undefined || idTarefa == '') {
			tarefa.id = new Date().getTime();
		} else { /* se tem esta editando*/
			tarefa.id = parseInt(idTarefa);
		}

		if (isEditando) {
			excluiTarefa(tarefa.id);
			listaTarefas.push(tarefa);
			isEditando = false;
		} else {
			listaTarefas.push(tarefa);
		}

		salvaTarefaNoLocalStorage();
		renderizaTarefas();
		$("#Modal-Tarefa").modal('hide');
		return false;
	}
}

function validaInputs() {
	if (document.getElementById("prioridade-tarefa").value == "Escolha uma prioridade..." ||
		document.getElementById("situacao-tarefa").value == "Escolha uma situação..." ||
		document.getElementById("categoria-tarefa").value == "Escolha uma categoria...") {
		alert("Prioridade, Situação ou Categoria inválidas !!!");
		return false;
	}
	return true;
}


function renderizaTarefas() {
	/* Busca tabela com esse ID*/
	const tbody = document.getElementById("corpo-tabela-tarefas");

	/* Zera conteudo da tabela*/
	tbody.innerHTML = '';

	for (let i = 0; i < listaTarefas.length; i++) {
		const tarefa = listaTarefas[i];

		/* cria elemento do tipo tr - table row */
		let linha = document.createElement('tr');

		linha.setAttribute("id", "linha-tarefas");

		linha.onclick = function () {
			$('#Modal-Tarefa').modal('show');
			isEditando = true;
			bloqueiaEdicaoTarefa();
			liberaExclusaoTarefa();
			editarTarefa(tarefa.id);
		};

		/* cria elemento td - table data */
		let tdTitulo = document.createElement('td');
		let tdPrioridade = document.createElement('td');
		let tdSituacao = document.createElement('td');
		let tdCategoria = document.createElement('td');

		/* seta os conteudo das td com o que tem qeu ficar ali dentro*/
		tdTitulo.innerHTML = tarefa.titulo;
		tdPrioridade.innerHTML = tarefa.prioridade;
		tdSituacao.innerHTML = tarefa.situacao;
		tdCategoria.innerHTML = tarefa.categoria;

		if (tarefa.titulo != null && tarefa.prioridade != null && tarefa.situacao && tarefa.categoria != null) {
			/* concatena os Td dentro do Tr*/
			linha.appendChild(tdTitulo);
			linha.appendChild(tdPrioridade);
			linha.appendChild(tdSituacao);
			linha.appendChild(tdCategoria);

			/* pega o tr e joga dentro do corpo da tabela*/
			tbody.appendChild(linha);
		}
		iniciaCampoComContadores()
	}
}
function renderizaSelectCategorias() {
	const corpoSelect = document.getElementById("categoria-tarefa");


	let firstLinha = document.createElement('option');
	firstLinha.innerHTML = 'Escolha uma categoria...';
	firstLinha.setAttribute("selected", "selected");
	corpoSelect.innerHTML = '';
	corpoSelect.appendChild(firstLinha);


	for (let i = 0; i < listaCategorias.length; i++) {
		const categoria = listaCategorias[i];

		let linha = document.createElement('option');

		linha.innerHTML = categoria.nome;

		corpoSelect.appendChild(linha);
	}
}

$('#Modal-Tarefa').on('show.bs.modal', function (event) {
	renderizaSelectCategorias()
})

function editarTarefa(id) {
	let tarefa = findTarefaById(id);

	if (tarefa) {
		document.getElementById("id-tarefa").value = tarefa.id;
		document.getElementById("titulo-tarefa").value = tarefa.titulo;
		document.getElementById("prioridade-tarefa").value = tarefa.prioridade;
		document.getElementById("situacao-tarefa").value = tarefa.situacao;
		document.getElementById("categoria-tarefa").value = tarefa.categoria;
	} else {
		alert("Nao foi possivel encontrar a tarefa");
	}
}

/* .filter vai filtrar o array e retornar true quando a condicao for verdadeira, entao ele adiciona na let pessoa*/
function findTarefaById(id) {
	let tarefas = listaTarefas.filter(function (value) {
		return value.id == id;
	});

	if (tarefas.length == 0) {
		return undefined;
	} else {
		return tarefas[0];
	}

}

function liberaEdicaoTarefa() {
	document.getElementById('btn-limpar-tarefa').disabled = false;
	document.getElementById("titulo-tarefa").disabled = false;
	document.getElementById("prioridade-tarefa").disabled = false;
	document.getElementById("situacao-tarefa").disabled = false;
	document.getElementById("categoria-tarefa").disabled = false;
}

function bloqueiaEdicaoTarefa() {
	document.getElementById('btn-limpar-tarefa').disabled = true;
	document.getElementById("titulo-tarefa").disabled = true;
	document.getElementById("prioridade-tarefa").disabled = true;
	document.getElementById("situacao-tarefa").disabled = true;
	document.getElementById("categoria-tarefa").disabled = true;
}

function novoBloqueiaExclusaoTarefa() {
	zeraInputTarefa();
	liberaEdicaoTarefa();
	document.getElementById('btn-editar-tarefa').style.display = 'none';
	document.getElementById('btn-excluir-tarefa').style.display = 'none';
}

function liberaExclusaoTarefa() {
	document.getElementById('btn-editar-tarefa').style.display = 'inline';
	document.getElementById('btn-excluir-tarefa').style.display = 'inline';
}

function zeraInputTarefa() {
	document.getElementById("titulo-tarefa").value = '';
	document.getElementById("prioridade-tarefa").value = 'Escolha uma prioridade...';
	document.getElementById("situacao-tarefa").value = 'Escolha uma situação...';
	document.getElementById("categoria-tarefa").value = 'Escolha uma categoria...';
	document.getElementById("id-tarefa").value = '';
}

function excluiTarefa(id) {
	listaTarefas = listaTarefas.filter(function (value) {
		return value.id != id;
	});
}

function excluiTarefaByButton() {
	let id = document.getElementById("id-tarefa").value;
	excluiTarefa(id);
	salvaTarefaNoLocalStorage();
	renderizaTarefas();
	$('#Modal-Tarefa').modal('hide');
}

function salvaTarefaNoLocalStorage() {
	/* Convertendo Lista para JSON*/
	const listaJSON = JSON.stringify(listaTarefas);

	/* Coloca a lista no LocalStorage */
	localStorage.setItem("listaTarefas", listaJSON);
}

function pegaTarefaDoLocalStorage() {
	/* Busca no Local Storage pela key lista*/
	const listaStorage = localStorage.getItem("listaTarefas");
	/* converte para lista denovo*/
	listaTarefas = JSON.parse(listaStorage) || [];

}

function contadores() {
	for (var i = 0; i < listaTarefas.length; i++) {
		if (listaTarefas[i].situacao == "Finalizada") {
			nFinalizadas++;
		}
	}

	for (var i = 0; i < listaTarefas.length; i++) {
		if (listaTarefas[i].situacao == "Em Andamento") {
			nEmAndamento++;
		}
	}

	for (var i = 0; i < listaTarefas.length; i++) {
		if (listaTarefas[i].situacao == "Em Análise") {
			nEmAnalise++;
		}
	}

	for (var i = 0; i < listaTarefas.length; i++) {
		if (listaTarefas[i].prioridade == "Alta") {
			pAlta++;
		}
	}

	for (var i = 0; i < listaTarefas.length; i++) {
		if (listaTarefas[i].prioridade == "Média") {
			pMedia++;
		}
	}

	for (var i = 0; i < listaTarefas.length; i++) {
		if (listaTarefas[i].prioridade == "Baixa") {
			pBaixa++;
		}
	}
}

function zeraContadores() {
	nFinalizadas = 0;
	nEmAndamento = 0;
	nEmAnalise = 0;
	pAlta = 0;
	pMedia = 0;
	pBaixa = 0;
}

function iniciaCampoComContadores() {
	zeraContadores();
	contadores();
	if (nFinalizadas) {
		document.getElementById('tarefas-finalizadas').innerHTML = nFinalizadas;
	} else {
		document.getElementById('tarefas-finalizadas').innerHTML = '0';
	}
	if (nEmAndamento) {
		document.getElementById('tarefas-em-andamento').innerHTML = nEmAndamento;
	} else {
		document.getElementById('tarefas-em-andamento').innerHTML = '0';
	}
	if (nEmAnalise) {
		document.getElementById('tarefas-em-analise').innerHTML = nEmAnalise;
	} else {
		document.getElementById('tarefas-em-analise').innerHTML = '0';
	}
	if (pAlta) {
		document.getElementById('tarefas-alta').innerHTML = pAlta;
	} else {
		document.getElementById('tarefas-alta').innerHTML = '0';
	}
	if (pMedia) {
		document.getElementById('tarefas-media').innerHTML = pMedia;
	} else {
		document.getElementById('tarefas-media').innerHTML = '0';
	}
	if (pBaixa) {
		document.getElementById('tarefas-baixa').innerHTML = pBaixa;
	} else {
		document.getElementById('tarefas-baixa').innerHTML = '0';
	}
}


/* Executa assim que termina de carregar a pagina*/
(function () {
	pegaTarefaDoLocalStorage();
	renderizaTarefas();
})(); 