const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'setwelcome',
    description: 'Define o canal para mensagens de boas-vindas',
    options: [
        {
            name: 'channel',
            type: 7, // CHANNEL
            description: 'Canal onde as mensagens de boas-vindas serão enviadas',
            required: true,
        },
    ],
    run: async (client, interaction) => {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                return interaction.reply({
                    content: 'Você não tem permissão para gerenciar canais.',
                    ephemeral: true,
                });
            }

            const channel = interaction.options.getChannel('channel');

            if (!channel || channel.type !== 0) { // Verifica se é um canal de texto
                return interaction.reply({
                    content: 'Por favor, selecione um canal de texto válido.',
                    ephemeral: true,
                });
            }

            // Salva o ID do canal no client para usar depois
            client.welcomeChannel = channel.id;

            interaction.reply({
                content: `Canal de boas-vindas definido para ${channel}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: 'Ocorreu um erro ao configurar o canal de boas-vindas.',
                ephemeral: true,
            });
        }
    },
};
