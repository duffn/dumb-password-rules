if (process.env.NODE_ENV !== "production") {
  await import("dotenv").then((dotenv) => dotenv.config());
}

import fs from "fs";
import { login } from "masto";
import { parse } from "yaml";
import path from "path";
import slugify from "@sindresorhus/slugify";
import { AtpAgent, RichText } from "@atproto/api";
import ogs from "open-graph-scraper";

const SITES_DIRECTORY = "../../src/_data/sites";

function randomFile() {
  const files = fs.readdirSync(SITES_DIRECTORY);
  return files[Math.floor(Math.random() * files.length)];
}

function text() {
  const yaml = parse(
    fs.readFileSync(path.resolve(SITES_DIRECTORY, randomFile()), "utf8"),
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

  return `This dumb password rule is from ${yaml.name}.

${description}

https://dumbpasswordrules.com/sites/${slug}/

#password #passwords #infosec #cybersecurity #dumbpasswordrules`;
}

async function postMastodon() {
  try {
    const masto = await login({
      url: process.env.MASTODON_URL,
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

async function getUrlMetadata(url) {
  try {
    const { result } = await ogs({ url, timeout: 5000 });
    // ogImage can be object or array.
    let image = "";
    if (Array.isArray(result.ogImage) && result.ogImage.length > 0) {
      image = result.ogImage[0].url || "";
    } else if (result.ogImage && typeof result.ogImage === "object") {
      image = result.ogImage.url || "";
    }
    return {
      title: result.ogTitle || "",
      description: result.ogDescription || "",
      image,
    };
  } catch (err) {
    console.error("Error extracting Open Graph metadata:", err);
    return { title: "", description: "", image: "" };
  }
}

async function getBlueskyEmbedCard(url, agent) {
  if (!url) return;
  try {
    const metadata = await getUrlMetadata(url);
    const imageRes = await fetch(metadata.image);
    const blob = await imageRes.blob();
    const { data } = await agent.uploadBlob(blob, { encoding: "image/jpeg" });

    return {
      $type: "app.bsky.embed.external",
      external: {
        uri: url,
        title: metadata.title,
        description: metadata.description,
        thumb: data.blob,
      },
    };
  } catch (error) {
    console.error("Error fetching embed card:", error);
    return;
  }
}

async function postBluesky() {
  try {
    const agent = new AtpAgent({ service: "https://bsky.social" });
    await agent.login({
      identifier: process.env.BLUESKY_IDENTIFIER,
      password: process.env.BLUESKY_PASSWORD,
    });

    let postText = text();

    const urlMatch = postText.match(
      /https?:\/\/dumbpasswordrules\.com\/[^\s)]+/,
    );
    const url = urlMatch ? urlMatch[0] : undefined;

    let rt = new RichText({ text: postText });
    await rt.detectFacets(agent);

    // Trim if needed as RichText will handle 300 graphemes max.
    if (rt.graphemeLength > 300) {
      let trimmedText = Array.isArray(rt.graphemes)
        ? rt.graphemes.slice(0, 300).join("")
        : typeof rt.text === "string"
          ? rt.text.slice(0, 300)
          : "";
      if (!trimmedText) {
        console.error(
          "RichText.graphemes missing and unable to trim safely for post:",
          rt,
        );
        return;
      }
      rt = new RichText({ text: trimmedText });
      await rt.detectFacets(agent);
    }

    const res = await agent.post({
      text: rt.text,
      facets: rt.facets,
      embed: await getBlueskyEmbedCard(url, agent),
    });
    console.log(`Bluesky post successful: ${res.uri}`);
  } catch (error) {
    console.error("Unable to send to Blue Sky.");
    console.error(error);
    process.exit(1);
  }
}

(async () => {
  await postMastodon();
  await postBluesky();
})();
