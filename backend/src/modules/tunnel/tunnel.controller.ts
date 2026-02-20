/**
 * @file tunnel.controller.ts
 * @description Rabbit Hole Ollama Tunnel endpoints.
 *
 * Routes (all prefixed with /api):
 * - GET    /tunnel/token       (auth)  -> get current tunnel token (masked)
 * - POST   /tunnel/token       (auth)  -> create token (returns plaintext once)
 * - PATCH  /tunnel/token       (auth)  -> rotate token (returns plaintext once)
 * - DELETE /tunnel/token       (auth)  -> revoke token
 *
 * - GET    /tunnel/heartbeat   (auth)  -> tunnel status for current user
 * - POST   /tunnel/heartbeat   (token) -> heartbeat register/update
 *
 * - GET    /tunnel/script      (auth)  -> download tunnel script
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Headers,
  Body,
  UseGuards,
  ForbiddenException,
  NotFoundException,
  HttpException,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { VaultService } from '../wunderland/vault/vault.service.js';
import { TunnelService } from './tunnel.service.js';
import { randomBytes } from 'node:crypto';

const CREDENTIAL_TYPE = 'tunnel_token';
const LABEL = 'Ollama Tunnel';

function pickTunnelKey<T extends { credentialType?: string; label?: string }>(
  items: T[]
): T | undefined {
  const typed = items.filter((k) => k.credentialType === CREDENTIAL_TYPE);
  const byLabel = typed.find(
    (k) =>
      String(k.label ?? '')
        .trim()
        .toLowerCase() === LABEL.toLowerCase()
  );
  if (byLabel) return byLabel;
  return typed[0];
}

function siteOrigin(): string {
  return (
    process.env.RABBITHOLE_SITE_URL ||
    process.env.AUTH_URL ||
    process.env.FRONTEND_URL ||
    'https://rabbithole.inc'
  ).replace(/\/+$/, '');
}

function assertProOrEnterprise(user: any): void {
  const status = String(user?.subscriptionStatus ?? user?.subscription_status ?? '').toLowerCase();
  const plan = String(user?.planId ?? user?.plan_id ?? '').toLowerCase();
  const role = String(user?.role ?? '').toLowerCase();

  const isActive = ['active', 'trialing', 'unlimited'].includes(status) || role === 'admin';
  const isProOrEnterprise = ['pro', 'enterprise'].includes(plan) || role === 'admin';

  if (!isActive) throw new ForbiddenException('Active subscription required');
  if (!isProOrEnterprise)
    throw new ForbiddenException('Pro or Enterprise plan required for Ollama Tunnel');
}

function generateTunnelToken(userId: string): string {
  const userIdEncoded = Buffer.from(String(userId), 'utf8').toString('base64url');
  return `rht.${userIdEncoded}.${randomBytes(32).toString('hex')}`;
}

@Controller('tunnel')
export class TunnelController {
  public constructor(
    private readonly vault: VaultService,
    private readonly tunnelService: TunnelService
  ) {}

  // ── Token CRUD ────────────────────────────────────────────────────────────

  @UseGuards(AuthGuard)
  @Get('token')
  async getToken(@CurrentUser() user: any, @CurrentUser('id') userId: string) {
    assertProOrEnterprise(user);
    const { items } = await this.vault.listKeys(userId);
    const key = pickTunnelKey(items);
    return {
      exists: Boolean(key),
      token: key
        ? {
            id: key.id,
            maskedValue: key.maskedValue,
            createdAt: key.createdAt,
            lastUsedAt: key.lastUsedAt ?? null,
          }
        : null,
    };
  }

  @UseGuards(AuthGuard)
  @Post('token')
  @HttpCode(HttpStatus.OK)
  async createToken(@CurrentUser() user: any, @CurrentUser('id') userId: string) {
    assertProOrEnterprise(user);

    const value = generateTunnelToken(userId);
    const { key } = await this.vault.createKey(userId, {
      credentialType: CREDENTIAL_TYPE,
      label: LABEL,
      value,
    });

    return {
      token: {
        id: key.id,
        value,
        maskedValue: key.maskedValue,
        createdAt: key.createdAt,
        lastUsedAt: key.lastUsedAt ?? null,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Patch('token')
  async rotateToken(@CurrentUser() user: any, @CurrentUser('id') userId: string) {
    assertProOrEnterprise(user);

    const { items } = await this.vault.listKeys(userId);
    const existing = pickTunnelKey(items);
    if (existing) {
      await this.vault.deleteKey(userId, existing.id);
    }

    const value = generateTunnelToken(userId);
    const { key } = await this.vault.createKey(userId, {
      credentialType: CREDENTIAL_TYPE,
      label: LABEL,
      value,
    });

    return {
      token: {
        id: key.id,
        value,
        maskedValue: key.maskedValue,
        createdAt: key.createdAt,
        lastUsedAt: key.lastUsedAt ?? null,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Delete('token')
  async revokeToken(@CurrentUser() user: any, @CurrentUser('id') userId: string) {
    assertProOrEnterprise(user);

    const { items } = await this.vault.listKeys(userId);
    const existing = pickTunnelKey(items);
    if (!existing) throw new NotFoundException('No tunnel token found');
    await this.vault.deleteKey(userId, existing.id);
    return { deleted: true };
  }

  // ── Status (auth) ─────────────────────────────────────────────────────────

  @UseGuards(AuthGuard)
  @Get('heartbeat')
  async getHeartbeat(@CurrentUser() user: any, @CurrentUser('id') userId: string) {
    assertProOrEnterprise(user);
    return this.tunnelService.getStatusForUser(userId);
  }

  @UseGuards(AuthGuard)
  @Get('status')
  async getStatus(@CurrentUser() user: any, @CurrentUser('id') userId: string) {
    assertProOrEnterprise(user);
    return this.tunnelService.getStatusForUser(userId);
  }

  // ── Heartbeat (token) ────────────────────────────────────────────────────

  @Post('heartbeat')
  async postHeartbeat(
    @Headers('x-tunnel-token') tunnelToken: string | undefined,
    @Body() body: any
  ) {
    const ollamaUrl = body?.ollamaUrl ?? body?.ollamaHost ?? null;
    const models = body?.models ?? [];
    const version = body?.version ?? null;
    const disconnecting = body?.disconnecting === true;

    const result = await this.tunnelService.upsertHeartbeat({
      tunnelToken: String(tunnelToken ?? ''),
      ollamaUrl: typeof ollamaUrl === 'string' ? ollamaUrl : null,
      models,
      version,
      disconnecting,
    });

    if (!result.ok) {
      throw new HttpException({ message: result.message, error: result.message }, result.status);
    }

    return {
      status: 'ok',
      registered: result.status.connected,
      ollamaUrl: result.status.ollamaUrl,
      models: result.status.models,
      nextHeartbeatIn: 30,
    };
  }

  // ── Script download ──────────────────────────────────────────────────────

  @UseGuards(AuthGuard)
  @Get('script')
  async downloadScript(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @CurrentUser('email') email: string,
    @Res() res: Response
  ): Promise<void> {
    assertProOrEnterprise(user);

    const { items } = await this.vault.listKeys(userId);
    const tunnelKey = pickTunnelKey(items);
    if (!tunnelKey) throw new NotFoundException('No tunnel token found. Generate one first.');

    const origin = siteOrigin();
    const planRaw = String(user?.planId ?? '').toLowerCase();
    const planLabel = planRaw ? planRaw.charAt(0).toUpperCase() + planRaw.slice(1) : 'Pro';

    const script = `#!/usr/bin/env bash
# ============================================================================
# Rabbit Hole Ollama Tunnel v2.1
# Connects your local Ollama to your Rabbit Hole ${planLabel} account via
# Cloudflare Tunnel — no port forwarding, no firewall changes needed.
#
# Generated for: ${email || userId}
# Manage token:  ${origin}/app/account/tunnel
#
# Tip: For best results, auto-detect + pull optimal models:
#   npm i -g wunderland && wunderland ollama-setup
#
# How it works:
#   1. Verifies Ollama is running locally
#   2. Auto-installs cloudflared if needed (free, by Cloudflare)
#   3. Opens a secure tunnel: localhost:11434 → public HTTPS URL
#   4. Registers the URL with your Rabbit Hole account
#   5. Our server routes inference requests through the tunnel to your Ollama
# ============================================================================

set -euo pipefail

# ── Configuration ───────────────────────────────────────────────────────────
RABBITHOLE_API="${origin}/api"
TUNNEL_TOKEN="${tunnelKey.maskedValue.includes('••') ? '<YOUR_TOKEN>' : tunnelKey.maskedValue}"
OLLAMA_HOST="\${OLLAMA_HOST:-http://localhost:11434}"
OLLAMA_PORT="\${OLLAMA_PORT:-11434}"
HEARTBEAT_INTERVAL="\${HEARTBEAT_INTERVAL:-30}"
VERSION="2.1.0"
CLOUDFLARED_PID=""
TUNNEL_URL=""

# ── Colors ──────────────────────────────────────────────────────────────────
RED='\\033[0;31m'
GREEN='\\033[0;32m'
GOLD='\\033[0;33m'
CYAN='\\033[0;36m'
DIM='\\033[2m'
NC='\\033[0m'

log()   { echo -e "\${CYAN}[tunnel]\${NC} $1"; }
ok()    { echo -e "\${GREEN}  ✓\${NC} $1"; }
warn()  { echo -e "\${GOLD}  ⚠\${NC} $1"; }
error() { echo -e "\${RED}  ✗\${NC} $1" >&2; }
step()  { echo -e "\\n\${GOLD}──\${NC} $1"; }

# ── Token override ──────────────────────────────────────────────────────────
if [[ "$TUNNEL_TOKEN" == *"••"* ]] || [[ "$TUNNEL_TOKEN" == "<YOUR_TOKEN>" ]]; then
  if [[ -n "\${RH_TUNNEL_TOKEN:-}" ]]; then
    TUNNEL_TOKEN="$RH_TUNNEL_TOKEN"
  elif [[ -n "\${1:-}" ]]; then
    TUNNEL_TOKEN="$1"
  else
    error "No tunnel token found."
    echo "  Set RH_TUNNEL_TOKEN env var or pass as first argument:"
    echo "    ./rabbithole-tunnel.sh <YOUR_TUNNEL_TOKEN>"
    echo ""
    echo "  Generate a token at: ${origin}/app/account/tunnel"
    exit 1
  fi
fi

# ── Cleanup on exit ─────────────────────────────────────────────────────────
cleanup() {
  echo ""
  log "Shutting down..."
  if [[ -n "$CLOUDFLARED_PID" ]]; then
    kill "$CLOUDFLARED_PID" 2>/dev/null || true
    wait "$CLOUDFLARED_PID" 2>/dev/null || true
    ok "Cloudflare tunnel closed"
  fi
  # Deregister from Rabbit Hole
  curl -sf -X POST "$RABBITHOLE_API/tunnel/heartbeat" \\
    -H "Content-Type: application/json" \\
    -H "X-Tunnel-Token: $TUNNEL_TOKEN" \\
    -d '{"ollamaUrl": "", "models": [], "version": "'""$VERSION""'", "disconnecting": true}' \\
    &>/dev/null || true
  log "Tunnel disconnected."
  exit 0
}
trap cleanup INT TERM EXIT

# ── Dependency checks ───────────────────────────────────────────────────────
check_deps() {
  step "Checking dependencies"
  for cmd in curl jq; do
    if command -v "$cmd" &>/dev/null; then
      ok "$cmd"
    else
      error "$cmd is required but not installed."
      exit 1
    fi
  done
}

# ── Ollama check ────────────────────────────────────────────────────────────
check_ollama() {
  step "Checking Ollama at $OLLAMA_HOST"
  local response
  if response=$(curl -sf "$OLLAMA_HOST/api/tags" 2>/dev/null); then
    local count
    count=$(echo "$response" | jq '.models | length' 2>/dev/null || echo "0")
    ok "Ollama running — $count model(s) available"

    if [[ "$count" -eq 0 ]]; then
      warn "No models found."
      echo "  Recommended: npm i -g wunderland && wunderland ollama-setup"
      echo "  Or pull one: ollama pull llama3.1:8b"
      echo ""
      exit 1
    fi

    echo "$response" | jq -r '.models[].name' 2>/dev/null | while read -r model; do
      echo -e "      \${DIM}→ $model\${NC}"
    done
  else
    error "Cannot reach Ollama at $OLLAMA_HOST"
    echo ""
    echo "  Install: https://ollama.ai/download"
    echo "  Then:    ollama serve"
    exit 1
  fi
}

# ── Cloudflared install ─────────────────────────────────────────────────────
install_cloudflared() {
  step "Checking cloudflared"

  if command -v cloudflared &>/dev/null; then
    local cf_version
    cf_version=$(cloudflared --version 2>&1 | head -1)
    ok "cloudflared installed ($cf_version)"
    return 0
  fi

  log "cloudflared not found — installing..."

  local os arch
  os=$(uname -s | tr '[:upper:]' '[:lower:]')
  arch=$(uname -m)

  case "$arch" in
    x86_64|amd64) arch="amd64" ;;
    aarch64|arm64) arch="arm64" ;;
    armv7l|armhf)  arch="arm"   ;;
    *)
      error "Unsupported architecture: $arch"
      echo "  Install cloudflared manually: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/"
      exit 1
      ;;
  esac

  local url=""
  local install_dir="\${HOME}/.local/bin"

  case "$os" in
    linux)
      url="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-\${arch}"
      mkdir -p "$install_dir"
      log "Downloading cloudflared for Linux/\${arch}..."
      if curl -fsSL "$url" -o "\${install_dir}/cloudflared"; then
        chmod +x "\${install_dir}/cloudflared"
        export PATH="\${install_dir}:$PATH"
        ok "Installed to \${install_dir}/cloudflared"
      else
        error "Download failed. Install manually:"
        echo "  https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/"
        exit 1
      fi
      ;;
    darwin)
      if command -v brew &>/dev/null; then
        log "Installing via Homebrew..."
        brew install cloudflared 2>/dev/null
        ok "Installed via Homebrew"
      else
        url="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-\${arch}.tgz"
        log "Downloading cloudflared for macOS/\${arch}..."
        mkdir -p "$install_dir"
        if curl -fsSL "$url" | tar xz -C "$install_dir" 2>/dev/null; then
          chmod +x "\${install_dir}/cloudflared"
          export PATH="\${install_dir}:$PATH"
          ok "Installed to \${install_dir}/cloudflared"
        else
          url="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-\${arch}"
          if curl -fsSL "$url" -o "\${install_dir}/cloudflared"; then
            chmod +x "\${install_dir}/cloudflared"
            export PATH="\${install_dir}:$PATH"
            ok "Installed to \${install_dir}/cloudflared"
          else
            error "Download failed. Install manually:"
            echo "  brew install cloudflared"
            exit 1
          fi
        fi
      fi
      ;;
    *)
      error "Unsupported OS: $os"
      echo "  Install cloudflared manually: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/"
      exit 1
      ;;
  esac

  if ! command -v cloudflared &>/dev/null; then
    error "cloudflared installation failed."
    exit 1
  fi
}

# ── Start Cloudflare Tunnel ─────────────────────────────────────────────────
start_cloudflare_tunnel() {
  step "Starting Cloudflare Tunnel"
  log "Exposing localhost:$OLLAMA_PORT → public HTTPS URL..."

  local log_file
  log_file=$(mktemp /tmp/cloudflared-XXXXXX.log)

  cloudflared tunnel --url "http://localhost:$OLLAMA_PORT" \\
    --no-autoupdate \\
    --logfile "$log_file" \\
    2>&1 &
  CLOUDFLARED_PID=$!

  local attempts=0
  while [[ $attempts -lt 30 ]]; do
    if [[ -f "$log_file" ]]; then
      TUNNEL_URL=$(grep -oE 'https://[a-z0-9-]+\\.trycloudflare\\.com' "$log_file" 2>/dev/null | head -1 || true)
      if [[ -n "$TUNNEL_URL" ]]; then
        break
      fi
    fi
    sleep 1
    attempts=$((attempts + 1))
  done

  if [[ -z "$TUNNEL_URL" ]]; then
    if ! kill -0 "$CLOUDFLARED_PID" 2>/dev/null; then
      error "cloudflared exited unexpectedly. Check logs:"
      echo "    $log_file"
      cat "$log_file" 2>/dev/null | tail -5
      exit 1
    fi
    error "Timed out waiting for tunnel URL."
    echo "    Check logs: $log_file"
    exit 1
  fi

  ok "Tunnel active: $TUNNEL_URL"
  echo -e "      \${DIM}PID: $CLOUDFLARED_PID | Log: $log_file\${NC}"
}

# ── Register with Rabbit Hole ───────────────────────────────────────────────
register_tunnel() {
  step "Registering with Rabbit Hole"

  local models
  models=$(curl -sf "$OLLAMA_HOST/api/tags" | jq -c '[.models[].name]' 2>/dev/null || echo '[]')

  local response status
  response=$(curl -sf -w "\\n%{http_code}" \\
    -X POST "$RABBITHOLE_API/tunnel/heartbeat" \\
    -H "Content-Type: application/json" \\
    -H "X-Tunnel-Token: $TUNNEL_TOKEN" \\
    -d "{
      \\"ollamaUrl\\": \\"$TUNNEL_URL\\",
      \\"models\\": $models,
      \\"version\\": \\"$VERSION\\"
    }" 2>/dev/null) || true

  status=$(echo "$response" | tail -1)

  case "$status" in
    200|201)
      ok "Registered — Rabbit Hole can now route requests to your Ollama"
      ;;
    401|403)
      error "Authentication failed. Token may be revoked or expired."
      echo "  Regenerate at: ${origin}/app/account/tunnel"
      exit 1
      ;;
    "")
      warn "Could not reach Rabbit Hole API — tunnel will retry on heartbeat"
      ;;
    *)
      warn "Registration returned HTTP $status"
      ;;
  esac
}

# ── Heartbeat loop ──────────────────────────────────────────────────────────
run_heartbeat() {
  step "Tunnel connected"
  echo ""
  echo -e "  \${CYAN}Local Ollama\${NC}   → $OLLAMA_HOST"
  echo -e "  \${CYAN}Tunnel URL\${NC}     → $TUNNEL_URL"
  echo -e "  \${CYAN}Rabbit Hole\${NC}    → $RABBITHOLE_API"
  echo -e "  \${CYAN}Plan\${NC}           → ${planLabel}"
  echo -e "  \${CYAN}Heartbeat\${NC}      → every \${HEARTBEAT_INTERVAL}s"
  echo ""
  echo -e "  \${DIM}Simple requests → local Ollama (free)\${NC}"
  echo -e "  \${DIM}Complex requests → cloud LLM credits\${NC}"
  echo ""
  echo "  Press Ctrl+C to disconnect."
  echo ""

  while true; do
    if ! kill -0 "$CLOUDFLARED_PID" 2>/dev/null; then
      error "Cloudflare tunnel process died. Restarting..."
      start_cloudflare_tunnel
      register_tunnel
    fi

    local models
    models=$(curl -sf "$OLLAMA_HOST/api/tags" | jq -c '[.models[].name]' 2>/dev/null || echo '[]')

    curl -sf -X POST "$RABBITHOLE_API/tunnel/heartbeat" \\
      -H "Content-Type: application/json" \\
      -H "X-Tunnel-Token: $TUNNEL_TOKEN" \\
      -d "{
        \\"ollamaUrl\\": \\"$TUNNEL_URL\\",
        \\"models\\": $models,
        \\"version\\": \\"$VERSION\\"
      }" &>/dev/null || true

    sleep "$HEARTBEAT_INTERVAL"
  done
}

# ── Main ────────────────────────────────────────────────────────────────────
echo ""
echo -e "\${GOLD}╔══════════════════════════════════════════════╗\${NC}"
echo -e "\${GOLD}║\${NC}   Rabbit Hole Ollama Tunnel v$VERSION          \${GOLD}║\${NC}"
echo -e "\${GOLD}║\${NC}   \${DIM}Powered by Cloudflare Tunnel\${NC}               \${GOLD}║\${NC}"
echo -e "\${GOLD}╚══════════════════════════════════════════════╝\${NC}"

check_deps
check_ollama
install_cloudflared
start_cloudflare_tunnel
register_tunnel
run_heartbeat
`;

    res.setHeader('Content-Type', 'application/x-sh');
    res.setHeader('Content-Disposition', 'attachment; filename="rabbithole-tunnel.sh"');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(script);
  }
}
