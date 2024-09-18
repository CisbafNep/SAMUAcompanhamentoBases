const links = document.querySelectorAll('aside a');
const contents = document.querySelectorAll('.content');

links.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        contents.forEach(content => content.classList.remove('active'));

        const targetId = event.target.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

let participantes = JSON.parse(localStorage.getItem('participantes')) || [];
function salvarDados() {
    localStorage.setItem('participantes', JSON.stringify(participantes));

}
function adicionarParticipante() {
    const nome = document.getElementById('nome').value;
    const genero = document.getElementById('genero').value;
    const cargo = document.getElementById('cargo').value;

    if(nome && cargo){
        const participante = {
            nome,
            genero,
            cargo,
            presenca: 0,
            faltas: 0
        };

        participantes.push(participante);
        atualizarTabela();
        salvarDados();
        limparcampos();
    } else {
        alert('Por favor, preencha todos os campos!')
    }
}
function limparcampos() {
    document.getElementById('nome').value = '';
    document.getElementById('cargo').value = '';
}
 function marcarPresenca(index) {
    participantes[index].presenca += 1;
    atualizarTabela();
    salvarDados();
 }
 function marcarFalta(index) {
    participantes[index].faltas += 1;
    atualizarTabela();
    salvarDados();
 }
 function limparPresencaFalta(index) {
    participantes[index].presenca = 0;
    participantes[index].faltas = 0;
    atualizarTabela();
    salvarDados();
 }
 function removerParticipante(index) {
    participantes.splice(index, 1);
    atualizarTabela();
    salvarDados();
 }


function atualizarTabela() {
    const tabela = document.getElementById('tabela-presenca').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';

    participantes.forEach((participante, index) => {
        const row = tabela.insertRow();

        row.insertCell(0).innerHTML = participante.nome;
        row.insertCell(1).innerHTML = participante.genero;
        row.insertCell(2).innerHTML = participante.cargo;
        row.insertCell(3).innerHTML = participante.presenca;
        row.insertCell(4).innerHTML = participante.faltas;

        const actionsCell = row.insertCell(5);
        actionsCell.innerHTML = `
        <button onclick="marcarPresenca(${index})" style="background: green;">Presença</button>
        <button onclick="marcarFalta(${index})" style="background: red; color: #fff;">Falta</button>
        <button onclick="limparPresencaFalta(${index})" style="background: orange; ">Limpar</button>
        <button onclick="removerParticipante(${index})" style="background: #333; color: #fff;">Remover</button>
        `;
    });
}

function gerarGrafico() {
    const ctx  = document.getElementById('presenca-chart').getContext('2d');
    const labels = participantes.map(p => p.nome);
    const presencas = participantes.map(p => p.presenca);
    const faltas = participantes.map(p => p.faltas);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets:[
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
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
window.addEventListener('load', () => {
    atualizarTabela();
    gerarGrafico();
});