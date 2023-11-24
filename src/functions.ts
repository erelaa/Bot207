import chalk from "chalk"
import { Guild, GuildMember, PermissionFlagsBits, PermissionResolvable, TextChannel } from "discord.js"
import GuildDB from "./schemas/Guild"
import { GuildOption } from "./types"
import mongoose from "mongoose";

type colorType = "text" | "variable" | "error"

const themeColors = {
    text: "#ff8e4d",
    variable: "#ff624d",
    error: "#f5426c"
}

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].slice(1)}`)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const color = (color: colorType, message: any) => {
    return chalk.hex(themeColors[color])(message)
}

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    const neededPermissions: PermissionResolvable[] = []
    for (const permission of permissions) {
        if (!member.permissions.has(permission)) neededPermissions.push(permission)
    }
    if (neededPermissions.length === 0) return null
    return neededPermissions.map(p => {
        return typeof p === "string" ? p.split(/(?=[A-Z])/).join(" ") : Object.keys(PermissionFlagsBits).find(k => PermissionFlagsBits[k as keyof typeof PermissionFlagsBits] === p)?.split(/(?=[A-Z])/).join(" ");
    })
}

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
    channel.send(message)
        .then(m => setTimeout(async () =>{
            const messages = await channel.messages.fetch(m)
            messages.delete();
        }, duration));
    return
}

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    const foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    return foundGuild.options[option]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setGuildOption = async (guild: Guild, option: GuildOption, value: any) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    const foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    foundGuild.options[option] = value
    foundGuild.save()
}