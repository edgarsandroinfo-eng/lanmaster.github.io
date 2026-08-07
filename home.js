export function desenharInicio(banco){

    const cards = document.getElementById("cards");
    const bloco = document.getElementById("blocoNotas");

    bloco.style.display = "none";
    cards.style.display = "grid";

    const propagandas = banco["Serviços"].filter(s => s.metaHoje);


const totalServicos = banco["Serviços"]
    .filter(s => s.status === "Ativo").length;

const divulgados = banco["Serviços"]
    .filter(s => s.status === "Ativo" && s.divulgadoNoCiclo).length;

const larguraBarra =
    totalServicos === 0
        ? 0
        : (divulgados / totalServicos) * 100;


    cards.innerHTML = `

        <div class="homeTopo">

            <h2>👋 Bem-vindo, Edgar!</h2>

            <p>Sistema de Anotações da Lan Master</p>

        </div>

        <div class="homePropagandas">

            <h3>📢 PROPAGANDAS DE HOJE</h3>

            <div class="progressoPropaganda">

    <div
        class="barraPropaganda"
        style="width:${larguraBarra}%">
    </div>

</div>

            ${
                propagandas.length === 0
                ?
                `<div class="itemPropaganda vazio">

                    Todas as propagandas de hoje foram concluídas.

                </div>`
                :
                propagandas.map(servico=>`

                    <div class="itemPropaganda">

                        <div>

                            <strong>${servico.nome}</strong>

                            <br>

                            <small>${servico.descricao}</small>

                        </div>

                        <button onclick="concluirPropaganda(${servico.id})">

                            Concluir

                        </button>

                    </div>

                `).join("")
            }

        </div>

        <div class="card homeMini"
     onclick="abrirHomeCategoria('Pendências')">

            <h3>📋 Pendências</h3>

            <span>${banco["Pendências"].length}</span>

        </div>

        <div class="card homeMini"
     onclick="abrirHomeCategoria('Serviços')">

            <h3>🛠 Serviços</h3>

            <span>${banco["Serviços"].length}</span>

        </div>

    `;

}