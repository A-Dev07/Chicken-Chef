#!/usr/bin/env bash
# ============================================================
# Chicken Chef – Backend Setup Script
# Run once from the project root: bash backend/setup_backend.sh
# ============================================================
set -e
CYAN="\033[0;36m"; GREEN="\033[0;32m"; YELLOW="\033[1;33m"; BOLD="\033[1m"; R="\033[0m"
log()  { echo -e "${CYAN}[setup]${R} $*"; }
ok()   { echo -e "${GREEN}[ok]${R}    $*"; }
warn() { echo -e "${YELLOW}[warn]${R}  $*"; }

echo ""
echo -e "${BOLD}=================================================${R}"
echo -e "${BOLD}   Chicken Chef – Backend Setup                 ${R}"
echo -e "${BOLD}=================================================${R}"
echo ""

# ── 1. Check PHP ───────────────────────────────────────────
if ! command -v php &>/dev/null; then
  echo -e "${YELLOW}PHP not found. Install it first:${R}"
  echo "  Ubuntu/Debian : sudo apt install php php-pgsql"
  echo "  macOS (brew)  : brew install php"
  exit 1
fi
PHP_VER=$(php -r 'echo PHP_MAJOR_VERSION . "." . PHP_MINOR_VERSION;')
log "PHP $PHP_VER found."

# Check pdo_pgsql extension
if php -r 'exit(extension_loaded("pdo_pgsql") ? 0 : 1);'; then
  ok "pdo_pgsql extension is loaded."
else
  warn "pdo_pgsql is NOT loaded!"
  echo ""
  echo "  Ubuntu/Debian : sudo apt install php-pgsql && sudo phpenmod pdo_pgsql"
  echo "  macOS (brew)  : brew install php && pecl install pdo_pgsql"
  echo ""
  echo "  Then re-run this script."
  exit 1
fi

# ── 2. Check psql (PostgreSQL client) ──────────────────────
if ! command -v psql &>/dev/null; then
  warn "psql not found. Skipping DB creation — run setup.sql manually."
  warn "  psql -U postgres -f backend/setup.sql"
else
  log "Running setup.sql…"
  PGPASSWORD="${PGPASSWORD:-postgres}" psql -U "${PGUSER:-postgres}" \
    -h 127.0.0.1 -p 5432 \
    -f "$(dirname "$0")/setup.sql" || {
      warn "DB setup failed. Check your PostgreSQL credentials in backend/config.php"
    }
  ok "Database ready."
fi

# ── 3. Done ─────────────────────────────────────────────────
echo ""
echo -e "${BOLD}=================================================${R}"
echo -e "${GREEN}${BOLD}  Setup complete! 🎉                            ${R}"
echo -e "${BOLD}=================================================${R}"
echo ""
echo -e "  Start the PHP backend server:"
echo -e "  ${BOLD}cd backend && php -S localhost:8000${R}"
echo ""
echo -e "  (In a separate terminal, start React:)"
echo -e "  ${BOLD}npm run dev${R}"
echo ""
