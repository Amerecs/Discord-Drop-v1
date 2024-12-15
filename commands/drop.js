const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("drop")
        .setDescription("Send a drop and the first who clicks gets the prize.")
        .addStringOption(option =>
            option.setName("prize")
                .setDescription("The drop prize.")
                .setRequired(true)
        ),
    async execute(client, interaction) {

      if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: "ليس لديك صلاحية لاستخدام الامر", ephemeral: true });
      }
      
        const prize = interaction.options.getString("prize");

        const embed = new EmbedBuilder()
            .setAuthor({
                name: prize,
                iconURL: interaction.guild.iconURL({ format: 'png' })
            })
            .setDescription(`Hosted by ${interaction.user}`)
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ extension: 'png' })
            })
            .setColor('#b811ff');
        
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji('🎉')
                    .setCustomId("won")
                    .setStyle(ButtonStyle.Secondary)
            );


       const sentMessage = await interaction.reply({ embeds: [embed], components: [row] });
    
    
            const filter = int => int.customId === 'won';
        const collector = sentMessage.createMessageComponentCollector({ filter, max: 1, time: 60000 });

        collector.on('collect', async int => {
            const winner = int.user;
            
            const embed1 = new EmbedBuilder()
            .setAuthor({
                name: prize,
                iconURL: interaction.guild.iconURL({ format: 'png' })
            })
            .setDescription(`Hosted by ${interaction.user}
🏆 ${winner}`)
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ extension: 'png' })
            })
            .setColor('#b811ff');
await int.update({ embeds: [embed1], components: [] });
            await int.channel.send(`Congratulations, ${winner}! You won **${prize}**!`)
        });
        
        
                collector.on('end', collected => {
            if (collected.size === 0) {
                sentMessage.edit({ components: [] });
            }
        });
    }
};
