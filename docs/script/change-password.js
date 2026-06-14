document.getElementById('change-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageDiv = document.getElementById('change-password-message');
    
    if (newPassword !== confirmPassword) {
        messageDiv.style.color = '#ff4757';
        messageDiv.style.background = 'rgba(255, 71, 87, 0.1)';
        messageDiv.style.borderLeftColor = '#ff4757';
        messageDiv.textContent = 'As senhas não coincidem!';
        messageDiv.style.display = 'block';
        return;
    }
    
    if (newPassword.length < 6) {
        messageDiv.style.color = '#ff4757';
        messageDiv.style.background = 'rgba(255, 71, 87, 0.1)';
        messageDiv.style.borderLeftColor = '#ff4757';
        messageDiv.textContent = 'A senha deve ter pelo menos 6 caracteres!';
        messageDiv.style.display = 'block';
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:3000/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                currentPassword, 
                newPassword 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.style.color = '#27ae60';
            messageDiv.style.background = 'rgba(39, 174, 96, 0.1)';
            messageDiv.style.borderLeftColor = '#27ae60';
            messageDiv.textContent = data.message || 'Senha alterada com sucesso!';
            document.getElementById('change-password-form').reset();
        } else {
            messageDiv.style.color = '#ff4757';
            messageDiv.style.background = 'rgba(255, 71, 87, 0.1)';
            messageDiv.style.borderLeftColor = '#ff4757';
            messageDiv.textContent = data.error || 'Erro ao alterar senha. Verifique sua senha atual.';
        }
        
        messageDiv.style.display = 'block';
    } catch (error) {
        messageDiv.style.color = '#ff4757';
        messageDiv.style.background = 'rgba(255, 71, 87, 0.1)';
        messageDiv.style.borderLeftColor = '#ff4757';
        messageDiv.textContent = 'Erro de conexão. Tente novamente.';
        messageDiv.style.display = 'block';
    }
});
