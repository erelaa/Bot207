import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} from "discord.js";
import { SlashCommand } from "../types";
import axios from "axios";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
      .setName("jail")
      .addStringOption(option => {
        return option
          .setName("imageurl")
          .setDescription("Enter the image URL")
          .setRequired(false);
      })
      .addUserOption(option => {
        return option
          .setName("user")
          .setDescription("Enter the user")
          .setRequired(false);
      })
      .setDescription("Create a jailed image"),
      
      execute: async (interaction) => {
        try {
            await interaction.deferReply();
            const user = interaction.options.getUser("user");
            const imageUrl = interaction.options.getString("imageurl");
            let finalImageUrl = imageUrl;

            if (user) {
                const avatarUrl = user.avatarURL();
                if (avatarUrl) {
                    finalImageUrl = avatarUrl.replace(/\.\w+$/, '.jpg');
                } else {
                    await interaction.editReply({ content: "Could not find user's avatar." });
                    return;
                }
            } else if (!imageUrl || !imageUrl.startsWith("http")) {
                await interaction.editReply({ content: "Please provide a valid image URL or a user ID." });
                return;
            }
        if (finalImageUrl) {
            const jailImageUrl = `https://api.popcat.xyz/jail?image=${encodeURIComponent(finalImageUrl)}`;
            const response = await axios.get(jailImageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            const attachment = new AttachmentBuilder(buffer, { name: 'jail.png' });
            const embed = new EmbedBuilder()
                .setTitle("YOU ARE IN JAIL")
                .setImage('attachment://jail.png');
            await interaction.editReply({ embeds: [embed], files: [attachment] });
        } else {
            await interaction.editReply({ content: "Unable to retrieve the image URL." });
        }        
        } catch (error) {
        console.error("Error", error);
        interaction.editReply({ content: "Something went wrong..." });
      }
    },
    cooldown: 0,
  };
  
  export default command;