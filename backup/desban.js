const Discord = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Desbane um usuário pelo ID.',
    options: [
        {
            name: 'userid',
            description: 'ID do usuário a ser desbanido.',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'motivo',
            description: 'Motivo do desbanimento.',
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    run: async (client, interaction) => {
        try {
            // Defer reply para evitar expiração
            await interaction.deferReply({ ephemeral: true });

            const userId = interaction.options.getString('userid');
            const motivo = interaction.options.getString('motivo') || 'Não especificado';

            // Verifica se o ID do usuário é válido
            if (!/^\d{17,19}$/.test(userId)) {
                return await interaction.editReply('❌ O ID do usuário fornecido não é válido.');
            }

            // Tenta desbanir o usuário
            const guild = interaction.guild;
            const banList = await guild.bans.fetch();

            if (!banList.has(userId)) {
                return await interaction.editReply('❌ Este usuário não está banido.');
            }

            await guild.members.unban(userId, motivo);
            await interaction.editReply(`✅ O usuário <@${userId}> foi desbanido com sucesso!\n**Motivo:** ${motivo}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Ocorreu um erro ao tentar desbanir o usuário.');
        }
    },
};
