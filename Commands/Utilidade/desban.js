const { GuildMember } = require('discord.js');

module.exports = {
    name: 'desban',
    description: 'Remove o banimento de um usuário.',
    async run(client, message, args) {
        if (!args[0]) return message.reply('Você precisa fornecer o ID do usuário para desbanir.');

        const userId = args[0].replace(/[<@!>]/g, ''); // Extrai o ID do usuário
        const guild = message.guild;

        try {
            await guild.bans.fetch(userId); // Verifica se o usuário está banido
            await guild.members.unban(userId);

            const user = await client.users.fetch(userId);
            try {
                await user.send('Você foi desbanido do servidor **server teste**.');
            } catch {
                message.channel.send(`Não consegui enviar mensagem direta para <@${userId}>, mas o desbanimento foi realizado.`);
            }

            message.channel.send(`<@${userId}> foi desbanido com sucesso.`);
        } catch (error) {
            if (error.code === 10026) { // Código de erro para "usuário não banido"
                return message.reply('Este usuário não está banido.');
            }
            console.error(error);
            message.reply('Ocorreu um erro ao tentar desbanir o usuário.');
        }
    }
};
