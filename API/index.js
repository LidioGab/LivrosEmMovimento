import cors from 'cors';
import express from 'express';  
import 'dotenv/config';
import axios from 'axios';

const endpoint = express();

endpoint.use(cors());
endpoint.use(express.json());

// Função para enviar email
const sendEmail = async (emailData) => {
    return await axios.post('https://api.mailersend.com/v1/email', emailData, {
        headers: {
            'Authorization': `Bearer ${process.env.TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
}

// Rota para enviar email sobre coleta
endpoint.post('/coleta', async (req, res) => {
    const { nome, cep, numero, tipo, email, endereco, telefone, data } = req.body; 
    let enviado = false; // Use let para poder alterar o valor

    // Validando os campos obrigatórios
    if (!nome || !email || !tipo) {
        return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios: nome, email e tipo.' });
    }

    // Estrutura do email a ser enviado ao responsável pela coleta
    const emailData = {
        from: {
            email: "MS_G3GXKg@trial-ynrw7gy2ox242k8e.mlsender.net",
            name: "Livros em Movimento"
        },
        to: [{
            email: 'livrosemmovimento26@gmail.com',
            name: nome
        }],
        subject: `Novo pedido de doação: ${tipo}`,
        text: `
            Você recebeu uma nova solicitação de doação.
            Nome: ${nome}
            CEP: ${cep}
            Número: ${numero}
            Tipo de doação: ${tipo}
            Email: ${email}
            Endereço: ${endereco}
            Telefone: ${telefone}
            Data: ${data}
        `, 
        html: `
            <p>Você recebeu uma nova solicitação de doação.</p>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>CEP:</strong> ${cep}</p>
            <p><strong>Número:</strong> ${numero}</p>
            <p><strong>Tipo de doação:</strong> ${tipo}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Endereço:</strong> ${endereco}</p>
            <p><strong>Telefone:</strong> ${telefone}</p>
            <p><strong>Data:</strong> ${data}</p>
        `
    };

    try {
        // Enviando o email usando MailerSend
        await sendEmail(emailData);
        enviado = true;

        // Estrutura do email a ser enviado ao usuário
        const userEmailData = {
            from: {
                email: "MS_G3GXKg@trial-ynrw7gy2ox242k8e.mlsender.net",
                name: "Livros em Movimento"
            },
            to: [{
                email: email,
                name: nome
            }],
            subject: `Olá ${nome}`,
            text: `Solicitação de doação enviada com sucesso.`, 
            html: `
                <h1>Sua solicitação está sendo processada, você receberá um email de confirmação em breve.</h1>
                <br>
                <p>Muito obrigado por contribuir conosco.</p>
            `
        };

        // Enviando o email ao usuário
        await sendEmail(userEmailData);
        return res.status(200).json({ message: 'Emails enviados com sucesso!' });

    } catch (error) {
        console.error('Erro ao enviar email:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Falha ao enviar o email' });
    }
});

// Rota para enviar email sobre contato
endpoint.post('/contato', async (req, res) => {
    const { nome, email, mensagem } = req.body;

    // Validando os campos obrigatórios
    if (!nome || !email || !mensagem) {
        return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios: nome, email e mensagem.' });
    }

    const emailData = {
        from: {
            email: "MS_G3GXKg@trial-ynrw7gy2ox242k8e.mlsender.net",
            name: nome
        },
        to: [{
            email: 'livrosemmovimento26@gmail.com',
            name: nome
        }],
        subject: `Solicitação de contato de: ${nome}`,
        text: `
            Você recebeu uma nova solicitação de contato.
        `, 
        html: `
            <p>Você recebeu uma nova solicitação de contato.</p>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensagem:</strong> ${mensagem}</p>
        `
    };

    try {
        // Enviando o email usando MailerSend
        await sendEmail(emailData);
        res.status(200).json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar email:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Falha ao enviar o email' });
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
endpoint.listen(PORT, () => {
    console.log(`API ONLINE NA PORTA http://localhost:${PORT}`);
});
