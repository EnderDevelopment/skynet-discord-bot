const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-tickets')
    .setDescription('Posts the ticket panel in this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ content: 'Only administrators can configure tickets.', ephemeral: true });
      return;
    }
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('Support tickets')
      .setDescription('Need help? Press the button below to open a private support ticket.');
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket:open').setLabel('📩 Otvori tiket').setStyle(ButtonStyle.Primary)
    );
    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Ticket panel created.', ephemeral: true });
  }
};
