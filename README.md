# 🎨 Sistema de Portfólio Personalizável

Um sistema completo de portfólio personalizável com login, edição em tempo real e efeitos 3D.

## ✨ Funcionalidades

### 🔐 Sistema de Login
- **Usuário Admin**: `admin` / `admin123`
- **Usuário Normal**: `user` / `user123`
- Login persistente (não precisa fazer login toda vez)
- Logout seguro
- **Painel de Admin**: Criação e gerenciamento de usuários

### 🎯 Edição de Portfólio
- **Perfil**: Nome, título, email, telefone, sobre você, foto de perfil
- **Aparência**: Temas de cores, cores personalizadas, fontes, tamanho de texto
- **Conteúdo**: Experiência, habilidades, projetos, educação, links sociais
- **Efeitos 3D**: Cubo, esfera, partículas, velocidade de animação, parallax

### 🎨 Personalização Visual
- **Temas**: Padrão, Escuro, Claro, Gradiente
- **Cores**: Primária e secundária personalizáveis
- **Fontes**: Arial, Times New Roman, Courier New, Georgia, Verdana
- **Tamanho de fonte**: Ajustável de 12px a 24px

### 🌟 Efeitos 3D
- **Cubo 3D**: Rotação em 3D
- **Esfera 3D**: Esfera girando
- **Partículas**: Sistema de partículas animadas
- **Velocidade**: Controle da velocidade das animações
- **Cores**: Personalização das cores dos efeitos
- **Parallax**: Efeito de profundidade no scroll

## 🚀 Como Usar

### 1. Acesso
1. Abra o arquivo `index.html` no seu navegador
2. Faça login com as credenciais de teste:
   - **Admin**: `admin` / `admin123`
   - **Usuário**: `user` / `user123`

### 2. Edição do Portfólio
1. Clique no botão **"Editar"** no cabeçalho
2. Use as abas para navegar entre as seções:
   - **Perfil**: Informações pessoais e foto
   - **Aparência**: Cores, fontes e temas
   - **Conteúdo**: Experiência, habilidades, projetos
   - **Efeitos 3D**: Animações e efeitos visuais

### 3. Painel de Administração (Apenas Admin)
1. Faça login como **admin** (`admin` / `admin123`)
2. Clique no botão **"Gerenciar Usuários"** no cabeçalho
3. **Criar Usuário**: Preencha o formulário com dados do novo usuário
4. **Gerenciar Usuários**: Visualize e exclua usuários existentes

### 3. Personalização
- **Foto de Perfil**: Clique em "Escolher arquivo" para upload
- **Cores**: Use os seletores de cor para personalizar
- **Temas**: Escolha entre diferentes temas visuais
- **Efeitos 3D**: Selecione e configure animações
- **Links Sociais**: Adicione LinkedIn, GitHub, portfólio

### 4. Salvamento
1. Clique em **"Salvar"** para guardar suas alterações
2. Os dados são salvos automaticamente no navegador
3. Clique em **"Visualizar"** para ver o resultado final

### 5. Gerenciamento de Usuários (Admin)
- **Criar Usuário**: Nome de usuário, nome completo, senha e tipo
- **Validações**: Senha mínima 6 caracteres, confirmação de senha
- **Excluir Usuário**: Remove usuários (exceto o próprio admin)
- **Tipos de Usuário**: Normal ou Administrador

## 📁 Estrutura do Projeto

```
expans-o/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript com toda a lógica
└── README.md           # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos e responsivos
- **JavaScript ES6+**: Lógica da aplicação
- **Three.js**: Efeitos 3D
- **Font Awesome**: Ícones
- **LocalStorage**: Persistência de dados

## 🎨 Recursos Visuais

### Temas Disponíveis
- **Padrão**: Gradiente azul/roxo
- **Escuro**: Fundo escuro com texto claro
- **Claro**: Fundo claro com texto escuro
- **Gradiente**: Gradiente personalizado

### Efeitos 3D
- **Cubo**: Rotação em 3D com cores personalizáveis
- **Esfera**: Esfera 3D girando
- **Partículas**: Sistema de partículas animadas
- **Parallax**: Efeito de profundidade no scroll

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (até 767px)

## 💾 Armazenamento

- Os dados são salvos no **LocalStorage** do navegador
- Cada usuário tem seu próprio portfólio salvo
- Os dados persistem entre sessões
- Não há necessidade de servidor ou banco de dados

## 🔧 Personalização Avançada

### Adicionando Novos Usuários
No arquivo `script.js`, adicione novos usuários no objeto `users`:

```javascript
users = {
    'admin': {
        password: 'admin123',
        role: 'admin',
        name: 'Administrador'
    },
    'user': {
        password: 'user123',
        role: 'user',
        name: 'Usuário'
    },
    'novo_usuario': {
        password: 'senha123',
        role: 'user',
        name: 'Novo Usuário'
    }
};
```

### Adicionando Novos Efeitos 3D
No método `setupThreeDEffect()`, adicione novos casos:

```javascript
case 'novo_efeito':
    // Código do novo efeito
    break;
```

## 🚀 Próximas Funcionalidades

- [ ] Sistema de templates pré-definidos
- [ ] Exportação para PDF
- [ ] Compartilhamento de portfólio
- [ ] Galeria de imagens
- [ ] Sistema de comentários
- [ ] Analytics de visualizações
- [ ] Backup na nuvem
- [ ] Múltiplos idiomas

## 📞 Suporte

Para dúvidas ou sugestões:
1. Verifique se está usando um navegador moderno
2. Certifique-se de que o JavaScript está habilitado
3. Limpe o cache do navegador se necessário

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente para fins educacionais e comerciais.

---

**Desenvolvido com ❤️ para criar portfólios incríveis!** 