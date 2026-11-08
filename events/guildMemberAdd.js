const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    if (config.autoRoleId) {
      try {
        await member.roles.add(config.autoRoleId, 'Automatic newcomer role');
      } catch (error) {
        console.error(`Could not assign auto-role in ${member.guild.name}:`, error.message);
      }
    }

    if (!config.welcomeChannelId) return;
    const channel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('Welcome!')
      .setDescription(`Welcome ${member} to **${member.guild.name}**!`)
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
};
