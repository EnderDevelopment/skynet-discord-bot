const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendModLog } = require('../utils/logging');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes recent messages from this channel.')
    .addIntegerOption((option) => option
      .setName('kolicina')
      .setDescription('Number of messages to delete, from 1 to 100.')
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ content: 'Only administrators can use this command.', ephemeral: true });
      return;
    }
    if (!interaction.channel.isTextBased() || !interaction.channel.bulkDelete) {
      await interaction.reply({ content: 'This command can only be used in a text channel.', ephemeral: true });
      return;
    }

    const amount = interaction.options.getInteger('kolicina');
    await interaction.deferReply({ ephemeral: true });
    const deleted = await interaction.channel.bulkDelete(amount, true);
    await interaction.editReply(`Deleted ${deleted.size} message(s). Messages older than 14 days are skipped by Discord.`);
    await sendModLog(interaction.guild, {
      title: 'Messages purged',
      description: `${interaction.user.tag} purged messages in ${interaction.channel}.`,
      color: 0xed4245,
      fields: [
        { name: 'Deleted', value: String(deleted.size), inline: true },
        { name: 'Requested', value: String(amount), inline: true },
        { name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})` }
      ]
    });
  }
};
