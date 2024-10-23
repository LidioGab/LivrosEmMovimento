document.getElementById('enviarButton').addEventListener('click', async () => {
    // Capturando os valores dos campos do formulário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem').value;

    // Validando se os campos obrigatórios estão preenchidos
    if (!nome || !email || !mensagem) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const data = {
        nome: nome,
        email: email,
        mensagem: mensagem,
    };

    try {
        const response = await fetch('http://localhost:3000/contato', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Verificando a resposta
        if (response.ok) {
            const result = await response.json();
            alert(result.message); 
            // Limpa os campos após o envio
            document.getElementById('nome').value = '';
            document.getElementById('email').value = '';
            document.getElementById('mensagem').value = '';
        } else {
            const error = await response.json();
            alert(error.error); // Exibe mensagem de erro
        }
    } catch (error) {
        console.error('Erro ao enviar a solicitação:', error);
        alert('Falha ao enviar a mensagem. Tente novamente mais tarde.');
    }
});
