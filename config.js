const requiredVariables = ['DISCORD_TOKEN', 'CLIENT_ID'];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

const optionalSnowflake = (name) => process.env[name] || null;

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: optionalSnowflake('GUILD_ID'),
  welcomeChannelId: optionalSnowflake('WELCOME_CHANNEL_ID'),
  autoRoleId: optionalSnowflake('AUTO_ROLE_ID'),
  ticketCategoryId: optionalSnowflake('TICKET_CATEGORY_ID'),
  adminRoleId: optionalSnowflake('ADMIN_ROLE_ID'),
  modLogChannelId: optionalSnowflake('MOD_LOG_CHANNEL_ID')
};
