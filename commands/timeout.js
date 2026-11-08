const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { parseDuration } = require('../utils/duration');
const { sendModLog } = require('../utils/logging');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Temporarily restricts a member.')
    .addUserOption((option) => option.setName('korisnik').setDescription('Member to restrict.').setRequired(true))
    .addStringOption((option) => option.setName('vreme').setDescription('Duration such as 10m, 2h, or 1d.').setRequired(true))
    .addStringOption((option) => option.setName('razlog').setDescription('Reason for the timeout.').setMaxLength(512))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
      await interaction.reply({ content: 'You need the Moderate Members permission.', ephemeral: true });
      return;
    }

    const user = interaction.options.getUser('korisnik');
    const durationText = interaction.options.getString('vreme');
    const duration = parseDuration(durationText);
    const reason = interaction.options.getString('razlog') || 'No reason provided';
    if (!duration) {
      await interaction.reply({ content: 'Invalid duration. Use a number followed by s, m, h, or d.', ephemeral: true });
      return;
    }

    const member = await interaction.guild.members.fetch(user.id);
    if (!member.moderatable) {
      await interaction.reply({ content: 'I cannot timeout this member. Check role hierarchy and permissions.', ephemeral: true });
      return;
    }

    await member.timeout(duration, reason);
    await interaction.reply(`${user.tag} was timed out for **${durationText}**. Reason: ${reason}`);
    await sendModLog(interaction.guild, {
      title: 'Member timed out',
      description: `${user.tag} (${user.id}) was timed out by ${interaction.user.tag}.`,
      color: 0xed4245,
      fields: [
        { name: 'Duration', value: durationText, inline: true },
        { name: 'Reason', value: reason.slice(0, 1024) },
        { name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})` }
      ]
    });
  }
};
