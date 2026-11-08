const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows bot and Discord API latency.'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Measuring latency...', fetchReply: true });
    const roundTrip = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`Bot latency: **${roundTrip}ms** | API latency: **${Math.round(interaction.client.ws.ping)}ms**`);
  }
};
