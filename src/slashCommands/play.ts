import { EmbedBuilder, SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { useMainPlayer } from "discord-player";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("play")
    .addStringOption(option => {
      return option
        .setName("query")
        .setDescription("Query or URL of the requested track")
        .setRequired(true);
    })
    .setDescription("Play the requested track"),
  execute: async (interaction) => {


    const player = useMainPlayer();
    const guild = interaction.guild;
    const member = guild?.members.cache.get(interaction.user.id)
    const channel = member?.voice.channel
    if (!channel) return interaction.reply({content: 'You are not connected to a voice channel!', ephemeral: true});
    const query = interaction.options.getString('query', true);

    if(!guild) return interaction.reply({content: 'This command can only be used on a server', ephemeral: true})

    await interaction.deferReply();

    try {
      if (player.queues.get(guild.id) && player.queues.get(guild.id)?.isPlaying) {
        const { track } = await player.play(channel, query);
        return interaction.followUp({content: track.title + " added to queue!", ephemeral: true});
        } else{
          const { track } = await player.play(channel, query, {
            nodeOptions: {
                volume: 20,
                metadata: interaction
            }
        });
        const embed = new EmbedBuilder()
        .setTitle("Loading " + track.title)
        return interaction.followUp({embeds: [embed]});
      }
    } catch (e) {
        // let's return error if something failed
        return interaction.followUp(`Something went wrong: ${e}`);
    }

  },
  cooldown: 10
}

export default command