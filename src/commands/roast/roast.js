import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { ROASTS } from "../../lib/roastData.js";
import { isOptedOut } from "../../lib/roastOptOutStore.js";

export default {
  data: new SlashCommandBuilder()
    .setName("roast")
    .setDescription("Roast iemand (of jezelf) met een onschuldige, absurde roast")
    .addUserOption((option) => option.setName("persoon").setDescription("Wie wordt geroasted? (default: jijzelf)")),

  async execute(interaction) {
    const target = interaction.options.getUser("persoon") ?? interaction.user;
    const isSelfRoast = target.id === interaction.user.id;

    if (!isSelfRoast && isOptedOut(target.id)) {
      return interaction.reply({
        content: `${target} heeft zich uitgeschreven van roasts met \`/roastme\`. Respecteer dat 🙏`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
    return interaction.reply(`🔥 ${target} ${roast}`);
  },
};
