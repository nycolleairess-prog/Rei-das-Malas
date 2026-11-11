
// REI DAS MALAS - MONTADOR DE KITS

// Coloque aqui o WhatsApp comercial da loja.
// Exemplo: "5587199154763
// " (55 = Brasil, 83 = DDD, 988261644 = número)
const whatsappLoja = "5571991547632";

// Valores baseados nas imagens de referência.
// Confira a tabela oficial antes de publicar.

const catalogoKit = [
    {
        nome: "Malas em Polipropileno",
        descricao: "MATERIAL MAIS RESISTENTE",
        grupos: [
            {
                nome: "BORDO",
                produtos: [
                    ["10kg", 220],
                    ["12kg", 240],
                    ["15kg", 260]
                ]
            },
            {
                nome: "MÉDIAS",
                produtos: [
                    ["18kg", 280],
                    ["21kg", 300],
                    ["23kg", 320],
                    ["25kg", 340],
                    ["27kg", 360]
                ]
            },
            {
                nome: "GRANDES",
                produtos: [
                    ["30kg", 380],
                    ["32kg", 400],
                    ["35kg", 420],
                    ["40kg", 440],
                    ["45kg", 460]
                ]
            }
        ]
    },
    {
        nome: "Malas em ABS",
        descricao: "LEVES E RESISTENTES",
        grupos: [
            {
                nome: "BORDO",
                produtos: [
                    ["N17 - 8kg", 180],
                    ["N19 - 10kg", 200],
                    ["N20 - 12kg", 220],
                    ["N21 - 15kg", 230]
                ]
            },
            {
                nome: "FRASQUEIRA",
                produtos: [
                    ["Frasqueira ABS", 100]
                ]
            },
            {
                nome: "PARA DESPACHAR",
                produtos: [
                    ["N23 - 20kg", 240],
                    ["N24 - 23kg", 250],
                    ["N26 - 25kg", 270],
                    ["N28 - 32kg", 320],
                    ["N29 - 35kg", 330],
                    ["N30 - 40kg", 350]
                ]
            }
        ]
    },
    {
        nome: "Linha Luxo",
        descricao: "DESIGN PREMIUM",
        grupos: [
            {
                nome: "BORDO",
                produtos: [
                    ["10kg", 220],
                    ["12kg", 240]
                ]
            },
            {
                nome: "MÉDIAS",
                produtos: [
                    ["17kg", 260],
                    ["20kg", 280],
                    ["23kg", 300],
                    ["25kg", 330]
                ]
            },
            {
                nome: "GRANDES",
                produtos: [
                    ["32kg", 350],
                    ["35kg", 380]
                ]
            },
            {
                nome: "GG",
                produtos: [
                    ["40kg", 400]
                ]
            },
            {
                nome: "FRASQUEIRAS",
                produtos: [
                    ["Frasqueira pequena", 120],
                    ["Frasqueira grande", 140]
                ]
            }
        ]
    }
];

// Elementos da página
const fundoKit = document.getElementById("kit-fundo");
const abrirKit = document.getElementById("abrir-kit");
const fecharKit = document.getElementById("fechar-kit");
const listaProdutos = document.getElementById("kit-produtos");
const listaResumo = document.getElementById("kit-itens");
const valorTotal = document.getElementById("kit-valor");
const quantidadeTotal = document.getElementById("kit-quantidade");
const finalizarKit = document.getElementById("finalizar-kit");
const limparKit = document.getElementById("limpar-kit");

// Armazena os produtos e as quantidades
const produtos = [];
const carrinhoKit = {};

let focoAnterior = null;

// Formata os valores em reais
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Organiza os produtos por categoria
function prepararProdutos() {
    catalogoKit.forEach((categoria) => {
        categoria.grupos.forEach((grupo) => {
            grupo.produtos.forEach(([tamanho, preco]) => {
                produtos.push({
                    id: produtos.length,
                    categoria: categoria.nome,
                    grupo: grupo.nome,
                    tamanho: tamanho,
                    preco: preco
                });
            });
        });
    });
}

// Cria as opções na tela
function mostrarProdutos() {
    let html = "";
    let indice = 0;

    catalogoKit.forEach((categoria) => {
        html += `
            <section class="kit-grupo">
                <h3>${categoria.nome}</h3>
                <p class="kit-subtitulo">
                    ${categoria.descricao}
                </p>
        `;

        categoria.grupos.forEach((grupo) => {
            html += `
                <h4 class="kit-faixa">
                    ${grupo.nome}
                </h4>

                <div class="kit-opcoes">
            `;

            grupo.produtos.forEach(([tamanho, preco]) => {
                const id = indice++;
                const quantidade = carrinhoKit[id] || 0;

                html += `
                    <div class="kit-produto ${quantidade ? "selecionado" : ""}">
                        <div class="kit-produto-nome">
                            ${tamanho}
                        </div>

                        <div class="kit-produto-preco">
                            ${formatarPreco(preco)}
                        </div>

                        <div class="kit-controles">
                            <button
                                type="button"
                                data-id="${id}"
                                data-acao="menos"
                                aria-label="Diminuir ${tamanho}"
                                ${quantidade === 0 ? "disabled" : ""}>
                                −
                            </button>

                            <span>${quantidade}</span>

                            <button
                                type="button"
                                class="kit-mais"
                                data-id="${id}"
                                data-acao="mais"
                                aria-label="Adicionar ${tamanho}">
                                +
                            </button>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        });

        html += `</section>`;
    });

    listaProdutos.innerHTML = html;
}

// Atualiza o resumo do pedido
function atualizarResumo() {
    let total = 0;
    let quantidade = 0;
    let html = "";

    produtos.forEach((produto) => {
        const qtd = carrinhoKit[produto.id] || 0;

        if (qtd > 0) {
            const subtotal = produto.preco * qtd;

            total += subtotal;
            quantidade += qtd;

            html += `
                <div class="kit-item">
                    <div class="kit-item-linha">
                        <span>
                            ${produto.categoria}<br>
                            <b>${produto.tamanho}</b>
                        </span>

                        <div>
                            <strong>
                                ${formatarPreco(subtotal)}
                            </strong>

                            <button
                                type="button"
                                class="kit-remover"
                                data-remover="${produto.id}"
                                aria-label="Remover produto">
                                ×
                            </button>
                        </div>
                    </div>

                    <small>
                        ${qtd} x ${formatarPreco(produto.preco)}
                    </small>
                </div>
            `;
        }
    });

    if (quantidade === 0) {
        html = "Nenhum produto selecionado ainda. Use os botões + para adicionar malas ao seu kit.";
    }

    listaResumo.innerHTML = html;
    valorTotal.textContent = formatarPreco(total);
    quantidadeTotal.textContent =
        quantidade + (quantidade === 1 ? " item" : " itens");

    finalizarKit.disabled = quantidade === 0;
}

// Adiciona ou diminui a quantidade
function alterarQuantidade(id, diferenca) {
    const atual = carrinhoKit[id] || 0;
    const novaQuantidade = Math.max(0, atual + diferenca);

    if (novaQuantidade === 0) {
        delete carrinhoKit[id];
    } else {
        carrinhoKit[id] = novaQuantidade;
    }

    mostrarProdutos();
    atualizarResumo();
}

// Abre a janela
function abrirMontador() {
    focoAnterior = document.activeElement;
    fundoKit.hidden = false;
    document.body.classList.add("kit-aberto");
    fecharKit.focus();
}

// Fecha a janela
function fecharMontador() {
    fundoKit.hidden = true;
    document.body.classList.remove("kit-aberto");

    if (focoAnterior) {
        focoAnterior.focus();
    }
}

// Botões de abrir e fechar
abrirKit.addEventListener("click", abrirMontador);
fecharKit.addEventListener("click", fecharMontador);

// Fecha ao clicar fora da janela
fundoKit.addEventListener("click", (evento) => {
    if (evento.target === fundoKit) {
        fecharMontador();
    }
});

// Fecha ao apertar Escape
document.addEventListener("keydown", (evento) => {
    if (fundoKit.hidden) return;

    if (evento.key === "Escape") {
        fecharMontador();
    }

    // Mantém o foco dentro da janela
    if (evento.key === "Tab") {
        const botoes = [
            ...fundoKit.querySelectorAll(
                "button:not([disabled])"
            )
        ];

        const primeiro = botoes[0];
        const ultimo = botoes[botoes.length - 1];

        if (evento.shiftKey && document.activeElement === primeiro) {
            evento.preventDefault();
            ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
            evento.preventDefault();
            primeiro.focus();
        }
    }
});

// Detecta cliques nos botões + e -
listaProdutos.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-id]");

    if (!botao) return;

    const id = Number(botao.dataset.id);
    const acao = botao.dataset.acao;

    alterarQuantidade(id, acao === "mais" ? 1 : -1);
});

// Remove produto pelo resumo
listaResumo.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-remover]");

    if (!botao) return;

    const id = Number(botao.dataset.remover);

    delete carrinhoKit[id];

    mostrarProdutos();
    atualizarResumo();
});

// Limpa todo o kit
limparKit.addEventListener("click", () => {
    Object.keys(carrinhoKit).forEach((id) => {
        delete carrinhoKit[id];
    });

    mostrarProdutos();
    atualizarResumo();
});

// Finalização pelo WhatsApp
finalizarKit.addEventListener("click", () => {
    const numero = whatsappLoja.replace(/\D/g, "");

    if (!/^55\d{10,11}$/.test(numero)) {
        alert("Configure o número comercial do WhatsApp no arquivo kit.js.");
        return;
    }

    const selecionados = produtos.filter(
        (produto) => (carrinhoKit[produto.id] || 0) > 0
    );

    if (selecionados.length === 0) return;

    let mensagem = "Olá! Gostaria de fazer um pedido na Rei das Malas.\n\n";
    mensagem += "*MEU KIT DE MALAS*\n\n";

    let total = 0;

    selecionados.forEach((produto) => {
        const qtd = carrinhoKit[produto.id];
        const subtotal = produto.preco * qtd;

        total += subtotal;

        mensagem += `*${produto.categoria}*\n`;
        mensagem += `Modelo/tamanho: ${produto.tamanho}\n`;
        mensagem += `Quantidade: ${qtd}\n`;
        mensagem += `Subtotal: ${formatarPreco(subtotal)}\n\n`;
    });

    mensagem += `*TOTAL: ${formatarPreco(total)}*\n\n`;
    mensagem += "Gostaria de confirmar as cores disponíveis e finalizar meu pedido.";

    const url = "https://wa.me/" + numero +
        "?text=" + encodeURIComponent(mensagem);

    window.open(url, "_blank", "noopener,noreferrer");
});

// Inicia o montador
prepararProdutos();
mostrarProdutos();
atualizarResumo();
