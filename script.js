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
    "Notas",
    "Clientes",
    "VBA",
    "Investimentos",
    "Marketing",
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

/*=====================================================
  RENDERIZAÇÃO
=====================================================*/

function renderizar(){

    atualizarTitulo();

    atualizarResumo();

    desenharCards();

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

        "Notas":"fa-note-sticky",

        "Clientes":"fa-address-book",

        "VBA":"fa-code",

        "Investimentos":"fa-chart-line",

        "Marketing":"fa-bullhorn",

        "Compras":"fa-cart-shopping",

        "Favoritos":"fa-star",

        "Concluídos":"fa-circle-check"

    };

    const textos={

        "Pendências":"Suas tarefas e lembretes do dia.",

        "Notas":"Anotações rápidas.",

        "Clientes":"Cadastro de clientes.",

        "VBA":"Ideias de Programação.",

        "Investimentos":"Controle de investimentos.",

        "Marketing":"Ideias e campanhas.",

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

        banco["Notas"].length

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

    botaoNova.onclick=novaAnotacao;

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

async function concluir(categoria,indice){

    let cartao=banco[categoria][indice];

    banco[categoria].splice(indice,1);

    banco["Concluídos"].push(cartao);

    await salvarBanco();

    renderizar();

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

document.getElementById("btnNova").onclick = novaAnotacao;

document.getElementById("btnNova2").onclick = novaAnotacao;

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


window.favoritar = favoritar;
window.concluir = concluir;
window.editarCartao = editarCartao;
window.restaurar = restaurar;
window.excluir = excluir;