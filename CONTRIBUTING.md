# Contributing

Thanks for your interest in contributing to the https://badpasswordrules.net site code!

## New sites

If you're interested in adding a new site with a bad password rule, you can follow the setup steps below or optionally you can simply create a new YAML file, open a PR, and Vercel will build a preview environment for your changes.

- Add a new YAML file for your entry in the `_data/sites` directory.

- Entries must include:

  - A name.
    - This must be unique amongst all the entries.
  - A clean description about the bad password rule.
    - The `description` of an entry can be any valid markdown.
    - Sarcasm encouraged.
  - At least one screenshot.

- Entries can optionally include:

  - A URL to the offending bad rule.

- Follow the format of the other entries.

## Setup for local site development

- Have [Node.js 18+](https://nodejs.org/en/) installed.

- Install dependencies.

```bash
npm install
```

- Run the application locally.

```bash
npm run serve
```

- It's probably best to run a production build and ensure that it looks like what it should as well.

```bash
npm run build
npx http-server ./_site # Or `python -m http.server --directory _site` or any other similar method you like to serve static assets on your machine.
```

- Make your changes and [submit a PR](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

- Your PR will get an automatic deployment to [Vercel](https://vercel.com), where you can view your changes.

  - This serves as the "tests" as well. If your build fails here, you'll know something is wrong.

- Wait for approval and merging!

### Notes

- I'm always open to bug fixes!
- I'm always open to any accessbility improvements, speed improvements, optimizations, dependency updates, and similar.
- I'm somewhat open to any neat JavaScript interactivity additions, if you come up with any.
- I'm partially open to any design changes, though I mostly like it now.

## Setup for local bot development

There's now a bot that will toot random rules periodically! You can take a look in the `.github/bot` directory.

You'll first need a bot on the https://botsin.space instance in order to run this code.

- Have [Node.js 18+](https://nodejs.org/en/) installed.

- Copy `.env.sample` to `.env` and fill in the token.

- Install dependencies.

```bash
npm install
```

- Toot!

```
npm run toot
```
