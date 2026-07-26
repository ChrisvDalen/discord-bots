import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { setOptOut } from "../../lib/roastOptOutStore.js";

export default {
  data: new SlashCommandBuilder()
    .setName("roastme")
    .setDescription("Schrijf jezelf in of uit voor willekeurige /roast van anderen")
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("off = uitschrijven, on = weer inschrijven")
        .setRequired(true)
        .addChoices({ name: "off", value: "off" }, { name: "on", value: "on" })
    ),

  async execute(interaction) {
    const status = interaction.options.getString("status", true);
    setOptOut(interaction.user.id, status === "off");

    const message = status === "off"
      ? "🚫 Je bent uitgeschreven. Anderen kunnen `/roast` niet meer op jou gebruiken (jezelf roasten kan nog steeds)."
      : "✅ Je bent weer ingeschreven. Anderen kunnen je weer roasten met `/roast`.";

    return interaction.reply({ content: message, flags: MessageFlags.Ephemeral });
  },
};
