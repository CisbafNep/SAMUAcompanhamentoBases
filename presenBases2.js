let participantesNilopolis = JSON.parse(localStorage.getItem('participantesNilopolis')) || [];

function salvarDadosNilopolis() {
    localStorage.setItem('participantesNilopolis', JSON.stringify(participantesNilopolis));
}

function adicionarParticipanteNilopolis() {
    const nome = document.getElementById('nomeNilopolis').value;
    //const genero = document.getElementById('generoNilopolis').value;
    const cargo = document.getElementById('cargoNilopolis').value;

    if (nome && cargo) {
        const participante = {
            nome,
            genero,
            cargo,
            presenca: 0,
            faltas: 0
        };

        participantesNilopolis.push(participante);
        atualizarTabelaNilopolis();
        salvarDadosNilopolis();
        limparcamposNilopolis();
    } else {
        alert('Por favor, preencha todos os campos!')
    }
}

function limparcamposNilopolis() {
    document.getElementById('nomeNilopolis').value = '';
    document.getElementById('cargoNilopolis').value = '';
}

function marcarPresencaNilopolis(index) {
    participantesNilopolis[index].presenca += 1;
    atualizarTabelaNilopolis();
    salvarDadosNilopolis();
}

function marcarFaltaNilopolis(index) {
    participantesNilopolis[index].faltas += 1;
    atualizarTabelaNilopolis();
    salvarDadosNilopolis();
}

function limparPresencaFaltaNilopolis(index) {
    participantesNilopolis[index].presenca = 0;
    participantesNilopolis[index].faltas = 0;
    atualizarTabelaNilopolis();
    salvarDadosNilopolis();
}

function removerParticipanteNilopolis(index) {
    participantesNilopolis.splice(index, 1);
    atualizarTabelaNilopolis();
    salvarDadosNilopolis();
}

function atualizarTabelaNilopolis() {
    const totalAulas = 9; // Total de aulas
    const tabela = document.getElementById('tabela-presenca-nilopolis').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';

    participantesNilopolis.forEach((participante, index) => {
        const row = tabela.insertRow();

        const porcentagemPresenca = ((participante.presenca / totalAulas) * 100).toFixed(0) + '%';

         row.insertCell(0).innerHTML = participante.nome;
        row.insertCell(1).innerHTML = participante.cargo;
        row.insertCell(2).innerHTML = participante.presenca;
        row.insertCell(3).innerHTML = participante.faltas;
        row.insertCell(4).innerHTML = porcentagemPresenca; // Nova coluna para porcentagem de presença
        //row.insertCell(1).innerHTML = participante.genero;

        const actionsCell = row.insertCell(6);
        actionsCell.innerHTML = `
        <button onclick="marcarPresencaNilopolis(${index})" style="background: green;">Presença</button>
        <button onclick="marcarFaltaNilopolis(${index})" style="background: red; color: #fff;">Falta</button>
        
        <select id="acaoSelect${index}">
            <option value="#">Escolha...</option>
            <option value="limparPresencaFaltaNilopolis">Limpar</option>
            <option value="removerParticipanteNilopolis">Remover</option>
        </select>
        <button onclick="executarAcao(${index})" style="background: orange; color: #333;">Ação</button> `;
    });
}

function executarAcao(index) {
    const select = document.getElementById(`acaoSelect${index}`);
    const acao = select.value;

    if (acao === 'limparPresencaFaltaNilopolis') {
        limparPresencaFaltaNilopolis(index);
    } else if (acao === 'removerParticipanteNilopolis') {
        removerParticipanteNilopolis(index);
    } else {
        alert("Por favor, escolha uma ação válida.");
    }
}

let presencaChart = null; // Variável para armazenar o gráfico

function gerarGraficoNilopolis() {
    const ctx = document.getElementById('presenca-chart-nilopolis').getContext('2d');
    const labels = participantesNilopolis.map(p => p.nome);
    const presencas = participantesNilopolis.map(p => p.presenca);
    const faltas = participantesNilopolis.map(p => p.faltas);

    // Verifica se já existe um gráfico e o destrói
    if (presencaChart) {
        presencaChart.destroy();
    }

    // Cria um novo gráfico
    presencaChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Total de aulas: 9',
                    data: labels,
                    // Adicione aqui a cor, se necessário
                },
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
                x: {
                    stacked: true
                },
                y: {
                    beginAtZero: true,
                    max: 9,
                    stacked: true,
                    ticks: {
                        precision: 0,
                        callback: function(value) {
                            return value; // + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw; // .toFixed(1) + '%';
                        }
                    }
                },
                datalabels: {
                    color: 'white',
                    anchor: 'center',
                    align: 'center',
                    formatter: (value) => {
                        return value; // .toFixed(1) + '%';
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}


window.addEventListener('load', () => {
    atualizarTabelaNilopolis();
    gerarGraficoNilopolis();
});
        function toggleModel(){
            const html = document.documentElement
            //mudar tema entre claro e escuro
            html.classList.toggle("light"); const model = html.classList.contains("light") ? "light" : "dark";
                  localStorage.setItem("model", model);
          }

 let timeout;

function onResize() {
    gerarGraficoNilopolis();
}

function debounce(func, delay) {
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, arguments);
        }, delay);
    };
}
//menu lateral
document.getElementById("menu-toggle").addEventListener("click", function() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
});

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");

// Fechar o menu lateral ao clicar em qualquer lugar fora dele
document.addEventListener("click", function(event) {
    if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        sidebar.classList.remove("active");
    }
});

          // Verificar o modo salvo no carregamento da página
          window.onload = function() {
                  const model = localStorage.getItem('model');
                  if (model === 'light') {
                      toggleModel();
                  }
              };
 window.addEventListener('resize', debounce(onResize, 1000)); // 1000 ms = 1 segundo
