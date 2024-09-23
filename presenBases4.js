let participantesQueimados = JSON.parse(localStorage.getItem('participantesQueimados')) || [];

function salvarDadosQueimados() {
    localStorage.setItem('participantesQueimados', JSON.stringify(participantesQueimados));
}

function adicionarParticipanteQueimados() {
    const nome = document.getElementById('nomeQueimados').value;
    //const genero = document.getElementById('generoQueimados').value;
    const cargo = document.getElementById('cargoQueimados').value;

    if (nome && cargo) {
        const participante = {
            nome,
            //genero,
            cargo,
            presenca: 0,
            faltas: 0
        };

        participantesQueimados.push(participante);
        atualizarTabelaQueimados();
        salvarDadosQueimados();
        limparcamposQueimados();
    } else {
        alert('Por favor, preencha todos os campos!')
    }
}

function limparcamposQueimados() {
    document.getElementById('nomeQueimados').value = '';
    document.getElementById('cargoQueimados').value = '';
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

function limparPresencaFaltaQueimados(index) {
    participantesQueimados[index].presenca = 0;
    participantesQueimados[index].faltas = 0;
    atualizarTabelaQueimados();
    salvarDadosQueimados();
}

function removerParticipanteQueimados(index) {
    participantesQueimados.splice(index, 1);
    atualizarTabelaQueimados();
    salvarDadosQueimados();
}

function atualizarTabelaQueimados() {
    const totalAulas = 9; // Total de aulas
    const tabela = document.getElementById('tabela-presenca-queimados').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';

    participantesQueimados.forEach((participante, index) => {
        const row = tabela.insertRow();

        const porcentagemPresenca = ((participante.presenca / totalAulas) * 100).toFixed(0) + '%';

       row.insertCell(0).innerHTML = participante.nome;
        row.insertCell(1).innerHTML = participante.cargo;
        row.insertCell(2).innerHTML = participante.presenca;
        row.insertCell(3).innerHTML = participante.faltas;
        row.insertCell(4).innerHTML = porcentagemPresenca; // Nova coluna para porcentagem de presença
        //row.insertCell(1).innerHTML = participante.genero;

        const actionsCell = row.insertCell(5);
        actionsCell.innerHTML = `
        <button onclick="marcarPresencaQueimados(${index})" style="background: green;">Presença</button>
        <button onclick="marcarFaltaQueimados(${index})" style="background: red; color: #fff;">Falta</button>
        
        <select id="acaoSelect${index}">
            <option value="#">Escolha...</option>
            <option value="limparPresencaFaltaQueimados">Limpar</option>
            <option value="removerParticipanteQueimados">Remover</option>
        </select>
        <button onclick="executarAcao(${index})" style="background: orange; color: #333;">Ação</button> `;
    });
}

function executarAcao(index) {
    const select = document.getElementById(`acaoSelect${index}`);
    const acao = select.value;

    if (acao === 'limparPresencaFaltaQueimados') {
        limparPresencaFaltaQueimados(index);
    } else if (acao === 'removerParticipanteQueimados') {
        removerParticipanteQueimados(index);
    } else {
        alert("Por favor, escolha uma ação válida.");
    }
}
let presencaChart = null; // Variável para armazenar o gráfico

function gerarGraficoQueimados() {
    const ctx = document.getElementById('presenca-chart-queimados').getContext('2d');
    const labels = participantesQueimados.map(p => p.nome);
    const presencas = participantesQueimados.map(p => p.presenca);
    const faltas = participantesQueimados.map(p => p.faltas);

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
                    formatter: (value) =>  {
                        return value
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

window.addEventListener('load', () => {
    atualizarTabelaQueimados();
    gerarGraficoQueimados();
});
function toggleMode(){
    const html = document.documentElement
    //mudar tema entre claro e escuro
    html.classList.toggle("lightz"); const mode = html.classList.contains("lightz") ? "lightz" : "darkz";
          localStorage.setItem("mode", mode);
  }
  let timeout;

function onResize() {
    gerarGraficoQueimados();
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
          const mode = localStorage.getItem('mode');
          if (mode === 'lightz') {
              toggleMode();
          }
      };
      window.addEventListener('resize', debounce(onResize, 1000)); // 1000 ms = 1 segundo
