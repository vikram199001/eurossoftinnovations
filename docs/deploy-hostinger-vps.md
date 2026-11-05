# Deploying to a Hostinger VPS

This guide takes a brand-new Hostinger VPS to a live site at
`https://eurosoftinnovations.com`. It covers users and SSH, the firewall,
Node.js, connecting the server to GitHub, cloning, building, a systemd
service, a deploy script with automatic rollback, and Caddy with automatic
HTTPS. Auto-deploying from GitHub is an optional last step.

**How deploys work:** the server pulls from GitHub, runs `npm ci` and
`npm run build`, then copies the standalone build into a new timestamped
release folder. It switches the `current` symlink to that folder and
restarts the service. If the new release doesn't answer within 15 seconds,
the script switches back to the previous release.

---

## 0. Before you start

### Names used in this guide

| Thing | Value | Notes |
|---|---|---|
| Admin user | `eurosoft` | You log in as this user. Has full `sudo`. |
| Deploy user | `deploy` | Owns the app, runs it, and runs deploys. Can only restart the service. |
| App root | `/opt/apps/eurosoftinnovations` | |
| systemd service | `eurosoftinnovations` | |
| App port | `3000` on `127.0.0.1` | Only Caddy can reach it |
| Repo | `git@github.com:vikram199001/eurossoftinnovations.git` | |
| Package manager | npm (`package-lock.json`) | Don't use pnpm or yarn on the server |
| Node | 24 LTS | |
| Domain | `eurosoftinnovations.com` | `www` redirects to the bare domain |

Wherever you see `VPS_IP`, put in the server's public IPv4 address from hPanel.

### Final layout on the server

```
/opt/apps/eurosoftinnovations/
├── deploy.sh                            # build + release + restart + health check
├── current -> releases/20261105120000   # symlink, switched per deploy
├── releases/
│   └── 20261105120000/                  # one standalone build per deploy (latest 5 kept)
│       ├── server.js
│       ├── node_modules/
│       ├── .next/static/
│       └── public/
├── shared/
│   └── .env                             # optional runtime env vars
└── repo/                                # git clone the builds run from
```

### Check the repo first

- **`next.config.ts` must contain `output: "standalone"`, and that line must
  be committed and pushed.** Without it, `next build` creates no
  `.next/standalone/server.js` and the service can't start.
- **The contact form needs a real Web3Forms access key.**
  `app/contact/page.tsx` currently sends `"YOUR_ACCESS_KEY_HERE"`. Get a key
  at web3forms.com and replace the placeholder, otherwise every form
  submission is rejected. The key is meant to be public (it's sent from the
  browser), so it's fine in the code.

### What you need

- A Hostinger VPS (KVM plan) running **Ubuntu 24.04 LTS**.
- Access to the DNS for `eurosoftinnovations.com`.
- Admin access to `vikram199001/eurossoftinnovations` on GitHub.
- An SSH key on your own machine:

  ```bash
  ssh-keygen -t ed25519 -C "your-name@laptop"
  # Public key is ~/.ssh/id_ed25519.pub (Windows: C:\Users\<you>\.ssh\id_ed25519.pub)
  ```

---

## 1. Prepare the VPS in hPanel

hPanel menu names change from time to time. Look for these settings:

1. **Operating system**: VPS → *OS & Panel* → *Operating System*. Choose
   **Ubuntu 24.04 LTS**, the plain OS. Don't pick a control-panel template
   because it would compete with Caddy for ports 80 and 443.
2. **Root password**: set a strong one during OS setup.
3. **SSH key**: VPS → *Settings* → *SSH keys*. Paste in your
   `id_ed25519.pub`.
4. **Hostinger firewall** (VPS → *Security* → *Firewall*): this is optional
   and runs separately from `ufw`. If you turn it on, allow inbound **TCP
   22, TCP 80, TCP 443, and UDP 443**.
5. Copy the **IPv4 address** (`VPS_IP`), and the IPv6 address if there is
   one.

---

## 2. First login and system update

```bash
ssh root@VPS_IP
```

```bash
apt update && apt full-upgrade -y
apt install -y curl git ufw ca-certificates gnupg unattended-upgrades fail2ban

timedatectl set-timezone Europe/Amsterdam
hostnamectl set-hostname eurosoft-web     # optional

dpkg-reconfigure -plow unattended-upgrades   # answer "Yes"

reboot   # if a new kernel was installed
```

---

## 3. Create the users

### 3.1 Admin user (`eurosoft`)

```bash
ssh root@VPS_IP

adduser eurosoft
usermod -aG sudo eurosoft
rsync --archive --chown=eurosoft:eurosoft ~/.ssh /home/eurosoft
```

**Leave the root session open.** In a second terminal, check the new user
works:

```bash
ssh eurosoft@VPS_IP
sudo whoami        # root
```

### 3.2 Deploy user (`deploy`)

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
sudo install -m 600 -o deploy -g deploy /dev/null /home/deploy/.ssh/authorized_keys
```

`deploy` needs to restart the service and nothing else as root:

```bash
sudo visudo -f /etc/sudoers.d/deploy
```

Paste this, then save:

```
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart eurosoftinnovations
```

```bash
sudo chmod 440 /etc/sudoers.d/deploy
sudo visudo -c        # must report "parsed OK"
```

---

## 4. Harden SSH

Do this only after step 3.1 works. Root can still log in, but **with your
SSH key only**. Passwords are turned off for every user.

On Ubuntu 24.04, `sshd` uses the **first** value it reads for each setting,
and cloud-init may ship `50-cloud-init.conf` with
`PasswordAuthentication yes`. Name your file so it's read first:

```bash
sudo tee /etc/ssh/sshd_config.d/00-hardening.conf > /dev/null <<'EOF'
PermitRootLogin prohibit-password
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers root eurosoft deploy
EOF

sudo sshd -t && sudo systemctl restart ssh
```

Keep your current session open. From a **new** terminal, check:

```bash
ssh eurosoft@VPS_IP   # works
ssh root@VPS_IP       # works with your key
```

- `AllowUsers` has to list `root`. Otherwise it blocks root whatever
  `PermitRootLogin` says.
- To lock root out later, set `PermitRootLogin no` and remove `root` from
  `AllowUsers`.
- To undo this step:
  `sudo rm /etc/ssh/sshd_config.d/00-hardening.conf && sudo systemctl restart ssh`

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

---

## 5. Firewall (ufw)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp      # HTTP/3
sudo ufw enable
sudo ufw status verbose
```

Port 3000 stays closed, and Caddy is the only way in from outside.

---

## 6. Swap

Every deploy runs `next build` on the server. Without swap, a build on the
smaller plans can run out of memory and get killed partway through.

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swappiness.conf
sudo sysctl --system
free -h
```

---

## 7. Install Node.js 24

Install Node system-wide, so systemd finds it at `/usr/bin/node`. npm comes
with it.

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x -o /tmp/nodesource_setup.sh
sudo -E bash /tmp/nodesource_setup.sh
sudo apt install -y nodejs

node --version    # v24.x
npm --version
which node        # /usr/bin/node
```

---

## 8. Create the app directories

```bash
sudo mkdir -p /opt/apps/eurosoftinnovations/{releases,shared}
sudo touch /opt/apps/eurosoftinnovations/shared/.env
sudo chown -R deploy:deploy /opt/apps/eurosoftinnovations
sudo chmod 600 /opt/apps/eurosoftinnovations/shared/.env
```

The site doesn't need runtime env vars at the moment, so `shared/.env`
starts empty. When you add server-side variables later, put them there in
`KEY=value` form, with no quotes and no `export`, and restart the service.

> Variables starting with `NEXT_PUBLIC_` are **baked in at build time**.
> Setting them in `shared/.env` does nothing. Put them in `repo/.env.production`
> before the build instead (the file is ignored by git, so it stays on the
> server).

---

## 9. Connect the server to GitHub and clone

Run these as the `deploy` user:

```bash
sudo -iu deploy
```

### 9.1 Create a read-only deploy key

```bash
ssh-keygen -t ed25519 -C "deploy@eurosoft-vps (github read-only)" \
  -f ~/.ssh/github_readonly -N ""

cat >> ~/.ssh/config <<'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_readonly
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config

cat ~/.ssh/github_readonly.pub   # copy this line
```

### 9.2 Add it to the repository

GitHub → **vikram199001/eurossoftinnovations** → *Settings* → *Deploy keys*
→ *Add deploy key*:

- Title: `eurosoft-vps (read-only)`
- Key: the line you copied
- **Leave "Allow write access" unticked**

### 9.3 Test and clone

```bash
ssh -T git@github.com
# Answer "yes" to the host-key prompt. Expect:
# "Hi vikram199001/eurossoftinnovations! You've successfully authenticated..."

git clone git@github.com:vikram199001/eurossoftinnovations.git \
  /opt/apps/eurosoftinnovations/repo

grep -n standalone /opt/apps/eurosoftinnovations/repo/next.config.*
# must print: output: "standalone",
```

If `grep` prints nothing, the standalone line hasn't been pushed. Push it
from your machine, then run `git -C /opt/apps/eurosoftinnovations/repo pull`.

---

## 10. The deploy script

Still as `deploy`, create the script. You'll run it for every deploy:

```bash
cat > /opt/apps/eurosoftinnovations/deploy.sh <<'SCRIPT'
#!/usr/bin/env bash
# Build the latest main, release it, restart, health-check, roll back on failure.
set -euo pipefail

APP=/opt/apps/eurosoftinnovations
REPO="$APP/repo"
BRANCH="${1:-main}"
KEEP=5
SERVICE=eurosoftinnovations
URL=http://127.0.0.1:3000

echo "==> Updating code ($BRANCH)"
cd "$REPO"
git fetch --prune origin
git reset --hard "origin/$BRANCH"     # the server clone never has local edits
git log -1 --oneline

echo "==> Installing dependencies"
npm ci --no-audit --no-fund

echo "==> Building"
npm run build

if [ ! -f .next/standalone/server.js ]; then
  echo "ERROR: .next/standalone/server.js missing. Is output: \"standalone\" in next.config.ts?"
  exit 1
fi

RELEASE="$(date +%Y%m%d%H%M%S)"
R="$APP/releases/$RELEASE"
echo "==> Creating release $RELEASE"
mkdir -p "$R/.next"
cp -r .next/standalone/. "$R/"
cp -r .next/static "$R/.next/static"
[ -d public ] && cp -r public "$R/public"
[ -f "$APP/shared/.env" ] && ln -sfn "$APP/shared/.env" "$R/.env"

PREV="$(readlink -f "$APP/current" 2>/dev/null || true)"

echo "==> Switching current -> $RELEASE and restarting"
ln -sfn "$R" "$APP/current"
sudo /usr/bin/systemctl restart "$SERVICE"

echo "==> Health check"
ok=0
for _ in $(seq 1 15); do
  if curl -fsS -o /dev/null "$URL"; then ok=1; break; fi
  sleep 1
done

if [ "$ok" != 1 ]; then
  echo "ERROR: $URL did not answer within 15s."
  if [ -n "$PREV" ] && [ -f "$PREV/server.js" ]; then
    echo "==> Rolling back to $(basename "$PREV")"
    ln -sfn "$PREV" "$APP/current"
    sudo /usr/bin/systemctl restart "$SERVICE"
  fi
  exit 1
fi

echo "==> Pruning old releases (keeping $KEEP)"
cd "$APP/releases"
ls -1dt */ | tail -n +$((KEEP + 1)) | xargs -r rm -rf

echo "==> Deployed $RELEASE"
SCRIPT

chmod 750 /opt/apps/eurosoftinnovations/deploy.sh
exit   # back to eurosoft
```

---

## 11. Run the app with systemd

As `eurosoft`:

```bash
sudo tee /etc/systemd/system/eurosoftinnovations.service > /dev/null <<'EOF'
[Unit]
Description=Eurosoft Innovations (Next.js standalone)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=deploy
Group=deploy
WorkingDirectory=/opt/apps/eurosoftinnovations/current
# The leading "-" means a missing file is not an error
EnvironmentFile=-/opt/apps/eurosoftinnovations/shared/.env
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOSTNAME=127.0.0.1
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5

NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=read-only

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable eurosoftinnovations   # enable only; there is no release to run yet
```

`HOSTNAME=127.0.0.1` binds Next only to the loopback interface. Without it,
the standalone server listens on every interface.

### First deploy

```bash
sudo -iu deploy /opt/apps/eurosoftinnovations/deploy.sh
```

It should finish with `==> Deployed 2026…`. Check:

```bash
sudo systemctl status eurosoftinnovations --no-pager
curl -I http://127.0.0.1:3000          # HTTP/1.1 200 OK
```

---

## 12. Point DNS at the VPS

In the DNS zone for `eurosoftinnovations.com` (hPanel → *Domains* →
*DNS / Nameservers*):

| Type | Name | Value |
|---|---|---|
| A | `@` | `VPS_IP` |
| A | `www` | `VPS_IP` |
| AAAA | `@` | VPS IPv6 (only if the VPS has one) |
| AAAA | `www` | VPS IPv6 (only if the VPS has one) |

**Delete any other A or AAAA records for `@` and `www`**, such as
Hostinger's parking records or old CDN entries. A stale AAAA record makes
Let's Encrypt check the wrong server, and the certificate fails. Leave the
MX, SPF, DKIM, and DMARC records as they are.

Check from your machine before you continue:

```bash
nslookup eurosoftinnovations.com
nslookup www.eurosoftinnovations.com
```

Both should return `VPS_IP`.

---

## 13. Install and configure Caddy

### 13.1 Install

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg
sudo chmod o+r /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
caddy version
```

### 13.2 Caddyfile

The app has no host redirects of its own, so Caddy sends `www` to the bare
domain:

```bash
sudo tee /etc/caddy/Caddyfile > /dev/null <<'EOF'
{
	# Let's Encrypt sends expiry and problem notices here
	email info@eurosoftvision.com
}

www.eurosoftinnovations.com {
	redir https://eurosoftinnovations.com{uri} permanent
}

eurosoftinnovations.com {
	encode zstd gzip

	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Content-Type-Options "nosniff"
		Referrer-Policy "strict-origin-when-cross-origin"
		-Server
	}

	reverse_proxy 127.0.0.1:3000

	log {
		output file /var/log/caddy/eurosoftinnovations.log {
			roll_size 10MiB
			roll_keep 5
		}
	}
}

# Optional: add the .nl domain once its DNS points at this server
# eurosoftinnovations.nl, www.eurosoftinnovations.nl {
# 	redir https://eurosoftinnovations.com{uri} permanent
# }
EOF

sudo caddy fmt --overwrite /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Watch Caddy get the certificates:

```bash
journalctl -u caddy -f
# Look for: "certificate obtained successfully"
```

### 13.3 Verify from outside

```bash
curl -I https://eurosoftinnovations.com          # 200
curl -I https://www.eurosoftinnovations.com      # 301 -> https://eurosoftinnovations.com/
curl -I http://eurosoftinnovations.com           # 308 -> https://
```

Open the site in a browser and check every page: `/`, `/about`,
`/services`, `/contact`. Check the images load, and send a test message
through the contact form.

---

## 14. Deploying changes

### Manually

Push to `main` from your machine, then on the server:

```bash
ssh eurosoft@VPS_IP
sudo -iu deploy /opt/apps/eurosoftinnovations/deploy.sh
```

### Automatically on every push (optional)

This GitHub Actions workflow only *triggers* the deploy script over SSH. The
build still runs on the server. The SSH key it uses is locked to running
`deploy.sh` and can't open a shell.

**1. Create the CI key on the server** (as `deploy`):

```bash
sudo -iu deploy
ssh-keygen -t ed25519 -C "github-actions -> deploy@eurosoft-vps" -f ~/gha_deploy -N ""

# command="..." means this key can ONLY run deploy.sh, whatever the client asks for
echo "restrict,command=\"/opt/apps/eurosoftinnovations/deploy.sh\" $(cat ~/gha_deploy.pub)" \
  >> ~/.ssh/authorized_keys

cat ~/gha_deploy     # copy the WHOLE private key, BEGIN and END lines included
```

**2. Add repository secrets.** GitHub → repo → *Settings* → *Secrets and
variables* → *Actions*:

| Secret | Value |
|---|---|
| `SERVER_HOST` | `VPS_IP` |
| `SERVER_USER` | `deploy` |
| `SERVER_SSH_KEY` | the private key from step 1 |

Then delete the private key from the server:

```bash
shred -u ~/gha_deploy && rm -f ~/gha_deploy.pub
exit
```

**3. Add `.github/workflows/deploy.yml` to the repo:**

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: production
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - name: Run deploy script on the VPS
        env:
          SSH_KEY: ${{ secrets.SERVER_SSH_KEY }}
          SSH_HOST: ${{ secrets.SERVER_HOST }}
          SSH_USER: ${{ secrets.SERVER_USER }}
        run: |
          set -euo pipefail
          mkdir -p ~/.ssh && chmod 700 ~/.ssh
          printf '%s\n' "$SSH_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -T 10 -H "$SSH_HOST" > ~/.ssh/known_hosts
          ssh -i ~/.ssh/deploy_key "$SSH_USER@$SSH_HOST"
```

The `ssh` line passes no command on purpose: the `command=` restriction
from step 1 runs `deploy.sh`. If the script fails, including a failed
health check, the job fails and the site stays on the previous release.

---

## 15. Day-to-day operations

### Logs

```bash
journalctl -u eurosoftinnovations -f                    # app
journalctl -u caddy -f                                  # proxy and certificates
sudo tail -f /var/log/caddy/eurosoftinnovations.log     # access log (JSON)
```

Read the journal as `eurosoft`. The `deploy` user doesn't have permission to
read the system journal.

### Roll back by hand

```bash
ls -1t /opt/apps/eurosoftinnovations/releases           # newest first
sudo -u deploy ln -sfn /opt/apps/eurosoftinnovations/releases/<PREVIOUS> \
  /opt/apps/eurosoftinnovations/current
sudo systemctl restart eurosoftinnovations
```

### Change runtime env vars

```bash
sudo -u deploy nano /opt/apps/eurosoftinnovations/shared/.env
sudo systemctl restart eurosoftinnovations
```

---

## 16. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Cannot find module '…/server.js'` | Release has no server: `output: "standalone"` not in the pushed `next.config.ts` | Commit and push it, run `deploy.sh` again |
| `curl: Failed to connect … port 3000` right after a restart | Next takes a second or two to start | Wait a few seconds. `deploy.sh` already retries for 15s. |
| `502 Bad Gateway` from Caddy | App not running | `sudo systemctl status eurosoftinnovations`, `sudo journalctl -u eurosoftinnovations -n 50` |
| `npm ci` fails: lockfile out of sync | `package-lock.json` doesn't match `package.json` | On your machine run `npm install`, commit the lockfile, push |
| `next build` killed / `JavaScript heap out of memory` | Not enough RAM | Add swap (step 6) |
| `deploy.sh`: `sudo: a password is required` | Sudoers line missing or different | Step 3.2. The path must be `/usr/bin/systemctl restart eurosoftinnovations`. |
| `git fetch`: `Permission denied (publickey)` | Deploy key missing on GitHub, or `~/.ssh/config` wrong | Step 9.1–9.3, test with `ssh -T git@github.com` as `deploy` |
| Caddy: `challenge failed` / `no valid A records` | DNS not propagated, stale AAAA, or port 80 blocked | Step 12, `sudo ufw status`, Hostinger firewall |
| Images missing in production | `public/` not copied into the release | `ls /opt/apps/eurosoftinnovations/current/public`. The deploy script copies it. |
| Contact form always fails | Web3Forms access key is still the placeholder | Replace `YOUR_ACCESS_KEY_HERE` in `app/contact/page.tsx` |
| CI job: `Permission denied (publickey)` | Secret pasted incompletely or key not in `authorized_keys` | Step 14.1–14.2 |

---

## Checklist

- [ ] `output: "standalone"` committed and pushed
- [ ] Web3Forms access key set in `app/contact/page.tsx`
- [ ] Ubuntu 24.04 installed, SSH key added in hPanel
- [ ] `eurosoft` (sudo) and `deploy` (restart-only sudo) users created
- [ ] SSH hardened: keys only, root with key only, logins confirmed
- [ ] ufw allows 22, 80, 443/tcp, 443/udp. Hostinger firewall matches.
- [ ] Swap on, Node 24 at `/usr/bin/node`
- [ ] Read-only deploy key added on GitHub, repo cloned to `repo/`
- [ ] `deploy.sh` in place, service enabled, first deploy succeeded
- [ ] DNS A/AAAA records point at the VPS, stale records removed
- [ ] HTTPS works, `www` redirects to the bare domain
- [ ] All four pages, images, and the contact form work
- [ ] (Optional) CI secrets set, workflow added, push to `main` deploys
