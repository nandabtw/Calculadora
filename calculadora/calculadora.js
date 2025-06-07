// Variáveis globais para controle da calculadora
let valorAtual = '0';
let operadorPendente = null;
let valorAnterior = null;
let reiniciarDisplay = false;
let expressaoCompleta = '';
let resultadoCalculado = false;
let novoNumeroAposOperador = false;

// Variáveis para histórico e contagem de teclas
let historico = [];
let contadorTeclas = {
    '0': 0, '1': 0, '2': 0, '3': 0, '4': 0,
    '5': 0, '6': 0, '7': 0, '8': 0, '9': 0
};
let relatorioVisivel = false;

// Função executada quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const conteudoHistorico = document.getElementById('conteudo-historico');
    const relatorio = document.getElementById('relatorio');
    const relatorioTeclas = document.getElementById('relatorio-teclas');

    // Configuração dos botões numéricos
    document.getElementById('btn-0').addEventListener('click', function() { adicionarNumero('0'); });
    document.getElementById('btn-1').addEventListener('click', function() { adicionarNumero('1'); });
    document.getElementById('btn-2').addEventListener('click', function() { adicionarNumero('2'); });
    document.getElementById('btn-3').addEventListener('click', function() { adicionarNumero('3'); });
    document.getElementById('btn-4').addEventListener('click', function() { adicionarNumero('4'); });
    document.getElementById('btn-5').addEventListener('click', function() { adicionarNumero('5'); });
    document.getElementById('btn-6').addEventListener('click', function() { adicionarNumero('6'); });
    document.getElementById('btn-7').addEventListener('click', function() { adicionarNumero('7'); });
    document.getElementById('btn-8').addEventListener('click', function() { adicionarNumero('8'); });
    document.getElementById('btn-9').addEventListener('click', function() { adicionarNumero('9'); });
    document.getElementById('btn-ponto').addEventListener('click', function() { adicionarNumero('.'); });

    // Configuração dos botões de operação
    document.getElementById('btn-adicao').addEventListener('click', function() { adicionarOperador('+'); });
    document.getElementById('btn-subtracao').addEventListener('click', function() { adicionarOperador('-'); });
    document.getElementById('btn-multiplicacao').addEventListener('click', function() { adicionarOperador('*'); });
    document.getElementById('btn-divisao').addEventListener('click', function() { adicionarOperador('/'); });
    document.getElementById('btn-porcentagem').addEventListener('click', function() { adicionarOperador('%'); });

    // Configuração dos botões de ação
    document.getElementById('btn-igual').addEventListener('click', calcular);
    document.getElementById('btn-limpar').addEventListener('click', limpar);
    document.getElementById('btn-limpar-entrada').addEventListener('click', limparEntrada);
    document.getElementById('btn-apagar').addEventListener('click', apagar);

    // Adicionar suporte a teclado
    document.addEventListener('keydown', function(event) {
        if (event.key >= '0' && event.key <= '9') {
            adicionarNumero(event.key);
        } else if (event.key === '.') {
            adicionarNumero('.');
        } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
            adicionarOperador(event.key);
        } else if (event.key === '%') {
            adicionarOperador('%');
        } else if (event.key === 'Enter' || event.key === '=') {
            calcular();
        } else if (event.key === 'Escape') {
            limpar();
        } else if (event.key === 'Backspace') {
            apagar();
        } else if (event.key === 'Delete') {
            limparEntrada();
        } else if (event.key === 'h' || event.key === 'H') {
            toggleRelatorio();
        }
    });

    // Função para alternar a visibilidade do relatório
    function toggleRelatorio() {
        relatorioVisivel = !relatorioVisivel;
        if (relatorioVisivel) {
            atualizarRelatorio();
            relatorio.style.display = 'block';
        } else {
            relatorio.style.display = 'none';
        }
    }

    // Função para atualizar o relatório de uso das teclas
    function atualizarRelatorio() {
        let html = '';
        for (let i = 0; i <= 9; i++) {
            html += `<div class="relatorio-item">
                        <span>Tecla ${i}:</span>
                        <span>${contadorTeclas[i.toString()]} vezes</span>
                     </div>`;
        }
        relatorioTeclas.innerHTML = html;
    }

    // Função para atualizar o histórico
    function atualizarHistorico() {
        if (historico.length === 0) {
            conteudoHistorico.innerHTML = '<p class="mensagem-historico">Nenhuma operação realizada.</p>';
            return;
        }

        let html = '';
        historico.forEach(item => {
            html += `<div class="operacao-historico">
                        <div class="expressao">${item.expressao}</div>
                        <div class="resultado">${item.resultado}</div>
                     </div>`;
        });
        conteudoHistorico.innerHTML = html;
        
        // Rolar para o final do histórico
        conteudoHistorico.scrollTop = conteudoHistorico.scrollHeight;
    }

    // Função para adicionar uma operação ao histórico
    function adicionarAoHistorico(expressao, resultado) {
        historico.push({
            expressao: expressao,
            resultado: resultado
        });
        atualizarHistorico();
    }

    // Função para atualizar o display
    function atualizarDisplay() {
        display.textContent = expressaoCompleta || valorAtual;
    }

    // Função para adicionar um número ao display
    function adicionarNumero(numero) {
        // Incrementar o contador de teclas numéricas
        if (numero >= '0' && numero <= '9') {
            contadorTeclas[numero]++;
        }

        if (resultadoCalculado) {
            valorAtual = numero;
            expressaoCompleta = numero;
            resultadoCalculado = false;
            atualizarDisplay();
            return;
        }
        
        if (novoNumeroAposOperador) {
            valorAtual = numero;
            novoNumeroAposOperador = false;
            
            if (operadorPendente) {
                let parteInicial = expressaoCompleta.substring(0, expressaoCompleta.lastIndexOf(getOperadorVisual(operadorPendente)) + 1);
                expressaoCompleta = parteInicial + numero;
            }
            atualizarDisplay();
            return;
        }
        
        if (valorAtual === '0' || reiniciarDisplay) {
            valorAtual = numero;
            reiniciarDisplay = false;
            
            if (expressaoCompleta && operadorPendente) {
                let parteInicial = expressaoCompleta.substring(0, expressaoCompleta.lastIndexOf(getOperadorVisual(operadorPendente)) + 1);
                expressaoCompleta = parteInicial + numero;
            } else {
                expressaoCompleta = numero;
            }
        } else {
            if (numero === '.' && valorAtual.includes('.')) {
                return;
            }
            valorAtual += numero;

            if (operadorPendente) {
                let parteInicial = expressaoCompleta.substring(0, expressaoCompleta.lastIndexOf(getOperadorVisual(operadorPendente)) + 1);
                expressaoCompleta = parteInicial + valorAtual;
            } else {
                expressaoCompleta = valorAtual;
            }
        }
        atualizarDisplay();
    }

    // Função para obter o símbolo visual do operador
    function getOperadorVisual(op) {
        switch(op) {
            case '*': return '×';
            case '/': return '/';
            default: return op;
        }
    }

    // Função para adicionar um operador
    function adicionarOperador(operador) {
        resultadoCalculado = false;
        
        if (operadorPendente !== null && !reiniciarDisplay) {
            calcular();
            expressaoCompleta = valorAtual;
        }
        
        valorAnterior = valorAtual;
        operadorPendente = operador;
        
        let operadorVisual = getOperadorVisual(operador);
        expressaoCompleta = expressaoCompleta + operadorVisual;
        
        novoNumeroAposOperador = true;
        
        atualizarDisplay();
    }

    // Função para calcular o resultado
    function calcular() {
        if (operadorPendente === null) {
            return;
        }

        let resultado;
        const anterior = parseFloat(valorAnterior);
        const atual = parseFloat(valorAtual);
        const expressaoParaHistorico = expressaoCompleta;

        switch (operadorPendente) {
            case '+':
                resultado = anterior + atual;
                break;
            case '-':
                resultado = anterior - atual;
                break;
            case '*':
                resultado = anterior * atual;
                break;
            case '/':
                if (atual === 0) {
                    limpar();
                    display.textContent = 'Erro: Divisão por zero';
                    return;
                }
                resultado = anterior / atual;
                break;
            case '%':
                resultado = anterior * (atual / 100);
                break;
            default:
                return;
        }

        valorAtual = resultado.toString();
        
        if (valorAtual.length > 12) {
            valorAtual = parseFloat(resultado).toExponential(6);
        }
        
        // Adicionar ao histórico
        adicionarAoHistorico(expressaoParaHistorico, valorAtual);
        
        operadorPendente = null;
        valorAnterior = null;
        expressaoCompleta = '';
        resultadoCalculado = true;
        novoNumeroAposOperador = false;
        atualizarDisplay();
    }

    // Função para limpar a calculadora e o histórico
    function limpar() {
        valorAtual = '0';
        operadorPendente = null;
        valorAnterior = null;
        reiniciarDisplay = false;
        expressaoCompleta = '';
        resultadoCalculado = false;
        novoNumeroAposOperador = false;
        historico = [];
        atualizarHistorico();
        
        atualizarDisplay();
    }

    // Função para limpar apenas a entrada atual (CE)
    function limparEntrada() {
        if (operadorPendente) {
            valorAtual = '0';
            let parteInicial = expressaoCompleta.substring(0, expressaoCompleta.lastIndexOf(getOperadorVisual(operadorPendente)) + 1);
            expressaoCompleta = parteInicial;
            novoNumeroAposOperador = true;
        } else {
            valorAtual = '0';
            expressaoCompleta = '';
        }
        
        resultadoCalculado = false;
        atualizarDisplay();
    }

    // Função para apagar o último dígito
    function apagar() {
        resultadoCalculado = false;
        
        if (expressaoCompleta) {
            expressaoCompleta = expressaoCompleta.slice(0, -1);
            
            if (operadorPendente && !expressaoCompleta.includes(getOperadorVisual(operadorPendente))) {
                operadorPendente = null;
                reiniciarDisplay = false;
                novoNumeroAposOperador = false;
            }
            
            if (operadorPendente) {
                let partes = expressaoCompleta.split(getOperadorVisual(operadorPendente));
                if (partes.length > 1) {
                    valorAtual = partes[1];
                } else {
                    valorAtual = '0';
                }
            } else {
                valorAtual = expressaoCompleta || '0';
            }
            
            if (!expressaoCompleta) {
                valorAtual = '0';
            }
        } else {
            if (valorAtual.length === 1 || (valorAtual.length === 2 && valorAtual.startsWith('-'))) {
                valorAtual = '0';
            } else {
                valorAtual = valorAtual.slice(0, -1);
            }
        }
        atualizarDisplay();
    }

    // Inicializar o histórico
    atualizarHistorico();

    // Expor funções para o escopo global
    window.adicionarNumero = adicionarNumero;
    window.adicionarOperador = adicionarOperador;
    window.calcular = calcular;
    window.limpar = limpar;
    window.limparEntrada = limparEntrada;
    window.apagar = apagar;
    window.toggleRelatorio = toggleRelatorio;
});
