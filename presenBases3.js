let participantesParacambi = JSON.parse(localStorage.getItem('participantesParacambi')) || [];

function salvarDadosParacambi() {
    localStorage.setItem('participantesParacambi', JSON.stringify(participantesParacambi));
}

function adicionarParticipanteParacambi() {
    const nome = document.getElementById('nomeParacambi').value;
    const genero = document.getElementById('generoParacambi').value;
    const cargo = document.getElementById('cargoParacambi').value;

    if (nome && cargo) {
        const participante = {
            nome,
            genero,
            cargo,
            presenca: 0,
            faltas: 0
        };

        participantesParacambi.push(participante);
        atualizarTabelaParacambi();
        salvarDadosParacambi();
        limparcamposParacambi();
    } else {
        alert('Por favor, preencha todos os campos!')
    }
}

function limparcamposParacambi() {
    document.getElementById('nomeParacambi').value = '';
    document.getElementById('cargoParacambi').value = '';
}

function marcarPresencaParacambi(index) {
    participantesParacambi[index].presenca += 1;
    atualizarTabelaParacambi();
    salvarDadosParacambi();
}

function marcarFaltaParacambi(index) {
    participantesParacambi[index].faltas += 1;
    atualizarTabelaParacambi();
    salvarDadosParacambi();
}

function limparPresencaFaltaParacambi(index) {
    participantesParacambi[index].presenca = 0;
    participantesParacambi[index].faltas = 0;
    atualizarTabelaParacambi();
    salvarDadosParacambi();
}

function removerParticipanteParacambi(index) {
    participantesParacambi.splice(index, 1);
    atualizarTabelaParacambi();
    salvarDadosParacambi();
}

function atualizarTabelaParacambi() {
    const totalAulas = 9; // Total de aulas
    const tabela = document.getElementById('tabela-presenca-paracambi').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';

    participantesParacambi.forEach((participante, index) => {
        const row = tabela.insertRow();

        const porcentagemPresenca = ((participante.presenca / totalAulas) * 100).toFixed(0) + '%';

        row.insertCell(0).innerHTML = participante.nome;
        row.insertCell(1).innerHTML = participante.genero;
        row.insertCell(2).innerHTML = participante.cargo;
        row.insertCell(3).innerHTML = participante.presenca;
        row.insertCell(4).innerHTML = participante.faltas;
        row.insertCell(5).innerHTML = porcentagemPresenca; // Nova coluna para porcentagem de presença

        const actionsCell = row.insertCell(6);
        actionsCell.innerHTML = `
        <button onclick="marcarPresencaParacambi(${index})" style="background: green;">Presença</button>
        <button onclick="marcarFaltaParacambi(${index})" style="background: red; color: #fff;">Falta</button>
        
        <select id="acaoSelect${index}">
            <option value="#">Escolha...</option>
            <option value="limparPresencaFaltaParacambi">Limpar</option>
            <option value="removerParticipanteParacambi">Remover</option>
        </select>
        <button onclick="executarAcao(${index})" style="background: orange; color: #333;">Ação</button> `;
    });
}

function executarAcao(index) {
    const select = document.getElementById(`acaoSelect${index}`);
    const acao = select.value;

    if (acao === 'limparPresencaFaltaParacambi') {
        limparPresencaFaltaParacambi(index);
    } else if (acao === 'removerParticipanteParacambi') {
        removerParticipanteParacambi(index);
    } else {
        alert("Por favor, escolha uma ação válida.");
    }
}

let presencaChart = null; // Variável para armazenar o gráfico

function gerarGraficoParacambi() {
    const ctx = document.getElementById('presenca-chart-paracambi').getContext('2d');
    const labels = participantesParacambi.map(p => p.nome);
    const presencas = participantesParacambi.map(p => p.presenca);
    const faltas = participantesParacambi.map(p => p.faltas);

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
                    data: labels
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
                            return value// + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw;
                        }
                    }
                },
                datalabels: {
                    color: 'white',
                    anchor: 'center',
                    align: 'center',
                    formatter: (value) => {
                        return value}
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

window.addEventListener('load', () => {
    atualizarTabelaParacambi();
    gerarGraficoParacambi();
});
function toggleModex(){
    const html = document.documentElement
    //mudar tema entre claro e escuro
    html.classList.toggle("lights"); const modex = html.classList.contains("lights") ? "lights" : "darks";
          localStorage.setItem("modex", modex);
  }
let timeout;

function onResize() {
    gerarGraficoParacambi();
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
          const modex = localStorage.getItem('modex');
          if (modex === 'lights') {
              toggleModex();
          }
      };

window.addEventListener('resize', debounce(onResize, 1000)); // 1000 ms = 1 segundo
