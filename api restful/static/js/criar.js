document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('enviar').addEventListener('click', async function(e) {   
        e.preventDefault();
        const nome = document.getElementById('inome').value.trim();
        const altura = document.getElementById('ialtura').value.trim();
        const nacionalidade = document.getElementById('inacionalidade').value.trim();
        const nascimento = document.getElementById('inascimento').value.trim();
        const peso = document.getElementById('ipeso').value.trim();
        const prof = document.getElementById('iprof').value.trim();
        const sexo = document.getElementById('isexo').value.trim();
        const cursoPreferido = document.getElementById('icursopreferido').value.trim();
        const sucesso = await criarAluno(nome, altura, nacionalidade, nascimento, peso, prof, sexo, cursoPreferido);
        if (sucesso) {
            window.location.href = 'index.html';
        };
    });
});

async function criarAluno(nome, altura, nacionalidade, nascimento, peso, prof, sexo, cursopreferido) {
    try {
        const resp = await fetch('http://127.0.0.1:5000/api', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome:nome,
                altura:altura,
                nacionalidade:nacionalidade,
                nascimento:nascimento,
                peso:peso,
                prof:prof,
                sexo:sexo,
                cursopreferido:cursopreferido
            })
            });
            if (!resp.ok) {
            const erro = await resp.json().catch(() => ({}));
            throw new Error(erro.message || `erro: ${resp.status}: ${resp.statusText}`);
            };
            const resultado = await resp.json();
            console.log('resposta da API: ', resultado);
            return true;
        } catch (erro) {
            console.log(`erro ao criar aluno: ${erro}`);
            console.log(`mensagem de erro: ${erro.message}`);
            return false;
        };
    };

