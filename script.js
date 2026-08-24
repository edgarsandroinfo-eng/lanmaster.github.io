/* =====================================================
   LAN MASTER ANOTAÇÕES
   SCRIPT.f
   BLOCO 1 - NÚCLEO DO SISTEMA
===================================================== */

import { autenticar } from "./authentication.js";
import {
    carregarFirebase,
    salvarFirebase,
    observarFirebase
} from "./firebase-db.js";

import {
    desenharInicio
} from "./home.js";

const CATEGORIAS = [
    "Pendências",
    "Bloco de Notas",
    "Contador de Impressões",
    "Clientes",
    "VBA",
    "Investimentos",
    "Marketing",
    "Prompts",
    "Serviços",
    "Compras",
    "Favoritos",
    "Concluídos"
];

let categoriaAtual = "Início";

let banco = {};
let salvandoBlocoNotas = false;


/*=====================================================
  INICIALIZAÇÃO
=====================================================*/

iniciarSistema()



async function iniciarSistema(){

 // Aguarda o login antes de acessar o Firestore
    await autenticar();

    let dados = await carregarFirebase();

    if(dados){

        banco = dados;

    }else{

        criarBanco();

        await salvarFirebase(banco);

    }

// Garante que todas as categorias existam
let alterouBanco = false;

CATEGORIAS.forEach(cat => {

    if (!banco[cat]) {

        banco[cat] = [];
        alterouBanco = true;

    }

});

if(!banco.Configuracoes){

    banco.Configuracoes = structuredClone(CONFIGURACAO_PADRAO);

    alterouBanco = true;

}
if(!banco.ContadorImpressoes){

    banco.ContadorImpressoes = {

        precoPB: 0.25,
        precoColorida: 2.50,

        pb: 0,
        colorida: 0,

        total: 0,
        valor: 0,

        totalPB: 0,
        totalColorida: 0,
        totalImpressoes: 0,
        valorTotal: 0,

        data: new Date().toLocaleDateString("pt-BR")

    };

    alterouBanco = true;
}

if(!banco.Configuracoes.contadorImpressoes){

    banco.Configuracoes.contadorImpressoes = {

        precoPB:0.25,
        precoColorida:2.50,

        hoje:{
            pb:0,
            colorida:0
        },

        mes:{
            pb:0,
            colorida:0
        },

        data:new Date().toLocaleDateString("pt-BR"),

        mesAtual:new Date().getMonth()

    };

    alterouBanco = true;

}


if(banco.ContadorImpressoes){

    if(banco.ContadorImpressoes.totalPB == null){
        banco.ContadorImpressoes.totalPB = 0;
        alterouBanco = true;
    }

    if(banco.ContadorImpressoes.totalColorida == null){
        banco.ContadorImpressoes.totalColorida = 0;
        alterouBanco = true;
    }

    if(banco.ContadorImpressoes.totalImpressoes == null){
        banco.ContadorImpressoes.totalImpressoes = 0;
        alterouBanco = true;
    }

    if(banco.ContadorImpressoes.valorTotal == null){
        banco.ContadorImpressoes.valorTotal = 0;
        alterouBanco = true;
    }

    if(!banco.ContadorImpressoes.data){
        banco.ContadorImpressoes.data =
            new Date().toLocaleDateString("pt-BR");
        alterouBanco = true;
    }

}


if (alterouBanco) {

    await salvarBanco();

}

    observarFirebase((novoBanco)=>{

    banco = novoBanco;

    if(salvandoBlocoNotas){

        salvandoBlocoNotas = false;
        return;

    }

    renderizar();

});

    atualizarRelogio();

    setInterval(atualizarRelogio,1000);

    configurarMenu();

    const logo = document.getElementById("logoHome");


logo.addEventListener("click", () => {

    categoriaAtual = "Início";
	
	
	categoriaAtual = "Início";

if(window.innerWidth <= 900){

    document
        .querySelector(".sidebar")
        .classList.remove("aberto");

}

renderizar();
	

    renderizar();

});

    renderizar();
	


}

/*=====================================================
  BANCO DE DADOS
=====================================================*/

function criarBanco(){

    banco = {};

    CATEGORIAS.forEach(cat=>{

        banco[cat]=[];

    });

    banco.Configuracoes = structuredClone(CONFIGURACAO_PADRAO);

// Contador de Impressões
banco.ContadorImpressoes = {

    precoPB: 0.25,
    precoColorida: 2.50,

    // CONTADOR DO DIA
    pb: 0,
    colorida: 0,
    total: 0,
    valor: 0,

    // ACUMULADO GERAL
    totalPB: 0,
    totalColorida: 0,
    totalImpressoes: 0,
    valorTotal: 0,

    // Controle da data
    data: new Date().toLocaleDateString("pt-BR"),

   };


}

async function salvarBanco(){

    await salvarFirebase(banco);

}
/*=====================================================
  MENU
=====================================================*/

function configurarMenu(){

    const menus = document.querySelectorAll(".sidebar li");

    menus.forEach(item=>{

        item.addEventListener("click",function(){

            menus.forEach(m=>m.classList.remove("ativo"));

            this.classList.add("ativo");

            categoriaAtual = this.dataset.categoria;

            renderizar();

            // Fecha o menu automaticamente no celular
            if(window.innerWidth <= 900){

                document
                .querySelector(".sidebar")
                .classList.remove("aberto");

            }

        });

    });

}

const logo = document.getElementById("logoHome");

logo.onclick = function(){

    document
        .querySelectorAll(".sidebar li")
        .forEach(li => li.classList.remove("ativo"));

    categoriaAtual = "Início";

    renderizar();

};

/*=====================================================
  RELÓGIO
=====================================================*/

function atualizarRelogio(){

    const hoje = new Date();

    const data = hoje.toLocaleDateString(

        "pt-BR",

        {

            weekday:"long",

            day:"2-digit",

            month:"2-digit",

            year:"numeric"

        }

    );

    const hora = hoje.toLocaleTimeString("pt-BR");

    const relogio=document.getElementById("relogio");

    if(relogio){

        relogio.innerHTML=

        data+" • "+hora;

    }

}



async function renderizar(){

    await prepararNovoDiaImpressoes();
	
	await prepararNovoDia();

    atualizarTitulo();

    atualizarResumo();

    atualizarBadges();

    mostrarTela();

}


function mostrarTela(){

    const cards = document.getElementById("cards");

    const bloco = document.getElementById("blocoNotas");

    const app = document.querySelector(".app");

    const contador = document.getElementById("contadorImpressoes");

    const btnNova = document.getElementById("btnNova");

    const btnNova2 = document.getElementById("btnNova2");

    switch(categoriaAtual){

       case "Início":

    cards.style.display = "grid";

    bloco.style.display = "none";

    contador.style.display = "none";

    app.classList.remove("modo-bloco");

    btnNova.style.display = "";
    
    btnNova2.style.display = "";

    desenharInicio(banco);

    break;

        case "Bloco de Notas":

            cards.style.display = "none";

            bloco.style.display = "block";
            
            app.classList.add("modo-bloco");

            desenharBlocoNotas();

            break;

            case "Contador de Impressões":

            cards.style.display = "none";

            bloco.style.display = "none";

            contador.style.display = "block";

            app.classList.remove("modo-bloco");

            btnNova.style.display = "none";
            
            btnNova2.style.display = "none";

            desenharContadorImpressoes();

    break;

        case "Prompts":

            cards.style.display = "grid";

            bloco.style.display = "none";

            contador.style.display = "none";

            app.classList.remove("modo-bloco");

            btnNova.style.display = "";

            btnNova2.style.display = "";

            desenharPrompts();

            break;

        case "Serviços":

            cards.style.display = "grid";

            bloco.style.display = "none";

            contador.style.display = "none";

            app.classList.remove("modo-bloco");

            btnNova.style.display = "";

            btnNova2.style.display = "";

            desenharServicos();

            break;

        default:

            cards.style.display = "grid";

            bloco.style.display = "none";

            contador.style.display = "none";

            app.classList.remove("modo-bloco");

            btnNova.style.display = "";

            btnNova2.style.display = "";

            desenharCards();

            break;

    }

}

/*=====================================================
  TTULO
=====================================================*/

function atualizarTitulo(){

    const titulo=document.querySelector(".titulo h1");

    const subtitulo=document.querySelector(".titulo span");

    if(!titulo) return;

    const icones={

        "Pendências":"fa-list-check",

        "Bloco de Notas":"fa-note-sticky",

        "Contador de Impressões":"fa-print",

        "Clientes":"fa-address-book",

        "VBA":"fa-code",

        "Investimentos":"fa-chart-line",

        "Marketing":"fa-bullhorn",
	
	"Prompts":"fa-wand-magic-sparkles",

        "Serviços":"fa-briefcase",

        "Compras":"fa-cart-shopping",

        "Favoritos":"fa-star",

        "Concluídos":"fa-circle-check"

    };

    const textos={

        "Pendências":"Suas tarefas e lembretes do dia.",

        "Bloco de Notas":"Anotações rápidas.",

        "Contador de Impressões":"Controle diário das impressões realizadas.",

        "Clientes":"Cadastro de clientes.",

        "VBA":"Ideias de Programação.",

        "Investimentos":"Controle de investimentos.",

        "Marketing":"Ideias e campanhas.",

	"Prompts":"Biblioteca de prompts para geração de imagens.",

	"Serviços":"Cadastro dos serviços oferecidos pela Lan Master.",

        "Compras":"Lista de compras.",

        "Favoritos":"Anotações favoritas.",

        "Concluídos":"Itens concluídos."

    };
	
	const nomes={

    "VBA":"Ideias de Programação."

};

    titulo.innerHTML=`
    <i class="fa-solid ${icones[categoriaAtual]}"></i>
    ${nomes[categoriaAtual] || categoriaAtual}
`;

    if(subtitulo){

        subtitulo.textContent=textos[categoriaAtual];

    }

const btnNova = document.getElementById("btnNova");
const btnNova2 = document.getElementById("btnNova2");
const pesquisa = document.querySelector(".pesquisa");
const painel = document.querySelector(".painel");

if (categoriaAtual === "Bloco de Notas") {

    btnNova.style.display = "none";

    if (btnNova2) btnNova2.style.display = "none";

    if (pesquisa) pesquisa.style.display = "none";

    if (subtitulo) subtitulo.style.display = "none";

    if (painel) painel.style.display = "none";

}else if(categoriaAtual === "Início"){

    titulo.innerHTML = "";

if(subtitulo){

    subtitulo.innerHTML = "";

}


    btnNova.style.display = "none";

    if (btnNova2) btnNova2.style.display = "none";

    if (pesquisa) pesquisa.style.display = "flex";

    if (subtitulo) subtitulo.style.display = "";

    if (painel) painel.style.display = "";

}else   
    {

    btnNova.style.display = "";

    if (btnNova2) btnNova2.style.display = "";

    if (pesquisa) pesquisa.style.display = "flex";

    if (subtitulo) subtitulo.style.display = "";

    if (painel) painel.style.display = "";

}

let textoBotao = "Nova Anotação";

if(categoriaAtual === "Prompts"){

    textoBotao = "Novo Prompt";

}else if(categoriaAtual === "Serviços"){

    textoBotao = "Novo Serviço";

}

if (btnNova) {
    btnNova.innerHTML = `
        <i class="fa-solid fa-plus"></i>
        ${textoBotao}
    `;
}

if (btnNova2) {
    btnNova2.innerHTML = `
        <i class="fa-solid fa-plus"></i>
        ${textoBotao}
    `;
}

}

/*=====================================================
  RESUMO
=====================================================*/

function atualizarResumo(){

    atualizarNumero(

        "qtPendencias",

        banco["Pendências"].length

    );

    atualizarNumero(

        "qtNotas",

        banco["Bloco de Notas"].length

    );

    atualizarNumero(

        "qtFavoritos",

        banco["Favoritos"].length

    );

    atualizarNumero(

        "qtConcluidos",

        banco["Concluídos"].length

    );

}

function atualizarNumero(id,valor){

    const obj=document.getElementById(id);

    if(obj){

        obj.innerText=valor;

    }

}



function atualizarBadges(){

    document.getElementById("badgePendencias").textContent =
        banco["Pendências"].length;

    document.getElementById("badgeNotas").textContent =
        banco["Bloco de Notas"].length;

    document.getElementById("badgeClientes").textContent =
        banco["Clientes"].length;

    document.getElementById("badgeProgramacao").textContent =
        banco["VBA"].length;

    document.getElementById("badgeInvestimentos").textContent =
        banco["Investimentos"].length;

    document.getElementById("badgeMarketing").textContent =
        banco["Marketing"].length;

    document.getElementById("badgeCompras").textContent =
        banco["Compras"].length;

    document.getElementById("badgePrompts").textContent =
        banco["Prompts"].length;

    document.getElementById("badgeServicos").textContent =
        banco["Serviços"].length;

    document.getElementById("badgeFavoritos").textContent =
        banco["Favoritos"].length;

    document.getElementById("badgeConcluidos").textContent =
        banco["Concluídos"].length;

}


/*=====================================================
  CARDS
=====================================================*/
function desenharCards(){

    const area=document.getElementById("cards");

    if(!area) return;

    area.innerHTML="";

    let lista=[];

    if(categoriaAtual==="Favoritos"){

        CATEGORIAS.forEach(cat=>{

            if(cat==="Favoritos") return;

            banco[cat].forEach((item,indice)=>{

                if(item.favorito){

                    lista.push({
                        categoria:cat,
                        indice:indice,
                        dados:item
                    });

                }

            });

        });

    }else{

        banco[categoriaAtual].forEach((item,indice)=>{

            lista.push({
                categoria:categoriaAtual,
                indice:indice,
                dados:item
            });

        });

    }

    const pesquisa=document.getElementById("pesquisa");

    let filtro="";

    if(pesquisa){

        filtro=pesquisa.value.toLowerCase();

    }

    lista=lista.filter(cartao=>{

        return (

            cartao.dados.titulo.toLowerCase().includes(filtro) ||

            cartao.dados.descricao.toLowerCase().includes(filtro)

        );

    });


const ordemPrioridade = {
    "A": 1,
    "M": 2,
    "B": 3
};

lista.sort((a, b) => {

    // 1 - Prioridade
    const prioridade =
        ordemPrioridade[a.dados.prioridade] -
        ordemPrioridade[b.dados.prioridade];

    if (prioridade !== 0)
        return prioridade;

    // 2 - Data de vencimento
    const va = a.dados.vencimento;
    const vb = b.dados.vencimento;

    if (va && vb) {

        const dataA = new Date(va);
        const dataB = new Date(vb);

        if (dataA.getTime() !== dataB.getTime()) {
            return dataA - dataB;
        }

    } else if (va && !vb) {

        return -1;

    } else if (!va && vb) {

        return 1;

    }

    // 3 - Mais recente primeiro
  return (
    (b.dados.timestamp || 0) -
    (a.dados.timestamp || 0)
);

});

    if(lista.length===0){

        area.innerHTML=`
        <div class="card">
            <h3>Nenhuma anotação encontrada</h3>
        </div>`;

        return;

    }

    lista.forEach(cartao=>{

        const c=cartao.dados;

        area.innerHTML+=`

        <div class="card">

         <h3>${c.titulo}</h3>

${c.descricao && c.descricao.trim() !== ""
    ? `<p>${c.descricao}</p>`
    : ""
}

<div class="data">
    ${c.data}
</div>

            <div class="acoes">

                <button onclick="favoritar('${cartao.categoria}',${cartao.indice})">

                    <i class="${c.favorito
                    ?'fa-solid fa-star'
                    :'fa-regular fa-star'}"></i>

                </button>

                <button onclick="editarCartao('${cartao.categoria}',${cartao.indice})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button onclick="concluir('${cartao.categoria}',${cartao.indice})">

                    <i class="fa-solid fa-check"></i>

                </button>

            </div>

        </div>

        `;

    });

}



/*=====================================================
  PROMPTS
=====================================================*/

function desenharPrompts(){

    const area = document.getElementById("cards");

    area.innerHTML = "";

   const pesquisa = document.getElementById("pesquisa");

let filtro = "";

if (pesquisa) {
    filtro = pesquisa.value.toLowerCase();
}

const lista = banco["Prompts"]
    .map((item, indice) => ({
        item,
        indiceOriginal: indice
    }))
    .filter(obj =>
        obj.item.titulo.toLowerCase().includes(filtro) ||
        obj.item.prompt.toLowerCase().includes(filtro)
    );


lista.sort((a, b) =>
    (b.item.timestamp || 0) -
    (a.item.timestamp || 0)
);

    if(lista.length == 0){

        area.innerHTML = `
            <div class="card">
                <h3>Nenhum prompt cadastrado.</h3>
            </div>
        `;

        return;

    }

    lista.forEach(obj => {

    const item = obj.item;

        area.innerHTML += `

        <div class="card">

            <h3>${item.titulo}</h3>

            <p>${item.prompt}</p>

            <div class="data">

                ${item.data}

            </div>

            <div class="acoes">

    <button onclick="gerarPrompt(${obj.indiceOriginal})">

        <i class="fa-solid fa-wand-magic-sparkles"></i>

        Gerar

    </button>

    <button onclick="editarPrompt(${obj.indiceOriginal})">

        <i class="fa-solid fa-pen"></i>

        Editar

    </button>

    <button onclick="excluirPrompt(${obj.indiceOriginal})">

        <i class="fa-solid fa-trash"></i>

        Excluir

    </button>

</div>

        `;

    });

}


function desenharServicos(){

    const area = document.getElementById("cards");

    area.innerHTML = "";

    if(banco["Serviços"].length == 0){

        area.innerHTML = `
            <div class="card">
                <h3>Nenhum serviço cadastrado.</h3>

                <p>
                    Clique em <strong>Novo Serviço</strong>
                    para cadastrar o primeiro serviço.
                </p>

            </div>
        `;

        return;

    }

    banco["Serviços"].forEach((servico, indice)=>{

        area.innerHTML += `

            <div class="card">

                <h3>${servico.nome}</h3>

                <p>${servico.descricao}</p>

                <div class="data">

                    ${servico.data}

                </div>

                <div class="acoes">

                    <button onclick="editarServico(${indice})">

                        <i class="fa-solid fa-pen"></i>

                        Editar

                    </button>

                    <button onclick="excluirServico(${indice})">

                        <i class="fa-solid fa-trash"></i>

                        Excluir

                    </button>

                </div>

            </div>

        `;

    });

}


async function desenharPropagandasDoDia(){

    const painel = document.getElementById("propagandasDia");
    const lista = document.getElementById("listaPropagandas");

    await prepararNovoDia();

    painel.style.display = "block";

    lista.innerHTML = "";

    const servicosHoje = banco["Serviços"].filter(servico =>

        servico.metaHoje === true

    );

    if(servicosHoje.length === 0){

        lista.innerHTML = `

            <div class="card">

                <h3>✅ Meta diária concluída</h3>

                <p>

                    Volte amanhã para receber
                    mais 2 propagandas.

                </p>

            </div>

        `;

        return;

    };

    servicosHoje.forEach(servico=>{

       lista.innerHTML += `

    <div class="itemPropaganda">

        <div class="dadosPropaganda">

            <strong>${servico.nome}</strong>

        </div>

        <button
            class="btnConcluirPropaganda"
            onclick="concluirPropaganda(${servico.id})">

            Concluir

        </button>

    </div>

`;

    });

}

function abrirPromptServico(tituloPrompt){

    const indice = banco["Prompts"].findIndex(prompt =>

        prompt.titulo === tituloPrompt

    );

    if(indice === -1){

        alert("Prompt não encontrado.");

        return;

    }

    gerarPrompt(indice);

}


async function concluirPropaganda(idServico){

    const servico = banco["Serviços"].find(item =>

        item.id === idServico

    );

    if(!servico){

        return;

    }

    servico.metaHoje = false;

    servico.divulgadoNoCiclo = true;

    servico.ultimaPropaganda = new Date().toLocaleDateString("pt-BR");

    servico.totalDivulgacoes++;

   const restantes = banco["Serviços"].filter(s => s.metaHoje);

if(restantes.length === 0){

    banco.Configuracoes.metaDiariaConcluida = true;

}
   
    await salvarBanco();

    mostrarMensagemPropaganda();

    renderizar();

}


function desenharBlocoNotas(){

    const area = document.getElementById("blocoNotas");

    let texto = "";

    if(banco["Bloco de Notas"].length > 0){

        texto = banco["Bloco de Notas"][0].texto || "";

    }

    area.innerHTML = `

        <div class="bloco-notas">

            <textarea
                id="txtBlocoNotas"
                placeholder="Digite aqui suas anotações..."
            >${texto}</textarea>

            <div class="rodapeBloco">

                <button id="btnOkBloco">

                    <i class="fa-solid fa-floppy-disk"></i>

                    Salvar

                </button>

            </div>

        </div>

    `;

    document
        .getElementById("btnOkBloco")
        .onclick = salvarBlocoNotas;
		
		let timerAutoSave;

document
    .getElementById("txtBlocoNotas")
    .addEventListener("input", function(){

        clearTimeout(timerAutoSave);

        timerAutoSave = setTimeout(async function(){

            await salvarBlocoNotas();

        }, 1000);

    });

}


async function salvarBlocoNotas(){

    const campo = document.getElementById("txtBlocoNotas");

    const texto = campo.value;

    banco["Bloco de Notas"] = [

        {
            texto: texto,
            data: new Date().toLocaleString("pt-BR"),
            timestamp: Date.now()
        }

    ];

    salvandoBlocoNotas = true;

    await salvarBanco();

    mostrarMensagemSalva();

}

const modalNova = document.getElementById("modalNova");

const txtTitulo = document.getElementById("txtTitulo");
const txtDescricao = document.getElementById("txtDescricao");

const chkFavorito = document.getElementById("chkFavorito");

let prioridadeSelecionada = "M";

const chkData = document.getElementById("chkData");

const areaData = document.getElementById("areaData");
const txtData = document.getElementById("txtData");

const btnCancelar = document.getElementById("btnCancelar");
const btnSalvarModal = document.getElementById("btnSalvarModal");

const btnAlta = document.querySelector(".prioridade.alta");
const btnMedia = document.querySelector(".prioridade.media");
const btnBaixa = document.querySelector(".prioridade.baixa");

/*=====================================================
  MODAL PROMPTS
=====================================================*/

const modalPrompt = document.getElementById("modalPrompt");

const txtTituloPrompt = document.getElementById("txtTituloPrompt");
const txtPrompt = document.getElementById("txtPrompt");

const btnCancelarPrompt = document.getElementById("btnCancelarPrompt");
const btnSalvarPrompt = document.getElementById("btnSalvarPrompt");


/*=====================================================
MODAL SERVIÇOS
=====================================================*/

const modalServico = document.getElementById("modalServico");

const txtNomeServico =
    document.getElementById("txtNomeServico");

const txtDescricaoServico =
    document.getElementById("txtDescricaoServico");

const cmbPromptServico =
    document.getElementById("cmbPromptServico");

const btnCancelarServico =
    document.getElementById("btnCancelarServico");

const btnSalvarServico =
    document.getElementById("btnSalvarServico");

/*=====================================================
MODAL GERAR PROMPT
=====================================================*/

const modalGerarPrompt = document.getElementById("modalGerarPrompt");

const txtTituloGerado = document.getElementById("txtTituloGerado");

const txtPromptGerado = document.getElementById("txtPromptGerado");

const btnFecharGerado = document.getElementById("btnFecharGerado");

const btnCopiarPrompt = document.getElementById("btnCopiarPrompt");


const btnChatGPT = document.getElementById("btnChatGPT");

const btnGemini = document.getElementById("btnGemini");


/*=====================================================
MODAL CONFIRMAÇÃO
=====================================================*/

const modalConfirmar = document.getElementById("modalConfirmar");

const textoConfirmacao = document.getElementById("textoConfirmacao");

const btnSim = document.getElementById("btnSim");
const btnNao = document.getElementById("btnNao");

let acaoConfirmada = null;
let indiceEdicaoPrompt = -1;
let indiceEdicaoServico = -1;

function abrirConfirmacao(texto, acao){

    textoConfirmacao.innerHTML = texto;

    acaoConfirmada = acao;

    modalConfirmar.style.display = "flex";

}

btnNao.onclick = function(){

    modalConfirmar.style.display = "none";

    acaoConfirmada = null;

}

btnSim.onclick = function(){

    modalConfirmar.style.display = "none";

    if(acaoConfirmada){

        acaoConfirmada();

    }

}

function selecionarPrioridade(nivel){

    prioridadeSelecionada = nivel;

    btnAlta.classList.remove("ativa");
    btnMedia.classList.remove("ativa");
    btnBaixa.classList.remove("ativa");

    if(nivel=="A") btnAlta.classList.add("ativa");
    if(nivel=="M") btnMedia.classList.add("ativa");
    if(nivel=="B") btnBaixa.classList.add("ativa");

}

btnAlta.onclick = () => selecionarPrioridade("A");

btnMedia.onclick = () => selecionarPrioridade("M");

btnBaixa.onclick = () => selecionarPrioridade("B");


function abrirNovoCadastro(){

    if(categoriaAtual === "Prompts"){

        novoPrompt();

    }else if(categoriaAtual === "Serviços"){

        novoServico();

    }else{

        novaAnotacao();

    }

}


/*=====================================================
  NOVA ANOTAÇÃO
=====================================================*/

function novaAnotacao(){

    txtTitulo.value = "";
    txtDescricao.value = "";

    chkFavorito.checked = false;
   selecionarPrioridade("M");
    chkData.checked = false;

    txtData.value = "";

    areaData.style.display = "none";

    modalNova.style.display = "flex";

    txtTitulo.focus();

}



chkData.onchange = function(){

    areaData.style.display =
        this.checked ? "block" : "none";

};


btnCancelar.onclick = function(){

    modalNova.style.display = "none";

};



btnSalvarModal.onclick = async function(){

    if(txtTitulo.value.trim()==""){

        alert("Informe um título.");

        txtTitulo.focus();

        return;

    }

    const agora = new Date();

banco[categoriaAtual].push({

    titulo:txtTitulo.value.trim(),

    descricao:txtDescricao.value.trim(),

    data:agora.toLocaleString("pt-BR"),

    timestamp: Date.now(),

    favorito:chkFavorito.checked,

    prioridade: prioridadeSelecionada,

    tag:"",

    vencimento:chkData.checked ? txtData.value : "",

    fixado:false

});



    await salvarBanco();

    modalNova.style.display="none";

    renderizar();

};

const botaoNova=document.querySelector(".novo");

if(botaoNova){
    botaoNova.onclick=abrirNovoCadastro;
}

/*=====================================================
  EDITAR
=====================================================*/

async function editarCartao(categoria,indice){

    let cartao=banco[categoria][indice];

    let titulo=prompt("Título:",cartao.titulo);

    if(titulo===null) return;

    let descricao=prompt("Descrição:",cartao.descricao);

    if(descricao===null) return;

    cartao.titulo=titulo;

    cartao.descricao=descricao;

    await salvarBanco();

    renderizar();

}
/*=====================================================
  FAVORITAR
=====================================================*/

async function favoritar(categoria,indice){

    banco[categoria][indice].favorito=
    !banco[categoria][indice].favorito;

    await salvarBanco();

    renderizar();

}
/*=====================================================
  CONCLUIR
=====================================================*/

async function concluir(categoria, indice){

    let cartao = banco[categoria][indice];

    banco[categoria].splice(indice,1);

    banco["Concluídos"].push(cartao);

    await salvarBanco();

    renderizar();

    mostrarMensagemConclusao();

}
/*=====================================================
  RESTAURAR
=====================================================*/

 async function restaurar(indice){

    const cartao = banco["Concluídos"][indice];

    banco["Concluídos"].splice(indice,1);

    banco["Pendências"].push(cartao);

    await salvarBanco();

    renderizar();

}



/*=====================================================
  EXCLUIR
=====================================================*/
async function excluir(indice){

    if(!confirm("Deseja realmente excluir esta anotação?"))
        return;

    banco[categoriaAtual].splice(indice,1);

    await salvarBanco();

    renderizar();

}


const pesquisa=document.getElementById("pesquisa");

if(pesquisa){

    pesquisa.addEventListener("keyup",renderizar);

}


/*=========================================
BOTÕES DA INTERFACE
=========================================*/

document.getElementById("btnNova").onclick = abrirNovoCadastro;

document.getElementById("btnNova2").onclick = abrirNovoCadastro;

document.getElementById("btnFavoritos").onclick = function(){

    categoriaAtual = "Favoritos";

    document.querySelectorAll(".sidebar li")
        .forEach(li => li.classList.remove("ativo"));

    document
    .querySelector('.sidebar li[data-categoria="Favoritos"]')
    .classList.add("ativo");

    renderizar();

};



/*=========================
MENU MOBILE
=========================*/

const btnMenu = document.getElementById("btnMenu");

if(btnMenu){

    btnMenu.onclick=function(e){

        e.stopPropagation();

        document
        .querySelector(".sidebar")
        .classList.toggle("aberto");

    }

}

// Fecha ao tocar fora do menu
document.addEventListener("click",function(e){

    if(window.innerWidth > 900) return;

    const menu=document.querySelector(".sidebar");

    if(
        menu.classList.contains("aberto") &&
        !menu.contains(e.target) &&
        e.target.id!="btnMenu" &&
        !e.target.closest("#btnMenu")
    ){

        menu.classList.remove("aberto");

    }

});


function mostrarMensagemConclusao(){

    const msg = document.createElement("div");

    msg.className = "mensagem-sucesso";

    msg.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        Parabéns! Mais uma tarefa concluída com sucesso.
    `;

    document.body.appendChild(msg);

    setTimeout(()=>{
        msg.classList.add("mostrar");
    },10);

    setTimeout(()=>{
        msg.classList.remove("mostrar");

        setTimeout(()=>{
            msg.remove();
        },400);

    },2500);

}


function mostrarMensagemPropaganda(){

    const msg = document.createElement("div");

    msg.className = "mensagem-sucesso";

    msg.innerHTML = `
        <i class="fa-solid fa-bullhorn"></i>
        Propaganda concluída com sucesso!
    `;

    document.body.appendChild(msg);

    setTimeout(()=>{
        msg.classList.add("mostrar");
    },10);

    setTimeout(()=>{
        msg.classList.remove("mostrar");

        setTimeout(()=>{
            msg.remove();
        },400);

    },2000);

}


function mostrarMensagemPropagandaReset(){

    const msg = document.createElement("div");

    msg.className = "mensagem-sucesso";

    msg.innerHTML = `
        <i class="fa-solid fa-flask"></i>
        Modo desenvolvedor: propagandas resetadas.
    `;

    document.body.appendChild(msg);

    setTimeout(()=>{

        msg.classList.add("mostrar");

    },10);

    setTimeout(()=>{

        msg.classList.remove("mostrar");

        setTimeout(()=>{

            msg.remove();

        },400);

    },2000);

}


function mostrarMensagemSalva(){

    const msg = document.createElement("div");

    msg.className = "mensagem-sucesso";

    msg.innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Anotações salvas com sucesso.
    `;

    document.body.appendChild(msg);

    setTimeout(()=>{
        msg.classList.add("mostrar");
    },10);

    setTimeout(()=>{
        msg.classList.remove("mostrar");

        setTimeout(()=>{
            msg.remove();
        },400);

    },1800);

}

/*=====================================================
EXCLUIR PROMPT
=====================================================*/

async function excluirPrompt(indice){

    abrirConfirmacao(

        "Deseja realmente excluir este Prompt?",

        async function(){

            banco["Prompts"].splice(indice,1);

            await salvarBanco();

            renderizar();

        }

    );

}


async function excluirServico(indice){

    abrirConfirmacao(

        "Deseja realmente excluir este serviço?",

        async function(){

            banco["Serviços"].splice(indice,1);

            await salvarBanco();

            renderizar();

        }

    );

}


function obterServicosDoDia(){

    if(banco["Serviços"].length === 0){

        return [];

    }

    let ativos = banco["Serviços"].filter(servico=>

        servico.status === "Ativo" &&

        servico.divulgadoNoCiclo === false

    );

    if(ativos.length === 0){

        banco["Serviços"].forEach(servico=>{

            servico.divulgadoNoCiclo = false;

        });

        ativos = banco["Serviços"].filter(servico=>

            servico.status === "Ativo"

        );

    }

    ativos.sort(()=>Math.random()-0.5);

    return ativos.slice(0,2);

}

async function prepararNovoDia(){

    const hoje = new Date().toLocaleDateString("pt-BR");

    if(banco.Configuracoes.metaDiariaConcluida === undefined){

    banco.Configuracoes.metaDiariaConcluida = false;

}

    // Já preparou as propagandas de hoje?
    
   
    
if(banco.Configuracoes.dataPropaganda === hoje){

    if(banco.Configuracoes.metaDiariaConcluida){

        return;

    }

    const existeMetaHoje = banco["Serviços"].some(servico => servico.metaHoje);

    if(existeMetaHoje){

        return;

    }

}
    // Limpa as propagandas do dia anterior
    banco["Serviços"].forEach(servico=>{

        servico.metaHoje = false;

    });

    // Serviços disponíveis
    let disponiveis = banco["Serviços"].filter(servico=>

        servico.status === "Ativo" &&
        servico.divulgadoNoCiclo === false

    );

    // Terminou o ciclo?
    if(disponiveis.length === 0){

        banco["Serviços"].forEach(servico=>{

            servico.divulgadoNoCiclo = false;

        });

        disponiveis = banco["Serviços"].filter(servico=>

            servico.status === "Ativo"

        );

    }

    // Embaralha
    disponiveis.sort(() => Math.random() - 0.5);

    // Marca até 2 propagandas
    disponiveis.slice(0,2).forEach(servico=>{

        servico.metaHoje = true;

    });

    banco.Configuracoes.dataPropaganda = hoje;
    banco.Configuracoes.metaDiariaConcluida = false;

    await salvarBanco();

}

function abrirHomeCategoria(categoria){

    categoriaAtual = categoria;

    document
        .querySelectorAll(".sidebar li")
        .forEach(li=>li.classList.remove("ativo"));

    const menu = document.querySelector(
        `.sidebar li[data-categoria="${categoria}"]`
    );

    if(menu){

        menu.classList.add("ativo");

    }

    renderizar();

}

window.abrirHomeCategoria = abrirHomeCategoria;


window.favoritar = favoritar;
window.concluir = concluir;
window.editarCartao = editarCartao;
window.restaurar = restaurar;
window.excluir = excluir;
window.alterarContador = alterarContador;
window.alterarManual = alterarManual;

window.excluirPrompt = excluirPrompt;
window.editarPrompt = editarPrompt;
window.gerarPrompt = gerarPrompt;
window.excluirServico = excluirServico;
window.editarServico = editarServico;
window.abrirPromptServico = abrirPromptServico;
window.concluirPropaganda = concluirPropaganda;


document.addEventListener("keydown", async function(e){

    if(e.key === "F9"){

        e.preventDefault();

        if(!confirm("Resetar as propagandas do dia?")){

            return;

        }

        banco.Configuracoes.dataPropaganda = "";

        banco.Configuracoes.metaDiariaConcluida = false;

        banco["Serviços"].forEach(servico=>{

            servico.metaHoje = false;

            servico.divulgadoNoCiclo = false;

        });

        await salvarBanco();

        renderizar();

        mostrarMensagemPropagandaReset();

    }

});


document.addEventListener("keydown", async function(e){

    if(e.key === "F10"){

        e.preventDefault();

        banco.ContadorImpressoes.data = "01/01/2000";

        await salvarBanco();

        await prepararNovoDiaImpressoes();

        desenharContadorImpressoes();

        alert("Virada do dia simulada!");

    }

});

function novoPrompt(){

    indiceEdicaoPrompt = -1;

    txtTituloPrompt.value = "";

    txtPrompt.value = "";

    document.querySelector(".cabecalhoPrompt h2").innerHTML = "Novo Prompt";

    modalPrompt.style.display = "flex";

    txtTituloPrompt.focus();

}



function novoServico(){

    indiceEdicaoServico = -1;
    document.querySelector("#modalServico h2").innerHTML = `
        <i class="fa-solid fa-briefcase"></i>
        Novo Serviço
    `;

    document.getElementById("txtNomeServico").value = "";
    document.getElementById("txtDescricaoServico").value = "";

    document.getElementById("cmbPromptServico").selectedIndex = 0;

    document.querySelector(
        'input[name="statusServico"][value="Ativo"]'
    ).checked = true;

carregarPromptsServico();

    document.getElementById("modalServico").style.display = "flex";

    document.getElementById("txtNomeServico").focus();

}




function editarServico(indice){

    indiceEdicaoServico = indice;

    const servico = banco["Serviços"][indice];

    txtNomeServico.value = servico.nome;

    txtDescricaoServico.value = servico.descricao;

    carregarPromptsServico();

    // Seleciona o Prompt correspondente
    for(let i = 0; i < cmbPromptServico.options.length; i++){

        if(cmbPromptServico.options[i].text === servico.prompt){

            cmbPromptServico.selectedIndex = i;
            break;

        }

    }

    document.querySelector(
        `input[name="statusServico"][value="${servico.status}"]`
    ).checked = true;

    document.querySelector("#modalServico h2").innerHTML = `
        <i class="fa-solid fa-briefcase"></i>
        Editar Serviço
    `;

    modalServico.style.display = "flex";

    txtNomeServico.focus();

}



function carregarPromptsServico(){

    const combo = document.getElementById("cmbPromptServico");

    combo.innerHTML =
        '<option value="">Selecione um Prompt...</option>';

    banco["Prompts"].forEach((prompt, indice)=>{

        const opcao = document.createElement("option");

        opcao.value = indice;

        opcao.textContent = prompt.titulo;

        combo.appendChild(opcao);

    });

}



function editarPrompt(indice){

    indiceEdicaoPrompt = indice;

    txtTituloPrompt.value = banco["Prompts"][indice].titulo;

    txtPrompt.value = banco["Prompts"][indice].prompt;

    document.querySelector(".cabecalhoPrompt h2").innerHTML = "Editar Prompt";

    modalPrompt.style.display = "flex";

    txtTituloPrompt.focus();

}


function gerarPrompt(indice){

    const prompt = banco["Prompts"][indice];

    txtTituloGerado.value = prompt.titulo;

    txtPromptGerado.value = prompt.prompt;

    modalGerarPrompt.style.display = "flex";

}


btnCopiarPrompt.onclick = async function(){

    try{

        await navigator.clipboard.writeText(
            txtPromptGerado.value
        );

        alert("✅ Prompt copiado com sucesso!");

    }catch{

        alert("Não foi possível copiar o Prompt.");

    }

}



btnChatGPT.onclick = async function(){

    try{

        await navigator.clipboard.writeText(
            txtPromptGerado.value
        );

        window.open(
            "https://chatgpt.com/",
            "_blank"
        );

    }catch{

        alert("Não foi possível abrir o ChatGPT.");

    }

}


btnGemini.onclick = async function(){

    try{

        await navigator.clipboard.writeText(
            txtPromptGerado.value
        );

        window.open(
            "https://gemini.google.com/",
            "_blank"
        );

    }catch{

        alert("Não foi possível abrir o Gemini.");

    }

}

btnFecharGerado.onclick = function(){

    modalGerarPrompt.style.display = "none";

}


btnCancelarPrompt.onclick = function(){

    modalPrompt.style.display = "none";

}

btnSalvarPrompt.onclick = async function(){

    if(txtTituloPrompt.value.trim() == ""){

        alert("Informe um título.");
        txtTituloPrompt.focus();
        return;

    }

    if(indiceEdicaoPrompt == -1){

        const agora = new Date();

        banco["Prompts"].push({

            titulo: txtTituloPrompt.value.trim(),
            prompt: txtPrompt.value.trim(),
            data: agora.toLocaleString("pt-BR"),
            timestamp: Date.now()

        });

    }else{

        banco["Prompts"][indiceEdicaoPrompt].titulo =
            txtTituloPrompt.value.trim();

        banco["Prompts"][indiceEdicaoPrompt].prompt =
            txtPrompt.value.trim();

    }

    await salvarBanco();

    modalPrompt.style.display = "none";

    renderizar();

}


btnCancelarServico.onclick = function(){

    modalServico.style.display = "none";

}

btnSalvarServico.onclick = async function(){

    if(txtNomeServico.value.trim() == ""){

        alert("Informe o nome do serviço.");
        txtNomeServico.focus();
        return;

    }

    const dadosServico = {

        id: indiceEdicaoServico == -1
            ? Date.now()
            : banco["Serviços"][indiceEdicaoServico].id,

        nome: txtNomeServico.value.trim(),

        descricao: txtDescricaoServico.value.trim(),

        prompt: banco["Prompts"][cmbPromptServico.value]?.titulo || "",

        status: document.querySelector(
            'input[name="statusServico"]:checked'
        ).value,
		
		
		ultimaPropaganda: "",

		divulgadoNoCiclo: false,
		
		metaHoje: false,

		totalDivulgacoes: 0,

        data: new Date().toLocaleString("pt-BR"),

        timestamp: Date.now()

    };

    if(indiceEdicaoServico == -1){

        banco["Serviços"].push(dadosServico);

    }else{

        banco["Serviços"][indiceEdicaoServico] = dadosServico;

    }

    await salvarBanco();

    indiceEdicaoServico = -1;

    modalServico.style.display = "none";

    renderizar();

}

async function prepararNovoDiaImpressoes(){

    const hoje = new Date().toLocaleDateString("pt-BR");

    // Ainda é o mesmo dia
    if(banco.ContadorImpressoes.data === hoje){
        return;
    }

    // Soma o dia aos acumulados gerais
    banco.ContadorImpressoes.totalPB += banco.ContadorImpressoes.pb;

    banco.ContadorImpressoes.totalColorida +=
        banco.ContadorImpressoes.colorida;

    banco.ContadorImpressoes.totalImpressoes +=
        banco.ContadorImpressoes.total;

    banco.ContadorImpressoes.valorTotal +=
        banco.ContadorImpressoes.valor;

    // Zera o contador diário
    banco.ContadorImpressoes.pb = 0;
    banco.ContadorImpressoes.colorida = 0;
    banco.ContadorImpressoes.total = 0;
    banco.ContadorImpressoes.valor = 0;

    // Atualiza a data
    banco.ContadorImpressoes.data = hoje;

    await salvarBanco();

}


function desenharContadorImpressoes(){

    document.getElementById("contadorImpressoes").innerHTML = `

    <div class="contadorPainel">

        <h2 class="tituloContador">
            🖨️ Contador de Impressões
        </h2>

        <p class="subtituloContador">
            Controle diário das impressões realizadas
        </p>


        <div class="cardContador">

            <h3>💲 Preços</h3>

            <div class="linhaCampo">

                <label>Preto e Branco</label>

                <input
                    type="number"
                    id="precoPB"
                    step="0.01"
                    value="${banco.ContadorImpressoes.precoPB}"
                    onchange="salvarPrecos()">

            </div>

            <div class="linhaCampo">

                <label>Colorida</label>

                <input
                    type="number"
                    id="precoColorida"
                    step="0.01"
                    value="${banco.ContadorImpressoes.precoColorida}"
                    onchange="salvarPrecos()">

            </div>

        </div>


        <div class="cardContador">

            <h3>🖨 Impressões</h3>

            <div class="contadorLinhaNova">

                <span>Preto e Branco</span>

                <button onclick="alterarContador('pb',-1)">−</button>

                <input
                    id="qtdPB"
                    type="number"
                    value="${banco.ContadorImpressoes.pb}"
                    onchange="alterarManual('pb')">

                <button onclick="alterarContador('pb',1)">+</button>

            </div>

            <div class="contadorLinhaNova">

                <span>Coloridas</span>

                <button onclick="alterarContador('colorida',-1)">−</button>

                <input
                    id="qtdColorida"
                    type="number"
                    value="${banco.ContadorImpressoes.colorida}"
                    onchange="alterarManual('colorida')">

                <button onclick="alterarContador('colorida',1)">+</button>

            </div>

        </div>


        <div class="cardContador">

            <h3>📅 Hoje</h3>

            <div class="linhaResumo">

                <span>Impressões</span>

                <strong id="totalImpressoes">
                    ${banco.ContadorImpressoes.total}
                </strong>

            </div>

            <div class="linhaResumo">

                <span>Arrecadado</span>

                <strong id="valorTotal">

                    ${banco.ContadorImpressoes.valor.toLocaleString("pt-BR",{
                        style:"currency",
                        currency:"BRL"
                    })}

                </strong>

            </div>

        </div>


        <div class="cardContador">

            <h3>📊 Estatísticas Gerais</h3>

            <div class="linhaResumo">

                <span>Total PB</span>

                <strong>
                    ${banco.ContadorImpressoes.totalPB}
                </strong>

            </div>

            <div class="linhaResumo">

                <span>Total Coloridas</span>

                <strong>
                    ${banco.ContadorImpressoes.totalColorida}
                </strong>

            </div>

            <div class="linhaResumo">

                <span>Total Impressões</span>

                <strong>
                    ${banco.ContadorImpressoes.totalImpressoes}
                </strong>

            </div>

            <div class="linhaResumo">

                <span>Valor Arrecadado</span>

                <strong>

                    ${banco.ContadorImpressoes.valorTotal.toLocaleString("pt-BR",{
                        style:"currency",
                        currency:"BRL"
                    })}

                </strong>

            </div>

        </div>

    </div>

    `;
}

function atualizarResumoImpressoes(){

    document.getElementById("qtdPB").value =
        banco.ContadorImpressoes.pb;

    document.getElementById("qtdColorida").value =
        banco.ContadorImpressoes.colorida;

    const total =
        banco.ContadorImpressoes.pb +
        banco.ContadorImpressoes.colorida;

    const valor =
        (banco.ContadorImpressoes.pb * banco.ContadorImpressoes.precoPB) +
        (banco.ContadorImpressoes.colorida * banco.ContadorImpressoes.precoColorida);

    document.getElementById("totalImpressoes").innerHTML = total;

   document.getElementById("valorTotal").innerHTML =
    valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

async function alterarManual(tipo){

    // Atualiza os preços
    banco.ContadorImpressoes.precoPB =
        Number(document.getElementById("precoPB").value) || 0;

    banco.ContadorImpressoes.precoColorida =
        Number(document.getElementById("precoColorida").value) || 0;

    // Atualiza a quantidade digitada
    if(tipo === "pb"){

        banco.ContadorImpressoes.pb =
            Number(document.getElementById("qtdPB").value) || 0;

    }else{

        banco.ContadorImpressoes.colorida =
            Number(document.getElementById("qtdColorida").value) || 0;

    }

    // Recalcula os totais
    banco.ContadorImpressoes.total =
        banco.ContadorImpressoes.pb +
        banco.ContadorImpressoes.colorida;

    banco.ContadorImpressoes.valor =
        (banco.ContadorImpressoes.pb * banco.ContadorImpressoes.precoPB) +
        (banco.ContadorImpressoes.colorida * banco.ContadorImpressoes.precoColorida);

    await salvarBanco();

    desenharContadorImpressoes();

}


async function salvarPrecos() {

    banco.ContadorImpressoes.precoPB =
        Number(document.getElementById("precoPB").value) || 0;

    banco.ContadorImpressoes.precoColorida =
        Number(document.getElementById("precoColorida").value) || 0;

    await salvarBanco();

}
async function alterarContador(tipo, valor){

    // Atualiza os preços digitados na tela
    banco.ContadorImpressoes.precoPB =
        Number(document.getElementById("precoPB").value) || 0;

    banco.ContadorImpressoes.precoColorida =
        Number(document.getElementById("precoColorida").value) || 0;

    // Atualiza os contadores
    if(tipo === "pb"){

        banco.ContadorImpressoes.pb += valor;

        if(banco.ContadorImpressoes.pb < 0){
            banco.ContadorImpressoes.pb = 0;
        }

    }

    if(tipo === "colorida"){

        banco.ContadorImpressoes.colorida += valor;

        if(banco.ContadorImpressoes.colorida < 0){
            banco.ContadorImpressoes.colorida = 0;
        }

    }

    // Recalcula os totais
    banco.ContadorImpressoes.total =
        banco.ContadorImpressoes.pb +
        banco.ContadorImpressoes.colorida;

    banco.ContadorImpressoes.valor =
        (banco.ContadorImpressoes.pb * banco.ContadorImpressoes.precoPB) +
        (banco.ContadorImpressoes.colorida * banco.ContadorImpressoes.precoColorida);

    await salvarBanco();

    desenharContadorImpressoes();

}