import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMMANDS_DIR = path.join(__dirname, "..", "commands");

// Loads every command under src/commands/<group>/<command>.js. The runtime and
// the deploy script share this so a command can never be registered with Discord
// without also being executable at runtime.
export async function loadCommands() {
  const groups = readdirSync(COMMANDS_DIR, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  const commands = [];

  for (const group of groups) {
    const groupDir = path.join(COMMANDS_DIR, group.name);
    const files = readdirSync(groupDir).filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(groupDir, file);
      const command = (await import(pathToFileURL(filePath).href)).default;

      if (!command?.data || !command?.execute) {
        console.warn(`Skipping ${filePath}: missing "data" or "execute" export.`);
        continue;
      }

      commands.push(command);
    }
  }

  return commands;
}
