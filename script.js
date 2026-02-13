const lista = document.getElementById("lista");
const mediaGeralDiv = document.getElementById("mediaGeral");
const recomendacaoDiv = document.getElementById("recomendacao");

let materias = JSON.parse(localStorage.getItem("materias")) || [];

document.getElementById("adicionar")
    .addEventListener("click", adicionarMateria);

function salvar() {
    localStorage.setItem("materias", JSON.stringify(materias));
}

function normalizar(texto) {
    return texto
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function adicionarMateria() {

    const nome = document.getElementById("materiaNome").value.trim();
    const n1 = parseFloat(document.getElementById("nota 1 trimestre").value);
    const n2 = parseFloat(document.getElementById("nota 2 trimestre").value);
    const n3 = parseFloat(document.getElementById("nota 3 trimestre").value);

    if (!nome || isNaN(n1) || isNaN(n2) || isNaN(n3)) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const media = (n1 + n2 + n3) / 3;

    materias.push({ nome, media });

    salvar();
    renderizar();

    document.getElementById("materiaNome").value = "";
    document.getElementById("nota 1 trimestre").value = "";
    document.getElementById("nota 2 trimestre").value = "";
    document.getElementById("nota 3 trimestre").value = "";
}

function removerMateria(index) {
    materias.splice(index, 1);
    salvar();
    renderizar();
}

function editarMateria(index) {

    const novaNota = prompt("Digite nova média:");

    if (!isNaN(novaNota)) {
        materias[index].media = parseFloat(novaNota);
        salvar();
        renderizar();
    }
}

function calcularMediaGeral() {

    if (materias.length === 0) {
        mediaGeralDiv.textContent = "0";
        return;
    }

    const soma = materias.reduce((acc, mat) => acc + mat.media, 0);
    const mediaGeral = (soma / materias.length).toFixed(1);

    mediaGeralDiv.textContent = mediaGeral;
}

function recomendarEstudo() {

    if (materias.length === 0) {
        recomendacaoDiv.textContent = "";
        return;
    }

    const pior = materias.reduce((a, b) => a.media < b.media ? a : b);

    const links = {
        matematica: "https://www.todamateria.com.br/matematica/",
        portugues: "https://www.todamateria.com.br/portugues/",
        historia: "https://www.todamateria.com.br/historia/",
        geografia: "https://www.todamateria.com.br/geografia/",
        biologia: "https://www.todamateria.com.br/biologia/",
        quimica: "https://www.todamateria.com.br/quimica/",
        fisica: "https://www.todamateria.com.br/fisica/",
        ingles: "https://www.todamateria.com.br/ingles/"
    };

    const chave = normalizar(pior.nome);

    if (links[chave]) {
        recomendacaoDiv.innerHTML = `
            Você deve reforçar <strong>${pior.nome}</strong><br>
            <a href="${links[chave]}" target="_blank">
                Estudar agora
            </a>
        `;
    } else {
        recomendacaoDiv.textContent =
            `Você deve reforçar ${pior.nome}`;
    }
}

function renderizar() {

    lista.innerHTML = "";

    materias.forEach((mat, index) => {

        const status = mat.media >= 60 ? "APROVADO" : "REPROVADO";

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <strong>${mat.nome}</strong><br>
            Média: ${mat.media.toFixed(1)}<br>
            Situação: ${status}<br><br>
            <button onclick="editarMateria(${index})">Editar</button>
            <button onclick="removerMateria(${index})">Remover</button>
        `;

        lista.appendChild(card);
    });

    calcularMediaGeral();
    recomendarEstudo();
}

renderizar();
