document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const alunoID = urlParams.get('id');
    const alunoNome = urlParams.get('nome');
    console.log(`editando aluno: ${alunoNome} (id: ${alunoID})`);
    if (!alunoID) {
        alert('Aluno não encontrado!');
        window.location.href = 'index.html';
        return;
    }; 
    document.querySelector('.enviar').addEventListener('click', async function(e) {
        console.log('botão encontrado?', document.querySelector('.enviar'));
        e.preventDefault();
        const campoSelecionado = document.querySelector('input[name="campo"]:checked');
        if (!campoSelecionado) {
            alert('Selecione um campo para editar!');
            return;
        };
        const novoValor = document.getElementById('novo-valor').value.trim();
        if (!novoValor) {
            alert('Digite o novo valor!');
            return;
        };
        const campo = campoSelecionado.value;
        const sucesso = await editarCampo(alunoID, campo, novoValor);
        if (sucesso) {
            window.location.href = 'index.html';
        };
    });
});
async function editarCampo(id, campo, novoValor) {
    try {
        const resp = await fetch(`http://127.0.0.1:5000/api/${id}/${campo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                [campo]: novoValor
            })
        });
        if (!resp.ok) {
            const erro = await resp.json().catch(() => ({}));
            throw new Error(erro.message || `erro: ${resp.status}: ${resp.statusText}`);
        };
        const resultado = await resp.json();
        console.log('resposta da API: ', resultado);
        console.log(`campo ${campo} do aluno ${id} editado com sucesso!`);
        return true;
    } catch (erro) {
        console.log(`erro ao editar. ${erro}`);
        alert(`Falha ao editar: ${erro.message}`);
        return false;
    };
};
