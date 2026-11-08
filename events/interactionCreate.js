const { Events, PermissionFlagsBits } = require('discord.js');
const config = require('../config');
const { createTicket, closeTicket, isTicketChannel } = require('../utils/tickets');

function isStaff(member) {
  return member.permissions.has(PermissionFlagsBits.Administrator)
    || (config.adminRoleId && member.roles.cache.has(config.adminRoleId));
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (command) await command.execute(interaction);
        return;
      }

      if (!interaction.isButton()) return;
      if (interaction.customId === 'ticket:open') {
        await createTicket(interaction);
        return;
      }
      if (interaction.customId === 'ticket:close') {
        if (!isTicketChannel(interaction.channel)) {
          await interaction.reply({ content: 'This button can only be used inside a ticket.', ephemeral: true });
          return;
        }
        const ownerId = interaction.channel.topic?.replace('ticket-owner:', '');
        if (interaction.user.id !== ownerId && !isStaff(interaction.member)) {
          await interaction.reply({ content: 'Only the ticket owner or staff can close this ticket.', ephemeral: true });
          return;
        }
        await closeTicket(interaction);
      }
    } catch (error) {
      console.error('Interaction error:', error);
      const response = { content: 'The request could not be completed.', ephemeral: true };
      if (interaction.replied || interaction.deferred) await interaction.followUp(response);
      else await interaction.reply(response);
    }
  }
};
