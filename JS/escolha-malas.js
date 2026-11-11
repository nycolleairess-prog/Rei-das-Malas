
/* =====================================
   REI DAS MALAS
   ESCOLHA DE TAMANHOS E PREÇOS
===================================== */

(() => {

    const whatsapp = "5571991547632";

    // Tabela de preços da loja
    const catalogo = {

        abs: {
            nome: "Malas ABS",
            produtos: [
                ["Bordo - N17 - 8kg", 180],
                ["Bordo - N19 - 10kg", 200],
                ["Bordo - N20 - 12kg", 220],
                ["Bordo - N21 - 15kg", 230],

                ["Despachar - N23 - 20kg", 240],
                ["Despachar - N24 - 23kg", 250],
                ["Despachar - N26 - 25kg", 270],
                ["Despachar - N28 - 32kg", 320],
                ["Despachar - N29 - 35kg", 330],
                ["Despachar - N30 - 40kg", 350]
            ]
        },

        polipropileno: {
            nome: "Malas de Polipropileno",
            produtos: [
                ["Bordo - 10kg", 220],
                ["Bordo - 12kg", 240],
                ["Bordo - 15kg", 260],

                ["Média - 18kg", 280],
                ["Média - 21kg", 300],
                ["Média - 23kg", 320],
                ["Média - 25kg", 340],
                ["Média - 27kg", 360],

                ["Grande - 30kg", 380],
                ["Grande - 32kg", 400],
                ["Grande - 35kg", 420],
                ["Grande - 40kg", 440],
                ["Grande - 45kg", 460]
            ]
        },

        luxo: {
            nome: "Linha Luxo",
            produtos: [
                ["Bordo - 10kg", 220],
                ["Bordo - 12kg", 240],

                ["Média - 17kg", 260],
                ["Média - 20kg", 280],
                ["Média - 23kg", 300],
                ["Média - 25kg", 330],

                ["Grande - 32kg", 350],
                ["Grande - 35kg", 380],

                ["GG - 40kg", 400]
            ]
        },

        frasqueiras: {
            nome: "Frasqueiras",
            produtos: [
                ["Frasqueira ABS", 100],
                ["Frasqueira Linha Luxo - G", 120],
                ["Frasqueira Linha Luxo - GG", 140]
            ]
        }

    };

    // Elementos do HTML
    const fundo = document.getElementById("escolha-fundo");
    const fechar = document.getElementById("fechar-escolha");
    const titulo = document.getElementById("escolha-titulo");
    const tamanho = document.getElementById("escolha-tamanho");
    const valor = document.getElementById("escolha-valor");
    const finalizar = document.getElementById("finalizar-escolha");

    // Evita interferir no restante do site
    if (
        !fundo ||
        !fechar ||
        !titulo ||
        !tamanho ||
        !valor ||
        !finalizar
    ) {
        console.warn("Elementos do seletor de malas não encontrados.");
        return;
    }

    let categoriaAtual = null;
    let botaoAnterior = null;

    function formatarPreco(preco) {
        return preco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    // Abre a janela da categoria escolhida
    function abrirJanela(categoria, botao) {

        const dados = catalogo[categoria];

        if (!dados) return;

        categoriaAtual = categoria;
        botaoAnterior = botao;

        titulo.textContent = dados.nome;

        tamanho.innerHTML = "";

        const inicial = document.createElement("option");
        inicial.value = "";
        inicial.textContent = "Selecione um tamanho";
        tamanho.appendChild(inicial);

        dados.produtos.forEach((produto, indice) => {

            const opcao = document.createElement("option");

            opcao.value = String(indice);
            opcao.textContent =
                produto[0] + " — " + formatarPreco(produto[1]);

            tamanho.appendChild(opcao);

        });

        tamanho.value = "";
        valor.textContent = "Selecione um tamanho";
        finalizar.disabled = true;

        fundo.hidden = false;

        fechar.focus();
    }

    // Atualiza o preço ao selecionar o tamanho
    function atualizarPreco() {

        const indice = tamanho.value;

        if (indice === "" || !categoriaAtual) {
            valor.textContent = "Selecione um tamanho";
            finalizar.disabled = true;
            return;
        }

        const produto =
            catalogo[categoriaAtual].produtos[Number(indice)];

        if (!produto) return;

        valor.textContent = formatarPreco(produto[1]);
        finalizar.disabled = false;
    }

    // Fecha a janela
    function fecharJanela() {

        fundo.hidden = true;
        categoriaAtual = null;

        if (botaoAnterior) {
            botaoAnterior.focus();
        }
    }

    // Detecta os botões das categorias
    document.querySelectorAll(".escolher-mala").forEach(botao => {

        botao.addEventListener("click", () => {

            abrirJanela(botao.dataset.categoria, botao);

        });

    });

    tamanho.addEventListener("change", atualizarPreco);

    fechar.addEventListener("click", fecharJanela);

    // Fecha ao clicar fora
    fundo.addEventListener("click", evento => {

        if (evento.target === fundo) {
            fecharJanela();
        }

    });

    // Fecha com Escape
    document.addEventListener("keydown", evento => {

        if (evento.key === "Escape" && !fundo.hidden) {
            fecharJanela();
        }

    });

    // Envia a seleção para o WhatsApp
    finalizar.addEventListener("click", () => {

        if (!categoriaAtual || tamanho.value === "") return;

        const categoria = catalogo[categoriaAtual];
        const produto = categoria.produtos[Number(tamanho.value)];

        if (!produto) return;

        const mensagem =
            "Olá! Gostaria de consultar uma mala na Rei das Malas.\n\n" +
            "*Categoria:* " + categoria.nome + "\n" +
            "*Modelo/Tamanho:* " + produto[0] + "\n" +
            "*Valor:* " + formatarPreco(produto[1]) + "\n\n" +
            "Quais cores estão disponíveis nesse modelo? " +
            "Gostaria de confirmar a disponibilidade e finalizar meu pedido.";

        const url =
            "https://wa.me/" + whatsapp +
            "?text=" + encodeURIComponent(mensagem);

        window.open(url, "_blank", "noopener,noreferrer");

    });

})();
