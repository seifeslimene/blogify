# scripts

This directory contains two scripts.

## `deploy.sh`

Used when the server is first deployed, it depends on `nodejs`, `pnpm` and `pm2`.

```shell
#!/bin/bash

cd /apps/blogify
git checkout main
git pull

pnpm install
pnpm run build
pnpm run pm2

pm2 startup
pm2 save
```

## `update.sh`

Used when the project is updated, and used with `webhook` to achieve automated deployment.

```shell
#!/bin/bash

cd /apps/blogify
git checkout refactor/pnpm
git pull

pnpm install
pnpm run build

pm2 reload @blogify/server
pm2 reload @blogify/client
pm2 reload @blogify/admin
```

## Automated deployment

After the server is deployed for the first time, it will be troublesome to manually update each iteration later. At this time, you can use `github webhook` to achieve automated deployment.

### Step 1: Configure webhook on your server

Install [webhook](https://github.com/adnanh/webhook/blob/master/docs/Hook-Examples.md#incoming-github-webhook) on your server, then write `hooks` and run it in the background `webhook`.

```shell
# Step 1: Write hooks.json
touch hooks.json

# Step 2: Create webhook.log
touch webhook.log

# Step 3: Run webhook in the background
nohup webhook -hooks hooks.json -hotreload -logfile webhook.log &
```

Hooks configuration example:

```json
[
  {
    "id": "blogify-auto-update",
    "execute-command": "/apps/blogify/scripts/update.sh", // Pay attention to modify the script path according to the project
    "command-working-directory": "/apps/blogify/",
    "http-methods": ["POST"],
    "pass-arguments-to-command": [
      {
        "source": "payload",
        "name": "head_commit.id"
      },
      {
        "source": "payload",
        "name": "pusher.name"
      },
      {
        "source": "payload",
        "name": "pusher.email"
      }
    ],
    "trigger-rule": {
      "and": [
        {
          "match": {
            "type": "payload-hmac-sha256",
            "secret": "please-rebuild-think",
            "parameter": {
              "source": "header",
              "name": "X-Hub-Signature-256"
            }
          }
        },
        {
          "match": {
            "type": "value",
            "value": "refs/heads/main",
            "parameter": {
              "source": "payload",
              "name": "ref"
            }
          }
        }
      ]
    }
  }
]
```

### Step 2: Test the webhook

Essentially, webhook starts a service on the server and then calls the corresponding URL through HTTP to trigger the execution of the specified script.

> For example, the webhook of the blogify project: <http://124.221.147.83:9000/hooks/blogify-auto-update>

Taking Github as an example, find the webhooks configuration specified URL in the settings. Note that `Content type` is `application/json`.
