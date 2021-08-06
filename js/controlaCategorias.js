

var listaCategorias = [];
var isEditando = false;

function salvarCategorias() {

	var categoria = {};

	categoria.nome = document.getElementById("nome-categoria").value;
	let idCategoria = document.getElementById('id-categoria').value;

	/* Caso nao tenha o id criar novo*/
	if (idCategoria == undefined || idCategoria == '') {
		categoria.id = new Date().getTime();
	} else { /* se tem esta editando*/
		categoria.id = parseInt(idCategoria);
	}

	if (isEditando) {
		excluiCategoria(categoria.id);
		listaCategorias.push(categoria);
		isEditando = false;
	} else {
		listaCategorias.push(categoria);
	}

	salvaCategoriaNoLocalStorage();
	renderizaCategorias();
	$("#Modal-Categoria").modal('hide');

	return false;
}


function renderizaCategorias() {
	/* Busca tabela com esse ID*/
	const tbody = document.getElementById("corpo-tabela-categorias");

	/* Zera conteudo da tabela*/
	tbody.innerHTML = '';

	for (let i = 0; i < listaCategorias.length; i++) {
		const categoria = listaCategorias[i];

		/* cria elemento do tipo tr - table row */
		let linha = document.createElement('tr');
		linha.setAttribute("id", "linha-categorias");

		linha.onclick = function () {
			$('#Modal-Categoria').modal('show');
			isEditando = true;
			bloqueiaEdicaoCategoria();
			liberaExclusaoCategoria();
			editarCategoria(categoria.id);
		};

		/* cria elemento td - table data */
		let tdNome = document.createElement('td');

		/* seta os conteudo das td com o que tem qeu ficar ali dentro*/
		tdNome.innerHTML = categoria.nome;

		if (categoria.nome != null) {
			/* concatena os Td dentro do Tr*/
			linha.appendChild(tdNome);

			/* pega o tr e joga dentro do corpo da tabela*/
			tbody.appendChild(linha);
		}
	}
}

function editarCategoria(id) {
	let categoria = findCategoriaById(id);

	if (categoria) {
		document.getElementById("nome-categoria").value = categoria.nome;
		document.getElementById("id-categoria").value = categoria.id;
	} else {
		alert("Nao foi possivel encontrar a categoria");
	}
}

/* .filter vai filtrar o array e retornar true quando a condicao for verdadeira, entao ele adiciona na let pessoa*/
function findCategoriaById(id) {
	let categorias = listaCategorias.filter(function (value) {
		return value.id == id;
	});

	if (categorias.length == 0) {
		return undefined;
	} else {
		return categorias[0];
	}

}

function liberaEdicaoCategoria() {
	document.getElementById('btn-limpar-categoria').disabled = false;
	document.getElementById('nome-categoria').disabled = false;
}

function bloqueiaEdicaoCategoria() {
	document.getElementById('btn-limpar-categoria').disabled = true;
	document.getElementById('nome-categoria').disabled = true;
}

function novoBloqueiaExclusaoCategoria() {
	zeraInputCategoria();
	liberaEdicaoCategoria();
	document.getElementById('btn-editar-categoria').style.display = 'none';
	document.getElementById('btn-excluir-categoria').style.display = 'none';
}

function liberaExclusaoCategoria() {
	document.getElementById('btn-editar-categoria').style.display = 'inline';
	document.getElementById('btn-excluir-categoria').style.display = 'inline';
}

function zeraInputCategoria() {
	document.getElementById("nome-categoria").value = '';
	document.getElementById("id-categoria").value = '';
}

function podeExcluir(id) {
	let categoriaAExcluir = findCategoriaById(id);

	for (var i = listaTarefas.length - 1; i >= 0; i--) {
		if (categoriaAExcluir.nome = listaTarefas[i].categoria) {
			alert("Impossível excluir categoria enquanto houver tarefas nela !!!");
			return false;
		}
	}
	return true;
}

function excluiCategoria(id) {
	listaCategorias = listaCategorias.filter(function (value) {
		return value.id != id;
	});
}

function excluiCategoriaByButton() {
	let id = document.getElementById("id-categoria").value;
	if (podeExcluir(id)) {
		excluiCategoria(id);
		salvaCategoriaNoLocalStorage();
		renderizaCategorias();
		$('#Modal-Categoria').modal('hide');
	}
}

function salvaCategoriaNoLocalStorage() {
	/* Convertendo Lista para JSON*/
	const listaJSON = JSON.stringify(listaCategorias);

	/* Coloca a lista no LocalStorage */
	localStorage.setItem("listaCategorias", listaJSON);
}

function pegaCategoriaNoLocalStorage() {
	/* Busca no Local Storage pela key lista*/
	const listaStorage = localStorage.getItem("listaCategorias");
	/* converte para lista denovo*/
	listaCategorias = JSON.parse(listaStorage) || [];

}



/* Executa assim que termina de carregar a pagina*/
(function () {
	pegaCategoriaNoLocalStorage();
	renderizaCategorias();
})(); 