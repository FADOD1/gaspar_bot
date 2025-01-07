const Discord = require('discord.js');

module.exports = {
    name: 'ticket',
    description: 'Sistema de tickets',
    run: async (client, interaction) => {
        try {
            const categoria = interaction.guild.channels.cache.find(
                (ch) => ch.name === 'Tickets' && ch.type === Discord.ChannelType.GuildCategory
            );

            if (!categoria) {
                return interaction.reply({
                    content: 'Categoria "Tickets" não encontrada. Por favor, crie uma categoria chamada "Tickets".',
                    ephemeral: false
                });
            }

            const ticketEmbed = new Discord.EmbedBuilder()
                .setColor('#00FF7F')
                .setTitle('🎟️ Sistema de Tickets')
                .setDescription('Clique no botão abaixo para abrir um ticket.(Lembre-se ao abrir um ticket sem motivo sera penalizado!!)')
                .setImage('https://i.picasion.com/pic92/5241b5dd41d88c44488f1610a266e389.gif');

            const ticketButton = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('abrir_ticket')
                    .setLabel('Abrir Ticket')
                    .setStyle(Discord.ButtonStyle.Success)
            );

            await interaction.reply({
                embeds: [ticketEmbed],
                components: [ticketButton],
                ephemeral: false
            });

            // Coletor sem limite de tempo
            const collector = interaction.channel.createMessageComponentCollector({
                componentType: Discord.ComponentType.Button
            });

            collector.on('collect', async (buttonInteraction) => {
                if (!buttonInteraction.isButton()) return;

                const user = buttonInteraction.user;

                if (buttonInteraction.customId === 'abrir_ticket') {
                    await buttonInteraction.deferReply({ ephemeral: false });

                    const existingChannel = interaction.guild.channels.cache.find(
                        (ch) => ch.name === `ticket-${user.id}`
                    );

                    if (existingChannel) {
                        return buttonInteraction.followUp({
                            content: 'Você já tem um ticket aberto.',
                            ephemeral: false
                        });
                    }

                    try {
                        const ticketChannel = await interaction.guild.channels.create({
                            name: `ticket-${user.id}`,
                            type: Discord.ChannelType.GuildText,
                            parent: categoria.id,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.id,
                                    deny: [Discord.PermissionsBitField.Flags.ViewChannel]
                                },
                                {
                                    id: user.id,
                                    allow: [
                                        Discord.PermissionsBitField.Flags.ViewChannel,
                                        Discord.PermissionsBitField.Flags.SendMessages,
                                        Discord.PermissionsBitField.Flags.AttachFiles
                                    ]
                                }
                            ]
                        });

                        const ticketEmbed = new Discord.EmbedBuilder()
                            .setColor('#00FF7F')
                            .setTitle('📩 Ticket Aberto')
                            .setDescription('Descreva o motivo do seu ticket e a equipe ajudará você em breve. Por agora apenas relate de forma clara e concisa qual é o seu problema.');

                        const closeButton = new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('fechar_ticket')
                                .setLabel('Fechar Ticket')
                                .setStyle(Discord.ButtonStyle.Danger)
                        );

                        const ticketMessage = await ticketChannel.send({
                            content: `<@${user.id}>`,
                            embeds: [ticketEmbed],
                            components: [closeButton]
                        });

                        const ticketCreatedMessage = await buttonInteraction.followUp({
                            content: `Seu ticket foi criado: ${ticketChannel}`,
                            ephemeral: false
                        });

                        setTimeout(async () => {
                            try {
                                await ticketCreatedMessage.delete();
                            } catch (error) {
                                console.error('Erro ao excluir a mensagem de ticket criado:', error);
                            }
                        }, 5000);

                        const ticketCollector = ticketChannel.createMessageComponentCollector({
                            componentType: Discord.ComponentType.Button
                        });

                        ticketCollector.on('collect', async (closeInteraction) => {
                            if (closeInteraction.customId === 'fechar_ticket') {
                                await closeInteraction.deferReply({ ephemeral: true });

                                try {
                                    await closeInteraction.followUp({
                                        content: 'O ticket será fechado em 5 segundos...',
                                        ephemeral: false
                                    });

                                    setTimeout(async () => {
                                        try {
                                            await ticketChannel.delete();
                                        } catch (error) {
                                            console.error('Erro ao excluir o canal:', error);
                                        }
                                    }, 5000);
                                } catch (error) {
                                    console.error('Erro ao processar o fechamento do ticket:', error);
                                    await closeInteraction.followUp({
                                        content: 'Ocorreu um erro ao tentar fechar o ticket.',
                                        ephemeral: false
                                    });
                                }
                            }
                        });
                    } catch (error) {
                        console.error('Erro ao criar o canal do ticket:', error);
                        await buttonInteraction.followUp({
                            content: 'Ocorreu um erro ao criar o ticket. Tente novamente mais tarde.',
                            ephemeral: false
                        });
                    }
                }
            });
        } catch (error) {
            console.error('Erro no sistema de tickets:', error);
            interaction.reply({
                content: 'Ocorreu um erro ao executar o comando de ticket.',
                ephemeral: false
            });
        }
    }
};
