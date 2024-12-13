
let usuarios = [];
let agendasPorUsuario = {};
let usuarioAtual = null;

function mostrarPagina(pagina) {
    document.getElementById('pagina-inicial').classList.add('hidden');
    document.getElementById('pagina-cadastro').classList.add('hidden');
    document.getElementById('pagina-login').classList.add('hidden');
    document.getElementById('pagina-agenda').classList.add('hidden');

    if (pagina === 'cadastro') {
        document.getElementById('pagina-cadastro').classList.remove('hidden');
    } else if (pagina === 'login') {
        document.getElementById('pagina-login').classList.remove('hidden');
    } else if (pagina === 'agenda') {
        document.getElementById('pagina-agenda').classList.remove('hidden');
    } else {
        document.getElementById('pagina-inicial').classList.remove('hidden');
    }
}

document.getElementById('form-cadastro').addEventListener('submit', (event) => {
    event.preventDefault();
    const usuario = document.getElementById('cadastro-usuario').value;
    const senha = document.getElementById('cadastro-senha').value;

    if (usuarios.some(u => u.usuario === usuario)) {
        alert('Usuário já cadastrado!');
        return;
    }

    usuarios.push({ usuario, senha });
    agendasPorUsuario[usuario] = [];
    alert('Usuário cadastrado com sucesso!');
    mostrarPagina('inicial');
});

document.getElementById('form-login').addEventListener('submit', (event) => {
    event.preventDefault();
    const usuario = document.getElementById('login-usuario').value;
    const senha = document.getElementById('login-senha').value;

    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.senha === senha);

    if (usuarioEncontrado) {
        alert('Login realizado com sucesso!');
        usuarioAtual = usuario;
        mostrarPagina('agenda');
        atualizarTabela();
    } else {
        alert('Usuário ou senha inválidos!');
    }
});

document.getElementById('form-agenda').addEventListener('submit', (event) => {
    event.preventDefault();
    const nome = document.getElementById('nome-item').value;
    const valor = document.getElementById('valor-item').value;

    if (usuarioAtual) {
        agendasPorUsuario[usuarioAtual].push({ nome, valor });
        atualizarTabela();
    }
});

function atualizarTabela() {
    const tabelaBody = document.querySelector('#tabela-agenda tbody');
    tabelaBody.innerHTML = '';

    if (usuarioAtual) {
        const agenda = agendasPorUsuario[usuarioAtual];

        agenda.forEach((item, index) => {
            const row = document.createElement('tr');

            const nomeCell = document.createElement('td');
            nomeCell.textContent = item.nome;

            const valorCell = document.createElement('td');
            valorCell.textContent = item.valor;

            const acoesCell = document.createElement('td');
            const botaoExcluir = document.createElement('button');
            botaoExcluir.textContent = 'Excluir';
            botaoExcluir.onclick = () => {
                agenda.splice(index, 1);
                atualizarTabela();
            };

            const botaoEditar = document.createElement('button');
            botaoEditar.textContent = 'Editar';
            botaoEditar.onclick = () => editarItem(index);

            acoesCell.appendChild(botaoExcluir);
            acoesCell.appendChild(botaoEditar);

            row.appendChild(nomeCell);
            row.appendChild(valorCell);
            row.appendChild(acoesCell);

            tabelaBody.appendChild(row);
        });
    }
}

function editarItem(index) {
    const agenda = agendasPorUsuario[usuarioAtual];
    const item = agenda[index];

    const tabelaBody = document.querySelector('#tabela-agenda tbody');
    const row = tabelaBody.children[index];

    // Criação dos campos de edição
    const nomeCell = row.children[0];
    const valorCell = row.children[1];
    const acoesCell = row.children[2];

    nomeCell.innerHTML = `<input type="text" id="edit-nome" value="${item.nome}" />`;
    valorCell.innerHTML = `<input type="number" id="edit-valor" value="${item.valor}" />`;

    const botaoSalvar = document.createElement('button');
    botaoSalvar.textContent = 'Salvar';
    botaoSalvar.onclick = () => salvarEdicao(index);

    // Substituindo o botão de editar por salvar
    acoesCell.innerHTML = '';
    acoesCell.appendChild(botaoSalvar);
}

function salvarEdicao(index) {
    const novoNome = document.getElementById('edit-nome').value;
    const novoValor = document.getElementById('edit-valor').value;

    if (usuarioAtual) {
        agendasPorUsuario[usuarioAtual][index] = { nome: novoNome, valor: novoValor };
        atualizarTabela();
    }
}

function baixarJSON() {
    if (usuarioAtual) {
        const blob = new Blob([JSON.stringify(agendasPorUsuario[usuarioAtual], null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `agenda_${usuarioAtual}.json`;
        link.click();
    }
}
