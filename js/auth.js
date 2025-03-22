import { auth, database } from './config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { 
    ref, 
    set, 
    get, 
    onValue,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.username.value;
    const password = loginForm.password.value;

    try {
        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user data from database
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
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
    const email = registerForm.email.value;
    const password = registerForm.password.value;

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user profile in database
        await set(ref(database, `users/${user.uid}`), {
            fullName,
            email,
            role: 'member',
            createdAt: serverTimestamp()
        });

        // Store user data in session storage
        sessionStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            fullName,
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
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        const userRef = ref(database, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
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

// Logout Handler
document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        showError('Logout failed: ' + error.message);
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