import { auth, database } from './config.js';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    try {
        // Sign in with email and password
        const userCredential = await auth.signInWithEmailAndPassword(username, password);
        const user = userCredential.user;

        // Get user data from database
        const userRef = database.ref(`users/${user.uid}`);
        const snapshot = await userRef.once('value');
        const userData = snapshot.val();

        if (userData) {
            // Store user data in session storage
            sessionStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                ...userData
            }));

            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        showError('Login failed: ' + error.message);
    }
});

// Register Handler
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = registerForm.fullName.value;
    const username = registerForm.username.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;

    try {
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Create user profile in database
        await database.ref(`users/${user.uid}`).set({
            fullName,
            username,
            email,
            role: 'member',
            createdAt: firebase.database.ServerValue.TIMESTAMP
        });

        // Store user data in session storage
        sessionStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            fullName,
            username,
            email,
            role: 'member'
        }));

        // Close modal and redirect to dashboard
        registerModal.hide();
        window.location.href = 'dashboard.html';
    } catch (error) {
        showError('Registration failed: ' + error.message);
    }
});

// Auth State Observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        const userRef = database.ref(`users/${user.uid}`);
        userRef.once('value').then((snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                sessionStorage.setItem('user', JSON.stringify({
                    uid: user.uid,
                    ...userData
                }));
            }
        });
    } else {
        // User is signed out
        sessionStorage.removeItem('user');
    }
});

// Error Handler
function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const form = document.querySelector('.modal-body form');
    form.insertBefore(alertDiv, form.firstChild);

    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Export auth functions
export { auth }; 