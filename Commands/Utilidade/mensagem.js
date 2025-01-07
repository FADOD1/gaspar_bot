const Discord = require('discord.js');
const cor = require('../../config').discord.color;

module.exports = {
    name: 'enviarmsg',
    description: 'Permite ao administrador enviar uma mensagem qualquer em um canal específico.',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'canal',
            description: 'Canal onde a mensagem será enviada',
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: 'mensagem',
            description: 'Conteúdo da mensagem a ser enviada',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {
        // Defere a interação para evitar expiração
        await interaction.deferReply({ ephemeral: true });

        const canal = interaction.options.getChannel('canal');
        const mensagem = interaction.options.getString('mensagem');

        // Verifica se o canal é um canal de texto
        if (canal.type !== Discord.ChannelType.GuildText) {
            return interaction.editReply({ content: 'Por favor, selecione um canal de texto válido.' });
        }

        try {
            // Envia a mensagem no canal especificado
            await canal.send(mensagem);
            await interaction.editReply({ content: 'Mensagem enviada com sucesso!' });
        } catch (error) {
            console.error(error);

            // Garante que a interação seja respondida
            if (!interaction.replied) {
                await interaction.editReply({ content: 'Ocorreu um erro ao tentar enviar a mensagem.' });
            }
        }
    }
};
