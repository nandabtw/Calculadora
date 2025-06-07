// Variáveis globais para controle da calculadora
let valorAtual = '0';
let operadorPendente = null;
let valorAnterior = null;
let reiniciarDisplay = false;
let expressaoCompleta = '';
let resultadoCalculado = false;
let novoNumeroAposOperador = false;

// Função executada quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');

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
        }
    });

    // Função para atualizar o display
    function atualizarDisplay() {
        display.textContent = expressaoCompleta || valorAtual;
    }

    // Função para adicionar um número ao display
    function adicionarNumero(numero) {
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
        
        operadorPendente = null;
        valorAnterior = null;
        expressaoCompleta = '';
        resultadoCalculado = true;
        novoNumeroAposOperador = false;
        atualizarDisplay();
    }

    // Função para limpar a calculadora
    function limpar() {
        valorAtual = '0';
        operadorPendente = null;
        valorAnterior = null;
        reiniciarDisplay = false;
        expressaoCompleta = '';
        resultadoCalculado = false;
        novoNumeroAposOperador = false;
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

    window.adicionarNumero = adicionarNumero;
    window.adicionarOperador = adicionarOperador;
    window.calcular = calcular;
    window.limpar = limpar;
    window.apagar = apagar;
});