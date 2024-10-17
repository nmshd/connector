import { spawnSync } from "child_process";
import { readFile, writeFile } from "fs/promises";
import _ from "lodash";

(async function () {
    let readmeFileContent = (await readFile("CLI-README.md")).toString();

    const helpTextReturn = spawnSync("node", ["dist/cli/index.js", "--help"]);
    const helpText = helpTextReturn.stdout.toString();
    let readMeReplace = `
# Usage

\`\`\`
${helpText}
\`\`\`
`;

    const commands = getAllCommandNames(helpText);

    for (const command of commands) {
        readMeReplace = await extendHelpText(readMeReplace, command);
    }

    const replaceRegex = new RegExp("<!-- generated start -->(.|\\n)*<!-- generated end -->");

    readmeFileContent = readmeFileContent.replace(
        replaceRegex,
        `<!-- generated start -->
${readMeReplace}
<!-- generated end -->`
    );

    await writeFile("CLI-README.md", readmeFileContent);
})().catch((err) => {
    console.error(err);
});

async function extendHelpText(readMeReplace: string, commandName: string, depth: number = 0): Promise<string> {
    const subCommandHelpReturn = spawnSync("node", ["dist/cli/index.js", ...commandName.split(" "), "--help"]);
    const subCommandHelp = subCommandHelpReturn.stdout.toString();
    readMeReplace += `
##${"#".repeat(depth)} ${_.startCase(commandName)}

\`\`\`
${subCommandHelp}
\`\`\`
`;
    const childCommands = getAllCommandNames(subCommandHelp);
    for (const command of childCommands) {
        readMeReplace = await extendHelpText(readMeReplace, command, depth + 1);
    }

    return readMeReplace;
}

function getAllCommandNames(helpText: string) {
    if (!helpText.includes("Commands:")) {
        return [];
    }

    const onlyCommandLines = helpText
        .replace(/(.|\n)*Commands:\n/gm, "")
        .replace(/Options:\n(.|\n)*/, "")
        .trim()
        .split("\n")
        .map((s) => s.trim());

    return onlyCommandLines.map((line) =>
        line
            .replace(/connector (.*?  ).*/, "$1")
            .trim()
            .replace(/(^\w*?\s+?\w*).*/, "$1")
            .trim()
    );
}
