const Discord = require('discord.js');

module.exports = {
    name: 'limpar',
    description: 'Limpa um número específico de mensagens em um canal.',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'quantidade',
            description: 'Número de mensagens a serem apagadas (entre 1 e 100)',
            type: Discord.ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

    run: async (client, interaction) => {
        // Verifica se o usuário possui permissão de administrador
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            return interaction.reply({ 
                content: 'Você não tem permissão para usar este comando.', 
                ephemeral: true 
            });
        }

        const quantidade = interaction.options.getInteger('quantidade');

        // Valida a quantidade de mensagens a serem apagadas
        if (quantidade < 1 || quantidade > 100) {
            return interaction.reply({ 
                content: 'Por favor, forneça um número entre 1 e 100.', 
                ephemeral: true 
            });
        }

        // Tenta apagar as mensagens
        try {
            const channel = interaction.channel;

            const messages = await channel.bulkDelete(quantidade, true); // `true` ignora mensagens mais antigas que 14 dias
            const reply = await interaction.reply({ 
                content: `✅ ${messages.size} mensagens foram apagadas com sucesso!`, 
                ephemeral: false 
            });

            // Remove a mensagem de confirmação após 4 segundos
            setTimeout(() => {
                interaction.deleteReply().catch(console.error);
            }, 4000);
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Ocorreu um erro ao tentar apagar as mensagens.', 
                ephemeral: true 
            });
        }
    }
};
