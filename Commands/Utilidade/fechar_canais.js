const Discord = require('discord.js');

module.exports = {
    name: 'fecharcanal',
    description: 'Fecha o canal atual para que ninguém possa enviar mensagens.',
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: '❌ Você não tem permissão para usar este comando.',
                ephemeral: true
            });
        }

        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: false
            });

            const msg = await interaction.reply({
                content: '✅ O canal foi fechado com sucesso!',
                ephemeral: false
            });

            setTimeout(() => {
                interaction.deleteReply().catch(() => {});
            }, 5000);
        } catch (error) {
            console.error('Erro ao fechar o canal:', error);
            interaction.reply({
                content: '❌ Ocorreu um erro ao fechar o canal.',
                ephemeral: true
            });
        }
    }
};
