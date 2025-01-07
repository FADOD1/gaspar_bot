const Discord = require('discord.js');

module.exports = {
    name: 'abrircanal',
    description: 'Abre o canal atual para que todos possam enviar mensagens.',
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: '❌ Você não tem permissão para usar este comando.',
                ephemeral: true
            });
        }

        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: true
            });

            const msg = await interaction.reply({
                content: '✅ O canal foi aberto com sucesso!',
                ephemeral: false
            });

            setTimeout(() => {
                interaction.deleteReply().catch(() => {});
            }, 5000);
        } catch (error) {
            console.error('Erro ao abrir o canal:', error);
            interaction.reply({
                content: '❌ Ocorreu um erro ao abrir o canal.',
                ephemeral: true
            });
        }
    }
};
