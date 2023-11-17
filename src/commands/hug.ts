import {PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { Command } from "../types";
import axios from "axios";
const command : Command = {
    name: "hug",
    execute: async (message) => {
      try {
            const response = await axios.get("https://nekos.best/api/v2/hug");
            const imageUrl = response.data.results[0].url;
            let author = message.author;
            let mentionedUser = message.mentions.members?.first();
            let embed: EmbedBuilder;
            if(mentionedUser){
              embed = new EmbedBuilder()
                .setImage(`${imageUrl}?width=400&height=300`)
                .setDescription(`<@${author?.id}> hugs<@${mentionedUser?.user.id}>`);
          }else{
            embed = new EmbedBuilder()
            .setImage(`${imageUrl}?width=400&height=300`)
          }     
          message.channel.send({ embeds: [embed] });
          } catch (error) {
            message.channel.send(JSON.stringify(error));
          }
    },
    cooldown: 0,
    aliases: [],
    permissions: ["Administrator", PermissionFlagsBits.ManageEmojisAndStickers]
}
export default command 