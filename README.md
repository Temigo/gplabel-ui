# GP Label Frontend

This is a [Next.js](https://nextjs.org/) project.

## Install
Recommend using [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm).

```bash
nvm install lts/gallium # or any more recent node version
nvm use lts/gallium
cd gplabel-ui
npm install # install dependencies based on package.json
```

You will need to create a file at the root of the repository `.env.local` with the following environment variables:

```
GITHUB_ID=xxx
GITHUB_SECRET=xxx
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=xxx  # generate this with `openssl rand -base64 32` for example
GOOGLE_ID=xxx
GOOGLE_SECRET=xxx
NEXT_PUBLIC_API_URL=http://localhost:8000
```

`GOOGLE_*` variables come from setting up an API key in Google Developer Console. Same for `GITHUB_*`. Ask me for key values that we can share for development. `NEXT_PUBLIC_API_URL` points to the concurrently running backend.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Testing

WIP - using [Cypress](https://www.cypress.io/) for tests.

```bash
npm run test:open
npm run test:run
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
