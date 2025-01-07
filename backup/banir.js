const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bane um usuário do servidor.',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'usuário',
            description: 'O usuário que será banido.',
            type: Discord.ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'motivo',
            description: 'O motivo do banimento.',
            type: Discord.ApplicationCommandOptionType.String,
            required: false
        }
    ],

    run: async (client, interaction) => {
        const usuario = interaction.options.getUser('usuário');
        const motivo = interaction.options.getString('motivo') || 'Nenhum motivo especificado';
        const membro = interaction.guild.members.cache.get(usuario.id);

        // Verifica se o usuário tem permissão para banir
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: '❌ Você não tem permissão para banir usuários!', ephemeral: true });
        }

        // Verifica se o bot tem permissão para banir
        if (!interaction.guild.members.me.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: '❌ Não tenho permissão para banir usuários.', ephemeral: true });
        }

        // Verifica se o membro pode ser banido
        if (!membro) {
            return interaction.reply({ content: '❌ Usuário não encontrado no servidor.', ephemeral: true });
        }

        if (!membro.bannable) {
            return interaction.reply({ content: '❌ Não posso banir este usuário. Ele pode ter um cargo superior ao meu ou eu não tenho permissão.', ephemeral: true });
        }

        // Tenta banir o membro
        try {
            await membro.ban({ reason: motivo });
            await interaction.reply({ content: `✅ ${usuario.tag} foi banido com sucesso. Motivo: ${motivo}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Ocorreu um erro ao tentar banir o usuário.', ephemeral: true });
        }
    }
};
