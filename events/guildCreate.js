const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildCreate,
  execute(guild) {
    console.log(`Joined guild: ${guild.name} (${guild.id})`);
  }
};
