window.onload = function () {
    const nomeInput = document.getElementById('nome');
    const cepInput = document.getElementById('cep');
    const numeroInput = document.getElementById('numero');
    const tipoInput = document.getElementById('tipo');
    const emailInput = document.getElementById('email');
    const enderecoInput = document.getElementById('endereco');
    const telefoneInput = document.getElementById('telefone');
    const dataInput = document.getElementById('data');
    const enviarButton = document.getElementById('enviar');
    const resposta = document.getElementById('resposta');
    cepInput.oninput = function () {
        let t = cepInput.value;
        const url = 'https://viacep.com.br/ws/' + t + '/json/';

        if (t.length === 8) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        enderecoInput.value = data.logradouro; // Corrigido para usar enderecoInput
                        cidade = data.localidade; 
                    } else {
                        enderecoInput.value = '';
                    }
                });
        } else {
            enderecoInput.value = '';
        }
    };

    enviarButton.onclick = function(event) {
        event.preventDefault(); 

        if(cidade != 'São Paulo') {
            resposta.value = 'infelizmente não poderemos retirar livros fora de São Paulo';
            return
        }

        // Validação dos campos obrigatórios
        if (!nomeInput.value || !cepInput.value || !numeroInput.value || !tipoInput.value || !emailInput.value || !enderecoInput.value || !telefoneInput.value || !dataInput.value) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;    
        }

        // Validação da data
        const hoje = new Date();
        const dataSelecionada = new Date(dataInput.value);

        if (dataSelecionada <= hoje) {
            alert('A data deve ser posterior ao dia de hoje.');
            return;
        }

        enviarEmail();
    };

    async function enviarEmail() {
        const formData = {
            nome: nomeInput.value,
            cep: cepInput.value,
            numero: numeroInput.value,
            tipo: tipoInput.value,
            email: emailInput.value,
            endereco: enderecoInput.value,
            telefone: telefoneInput.value,
            data: dataInput.value
        };

        try {
            const response = await fetch('http://localhost:3000/coleta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar email');
            }

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar o e-mail.');
        }
    }
};
