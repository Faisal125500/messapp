import { auth, database } from './config.js';

// Check authentication state
auth.onAuthStateChanged((user) => {
    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
    }
});

// Get current user data
const currentUser = JSON.parse(sessionStorage.getItem('user'));

// Initialize dashboard data
async function initializeDashboard() {
    try {
        // Get mess data
        const messRef = database.ref('mess');
        const messSnapshot = await messRef.once('value');
        const messData = messSnapshot.val() || {};

        // Update dashboard statistics
        updateDashboardStats(messData);

        // Load recent activities
        loadRecentActivities(messData);

        // Set up real-time listeners
        setupRealtimeListeners();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showError('Failed to load dashboard data');
    }
}

// Update dashboard statistics
function updateDashboardStats(messData) {
    const totalMembers = Object.keys(messData.members || {}).length;
    const totalMeals = Object.values(messData.meals || {}).reduce((sum, meal) => sum + meal.count, 0);
    const totalExpenses = Object.values(messData.expenses || {}).reduce((sum, expense) => sum + expense.amount, 0);

    // Update DOM elements
    document.getElementById('totalMembers').textContent = totalMembers;
    document.getElementById('totalMeals').textContent = totalMeals;
    document.getElementById('totalExpenses').textContent = `$${totalExpenses.toFixed(2)}`;
}

// Load recent activities
function loadRecentActivities(messData) {
    const activities = [];
    
    // Add meal entries
    if (messData.meals) {
        Object.entries(messData.meals).forEach(([date, meal]) => {
            activities.push({
                type: 'meal',
                date: new Date(date),
                data: meal
            });
        });
    }

    // Add expense entries
    if (messData.expenses) {
        Object.entries(messData.expenses).forEach(([date, expense]) => {
            activities.push({
                type: 'expense',
                date: new Date(date),
                data: expense
            });
        });
    }

    // Sort activities by date
    activities.sort((a, b) => b.date - a.date);

    // Display recent activities
    const activitiesList = document.getElementById('recentActivities');
    activitiesList.innerHTML = '';

    activities.slice(0, 5).forEach(activity => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        
        const date = activity.date.toLocaleDateString();
        const time = activity.date.toLocaleTimeString();
        
        if (activity.type === 'meal') {
            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${activity.data.memberName}</strong> had ${activity.data.count} meal(s)
                    </div>
                    <small class="text-muted">${date} ${time}</small>
                </div>
            `;
        } else {
            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${activity.data.description}</strong> - $${activity.data.amount.toFixed(2)}
                    </div>
                    <small class="text-muted">${date} ${time}</small>
                </div>
            `;
        }
        
        activitiesList.appendChild(li);
    });
}

// Set up real-time listeners
function setupRealtimeListeners() {
    // Listen for mess data changes
    const messRef = database.ref('mess');
    messRef.on('value', (snapshot) => {
        const messData = snapshot.val() || {};
        updateDashboardStats(messData);
        loadRecentActivities(messData);
    });
}

// Add meal entry
async function addMeal(memberId, count) {
    try {
        const date = new Date().toISOString().split('T')[0];
        const mealRef = database.ref(`mess/meals/${date}/${memberId}`);
        
        await mealRef.set({
            count,
            memberName: currentUser.fullName,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        showSuccess('Meal added successfully');
    } catch (error) {
        console.error('Error adding meal:', error);
        showError('Failed to add meal');
    }
}

// Add expense entry
async function addExpense(description, amount) {
    try {
        const date = new Date().toISOString().split('T')[0];
        const expenseRef = database.ref(`mess/expenses/${date}/${Date.now()}`);
        
        await expenseRef.set({
            description,
            amount: parseFloat(amount),
            addedBy: currentUser.fullName,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        showSuccess('Expense added successfully');
    } catch (error) {
        console.error('Error adding expense:', error);
        showError('Failed to add expense');
    }
}

// Show success message
function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Show error message
function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard); 