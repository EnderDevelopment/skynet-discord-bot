const { EmbedBuilder } = require('discord.js');
const config = require('../config');

async function sendModLog(guild, { title, description, color = 0x5865f2, fields = [] }) {
  if (!config.modLogChannelId || !guild) return false;

  try {
    const channel = await guild.channels.fetch(config.modLogChannelId);
    if (!channel || !channel.isTextBased()) return false;

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)
      .addFields(fields)
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    return true;
  } catch (error) {
    console.error(`Unable to send moderation log: ${error.message}`);
    return false;
  }
}

module.exports = { sendModLog };
