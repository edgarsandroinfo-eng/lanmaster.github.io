export function desenharInicio(banco){

    const cards = document.getElementById("cards");
    const bloco = document.getElementById("blocoNotas");

    bloco.style.display = "none";
    cards.style.display = "block";

    const hoje = new Date();

    const data = hoje.toLocaleDateString("pt-BR",{
        weekday:"long",
        day:"2-digit",
        month:"long",
        year:"numeric"
    });

    const propagandasHoje = banco.Configuracoes.propagandasHoje || [];

    const total = propagandasHoje.length;

    const concluidas = propagandasHoje.filter(p => p.concluido).length;

    const porcentagem = total > 0
        ? Math.round((concluidas / total) * 100)
        : 0;

    cards.innerHTML = `

        <div class="homeCabecalho">

            <h2>👋 Olá, Edgar!</h2>

            <p>Bem-vindo ao Sistema da Lan Master.</p>

            <span>${data}</span>

        </div>

        <div class="homeCard">

            <h3>📢 PROPAGANDAS DO DIA</h3>

            <div class="barraProgresso">

                <div class="barraPreenchida" style="width:${porcentagem}%"></div>

            </div>

            <p class="textoProgresso">

                ${concluidas} de ${total} concluídas

            </p>

            <span class="abrirCard">

                Clique para abrir →

            </span>

        </div>

    `;

}