/* =====================================================
   LAN MASTER ANOTAÇÕES
   SCRIPT.JS
   BLOCO 1 - NÚCLEO DO SISTEMA
===================================================== */


import {
    carregarFirebase,
    salvarFirebase,
    observarFirebase
} from "./firebase-db.js";

const CATEGORIAS = [
    "Pendências",
    "Bloco de Notas",
    "Clientes",
    "VBA",
    "Investimentos",
    "Marketing",
    "Prompts",
    "Compras",
    "Favoritos",
    "Concluídos"
];


let categoriaAtual = "Pendências";

let banco = {};

/*=====================================================
  INICIALIZAÇÃO
=====================================================*/

iniciarSistema()



async function iniciarSistema(){

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

if (alterouBanco) {

    await salvarBanco();

}

    observarFirebase((novoBanco)=>{

        banco = novoBanco;

        renderizar();

    });

    atualizarRelogio();

    setInterval(atualizarRelogio,1000);

    configurarMenu();

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



function renderizar(){

    atualizarTitulo();
    atualizarResumo();
    atualizarBadges();

    const cards = document.getElementById("cards");
    const bloco = document.getElementById("blocoNotas");
    const app = document.querySelector(".app");

    if(categoriaAtual === "Bloco de Notas"){

        cards.style.display = "none";
        bloco.style.display = "block";
        app.classList.add("modo-bloco");

        desenharBlocoNotas();

    }else{

        cards.style.display = "grid";
        bloco.style.display = "none";
        app.classList.remove("modo-bloco");

        if(categoriaAtual === "Prompts"){
            desenharPrompts();
        }else{
            desenharCards();
        }

    }

}



/*=====================================================
  TÍTULO
=====================================================*/

function atualizarTitulo(){

    const titulo=document.querySelector(".titulo h1");

    const subtitulo=document.querySelector(".titulo span");

    if(!titulo) return;

    const icones={

        "Pendências":"fa-list-check",

        "Bloco de Notas":"fa-note-sticky",

        "Clientes":"fa-address-book",

        "VBA":"fa-code",

        "Investimentos":"fa-chart-line",

        "Marketing":"fa-bullhorn",
	
	"Prompts":"fa-wand-magic-sparkles",

        "Compras":"fa-cart-shopping",

        "Favoritos":"fa-star",

        "Concluídos":"fa-circle-check"

    };

    const textos={

        "Pendências":"Suas tarefas e lembretes do dia.",

        "Bloco de Notas":"Anotações rápidas.",

        "Clientes":"Cadastro de clientes.",

        "VBA":"Ideias de Programação.",

        "Investimentos":"Controle de investimentos.",

        "Marketing":"Ideias e campanhas.",

	"Prompts":"Biblioteca de prompts para geração de imagens.",

        "Compras":"Lista de compras.",

        "Favoritos":"Anotações favoritas.",

        "Concluídos":"Itens concluídos."

    };

    titulo.innerHTML=`
        <i class="fa-solid ${icones[categoriaAtual]}"></i>
        ${categoriaAtual}
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

}else{

    btnNova.style.display = "";

    if (btnNova2) btnNova2.style.display = "";

    if (pesquisa) pesquisa.style.display = "flex";

    if (subtitulo) subtitulo.style.display = "";

    if (painel) painel.style.display = "";

}

const textoBotao =
    categoriaAtual === "Prompts"
        ? "Novo Prompt"
        : "Nova Anotação";

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
        banco["Programação"].length;

    document.getElementById("badgeInvestimentos").textContent =
        banco["Investimentos"].length;

    document.getElementById("badgeMarketing").textContent =
        banco["Marketing"].length;

    document.getElementById("badgeCompras").textContent =
        banco["Compras"].length;

    document.getElementById("badgePrompts").textContent =
        banco["Prompts"].length;

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

            <p>${c.descricao}</p>

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

const lista = banco["Prompts"].filter(item =>
    item.titulo.toLowerCase().includes(filtro) ||
    item.prompt.toLowerCase().includes(filtro)
);

lista.sort((a, b) =>
    (b.timestamp || 0) - (a.timestamp || 0)
);

    if(lista.length == 0){

        area.innerHTML = `
            <div class="card">
                <h3>Nenhum prompt cadastrado.</h3>
            </div>
        `;

        return;

    }

    lista.forEach((item, indice)=>{

        area.innerHTML += `

        <div class="card">

            <h3>${item.titulo}</h3>

            <p>${item.prompt}</p>

            <div class="data">

                ${item.data}

            </div>

            <div class="acoes">

    <button onclick="gerarPrompt(${indice})">

        <i class="fa-solid fa-wand-magic-sparkles"></i>

        Gerar

    </button>

    <button onclick="editarPrompt(${indice})">

        <i class="fa-solid fa-pen"></i>

        Editar

    </button>

    <button onclick="excluirPrompt(${indice})">

        <i class="fa-solid fa-trash"></i>

        Excluir

    </button>

</div>

        `;

    });

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

}


async function salvarBlocoNotas(){

    const texto =
        document
        .getElementById("txtBlocoNotas")
        .value;

    banco["Bloco de Notas"] = [

        {
            texto: texto,
            data: new Date().toLocaleString("pt-BR"),
            timestamp: Date.now()
        }

    ];

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

window.favoritar = favoritar;
window.concluir = concluir;
window.editarCartao = editarCartao;
window.restaurar = restaurar;
window.excluir = excluir;

window.excluirPrompt = excluirPrompt;
window.editarPrompt = editarPrompt;
window.gerarPrompt = gerarPrompt;


function novoPrompt(){

    indiceEdicaoPrompt = -1;

    txtTituloPrompt.value = "";

    txtPrompt.value = "";

    document.querySelector(".cabecalhoPrompt h2").innerHTML = "Novo Prompt";

    modalPrompt.style.display = "flex";

    txtTituloPrompt.focus();

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