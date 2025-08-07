// Sistema de Login e Gerenciamento de Estado
class PortfolioSystem {
    constructor() {
        this.currentUser = null;
        this.isEditMode = false;
        this.portfolioData = {};
        this.threeDScene = null;
        this.recoveryEmail = null;
        this.verificationCode = null;
        this.countdownInterval = null;
        this.autoSaveTimeout = null;
        this.autoSaveDelay = 2000; // 2 segundos de delay
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPortfolioData();
        this.checkLoginStatus();
    }

    // Usuários de teste
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
        }
    };

    setupEventListeners() {
        // Login
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Recuperação de senha
        document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPasswordScreen();
        });

        document.getElementById('backToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginScreen();
        });

        document.getElementById('emailForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendVerificationCode();
        });

        document.getElementById('codeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.verifyCode();
        });

        document.getElementById('newPasswordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        // Botões principais
        document.getElementById('adminPanelBtn').addEventListener('click', () => {
            this.toggleAdminPanel();
        });

        document.getElementById('editModeBtn').addEventListener('click', () => {
            this.toggleEditMode();
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
            this.savePortfolio();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Tabs de edição
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Formulário de criação de usuário
        document.getElementById('createUserForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createUser();
        });

        // Campos de edição
        this.setupFormListeners();
        this.setupThreeDEffects();
    }

    setupFormListeners() {
        // Campos de perfil
        const profileFields = ['fullName', 'jobTitle', 'email', 'phone', 'about'];
        profileFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', () => {
                    this.updatePreview(field);
                    this.triggerAutoSave();
                });
            }
        });

        // Foto de perfil
        document.getElementById('profilePhoto').addEventListener('change', (e) => {
            this.handleProfilePhoto(e);
            this.triggerAutoSave();
        });

        // Campos de aparência
        document.getElementById('colorTheme').addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
            this.triggerAutoSave();
        });

        document.getElementById('primaryColor').addEventListener('input', (e) => {
            this.updateColors();
            this.triggerAutoSave();
        });

        document.getElementById('secondaryColor').addEventListener('input', (e) => {
            this.updateColors();
            this.triggerAutoSave();
        });

        document.getElementById('fontFamily').addEventListener('change', (e) => {
            this.updateFonts();
            this.triggerAutoSave();
        });

        document.getElementById('fontSize').addEventListener('input', (e) => {
            this.updateFontSize(e.target.value);
            this.triggerAutoSave();
        });

        // Campos de conteúdo
        const contentFields = ['experience', 'skills', 'projects', 'education'];
        contentFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', () => {
                    this.updatePreview(field);
                    this.triggerAutoSave();
                });
            }
        });

        // Links sociais
        const socialFields = ['linkedin', 'github', 'portfolio'];
        socialFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', () => {
                    this.updateSocialLinks();
                    this.triggerAutoSave();
                });
            }
        });
    }

    setupThreeDEffects() {
        // Efeitos 3D
        document.getElementById('threeDEffect').addEventListener('change', (e) => {
            this.setupThreeDEffect(e.target.value);
            this.triggerAutoSave();
        });

        document.getElementById('animationSpeed').addEventListener('input', (e) => {
            this.updateAnimationSpeed(e.target.value);
            this.triggerAutoSave();
        });

        document.getElementById('effectColor').addEventListener('input', (e) => {
            this.updateEffectColor(e.target.value);
            this.triggerAutoSave();
        });

        document.getElementById('parallaxEnabled').addEventListener('change', (e) => {
            this.toggleParallax(e.target.checked);
            this.triggerAutoSave();
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const allUsers = this.getAllUsers();

        if (allUsers[username] && allUsers[username].password === password) {
            this.currentUser = {
                username: username,
                role: allUsers[username].role,
                name: allUsers[username].name
            };
            
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.showMainInterface();
            this.loadUserPortfolio();
        } else {
            alert('Usuário ou senha incorretos!');
        }
    }

    checkLoginStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showMainInterface();
            this.loadUserPortfolio();
        }
    }

    showMainInterface() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainInterface').classList.remove('hidden');
        document.getElementById('userTitle').textContent = `${this.currentUser.name} - Portfólio`;
        
        // Mostra botão de admin se for admin
        if (this.currentUser.role === 'admin') {
            document.getElementById('adminPanelBtn').classList.remove('hidden');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        document.getElementById('mainInterface').classList.add('hidden');
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('loginForm').reset();
    }

    // Métodos de Recuperação de Senha
    showForgotPasswordScreen() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('forgotPasswordScreen').classList.remove('hidden');
        this.resetRecoveryForms();
    }

    showLoginScreen() {
        document.getElementById('forgotPasswordScreen').classList.add('hidden');
        document.getElementById('loginScreen').classList.remove('hidden');
        this.resetRecoveryForms();
        this.stopCountdown();
    }

    resetRecoveryForms() {
        document.getElementById('emailForm').classList.remove('hidden');
        document.getElementById('codeForm').classList.add('hidden');
        document.getElementById('newPasswordForm').classList.add('hidden');
        document.getElementById('emailForm').reset();
        document.getElementById('codeForm').reset();
        document.getElementById('newPasswordForm').reset();
    }

    sendVerificationCode() {
        const email = document.getElementById('recoveryEmail').value.trim();
        
        if (!email) {
            alert('Por favor, digite seu email!');
            return;
        }

        // Verifica se o email existe no sistema
        const allUsers = this.getAllUsers();
        const userWithEmail = Object.keys(allUsers).find(username => {
            const user = allUsers[username];
            return user.email === email;
        });

        if (!userWithEmail) {
            alert('Email não encontrado no sistema!');
            return;
        }

        // Gera código de verificação (6 dígitos)
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Simula envio de email (em produção, aqui seria uma API real)
        this.recoveryEmail = email;
        this.verificationCode = code;
        
        // Mostra o código na tela (em produção, seria enviado por email)
        alert(`Código de verificação: ${code}\n\nEm produção, este código seria enviado para ${email}`);
        
        // Mostra o formulário de código
        document.getElementById('emailForm').classList.add('hidden');
        document.getElementById('codeForm').classList.remove('hidden');
        document.getElementById('emailDisplay').textContent = email;
        
        // Inicia contador de 5 minutos
        this.startCountdown();
    }

    startCountdown() {
        let timeLeft = 300; // 5 minutos em segundos
        
        const updateCountdown = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            document.getElementById('countdown').textContent = display;
            
            if (timeLeft <= 0) {
                this.stopCountdown();
                alert('Tempo expirado! Solicite um novo código.');
                this.resetRecoveryForms();
                document.getElementById('forgotPasswordScreen').classList.add('hidden');
                document.getElementById('loginScreen').classList.remove('hidden');
                return;
            }
            
            timeLeft--;
        };
        
        updateCountdown();
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }

    stopCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    verifyCode() {
        const enteredCode = document.getElementById('verificationCode').value.trim();
        
        if (!enteredCode) {
            alert('Por favor, digite o código de verificação!');
            return;
        }

        if (enteredCode === this.verificationCode) {
            // Código correto
            this.stopCountdown();
            document.getElementById('codeForm').classList.add('hidden');
            document.getElementById('newPasswordForm').classList.remove('hidden');
        } else {
            alert('Código incorreto! Tente novamente.');
            document.getElementById('verificationCode').value = '';
        }
    }

    changePassword() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;
        
        if (!newPassword || !confirmPassword) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        if (newPassword.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return;
        }

        // Atualiza a senha do usuário
        const allUsers = this.getAllUsers();
        const userWithEmail = Object.keys(allUsers).find(username => {
            const user = allUsers[username];
            return user.email === this.recoveryEmail;
        });

        if (userWithEmail) {
            allUsers[userWithEmail].password = newPassword;
            localStorage.setItem('users', JSON.stringify(allUsers));
            
            alert('Senha alterada com sucesso!');
            this.showLoginScreen();
        } else {
            alert('Erro ao alterar senha. Tente novamente.');
        }
    }

    // Métodos de Salvamento Automático
    triggerAutoSave() {
        // Cancela o timeout anterior
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }

        // Mostra indicador de salvamento
        this.showSavingIndicator();

        // Agenda o salvamento automático
        this.autoSaveTimeout = setTimeout(() => {
            this.autoSave();
        }, this.autoSaveDelay);
    }

    showSavingIndicator() {
        const indicator = document.getElementById('autoSaveIndicator');
        indicator.classList.add('saving');
        indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    }

    showSavedIndicator() {
        const indicator = document.getElementById('autoSaveIndicator');
        indicator.classList.remove('saving');
        indicator.classList.add('saved');
        indicator.innerHTML = '<i class="fas fa-check"></i> Salvo!';
        
        // Remove a classe 'saved' após 3 segundos
        setTimeout(() => {
            indicator.classList.remove('saved');
            indicator.innerHTML = '<i class="fas fa-save"></i> Salvamento Automático Ativo';
        }, 3000);
    }

    autoSave() {
        // Coleta todos os dados do formulário
        this.collectFormData();
        
        // Salva no localStorage
        this.saveToLocalStorage();
        
        // Mostra indicador de salvo
        this.showSavedIndicator();
        
        console.log('Portfólio salvo automaticamente!');
    }

    collectFormData() {
        this.portfolioData = {
            profile: {
                fullName: document.getElementById('fullName').value || '',
                jobTitle: document.getElementById('jobTitle').value || '',
                email: document.getElementById('email').value || '',
                phone: document.getElementById('phone').value || '',
                about: document.getElementById('about').value || '',
                photo: this.portfolioData.profile?.photo || ''
            },
            appearance: {
                theme: document.getElementById('colorTheme').value || 'default',
                primaryColor: document.getElementById('primaryColor').value || '#007bff',
                secondaryColor: document.getElementById('secondaryColor').value || '#6c757d',
                fontFamily: document.getElementById('fontFamily').value || 'Arial, sans-serif',
                fontSize: document.getElementById('fontSize').value || 16
            },
            content: {
                experience: document.getElementById('experience').value || '',
                skills: document.getElementById('skills').value || '',
                projects: document.getElementById('projects').value || '',
                education: document.getElementById('education').value || '',
                linkedin: document.getElementById('linkedin').value || '',
                github: document.getElementById('github').value || '',
                portfolio: document.getElementById('portfolio').value || ''
            },
            effects: {
                threeDEffect: document.getElementById('threeDEffect').value || 'none',
                animationSpeed: document.getElementById('animationSpeed').value || 1,
                effectColor: document.getElementById('effectColor').value || '#00ff00',
                parallaxEnabled: document.getElementById('parallaxEnabled').checked || false
            }
        };
    }

    saveToLocalStorage() {
        if (this.currentUser) {
            localStorage.setItem(`portfolio_${this.currentUser.username}`, JSON.stringify(this.portfolioData));
        }
    }

    // Métodos de Admin
    toggleAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        const editPanel = document.getElementById('editPanel');
        const adminBtn = document.getElementById('adminPanelBtn');
        
        if (adminPanel.classList.contains('hidden')) {
            // Mostra painel admin
            adminPanel.classList.remove('hidden');
            editPanel.classList.add('hidden');
            adminBtn.innerHTML = '<i class="fas fa-times"></i> Fechar Admin';
            this.loadUsersList();
        } else {
            // Esconde painel admin
            adminPanel.classList.add('hidden');
            adminBtn.innerHTML = '<i class="fas fa-users-cog"></i> Gerenciar Usuários';
        }
    }

    createUser() {
        const username = document.getElementById('newUsername').value.trim();
        const fullName = document.getElementById('newFullName').value.trim();
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const role = document.getElementById('newUserRole').value;

        // Validações
        if (!username || !fullName || !password || !confirmPassword) {
            alert('Todos os campos são obrigatórios!');
            return;
        }

        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return;
        }

        // Verifica se o usuário já existe
        const allUsers = this.getAllUsers();
        if (allUsers[username]) {
            alert('Este nome de usuário já existe!');
            return;
        }

        // Cria o novo usuário
        const newUser = {
            password: password,
            role: role,
            name: fullName,
            email: `${username}@exemplo.com` // Email padrão baseado no username
        };

        // Adiciona ao objeto de usuários
        allUsers[username] = newUser;
        
        // Salva no localStorage
        localStorage.setItem('users', JSON.stringify(allUsers));

        // Limpa o formulário
        document.getElementById('createUserForm').reset();

        // Atualiza a lista de usuários
        this.loadUsersList();

        alert(`Usuário "${fullName}" criado com sucesso!\nEmail: ${newUser.email}`);
    }

    getAllUsers() {
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            return JSON.parse(savedUsers);
        }
        
        // Retorna usuários padrão se não existirem
        return {
            'admin': {
                password: 'admin123',
                role: 'admin',
                name: 'Administrador',
                email: 'admin@exemplo.com'
            },
            'user': {
                password: 'user123',
                role: 'user',
                name: 'Usuário',
                email: 'user@exemplo.com'
            }
        };
    }

    loadUsersList() {
        const usersList = document.getElementById('usersList');
        const allUsers = this.getAllUsers();
        
        usersList.innerHTML = '';

        Object.keys(allUsers).forEach(username => {
            const user = allUsers[username];
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            
            userItem.innerHTML = `
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-role ${user.role}">${user.role === 'admin' ? 'Administrador' : 'Usuário'}</div>
                    <small>@${username}</small>
                </div>
                <div class="user-actions">
                    <button class="btn btn-sm btn-danger" onclick="portfolioSystem.deleteUser('${username}')">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            `;
            
            usersList.appendChild(userItem);
        });
    }

    deleteUser(username) {
        if (username === this.currentUser.username) {
            alert('Você não pode excluir seu próprio usuário!');
            return;
        }

        if (confirm(`Tem certeza que deseja excluir o usuário "${username}"?`)) {
            const allUsers = this.getAllUsers();
            delete allUsers[username];
            
            localStorage.setItem('users', JSON.stringify(allUsers));
            this.loadUsersList();
            
            alert(`Usuário "${username}" excluído com sucesso!`);
        }
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        const editPanel = document.getElementById('editPanel');
        const saveBtn = document.getElementById('saveBtn');
        const editBtn = document.getElementById('editModeBtn');

        if (this.isEditMode) {
            editPanel.classList.remove('hidden');
            saveBtn.classList.remove('hidden');
            editBtn.innerHTML = '<i class="fas fa-eye"></i> Visualizar';
            this.populateFormFields();
        } else {
            editPanel.classList.add('hidden');
            saveBtn.classList.add('hidden');
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Editar';
        }
    }

    switchTab(tabName) {
        // Remove active de todas as tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Adiciona active na tab selecionada
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    populateFormFields() {
        // Preenche os campos com os dados atuais
        const data = this.portfolioData;
        
        if (data.profile) {
            document.getElementById('fullName').value = data.profile.fullName || '';
            document.getElementById('jobTitle').value = data.profile.jobTitle || '';
            document.getElementById('email').value = data.profile.email || '';
            document.getElementById('phone').value = data.profile.phone || '';
            document.getElementById('about').value = data.profile.about || '';
        }

        if (data.appearance) {
            document.getElementById('colorTheme').value = data.appearance.theme || 'default';
            document.getElementById('primaryColor').value = data.appearance.primaryColor || '#007bff';
            document.getElementById('secondaryColor').value = data.appearance.secondaryColor || '#6c757d';
            document.getElementById('fontFamily').value = data.appearance.fontFamily || 'Arial, sans-serif';
            document.getElementById('fontSize').value = data.appearance.fontSize || 16;
        }

        if (data.content) {
            document.getElementById('experience').value = data.content.experience || '';
            document.getElementById('skills').value = data.content.skills || '';
            document.getElementById('projects').value = data.content.projects || '';
            document.getElementById('education').value = data.content.education || '';
            document.getElementById('linkedin').value = data.content.linkedin || '';
            document.getElementById('github').value = data.content.github || '';
            document.getElementById('portfolio').value = data.content.portfolio || '';
        }

        if (data.effects) {
            document.getElementById('threeDEffect').value = data.effects.threeDEffect || 'none';
            document.getElementById('animationSpeed').value = data.effects.animationSpeed || 1;
            document.getElementById('effectColor').value = data.effects.effectColor || '#00ff00';
            document.getElementById('parallaxEnabled').checked = data.effects.parallaxEnabled || false;
        }

        // Atualiza previews
        this.updateAllPreviews();
    }

    updatePreview(field) {
        const value = document.getElementById(field).value;
        
        switch (field) {
            case 'fullName':
                document.getElementById('displayName').textContent = value || 'Seu Nome';
                break;
            case 'jobTitle':
                document.getElementById('displayTitle').textContent = value || 'Título Profissional';
                break;
            case 'email':
                document.getElementById('displayEmail').textContent = value || 'email@exemplo.com';
                break;
            case 'phone':
                document.getElementById('displayPhone').textContent = value || '(11) 99999-9999';
                break;
            case 'about':
                document.getElementById('displayAbout').textContent = value || 'Sobre você aparecerá aqui...';
                break;
            case 'experience':
                document.getElementById('displayExperience').textContent = value || 'Sua experiência profissional aparecerá aqui...';
                break;
            case 'skills':
                document.getElementById('displaySkills').textContent = value || 'Suas habilidades aparecerão aqui...';
                break;
            case 'projects':
                document.getElementById('displayProjects').textContent = value || 'Seus projetos aparecerão aqui...';
                break;
            case 'education':
                document.getElementById('displayEducation').textContent = value || 'Sua formação aparecerá aqui...';
                break;
        }
    }

    updateAllPreviews() {
        const fields = ['fullName', 'jobTitle', 'email', 'phone', 'about', 'experience', 'skills', 'projects', 'education'];
        fields.forEach(field => {
            this.updatePreview(field);
        });
        this.updateSocialLinks();
    }

    updateSocialLinks() {
        const linkedin = document.getElementById('linkedin').value;
        const github = document.getElementById('github').value;
        const portfolio = document.getElementById('portfolio').value;

        if (linkedin) {
            document.getElementById('linkedinLink').href = linkedin;
            document.getElementById('linkedinLink').style.display = 'flex';
        } else {
            document.getElementById('linkedinLink').style.display = 'none';
        }

        if (github) {
            document.getElementById('githubLink').href = github;
            document.getElementById('githubLink').style.display = 'flex';
        } else {
            document.getElementById('githubLink').style.display = 'none';
        }

        if (portfolio) {
            document.getElementById('portfolioLink').href = portfolio;
            document.getElementById('portfolioLink').style.display = 'flex';
        } else {
            document.getElementById('portfolioLink').style.display = 'none';
        }
    }

    handleProfilePhoto(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('profilePhotoPreview');
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                
                document.getElementById('profileImage').src = e.target.result;
                
                // Salva a imagem como base64
                this.portfolioData.profile = this.portfolioData.profile || {};
                this.portfolioData.profile.photo = e.target.result;
                
                // Salva automaticamente
                this.saveToLocalStorage();
                this.showSavedIndicator();
            };
            reader.readAsDataURL(file);
        }
    }

    applyTheme(theme) {
        const body = document.body;
        const portfolioContainer = document.querySelector('.portfolio-container');
        
        // Remove temas anteriores
        body.classList.remove('theme-dark', 'theme-light', 'theme-gradient');
        portfolioContainer.classList.remove('theme-dark', 'theme-light', 'theme-gradient');
        
        // Aplica novo tema
        if (theme !== 'default') {
            body.classList.add(`theme-${theme}`);
            portfolioContainer.classList.add(`theme-${theme}`);
        }
    }

    updateColors() {
        const primaryColor = document.getElementById('primaryColor').value;
        const secondaryColor = document.getElementById('secondaryColor').value;
        
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    }

    updateFonts() {
        const fontFamily = document.getElementById('fontFamily').value;
        document.body.style.fontFamily = fontFamily;
    }

    updateFontSize(size) {
        document.getElementById('fontSizeValue').textContent = `${size}px`;
        document.body.style.fontSize = `${size}px`;
    }

    setupThreeDEffect(effectType) {
        const preview = document.getElementById('threeDPreview');
        
        if (this.threeDScene) {
            this.threeDScene.dispose();
        }

        if (effectType === 'none') {
            preview.innerHTML = '<p>Nenhum efeito 3D ativo</p>';
            return;
        }

        // Configuração básica do Three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, preview.clientWidth / preview.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        
        renderer.setSize(preview.clientWidth, preview.clientHeight);
        preview.innerHTML = '';
        preview.appendChild(renderer.domElement);

        const effectColor = document.getElementById('effectColor').value;
        const material = new THREE.MeshBasicMaterial({ color: effectColor });

        let geometry, mesh;

        switch (effectType) {
            case 'cube':
                geometry = new THREE.BoxGeometry();
                mesh = new THREE.Mesh(geometry, material);
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(1, 32, 32);
                mesh = new THREE.Mesh(geometry, material);
                break;
            case 'particles':
                const particles = new THREE.Points(
                    new THREE.BufferGeometry(),
                    new THREE.PointsMaterial({ color: effectColor, size: 0.05 })
                );
                
                const positions = [];
                for (let i = 0; i < 1000; i++) {
                    positions.push(
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10
                    );
                }
                
                particles.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                scene.add(particles);
                break;
        }

        if (mesh) {
            scene.add(mesh);
        }

        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            
            if (mesh) {
                mesh.rotation.x += 0.01;
                mesh.rotation.y += 0.01;
            }
            
            renderer.render(scene, camera);
        };

        animate();
        this.threeDScene = { scene, camera, renderer, animate };
    }

    updateAnimationSpeed(speed) {
        document.getElementById('animationSpeedValue').textContent = `${speed}x`;
        // Implementar controle de velocidade das animações
    }

    updateEffectColor(color) {
        if (this.threeDScene) {
            this.setupThreeDEffect(document.getElementById('threeDEffect').value);
        }
    }

    toggleParallax(enabled) {
        if (enabled) {
            document.body.classList.add('parallax-enabled');
            this.setupParallax();
        } else {
            document.body.classList.remove('parallax-enabled');
            this.removeParallax();
        }
    }

    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.portfolio-header');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    removeParallax() {
        const parallax = document.querySelector('.portfolio-header');
        if (parallax) {
            parallax.style.transform = 'translateY(0)';
        }
    }

    savePortfolio() {
        // Usa o sistema de salvamento automático
        this.collectFormData();
        this.saveToLocalStorage();
        this.applyPortfolioData();
        
        alert('Portfólio salvo com sucesso!');
        this.toggleEditMode();
    }

    loadUserPortfolio() {
        const savedData = localStorage.getItem(`portfolio_${this.currentUser.username}`);
        if (savedData) {
            this.portfolioData = JSON.parse(savedData);
            this.applyPortfolioData();
        }
    }

    applyPortfolioData() {
        if (!this.portfolioData) return;

        // Aplica dados do perfil
        if (this.portfolioData.profile) {
            const profile = this.portfolioData.profile;
            document.getElementById('displayName').textContent = profile.fullName || 'Seu Nome';
            document.getElementById('displayTitle').textContent = profile.jobTitle || 'Título Profissional';
            document.getElementById('displayEmail').textContent = profile.email || 'email@exemplo.com';
            document.getElementById('displayPhone').textContent = profile.phone || '(11) 99999-9999';
            document.getElementById('displayAbout').textContent = profile.about || 'Sobre você aparecerá aqui...';
            
            if (profile.photo) {
                document.getElementById('profileImage').src = profile.photo;
            }
        }

        // Aplica aparência
        if (this.portfolioData.appearance) {
            const appearance = this.portfolioData.appearance;
            this.applyTheme(appearance.theme);
            this.updateColors();
            this.updateFonts();
            this.updateFontSize(appearance.fontSize);
        }

        // Aplica conteúdo
        if (this.portfolioData.content) {
            const content = this.portfolioData.content;
            document.getElementById('displayExperience').textContent = content.experience || 'Sua experiência profissional aparecerá aqui...';
            document.getElementById('displaySkills').textContent = content.skills || 'Suas habilidades aparecerão aqui...';
            document.getElementById('displayProjects').textContent = content.projects || 'Seus projetos aparecerão aqui...';
            document.getElementById('displayEducation').textContent = content.education || 'Sua formação aparecerá aqui...';
            
            this.updateSocialLinks();
        }

        // Aplica efeitos
        if (this.portfolioData.effects) {
            const effects = this.portfolioData.effects;
            this.setupThreeDEffect(effects.threeDEffect);
            this.updateAnimationSpeed(effects.animationSpeed);
            this.updateEffectColor(effects.effectColor);
            this.toggleParallax(effects.parallaxEnabled);
        }
    }

    loadPortfolioData() {
        // Carrega dados padrão se não existirem
        if (!localStorage.getItem('portfolio_user')) {
            const defaultData = {
                profile: {
                    fullName: 'João Silva',
                    jobTitle: 'Desenvolvedor Full Stack',
                    email: 'joao@exemplo.com',
                    phone: '(11) 99999-9999',
                    about: 'Desenvolvedor apaixonado por criar soluções inovadoras e experiências digitais únicas.'
                },
                content: {
                    experience: '5+ anos de experiência em desenvolvimento web, mobile e desktop.',
                    skills: 'JavaScript, React, Node.js, Python, Java, SQL, Git',
                    projects: 'E-commerce, Sistema de Gestão, App Mobile, Dashboard Analytics',
                    education: 'Bacharel em Ciência da Computação - Universidade XYZ'
                }
            };
            localStorage.setItem('portfolio_user', JSON.stringify(defaultData));
        }
    }
}

// Inicializa o sistema quando a página carrega
let portfolioSystem;
document.addEventListener('DOMContentLoaded', () => {
    portfolioSystem = new PortfolioSystem();
}); 