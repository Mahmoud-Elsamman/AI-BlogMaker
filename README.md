# AI-BlogMaker

A full stack SAAS application using OpenAI web API to generate SEO blog posts with react, next.js, Tailwind CSS, auth0, MongoDB and stripe.

## Getting Started

First of all create a file called `.env.local` then copy all the environment varibles from the `.env.local.sample` file

Fill the environment variables in that file as follows:

You must create an OpenAI API account to get the OpenAI API key.

You must create a database with your account on MongoDB atlas then:-

- Paste the database connection string in the `MONGODB_URI` environment variable.
- Change the name of the database in all the project with your database name.

Then create an account on Auth0 and add a new project then:-

- Get the auth0 secret, client id, client secret and issur URL.
- Paste your local URL as the auth0 base URL.

lastly create an account on stripe and get the stripe secret key then:-

- Create a stripe product and get the product price API key.
- Create a stripe webhook and get the stripe webhook secret key.

## Run the application in development mode

To run the application in development mode, run the command:

### `npm run dev`

Now open [http://localhost:3000](http://localhost:3000) to view it in your browser.

To build your application for deployment, run the command:

### `npm run build`
