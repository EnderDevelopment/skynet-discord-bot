const { PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');
const { sendModLog } = require('./logging');

function isTicketChannel(channel) {
  return Boolean(channel?.name?.startsWith('ticket-') && channel?.topic?.startsWith('ticket-owner:'));
}

async function createTicket(interaction) {
  const existing = interaction.guild.channels.cache.find(
    (channel) => isTicketChannel(channel) && channel.topic === `ticket-owner:${interaction.user.id}`
  );
  if (existing) {
    await interaction.reply({ content: `You already have an open ticket: ${existing}`, ephemeral: true });
    return;
  }

  const overwrites = [
    { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
    { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
  ];
  if (config.adminRoleId) {
    overwrites.push({ id: config.adminRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] });
  }

  const channel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 90) || `ticket-${interaction.user.id}`,
    type: ChannelType.GuildText,
    parent: config.ticketCategoryId || undefined,
    topic: `ticket-owner:${interaction.user.id}`,
    permissionOverwrites: overwrites,
    reason: `Ticket opened by ${interaction.user.tag}`
  });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket:close').setLabel('Zatvori tiket').setStyle(ButtonStyle.Danger)
  );
  const embed = new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle('Ticket opened')
    .setDescription(`${interaction.user}, describe your issue and a staff member will help you.`)
    .setTimestamp();
  await channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
  await interaction.reply({ content: `Your private ticket is ready: ${channel}`, ephemeral: true });
}

async function closeTicket(interaction) {
  const ownerId = interaction.channel.topic.replace('ticket-owner:', '');
  await sendModLog(interaction.guild, {
    title: 'Ticket closed',
    description: `${interaction.channel} was closed by ${interaction.user.tag}.`,
    color: 0xed4245,
    fields: [
      { name: 'Ticket owner', value: `<@${ownerId}> (${ownerId})`, inline: true },
      { name: 'Closed by', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
      { name: 'Channel', value: interaction.channel.name, inline: true }
    ]
  });
  await interaction.reply({ content: 'This ticket will be closed in 5 seconds.', ephemeral: true });
  setTimeout(() => interaction.channel.delete('Ticket closed').catch((error) => console.error('Ticket deletion failed:', error.message)), 5000);
}

module.exports = { createTicket, closeTicket, isTicketChannel };
