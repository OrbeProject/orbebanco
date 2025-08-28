const currentYear = new Date().getFullYear();

const copyrightElements = document.querySelectorAll('.footer-copyright');

copyrightElements.forEach(element => {
    element.innerHTML = element.innerHTML.replace(/\d{4}/, currentYear);
    });

// Credenciales de usuario válidas
const VALID_CREDENTIALS = {
    username: 'usuario_orbe',
    password: '123456'
};

// Datos simulados del usuario
const userData = {
    name: 'Legeon Josh',
    accounts: {
        checking: {
            number: '0123-4567-8901-3456',
            balance: 500000.50,
            type: 'Cuenta Corriente'
        },
        savings: {
            number: '0123-4567-8901-7890',
            balance: 128750.00,
            type: 'Cuenta de Ahorros'
        }
    },
    cards: [
        {
            id: 1,
            type: 'Débito',
            number: '5234 •••• •••• 3456',
            account: 'checking',
            expiry: '12/27',
            status: 'active',
            balance: 500000.50 // Añadido balance para tarjeta débito
        },
        {
            id: 2,
            type: 'Crédito',
            number: '4521 •••• •••• 7890',
            limit: 450000,
            available: 450000, // Límite disponible
            expiry: '08/26',
            status: 'active',
            balance: 0 // Saldo actual de la tarjeta
        }
    ],
     transactions: [
                { id: 1, description: 'Netflix', amount: -12.99, date: '2024-11-15', type: 'subscription', icon: 'netflix', account: 'checking' },
                { id: 2, description: 'Transferencia recibida', amount: 1250.00, date: '2024-11-14', type: 'transfer', icon: 'transfer', account: 'checking' },
                { id: 3, description: 'Spotify Premium', amount: -9.99, date: '2024-11-12', type: 'subscription', icon: 'spotify', account: 'checking' },
                { id: 4, description: 'Supermercado Jumbo', amount: -87.50, date: '2024-11-10', type: 'purchase', icon: 'transfer', account: 'checking' },
                { id: 5, description: 'Sueldo', amount: 850000, date: '2024-11-01', type: 'salary', icon: 'transfer', account: 'checking' },
                { id: 6, description: 'Transferencia a ahorros', amount: -100000, date: '2024-10-28', type: 'transfer', icon: 'transfer', account: 'checking' },
                { id: 7, description: 'Transferencia desde corriente', amount: 100000, date: '2024-10-28', type: 'transfer', icon: 'transfer', account: 'savings' },
                { id: 8, description: 'Intereses ganados', amount: 892.35, date: '2024-10-31', type: 'interest', icon: 'transfer', account: 'savings' }
            ],
            investments: [
                { type: 'Depósito a Plazo', value: 2500000, return: 2.8, change: 'positive' },
                { type: 'Fondo Mutuo Renta Fija', value: 1800000, return: 5.2, change: 'positive' },
                { type: 'APV Voluntario', value: 950000, return: 6.1, change: 'positive' },
                { type: 'Fondo Mutuo Acciones', value: 650000, return: -1.3, change: 'negative' }
            ]
        
};

// Estado de la aplicación
let currentUser = null;
let currentView = 'website'; // 'website', 'login', 'dashboard'

// Elementos DOM
let mainWebsite, loginScreen, bankingDashboard, loginForm, logoutBtn;
let successModal, successMessage, navButtons, contentSections;
let bankingButtons = [];

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    initializeFAQ();
    checkAuthStatus();
});

function initializeElements() {
    mainWebsite = document.getElementById('mainWebsite');
    loginScreen = document.getElementById('loginScreen');
    bankingDashboard = document.getElementById('bankingDashboard');
    loginForm = document.getElementById('loginForm');
    logoutBtn = document.getElementById('logoutBtn');
    successModal = document.getElementById('successModal');
    successMessage = document.getElementById('successMessage');
    navButtons = document.querySelectorAll('.nav-btn');
    contentSections = document.querySelectorAll('.content-section');
    
    // Botones de banca en línea
    bankingButtons = [
        document.getElementById('bankingBtn'),
        document.getElementById('bankingBtn2')
    ].filter(btn => btn !== null);
}

function initializeEventListeners() {
    // Botones de banca en línea
    bankingButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showBankingLogin();
            });
        }
    });

    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
            
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Quick actions
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            handleQuickAction(action);
        });
    });

    // Transfer tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.dataset.tab;
            showTransferTab(tab);
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Payment service buttons
    const serviceButtons = document.querySelectorAll('.service-btn');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            showPaymentForm(this.textContent.trim());
        });
    });

    // Cancel payment button
    const cancelPaymentBtn = document.querySelector('.cancel-payment');
    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', hidePaymentForm);
    }

    // Request card button
    const requestCardBtn = document.querySelector('.request-new-card');
    if (requestCardBtn) {
        requestCardBtn.addEventListener('click', showCardRequestForm);
    }

    // Cancel card request button
    const cancelRequestBtn = document.querySelector('.cancel-request');
    if (cancelRequestBtn) {
        cancelRequestBtn.addEventListener('click', hideCardRequestForm);
    }

    // Forms submission
    initializeFormSubmissions();

    // Modal close
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideSuccessModal);
    }

    // Click outside modal to close
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideSuccessModal();
            }
        });
    }

    // Botón para volver al sitio web
    const backToWebsiteBtn = document.getElementById('backToWebsite');
    if (backToWebsiteBtn) {
        backToWebsiteBtn.addEventListener('click', function() {
            showMainWebsite();
        });
    }
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Cerrar todas las preguntas
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Abrir la pregunta actual si no estaba activa
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

function initializeFormSubmissions() {
    // Transfer forms
    const transferForms = document.querySelectorAll('.transfer-form');
    transferForms.forEach(form => {
        form.addEventListener('submit', handleTransferSubmit);
    });

    // Payment form
    const paymentForm = document.querySelector('.payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }

    // Card request form
    const cardRequestForm = document.querySelector('.card-request-form form');
    if (cardRequestForm) {
        cardRequestForm.addEventListener('submit', handleCardRequestSubmit);
    }
}

function checkAuthStatus() {
    const isLoggedIn = sessionStorage.getItem('kardBankingLoggedIn');
    if (isLoggedIn === 'true') {
        currentUser = JSON.parse(sessionStorage.getItem('kardBankingUser'));
        // No mostrar dashboard automáticamente, mantener en el sitio web
        currentView = 'website';
        showMainWebsite();
    } else {
        showMainWebsite();
    }
}

// Funciones de navegación entre vistas
function showMainWebsite() {
    currentView = 'website';
    if (mainWebsite) mainWebsite.style.display = 'block';
    if (loginScreen) loginScreen.style.display = 'none';
    if (bankingDashboard) bankingDashboard.style.display = 'none';
    document.body.style.background = 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)';
}

function showBankingLogin() {
    currentView = 'login';
    if (mainWebsite) mainWebsite.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';
    if (bankingDashboard) bankingDashboard.style.display = 'none';
    document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
}

function showDashboard() {
    currentView = 'dashboard';
    if (mainWebsite) mainWebsite.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'none';
    if (bankingDashboard) bankingDashboard.style.display = 'flex';
    document.body.style.background = '#f7fafc';
    
    // Actualizar datos del usuario en la interfaz
    updateUserInterface();
    
    // Iniciar simulación de actualizaciones en tiempo real
    setTimeout(() => {
        simulateRealTimeUpdates();
    }, 5000);
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validar credenciales
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        // Login exitoso
        currentUser = userData;
        sessionStorage.setItem('kardBankingLoggedIn', 'true');
        sessionStorage.setItem('kardBankingUser', JSON.stringify(userData));
        
        showDashboard();
        showSuccessMessage('¡Bienvenido! Has iniciado sesión correctamente.');
    } else {
        // Login fallido
        showError('Usuario o contraseña incorrectos. Intenta nuevamente.');
    }
}

function handleLogout() {
    currentUser = null;
    sessionStorage.removeItem('kardBankingLoggedIn');
    sessionStorage.removeItem('kardBankingUser');
    showMainWebsite();
    
    // Limpiar formularios
    if (loginForm) {
        loginForm.reset();
    }
}

function updateUserInterface() {
    // Actualizar nombre del usuario
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.name;
    }

    // Actualizar avatar
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar && currentUser) {
        const initials = currentUser.name.split(' ').map(n => n[0]).join('');
        userAvatar.textContent = initials;
    }

    // Actualizar balances
    updateBalances();
    
    // Actualizar información de tarjetas
    updateCardsDisplay();
    
    // Actualizar transacciones recientes
    updateRecentTransactions();
}

// Nueva función para actualizar la visualización de las tarjetas
function updateCardsDisplay() {
    if (!currentUser) return;
    
    // Actualizar tarjeta de débito
    const debitCard = currentUser.cards.find(card => card.type === 'Débito');
    if (debitCard) {
        const debitBalanceElement = document.querySelector('.debit-card .card-balance');
        if (debitBalanceElement) {
            debitBalanceElement.textContent = formatCurrency(debitCard.balance);
        }
    }
    
    // Actualizar tarjeta de crédito
    const creditCard = currentUser.cards.find(card => card.type === 'Crédito');
    if (creditCard) {
        const creditLimitElement = document.querySelector('.credit-card .card-limit');
        const creditBalanceElement = document.querySelector('.credit-card .card-balance');
        
        if (creditLimitElement) {
            creditLimitElement.textContent = `Límite: ${formatCurrency(creditCard.available)} / ${formatCurrency(creditCard.limit)}`;
        }
        
        if (creditBalanceElement) {
            creditBalanceElement.textContent = formatCurrency(creditCard.balance);
        }
    }
}


function updateBalances() {
    if (!currentUser) return;
    
    const balanceElements = document.querySelectorAll('.balance-amount');
    if (balanceElements.length >= 2) {
        balanceElements[0].textContent = formatCurrency(currentUser.accounts.checking.balance);
        balanceElements[1].textContent = formatCurrency(currentUser.accounts.savings.balance);
    }

    // Actualizar balances en las páginas de cuentas
    const accountCards = document.querySelectorAll('.account-card .account-balance');
    if (accountCards.length >= 2) {
        accountCards[0].textContent = formatCurrency(currentUser.accounts.checking.balance);
        accountCards[1].textContent = formatCurrency(currentUser.accounts.savings.balance);
    }
}

function updateRecentTransactions() {
    if (!currentUser) return;
    
    const transactionList = document.querySelector('.transaction-list');
    if (transactionList) {
        transactionList.innerHTML = '';
        
        currentUser.transactions.forEach(transaction => {
            const transactionElement = createTransactionElement(transaction);
            transactionList.appendChild(transactionElement);
        });
    }
}

function createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    
    const amountClass = transaction.amount >= 0 ? 'positive' : 'negative';
    const formattedAmount = transaction.amount >= 0 ? '+' + formatCurrency(Math.abs(transaction.amount)) : '-' + formatCurrency(Math.abs(transaction.amount));
    
    div.innerHTML = `
        <div class="transaction-icon ${transaction.icon}">
            ${getTransactionIcon(transaction.icon)}
        </div>
        <div class="transaction-details">
            <span class="transaction-name">${transaction.description}</span>
            <span class="transaction-date">${formatDate(transaction.date)}</span>
        </div>
        <span class="transaction-amount ${amountClass}">${formattedAmount}</span>
    `;
    
    return div;
}

function getTransactionIcon(iconType) {
    switch(iconType) {
        case 'netflix': return 'N';
        case 'spotify': return '♪';
        case 'transfer': return '<i class="fas fa-exchange-alt"></i>';
        default: return '<i class="fas fa-credit-card"></i>';
    }
}

function showSection(sectionId) {
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

     // Load section-specific data
            if (sectionId === 'statements') {
                populateStatements();
            }
}

function handleQuickAction(action) {
    switch(action) {
        case 'transfer':
            showSection('transfers');
            updateNavigation('transfers');
            break;
        case 'pay':
            showSection('payments');
            updateNavigation('payments');
            break;
        case 'request-card':
            showSection('cards');
            updateNavigation('cards');
            showCardRequestForm();
            break;
        case 'statement':
            showSuccessMessage('El estado de cuenta se ha enviado a tu correo electrónico.');
            break;
        default:
            console.log('Acción no implementada:', action);
    }
}

function updateNavigation(activeSection) {
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === activeSection) {
            btn.classList.add('active');
        }
    });
}

function showTransferTab(tab) {
    const containers = document.querySelectorAll('.transfer-form-container');
    containers.forEach(container => {
        container.classList.remove('active');
    });
    
    const targetContainer = document.getElementById(`${tab}-transfer`);
    if (targetContainer) {
        targetContainer.classList.add('active');
    }
}

function handleTransferSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const amount = parseFloat(formData.get('amount')) || parseFloat(e.target.querySelector('input[type="number"]').value);
    
    if (!amount || amount <= 0) {
        showError('Por favor ingresa un monto válido.');
        return;
    }
    
    if (amount > currentUser.accounts.checking.balance) {
        showError('Saldo insuficiente para realizar la transferencia.');
        return;
    }
    
    // Simular procesamiento
    setTimeout(() => {
        // Actualizar saldo
        currentUser.accounts.checking.balance -= amount;
        
        // Agregar transacción
        const newTransaction = {
            id: Date.now(),
            description: 'Transferencia enviada',
            amount: -amount,
            date: new Date().toISOString().split('T')[0],
            type: 'transfer',
            icon: 'transfer',
            account: 'checking'
        };
        
        currentUser.transactions.unshift(newTransaction);
        
        // Actualizar interfaz
        updateUserInterface();
        
        // Limpiar formulario
        e.target.reset();
        
        showSuccessMessage(`Transferencia de ${formatCurrency(amount)} realizada exitosamente.`);
    }, 1000);
}

function showPaymentForm(serviceName) {
    const paymentFormContainer = document.querySelector('.payment-form-container');
    const formTitle = document.querySelector('.payment-form h3');
    
    if (paymentFormContainer && formTitle) {
        formTitle.textContent = `Pagar ${serviceName}`;
        paymentFormContainer.style.display = 'block';
        paymentFormContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

function hidePaymentForm() {
    const paymentFormContainer = document.querySelector('.payment-form-container');
    if (paymentFormContainer) {
        paymentFormContainer.style.display = 'none';
    }
}

function handlePaymentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const amount = parseFloat(e.target.querySelector('input[type="number"]').value);
    const clientNumber = e.target.querySelector('input[type="text"]').value;
    
    if (!amount || amount <= 0) {
        showError('Por favor ingresa un monto válido.');
        return;
    }
    
    if (!clientNumber) {
        showError('Por favor ingresa tu número de cliente.');
        return;
    }
    
    // Determinar si es pago con débito o crédito
    const isCreditPayment = document.querySelector('.payment-form h3').textContent.includes('Crédito');
    
    if (isCreditPayment) {
        // Pago con tarjeta de crédito
        const creditCard = currentUser.cards.find(card => card.type === 'Crédito');
        if (amount > creditCard.available) {
            showError('Límite de crédito insuficiente para realizar el pago.');
            return;
        }
    } else {
        // Pago con débito
        if (amount > currentUser.accounts.checking.balance) {
            showError('Saldo insuficiente para realizar el pago.');
            return;
        }
    }
    
    // Simular procesamiento del pago
     setTimeout(() => {
        if (isCreditPayment) {
            // Actualizar tarjeta de crédito
            const creditCard = currentUser.cards.find(card => card.type === 'Crédito');
            creditCard.balance += amount;
            creditCard.available -= amount;
        } else {
            // Actualizar cuenta corriente
            currentUser.accounts.checking.balance -= amount;
            // Actualizar tarjeta de débito
            updateCardBalance('checking', currentUser.accounts.checking.balance);
        }
        
        // Agregar transacción
        const serviceName = document.querySelector('.payment-form h3').textContent.replace('Pagar ', '');
        const newTransaction = {
            id: Date.now(),
            description: `Pago ${serviceName}`,
            amount: -amount,
            date: new Date().toISOString().split('T')[0],
            type: 'payment',
            icon: 'transfer',
            account: isCreditPayment ? 'credit' : 'checking'
        };
        
        currentUser.transactions.unshift(newTransaction);
        
        // Actualizar interfaz
        updateUserInterface();
        
        // Limpiar y ocultar formulario
        e.target.reset();
        hidePaymentForm();
        
        showSuccessMessage(`Pago de ${formatCurrency(amount)} realizado exitosamente.`);
    }, 1000);
}

// Nueva función para actualizar el balance de las tarjetas
function updateCardBalance(accountType, newBalance) {
    if (accountType === 'checking') {
        const debitCard = currentUser.cards.find(card => card.account === 'checking');
        if (debitCard) {
            debitCard.balance = newBalance;
        }
    }
}


function showCardRequestForm() {
    const cardRequestForm = document.querySelector('.card-request-form');
    if (cardRequestForm) {
        cardRequestForm.style.display = 'block';
        cardRequestForm.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideCardRequestForm() {
    const cardRequestForm = document.querySelector('.card-request-form');
    if (cardRequestForm) {
        cardRequestForm.style.display = 'none';
    }
}

function handleCardRequestSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const cardType = formData.get('card-type');
    const reason = formData.get('reason');
    const address = formData.get('address') || e.target.querySelector('textarea').value;
    
    if (!cardType || !reason || !address) {
        showError('Por favor completa todos los campos requeridos.');
        return;
    }
    
    // Simular procesamiento de solicitud
    setTimeout(() => {
        // Limpiar y ocultar formulario
        e.target.reset();
        hideCardRequestForm();
        
        showSuccessMessage('Tu solicitud de tarjeta ha sido enviada. Recibirás tu nueva tarjeta en 5-7 días hábiles.');
    }, 1000);
}

// NEW FUNCTIONS FOR ENHANCED FEATURES

        function populateStatements() {
            if (!currentUser) return;
            
            const container = document.getElementById('statement-transactions');
            if (container) {
                container.innerHTML = '';
                
                currentUser.transactions.forEach(transaction => {
                    const row = document.createElement('div');
                    row.className = 'transaction-row';
                    
                    const amountClass = transaction.amount >= 0 ? 'positive' : 'negative';
                    const formattedAmount = transaction.amount >= 0 ? '+' + formatCurrency(Math.abs(transaction.amount)) : '-' + formatCurrency(Math.abs(transaction.amount));
                    
                    row.innerHTML = `
                        <div>${formatDate(transaction.date)}</div>
                        <div>${transaction.description}</div>
                        <div class="transaction-amount ${amountClass}">${formattedAmount}</div>
                    `;
                    
                    container.appendChild(row);
                });
            }
        }

        function filterStatements() {
            // Implementation for filtering statements
            showSuccessMessage('Filtros aplicados correctamente.');
        }

        function downloadStatement() {
            showSuccessMessage('Estado de cuenta descargado en formato PDF.');
        }

        function emailStatement() {
            showSuccessMessage('Estado de cuenta enviado por email.');
        }

        function calculateLoan() {
            const amount = parseFloat(document.getElementById('loan-amount').value);
            const term = parseInt(document.getElementById('loan-term').value);
            const rate = parseFloat(document.getElementById('interest-rate').value);
            
            if (!amount || !term || !rate) {
                showError('Por favor completa todos los campos.');
                return;
            }
            
            const monthlyRate = rate / 100 / 12;
            const numPayments = term * 12;
            const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
            const totalAmount = monthlyPayment * numPayments;
            const totalInterest = totalAmount - amount;
            
            document.getElementById('calculation-result').style.display = 'block';
            document.querySelector('.result-amount').textContent = formatCurrency(monthlyPayment);
            document.getElementById('total-amount').textContent = formatCurrency(totalAmount);
            document.getElementById('total-interest').textContent = formatCurrency(totalInterest);
        }

        function requestLoan() {
            showSuccessMessage('Tu solicitud de préstamo ha sido enviada. Un ejecutivo se contactará contigo en 24 horas.');
        }

        function investInProduct(productType) {
            let productName = '';
            switch(productType) {
                case 'deposit':
                    productName = 'Depósito a Plazo 360 días';
                    break;
                case 'mutual-fund':
                    productName = 'Fondo Mutuo Balanceado';
                    break;
                case 'apv':
                    productName = 'APV Ahorro Previsional';
                    break;
            }
            showSuccessMessage(`Solicitud para ${productName} enviada. Un asesor te contactará para completar el proceso.`);
        }

        // Card management functions
        function toggleCard(cardType) {
            const card = currentUser.cards.find(c => c.type.toLowerCase() === cardType);
            if (card) {
                card.blocked = !card.blocked;
                const action = card.blocked ? 'bloqueada' : 'desbloqueada';
                showSuccessMessage(`Tarjeta ${action} exitosamente.`);
            }
        }

        function viewCardPin(cardType) {
            const card = currentUser.cards.find(c => c.type.toLowerCase() === cardType);
            if (card && card.pin) {
                showSuccessMessage(`Tu PIN es: ${card.pin}. Manténlo seguro y no lo compartas.`);
            }
        }

        function viewCreditStatement() {
            showSection('statements');
            updateNavigation('statements');
            showSuccessMessage('Mostrando estado de cuenta de tarjeta de crédito.');
        }

        function payCreditCard() {
            showSection('payments');
            updateNavigation('payments');
            showPaymentForm('Tarjeta de Crédito');
        }

        function viewAccountMovements(accountType) {
            showSection('statements');
            updateNavigation('statements');
            const accountName = accountType === 'checking' ? 'Cuenta Corriente' : 'Cuenta de Ahorros';
            showSuccessMessage(`Mostrando movimientos de ${accountName}.`);
        }

        // Utility functions
        function formatCurrency(amount) {
            return new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
                minimumFractionDigits: 0
            }).format(amount);
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-CL', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }


function showSuccessMessage(message) {
    if (successMessage) {
        successMessage.textContent = message;
    }
    if (successModal) {
        successModal.classList.add('show');
    }
}

function hideSuccessModal() {
    if (successModal) {
        successModal.classList.remove('show');
    }
}

function showError(message) {
    // Crear un modal de error temporal o usar alert
    alert(message);
}
 document.addEventListener('DOMContentLoaded', function() {
            const today = new Date().toISOString().split('T')[0];
            const dateInputs = document.querySelectorAll('input[type="date"]');
            dateInputs.forEach(input => {
                if (input.id === 'date-to') {
                    input.value = today;
                } else if (input.id === 'date-from') {
                    const lastMonth = new Date();
                    lastMonth.setMonth(lastMonth.getMonth() - 1);
                    input.value = lastMonth.toISOString().split('T')[0];
                }
            });

            // Set default interest rates based on loan type
            const loanTypeSelect = document.getElementById('loan-type');
            const interestRateInput = document.getElementById('interest-rate');
            
            if (loanTypeSelect && interestRateInput) {
                loanTypeSelect.addEventListener('change', function() {
                    switch(this.value) {
                        case 'personal':
                            interestRateInput.value = '8.5';
                            break;
                        case 'mortgage':
                            interestRateInput.value = '3.8';
                            break;
                        case 'car':
                            interestRateInput.value = '6.2';
                            break;
                    }
                });
            }
        });


// Funciones de utilidad
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Simulación de operaciones bancarias en tiempo real
function simulateRealTimeUpdates() {
    if (!currentUser || currentView !== 'dashboard') return;
    
    // Simular una transacción cada 30 segundos (solo para demo)
    const demoTransactions = [
        { description: 'Compra en Supermercado', amount: -45.99, icon: 'transfer' },
        { description: 'Transferencia recibida', amount: 200.00, icon: 'transfer' },
        { description: 'Pago automático', amount: -89.90, icon: 'transfer' }
    ];
    
    let transactionIndex = 0;
    
    const interval = setInterval(() => {
        if (!currentUser || currentView !== 'dashboard' || transactionIndex >= demoTransactions.length) {
            clearInterval(interval);
            return;
        }
        
        const transaction = demoTransactions[transactionIndex];
        const newTransaction = {
            id: Date.now(),
            description: transaction.description,
            amount: transaction.amount,
            date: new Date().toISOString().split('T')[0],
            type: 'demo',
            icon: transaction.icon
        };
        
        // Actualizar saldo
        if (transaction.amount > 0) {
            currentUser.accounts.checking.balance += transaction.amount;
        } else {
            currentUser.accounts.checking.balance += transaction.amount; // Ya es negativo
        }
        
        // Agregar transacción
        currentUser.transactions.unshift(newTransaction);
        
        // Limitar a las últimas 10 transacciones
        if (currentUser.transactions.length > 10) {
            currentUser.transactions = currentUser.transactions.slice(0, 10);
        }
        
        // Actualizar interfaz
        updateUserInterface();
        
        transactionIndex++;
    }, 30000); // 30 segundos
}