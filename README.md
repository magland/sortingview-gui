# sortingview-gui

The figurl view for [sortingview](https://github.com/magland/sortingview).

## Developing

To develop this view locally, host the app in development mode via:

```bash
yarn install # only needs to be done once (or whenever the npm dependencies are updated)
yarn start
```

Make note of the port it is running on. These instructions will assume the default port of 3000.

Open using figurl.org by pointing the `v` query parameter to `http://localhost:3000`. Here's an example workspace for testing:

https://www.figurl.org/f?v=http://localhost:3000&d=9e9ae4022012e3b2d852b0cfbb7292f8d1e613c6&channel=flatiron1&label=Test%20workspace%20new


## Deploying

To deploy, you will need to have access to the figurl google bucket. Run:

```bash
devel/deploy.sh
```

This will build the app as a static html bundle and upload it to the google bucket. Here is a test link for the deployed version:

https://www.figurl.org/f?v=gs://figurl/sortingview-gui-1&d=9e9ae4022012e3b2d852b0cfbb7292f8d1e613c6&channel=flatiron1&label=Test%20workspace%20new