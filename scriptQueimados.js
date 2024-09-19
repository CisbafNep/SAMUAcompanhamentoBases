let participantesQueimados = JSON.parse(localStorage.getItem('participantesQueimados')) || [];

function salvarDadosQueimados() {
    localStorage.setItem('participantesQueimados', JSON.stringify(participantesQueimados));
}

function adicionarParticipanteQueimados() {
    const nome = document.getElementById('nomeQueimados').value;
    const genero = document.getElementById('generoQueimados').value;
    const cargo = document.getElementById('cargoQueimados').value;

    if (nome && cargo) {
        const participante = {
            nome,
            genero,
            cargo,
            presenca: 0,
            faltas: 0
        };
        participantesQueimados.push(participante);
        atualizarTabelaQueimados();
        salvarDadosQueimados();
    } else {
        alert('Preencha todos os campos!');
    }
}

function marcarPresencaQueimados(index) {
    participantesQueimados[index].presenca += 1;
    atualizarTabelaQueimados();
    salvarDadosQueimados();
}

function marcarFaltaQueimados(index) {
    participantesQueimados[index].faltas += 1;
    atualizarTabelaQueimados();
    salvarDadosQueimados();
}

function atualizarTabelaQueimados() {
    const tabela = document.getElementById('tabela-presenca-queimados').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';

    participantesQueimados.forEach((participante, index) => {
        const row = tabela.insertRow();

        row.insertCell(0).innerHTML = participante.nome;
        row.insertCell(1).innerHTML = participante.genero;
        row.insertCell(2).innerHTML = participante.cargo;
        row.insertCell(3).innerHTML = participante.presenca;
        row.insertCell(4).innerHTML = participante.faltas;

        const actionsCell = row.insertCell(5);
        actionsCell.innerHTML = `
            <button onclick="marcarPresencaQueimados(${index})" style="background: green;">Presença</button>
            <button onclick="marcarFaltaQueimados(${index})" style="background: red; color: white;">Falta</button>
            <select id="acaoSelect${index}">
            <option value="#">Escolha...</option>
            <option value="limparPresencaFaltaQueimados">Limpar</option>
            <option value="removerParticipanteQueimados">Remover</option>
        </select>
        <button onclick="executarAcao(${index})" style="background: orange; color: #333;">Ação</button> `;
        });
    }

function gerarGraficoQueimados() {
    const ctx = document.getElementById('presenca-chart-queimados').getContext('2d');
    const labels = participantesQueimados.map(p => p.nome);
    const presencas = participantesQueimados.map(p => p.presenca);
    const faltas = participantesQueimados.map(p => p.faltas);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Presenças',
                    backgroundColor: 'green',
                    data: presencas
                },
                {
                    label: 'Faltas',
                    backgroundColor: 'red',
                    data: faltas
                }
            ]
        }
    });
}

window.addEventListener('load', () => {
    atualizarTabelaQueimados();
    gerarGraficoQueimados();
});
