const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bane um usuário do servidor',
    options: [
        {
            name: 'user',
            type: 6, // USER
            description: 'Usuário a ser banido',
            required: true,
        },
        {
            name: 'reason',
            type: 3, // STRING
            description: 'Motivo do banimento',
            required: false,
        },
    ],
    run: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });

            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'Não especificado';

            const member = interaction.guild.members.cache.get(user.id);
            if (!member) {
                return interaction.editReply({ content: 'Usuário não encontrado no servidor.' });
            }

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                return interaction.editReply({ content: 'Você não tem permissão para banir membros.' });
            }

            if (!member.bannable) {
                return interaction.editReply({ content: 'Não consigo banir este membro.' });
            }

            await member.ban({ reason });
            await user.send(`Você foi banido do servidor **${interaction.guild.name}** pelo seguinte motivo: ${reason}`);

            interaction.editReply({ content: `Usuário **${user.tag}** foi banido com sucesso!` });
        } catch (error) {
            console.error(error);
            interaction.editReply({ content: 'Ocorreu um erro ao tentar banir o usuário.' });
        }
    },
};

