const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Mostra todas as informações sobre o bot e seus comandos.',
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        try {
            // Criação do embed
            const helpEmbed = new Discord.EmbedBuilder()
                .setColor('#00FF7F') // Cor do embed
                .setTitle('Ajuda com o bot')
                .setDescription('Aqui estão as informações sobre o bot e os comandos disponíveis:')
                .addFields(
                    { name: '🛠️ Administração', value: '`/enviarmsg` - Envia mensagens em canais específicos.\n`/limpar` - Limpa mensagens em um canal.\n`/ban` - Bane um usuário do servidor.\n`/unban` - Desbane um usuário anteriormente banido.' },
                    { name: '⚙️ Utilidades', value: '`/embed` - Cria uma embed personalizada com título, descrição, imagens e botões.\n`/help` - Exibe este menu de ajuda com todas as informações do bot.' },
                    { name: '🎮 Entretenimento', value: '`/jogar` - Comando fictício para demonstrar categoria de entretenimento (adicione mais conforme necessário).' }
                )
                .addFields(
                    { name: '📜 Sobre o Bot', value: 'Este bot foi desenvolvido para auxiliar na administração e automação do seu servidor Discord.' },
                    { name: '🤖 Desenvolvedor', value: 'FADOD' }
                )
                .setImage('https://i.picasion.com/pic92/5241b5dd41d88c44488f1610a266e389.gif') // GIF animado como banner
                .setFooter({ text: 'Obrigado por usar o bot!', iconURL: client.user.displayAvatarURL() });

            // Envia o embed
            await interaction.reply({ embeds: [helpEmbed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Ocorreu um erro ao exibir o menu de ajuda.', 
                ephemeral: true 
            });
        }
    }
};
