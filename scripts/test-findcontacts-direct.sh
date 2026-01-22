#!/bin/bash

# ================================================================
# Script de Teste: GET /chat/findContacts
# Testa o endpoint DEFINITIVO que a Evolution API usa
# ================================================================

EVOLUTION_API_URL="https://evolution-api-production-eb21.up.railway.app"
INSTANCE_NAME="whatsapp-principal"
API_KEY="Beagle3005"

# Número de telefone para testar (sem @s.whatsapp.net)
PHONE_NUMBER="${1:-5521988960217}"

echo "📸 ===== TESTE GET /chat/findContacts ====="
echo "📸 URL: ${EVOLUTION_API_URL}/chat/findContacts/${INSTANCE_NAME}?number=${PHONE_NUMBER}"
echo "📸 Método: GET"
echo "📸 API Key: ${API_KEY:0:3}***${API_KEY: -4}"
echo ""

curl -v -X GET \
  "${EVOLUTION_API_URL}/chat/findContacts/${INSTANCE_NAME}?number=${PHONE_NUMBER}" \
  -H "apikey: ${API_KEY}" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo "📸 ====================================="
echo "📸 Se aparecer profilePicUrl: SUCESSO!"
echo "📸 Se der 404: Endpoint não existe"
echo "📸 Se der 401: Chave API incorreta"
echo "📸 ====================================="
