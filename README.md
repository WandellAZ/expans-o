# Sistema de Detecção de Dispositivos Móveis

Este projeto implementa um sistema de detecção de dispositivos móveis usando **User Agent String**, conforme solicitado.

## Como Funciona

O sistema usa JavaScript para detectar dispositivos móveis através da string User Agent que o navegador envia automaticamente. A função principal é:

```javascript
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
```

## Características

- ✅ **Detecção por User Agent**: Método simples e eficaz
- ✅ **Identificação específica**: Poco M5 Pro, Samsung A34/A54/A55
- ✅ **Fallback para Android**: Dispositivos Android genéricos
- ✅ **Interface responsiva**: Design adaptável para diferentes telas
- ✅ **Debug visual**: Mostra informações de detecção

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor:
```bash
npm start
```

3. Acesse: `http://localhost:3000`

## Dispositivos Suportados

- **Poco M5 Pro**: Wandell
- **Samsung A55**: Ana  
- **Samsung A54**: Robson
- **Samsung A34**: Jeff
- **Android Genérico**: Android User
- **Desktop**: Desktop User

## Estrutura do Projeto

```
expans-o/
├── index.html          # Página principal com detecção
├── a54.html           # Página específica Samsung A54
├── a55.html           # Página específica Samsung A55
├── poco-m5-pro.html   # Página específica Poco M5 Pro
├── m34.html           # Página específica Samsung A34
├── app.js             # Servidor Express
├── package.json       # Dependências
└── README.md          # Este arquivo
```

## Método de Detecção

O sistema usa **apenas User Agent String** como solicitado, removendo métodos complexos que não funcionaram:

1. **Verifica se é mobile**: `/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i`
2. **Identifica fabricante**: Poco/Xiaomi, Samsung
3. **Identifica modelo**: A34, A54, A55
4. **Fallback genérico**: Android ou Mobile

## Vantagens do Método User Agent

- ✅ Simples e direto
- ✅ Funciona em todos os navegadores
- ✅ Não requer APIs complexas
- ✅ Compatível com dispositivos antigos
- ✅ Fácil de implementar e manter 