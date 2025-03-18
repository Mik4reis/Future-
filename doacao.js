let totalDoacoes = 72;

function reflorestar(doacao) {
    const arvoresPorDoacao = 1;
    const valorPorArvore = 7;

    const numeroDeArvores = Math.floor(doacao / valorPorArvore) * arvoresPorDoacao;

    return numeroDeArvores;
}

function calcularDoacao() {
    const doacaoInput = document.getElementById('doacao');
    const instituicaoInput = document.getElementById('instituicao');
    const resultadoElement = document.getElementById('resultado');
    const contadorElement = document.getElementById('contador');

    const doacao = parseFloat(doacaoInput.value);

    if (isNaN(doacao) || doacao < 7) {
        resultadoElement.textContent = "Agradecemos sua tentativa, mas o valor mínimo é de 7 reais. Obrigado pelo interesse :)";
        return;
    }

    const numeroDeArvores = reflorestar(doacao);

    const instituicaoEscolhida = instituicaoInput.options[instituicaoInput.selectedIndex].text;

    resultadoElement.textContent = `Com a sua doação de R$${doacao.toFixed(2)} para a instituição ${instituicaoEscolhida}, você nos ajudou a reflorestar ${numeroDeArvores} árvores.`;

    // Incrementar o total de doações
    totalDoacoes++;
    // Atualizar o conteúdo do contador
    contadorElement.textContent = totalDoacoes;
}
