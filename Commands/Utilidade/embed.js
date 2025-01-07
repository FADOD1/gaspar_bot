const Discord = require('discord.js');
const cor = require('../../config').discord.color;

module.exports = {
    name: 'embed',
    description: 'Cria uma embed personalizada com título, descrição, imagens e botões.',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'titulo',
            description: 'Título da embed',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'descricao',
            description: 'Descrição da embed',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'imagem',
            description: 'URL da imagem principal',
            type: Discord.ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'thumbnail',
            description: 'URL da imagem menor (thumbnail)',
            type: Discord.ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'download',
            description: 'URL para download',
            type: Discord.ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'youtube',
            description: 'URL de um vídeo no YouTube',
            type: Discord.ApplicationCommandOptionType.String,
            required: false
        }
    ],

    run: async (client, interaction) => {
        const titulo = interaction.options.getString('titulo');
        const descricao = interaction.options.getString('descricao');
        const imagem = interaction.options.getString('imagem');
        const thumbnail = interaction.options.getString('thumbnail');
        const download = interaction.options.getString('download');
        const youtube = interaction.options.getString('youtube');

        // Cria a embed
        const embed = new Discord.EmbedBuilder()
            .setColor(cor)
            .setTitle(titulo)
            .setDescription(descricao);

        if (imagem) embed.setImage(imagem);
        if (thumbnail) embed.setThumbnail(thumbnail);

        // Cria os botões
        const buttons = new Discord.ActionRowBuilder();

        if (download) {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setLabel('Download')
                    .setStyle(Discord.ButtonStyle.Link) // Botão de link
                    .setURL(download)
            );
        }

        if (youtube) {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setLabel('YouTube')
                    .setStyle(Discord.ButtonStyle.Link) // Botão de link
                    .setURL(youtube)
            );
        }

        // Envia a embed com os botões, se houver
        if (download || youtube) {
            await interaction.reply({ embeds: [embed], components: [buttons] });
        } else {
            await interaction.reply({ embeds: [embed] });
        }
    }
};
