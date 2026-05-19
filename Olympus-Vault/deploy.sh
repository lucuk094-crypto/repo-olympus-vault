#!/bin/bash

# Olympus Vault - Deployment Manager (Linux/Mac)

show_menu() {
    clear
    echo ""
    echo "  ╔════════════════════════════════════════════════════════╗"
    echo "  ║                                                        ║"
    echo "  ║           🏛️  OLYMPUS VAULT DEPLOYMENT 🏛️              ║"
    echo "  ║                                                        ║"
    echo "  ╚════════════════════════════════════════════════════════╝"
    echo ""
    echo "  [1] Setup Environment (.env)"
    echo "  [2] Run Local Development"
    echo "  [3] Deploy to Vercel"
    echo "  [4] Deploy to Netlify"
    echo "  [5] Deploy to Railway"
    echo "  [6] Install Dependencies"
    echo "  [7] Generate SECRET_KEY"
    echo "  [0] Exit"
    echo ""
    echo "  ════════════════════════════════════════════════════════"
    echo ""
    read -p "  Select option (0-7): " choice

    case $choice in
        1) setup_env ;;
        2) run_local ;;
        3) deploy_vercel ;;
        4) deploy_netlify ;;
        5) deploy_railway ;;
        6) install_deps ;;
        7) generate_key ;;
        0) exit 0 ;;
        *) show_menu ;;
    esac
}

setup_env() {
    echo ""
    echo "[SETUP] Creating environment..."
    python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))" > .env
    echo "UPLOAD_FOLDER=static/uploads" >> .env
    echo "DATABASE_PATH=backend/vault.db" >> .env
    echo "PORT=5000" >> .env

    mkdir -p static/uploads/{documents,images,videos,apk,others}

    echo ""
    echo ".env file created!"
    read -p "Press Enter to continue..."
    show_menu
}

run_local() {
    echo ""
    echo "[LOCAL] Starting development server..."

    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
    fi

    source venv/bin/activate
    pip install -r requirements.txt
    python backend/app.py

    read -p "Press Enter to continue..."
    show_menu
}

deploy_vercel() {
    echo ""
    echo "[VERCEL] Deploying to Vercel..."

    if ! command -v vercel &> /dev/null; then
        echo "ERROR: Vercel CLI not found!"
        echo "Install: npm install -g vercel"
        read -p "Press Enter to continue..."
        show_menu
        return
    fi

    vercel --prod

    read -p "Press Enter to continue..."
    show_menu
}

deploy_netlify() {
    echo ""
    echo "[NETLIFY] Deploying to Netlify..."

    if ! command -v netlify &> /dev/null; then
        echo "ERROR: Netlify CLI not found!"
        echo "Install: npm install -g netlify-cli"
        read -p "Press Enter to continue..."
        show_menu
        return
    fi

    netlify deploy --prod

    read -p "Press Enter to continue..."
    show_menu
}

deploy_railway() {
    echo ""
    echo "[RAILWAY] Deploying to Railway..."

    if ! command -v railway &> /dev/null; then
        echo "ERROR: Railway CLI not found!"
        echo "Install: npm install -g @railway/cli"
        read -p "Press Enter to continue..."
        show_menu
        return
    fi

    railway login
    railway init
    railway up
    railway open

    read -p "Press Enter to continue..."
    show_menu
}

install_deps() {
    echo ""
    echo "[INSTALL] Installing dependencies..."

    if ! command -v python3 &> /dev/null; then
        echo "ERROR: Python not found!"
        read -p "Press Enter to continue..."
        show_menu
        return
    fi

    pip install -r requirements.txt
    echo ""
    echo "Dependencies installed successfully!"

    read -p "Press Enter to continue..."
    show_menu
}

generate_key() {
    echo ""
    echo "[GENERATE] Creating SECRET_KEY..."
    echo ""
    echo "Your SECRET_KEY:"
    python3 -c "import secrets; print(secrets.token_hex(32))"
    echo ""
    echo "Copy this key to your .env file or platform dashboard"

    read -p "Press Enter to continue..."
    show_menu
}

# Start
cd "$(dirname "$0")"
show_menu
