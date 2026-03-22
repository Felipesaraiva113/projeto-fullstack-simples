const url = 'http://127.0.0.1:5000/api';
async function nomeDoAluno() {
    try {
        const resp = await fetch(url);
        const json = await resp.json();
        const div = document.getElementById('alunos');
        div.innerHTML = '';
        const lista = json.dados;
        lista.forEach((aluno) => {
        const nome =  `
            <div class="gafanhotos"  style="border: 5px solid aqua; padding: 3px; border-radius: 8px; width: 400px; text-align: center;">
                <h2><strong>${aluno.nome}</strong></h2>
                <p>Altura: ${aluno.altura}</p>
                <p>Curso preferido: ${aluno.cursopreferido}</p>
                <p>Nacionalidade: ${aluno.nacionalidade}</p>
                <p>Nascimento: ${aluno.nascimento}</p>
                <p>Peso: ${aluno.peso}</p>
                <p>Profissão: ${aluno.prof}</p>
                <p>Sexo: ${aluno.sexo}</p>
            </div>
            <div class="botoes">
            <p data-id = "${aluno.id}"><a href="editar.html?id=${aluno.id}&nome=${encodeURIComponent(aluno.nome)}">Editar</a></p>
            <p class="deletar" data-id = "${aluno.id}">Deletar</p>
            </div>
        `;
        div.innerHTML += nome;
        });
        configurarBotaodeDeletar();
    } catch (error) {
        console.error(`Erro: ${error}`);
    }
};
function configurarBotaodeDeletar() {
    const botaoDeletar = document.querySelectorAll('p.deletar');
    botaoDeletar.forEach(botao => {
        botao.addEventListener('click', async function() {
            const id = this.getAttribute('data-id');
            console.log(`Clicou para deletar o aluno ID: ${id}`);
            await deletarAluno(id);
            nomeDoAluno();
        });
});
};
nomeDoAluno();
async function deletarAluno(id) {
    try {
        const resp = await fetch(`http://127.0.0.1:5000/api/${id}`, {
            method: 'DELETE', 
        });
        if (!resp.ok) {
            throw new Error(`erro: ${resp.status}: ${resp.statusText}`);
        }
        console.log(`Aluno ${id} deletado com sucesso!`);
        await nomeDoAluno();
    } catch (erro) {
        console.error('Erro ao excluir.', erro);
    };
};     
        
