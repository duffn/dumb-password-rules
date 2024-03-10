import * as dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import { login } from "masto";
import { parse } from "yaml";
import path from "path";
import slugify from "@sindresorhus/slugify";

const SITES_DIRECTORY = "../../src/_data/sites";

function randomFile() {
  const files = fs.readdirSync(SITES_DIRECTORY);
  return files[Math.floor(Math.random() * files.length)];
}

function text() {
  const yaml = parse(
    fs.readFileSync(path.resolve(SITES_DIRECTORY, randomFile()), "utf8")
  );

  const slug = slugify(yaml.name, {
    decamelize: false,
  });

  let description;
  if (yaml.description.length >= 300) {
    description = `${yaml.description.slice(0, 297)}...`;
  } else {
    description = yaml.description;
  }

  console.log(`Retrieved file for ${yaml.name}.`);

  return `This bad password rule is from ${yaml.name}.

${description}

https://badpasswordrules.net/sites/${slug}/

#password #passwords #infosec #cybersecurity #badpasswordrules`;
}

async function postSite() {
  try {
    const masto = await login({
      url: "https://botsin.space",
      accessToken: process.env.MASTODON_API_ACCESS_TOKEN,
    });

    const status = await masto.v1.statuses.create({
      status: text(),
      visibility: "public",
    });

    console.log(`Toot successful at ${status.url}`);
  } catch (error) {
    console.error("Unable to send toot.");
    console.error(error);
    process.exit(1);
  }
}

postSite();
