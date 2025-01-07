const {
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');

module.exports = {
  name: 'setregister',
  description: 'Configura o painel de registro com react roles.',
  options: [
      {
          name: 'channel',
          type: 7, // CHANNEL
          description: 'Canal onde o painel de registro será enviado.',
          required: true,
      },
  ],
  run: async (client, interaction) => {
      try {
          // Verifica permissão
          if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
              return interaction.reply({
                  content: 'Você não tem permissão para gerenciar cargos.',
                  ephemeral: true,
              });
          }

          const channel = interaction.options.getChannel('channel');
          if (!channel || channel.type !== 0) {
              return interaction.reply({
                  content: 'Por favor, selecione um canal de texto válido.',
                  ephemeral: true,
              });
          }

          // Solicita os cargos e emojis
          await interaction.reply({
              content: 'Envie os cargos e emojis no formato: `<@&ID_CARGO>:emoji` separados por linha.',
              ephemeral: true,
          });

          const filter = (msg) => msg.author.id === interaction.user.id;
          const collected = await interaction.channel.awaitMessages({
              filter,
              max: 1,
              time: 60000,
              errors: ['time'],
          });

          const rolesData = collected.first().content.split('\n').map((line) => {
              const [roleMention, emoji] = line.split(':');
              const roleId = roleMention.replace(/<@&|>/g, '').trim();
              return { roleId, emoji: emoji.trim() };
          });

          // Valida os cargos
          for (const { roleId } of rolesData) {
              const role = interaction.guild.roles.cache.get(roleId);
              if (!role) {
                  return interaction.followUp({
                      content: `O ID do cargo \`${roleId}\` é inválido.`,
                      ephemeral: true,
                  });
              }
          }

          // Cria o embed do painel
          const embed = new EmbedBuilder()
              .setTitle('Painel de Registro')
              .setDescription(
                  rolesData
                      .map(({ roleId, emoji }) => `${emoji} - <@&${roleId}>`)
                      .join('\n')
              )
              .setColor('#00FF7F');

          const message = await channel.send({ embeds: [embed] });

          // Adiciona as reações
          for (const { emoji } of rolesData) {
              await message.react(emoji);
          }

          // Listener para reações
          const reactionCollector = message.createReactionCollector({
              dispose: true,
          });

          reactionCollector.on('collect', async (reaction, user) => {
              if (user.bot) return;
              const roleData = rolesData.find((data) => data.emoji === reaction.emoji.name);
              if (!roleData) return;

              const member = await interaction.guild.members.fetch(user.id);
              const role = interaction.guild.roles.cache.get(roleData.roleId);

              if (!role) return;
              await member.roles.add(role);
              user.send(`Você recebeu o cargo ${role.name}!`).catch(() => null);
          });

          reactionCollector.on('remove', async (reaction, user) => {
              if (user.bot) return;
              const roleData = rolesData.find((data) => data.emoji === reaction.emoji.name);
              if (!roleData) return;

              const member = await interaction.guild.members.fetch(user.id);
              const role = interaction.guild.roles.cache.get(roleData.roleId);

              if (!role) return;
              await member.roles.remove(role);
              user.send(`O cargo ${role.name} foi removido de você.`).catch(() => null);
          });

          interaction.followUp({
              content: 'Painel de registro configurado com sucesso!',
              ephemeral: true,
          });
      } catch (error) {
          console.error(error);
          interaction.followUp({
              content: 'Ocorreu um erro ao configurar o painel de registro.',
              ephemeral: true,
          });
      }
  },
};
