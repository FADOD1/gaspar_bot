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
                    { name: '🛠️ Administração', value: '`/banir` - Bane um usuário do servidor.\n`/desban` - Desbane um usuário anteriormente banido.\n`/fechar_canais` - Fecha canais específicos.\n`/limpar` - Limpa mensagens em um canal.' },
                    { name: '⚙️ Utilidades', value: '`/abrir_canal` - Abre um canal específico.\n`/embed` - Cria uma embed personalizada.\n`/help` - Exibe este menu de ajuda.\n`/mensagem` - Envia uma mensagem personalizada.\n`/ping` - Mostra a latência do bot.\n`/registro` - Registra informações.\n`/setwelcome` - Define uma mensagem de boas-vindas.\n`/ticket` - Gerencia tickets no servidor.' },
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
