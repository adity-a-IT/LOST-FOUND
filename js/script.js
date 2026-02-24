// ============================================
// Data Management
// ============================================

let items = [];
let itemIdCounter = 1000;
let currentUser = null;
let userRole = null;

// ============================================
// Authentication System
// ============================================

// Check if user is logged in on page load
function checkUserSession() {
    const storedUser = localStorage.getItem('currentUser');
    const storedRole = localStorage.getItem('userRole');

    if (storedUser && storedRole) {
        currentUser = storedUser;
        userRole = storedRole;
        showMainApp();
    } else {
        showLoginPage();
    }
}

function showLoginPage() {
    document.getElementById('loginWrapper').style.display = 'flex';
    document.getElementById('navbar').style.display = 'none';
    document.querySelector('.main-container').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
}

function showMainApp() {
    document.getElementById('loginWrapper').style.display = 'none';
    document.getElementById('navbar').style.display = 'block';
    document.querySelector('.main-container').style.display = 'block';
    document.querySelector('.footer').style.display = 'block';
    updateNavBarForRole();
    switchPage('home');
}

function updateNavBarForRole() {
    const adminLink = document.getElementById('adminMenuLink');
    if (userRole === 'admin') {
        adminLink.style.display = 'block';
    } else {
        adminLink.style.display = 'none';
    }
}

// Initialize with sample data
function initializeSampleData() {
    const sampleItems = [];
    items = sampleItems;
    updateAllViews();
}

// ============================================
// Login Form Handlers
// ============================================

function switchLoginTab(tab) {
    // Hide all forms
    document.getElementById('studentLoginForm').classList.remove('active');
    document.getElementById('adminLoginForm').classList.remove('active');

    // Remove active class from tabs
    document.getElementById('studentTabBtn').classList.remove('active');
    document.getElementById('adminTabBtn').classList.remove('active');

    // Show selected form and tab
    if (tab === 'student') {
        document.getElementById('studentLoginForm').classList.add('active');
        document.getElementById('studentTabBtn').classList.add('active');
    } else {
        document.getElementById('adminLoginForm').classList.add('active');
        document.getElementById('adminTabBtn').classList.add('active');
    }
}

function handleStudentLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;

    // Accept any student email and password
    if (email.trim() && password.trim()) {
        currentUser = email;
        userRole = 'student';
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('userRole', userRole);
        showMainApp();
        showNotification('✓ Welcome, Student!');
    } else {
        showNotification('❌ Please enter email and password');
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    // Accept any admin email and password
    if (email.trim() && password.trim()) {
        currentUser = email;
        userRole = 'admin';
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('userRole', userRole);
        showMainApp();
        showNotification('✓ Welcome, Admin!');
    } else {
        showNotification('❌ Please enter email and password');
    }
}

function logout() {
    currentUser = null;
    userRole = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    document.getElementById('studentLoginForm').reset();
    document.getElementById('adminLoginForm').reset();
    switchLoginTab('student');
    showLoginPage();
    showNotification('✓ Logged out successfully');
}

// ============================================
// Page Navigation
// ============================================

function switchPage(pageName) {
    // Prevent non-admin users from accessing admin page
    if (pageName === 'admin' && userRole !== 'admin') {
        showNotification('❌ Access Denied! Only admins can view the dashboard');
        switchPage('home');
        return;
    }

    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Show selected page
    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === pageName) {
            link.style.borderBottom = '3px solid #ffffff';
        } else {
            link.style.borderBottom = 'none';
        }
    });

    // Close mobile menu
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.remove('active');

    // Populate page content when switching
    if (pageName === 'home') {
        displayRecentlyAdded();
    } else if (pageName === 'search') {
        displayAllItems();
    } else if (pageName === 'admin') {
        updateAdminDashboard();
    }
}

// ============================================
// Mobile Menu Toggle
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkUserSession();
    
    // Fetch items from backend API
    fetchItemsFromAPI();

    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const pageName = this.dataset.page;
            switchPage(pageName);
        });
    });
});

// ============================================
// Notification System
// ============================================

function showNotification(message) {
    const banner = document.getElementById('notificationBanner');
    const text = document.getElementById('notificationText');
    text.textContent = message;
    banner.classList.add('show');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        banner.classList.remove('show');
    }, 5000);
}

function closeNotification() {
    const banner = document.getElementById('notificationBanner');
    banner.classList.remove('show');
}

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Fetch items from backend
async function fetchItemsFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/items`);
        if (response.ok) {
            items = await response.json();
            updateAllViews();
        }
    } catch (error) {
        console.log('Backend not available, using local storage', error);
    }
}

// Add item to backend
async function addItemToAPI(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const newItem = await response.json();
            items.push(newItem);
            updateAllViews();
            return newItem;
        }
    } catch (error) {
        console.log('Could not save to backend, saving locally', error);
        items.push(formData);
        updateAllViews();
    }
}

// Update item in backend
async function updateItemInAPI(itemId, updates) {
    try {
        const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        if (response.ok) {
            await fetchItemsFromAPI();
        }
    } catch (error) {
        console.log('Could not update item', error);
    }
}

// Delete item from backend
async function deleteItemFromAPI(itemId) {
    try {
        const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            items = items.filter(i => i._id !== itemId);
            updateAllViews();
        }
    } catch (error) {
        console.log('Could not delete item', error);
    }
}
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '#e2e8f0';
        }
    });

    return isValid;
}

// Image preview
document.getElementById('lostImage')?.addEventListener('change', function(e) {
    handleImagePreview(e, 'lostImagePreview');
});

document.getElementById('foundImage')?.addEventListener('change', function(e) {
    handleImagePreview(e, 'foundImagePreview');
});

function handleImagePreview(event, previewContainerId) {
    const files = event.target.files;
    const container = document.getElementById(previewContainerId);
    container.innerHTML = '';

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            container.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

// Lost Item Form Submission
document.getElementById('lostItemForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateForm(this)) {
        alert('Please fill all required fields');
        return;
    }

    const formData = {
        itemName: document.getElementById('lostItemName').value,
        category: document.getElementById('lostCategory').value,
        description: document.getElementById('lostDescription').value,
        location: document.getElementById('lostLocation').value,
        date: document.getElementById('lostDate').value,
        status: 'lost',
        image: '📷',
        contact: document.getElementById('lostContact').value
    };

    await addItemToAPI(formData);

    // Show matches
    const matches = findMatches(formData);
    if (matches.length > 0) {
        displayMatches(matches, 'lostMatches', 'lostMatchesGrid');
    }

    showNotification('✓ Lost item reported successfully! We will help you find it.');
    this.reset();
    document.getElementById('lostImagePreview').innerHTML = '';

    // Scroll to matches
    if (matches.length > 0) {
        setTimeout(() => {
            document.getElementById('lostMatches').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
});

// Found Item Form Submission
document.getElementById('foundItemForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateForm(this)) {
        alert('Please fill all required fields');
        return;
    }

    const formData = {
        itemName: document.getElementById('foundItemName').value,
        category: document.getElementById('foundCategory').value,
        description: document.getElementById('foundDescription').value,
        location: document.getElementById('foundLocation').value,
        date: document.getElementById('foundDate').value,
        status: 'found',
        image: '📷',
        contact: document.getElementById('foundContact').value
    };

    await addItemToAPI(formData);

    // Show matches
    const matches = findMatches(formData);
    if (matches.length > 0) {
        displayMatches(matches, 'foundMatches', 'foundMatchesGrid');
    }

    showNotification('✓ Found item reported successfully! Thank you for helping.');
    this.reset();
    document.getElementById('foundImagePreview').innerHTML = '';

    // Scroll to matches
    if (matches.length > 0) {
        setTimeout(() => {
            document.getElementById('foundMatches').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
});

// ============================================
// Matching System
// ============================================

function findMatches(newItem) {
    const oppositeStatus = newItem.status === 'lost' ? 'found' : 'lost';
    const matches = [];
    const newItemId = newItem._id || newItem.id;

    items.forEach(item => {
        const itemId = item._id || item.id;
        if (item.status !== oppositeStatus || itemId === newItemId) return;

        const categoryMatch = item.category === newItem.category;
        const locationProximity = item.location.toLowerCase().includes(newItem.location.toLowerCase()) ||
                                 newItem.location.toLowerCase().includes(item.location.toLowerCase());
        const keywordMatch = newItem.description.toLowerCase().split(' ').some(word =>
            word.length > 3 && item.description.toLowerCase().includes(word)
        );

        // Calculate match score
        let score = 0;
        if (categoryMatch) score += 40;
        if (locationProximity) score += 35;
        if (keywordMatch) score += 25;

        if (score >= 40) {
            matches.push({ ...item, matchScore: score });
        }
    });

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);
    return matches.slice(0, 3); // Return top 3 matches
}

function displayMatches(matches, sectionId, gridId) {
    const section = document.getElementById(sectionId);
    const grid = document.getElementById(gridId);

    if (matches.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    grid.innerHTML = '';

    matches.forEach(item => {
        const card = createItemCard(item, true);
        grid.appendChild(card);
    });
}

// ============================================
// Display Functions
// ============================================

function displayRecentlyAdded() {
    updateHeroStats();
    
    const recentItems = [...items]
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        .slice(0, 6);

    const grid = document.getElementById('recentlyAddedGrid');
    grid.innerHTML = '';

    if (recentItems.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">No items yet</p>';
        return;
    }

    recentItems.forEach(item => {
        const card = createItemCard(item);
        grid.appendChild(card);
    });
}

function updateHeroStats() {
    const totalItems = items.length;
    const lostItems = items.filter(i => i.status === 'lost').length;
    const foundItems = items.filter(i => i.status === 'found').length;
    
    document.getElementById('heroTotalItems').textContent = totalItems;
    document.getElementById('heroLostItems').textContent = lostItems;
    document.getElementById('heroFoundItems').textContent = foundItems;
}

function createItemCard(item, isMatch = false) {
    const card = document.createElement('div');
    card.className = 'item-card';

    const itemId = item._id || item.id;
    const categoryEmoji = getCategoryEmoji(item.category);
    const dateObj = new Date(item.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    card.innerHTML = `
        <div class="item-image" style="display: flex; align-items: center; justify-content: center; font-size: 4rem;">
            ${getCategoryIcon(item.category)}
        </div>
        <div class="item-content">
            <div class="item-header">
                <h3 class="item-name">${item.itemName}</h3>
                <span class="item-badge ${item.status === 'lost' ? 'badge-lost' : 'badge-found'}">
                    ${item.status}
                </span>
            </div>
            ${isMatch ? `<span class="item-badge badge-matched">Suggested Match</span>` : ''}
            <span class="item-category">${item.category}</span>
            <p class="item-description">${item.description}</p>
            <div class="item-meta">
                <div class="item-location">📍 <strong>${item.location}</strong></div>
                <div class="item-date">📅 ${formattedDate}</div>
                <div class="item-date">📧 ${item.contact}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-primary" onclick="alert('Contacting: ${item.contact}')">Contact Owner</button>
                <button class="btn btn-secondary" onclick="shareItem('${itemId}')">Share</button>
            </div>
        </div>
    `;

    return card;
}

function displayAllItems() {
    const grid = document.getElementById('searchResultsGrid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">No items found</p>';
        return;
    }

    items.forEach(item => {
        const card = createItemCard(item);
        grid.appendChild(card);
    });

    updateResultsTitle();
}

function updateResultsTitle() {
    const title = document.getElementById('resultsTitle');
    const count = items.length;
    title.textContent = `All Items (${count})`;
}

// ============================================
// Search & Filter
// ============================================

function performSearch() {
    applyFilters();
}

function handleDateRangeChange() {
    const dateRange = document.getElementById('filterDateRange').value;
    const customDateRange = document.getElementById('customDateRange');
    
    if (dateRange === 'custom') {
        customDateRange.style.display = 'block';
    } else {
        customDateRange.style.display = 'none';
        // Clear custom dates when switching away from custom
        document.getElementById('filterStartDate').value = '';
        document.getElementById('filterEndDate').value = '';
    }
    
    applyFilters();
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    const locationFilter = document.getElementById('filterLocation').value.toLowerCase();
    const dateRange = document.getElementById('filterDateRange').value;
    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;

    const today = new Date();
    
    const filteredItems = items.filter(item => {
        // Search/Keyword filter
        const matchesSearch = !searchInput ||
            item.itemName.toLowerCase().includes(searchInput) ||
            item.description.toLowerCase().includes(searchInput) ||
            item.category.toLowerCase().includes(searchInput) ||
            item.location.toLowerCase().includes(searchInput);

        // Status filter
        const matchesStatus = !statusFilter || item.status === statusFilter;

        // Category filter
        const matchesCategory = !categoryFilter || item.category === categoryFilter;

        // Location filter
        const matchesLocation = !locationFilter || item.location.toLowerCase().includes(locationFilter);

        // Date filter (Quick range or Custom range)
        let matchesDate = true;
        
        if (dateRange === 'custom') {
            // Custom date range
            if (startDate || endDate) {
                const itemDate = new Date(item.date);
                
                if (startDate) {
                    const start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    if (itemDate < start) matchesDate = false;
                }
                
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    if (itemDate > end) matchesDate = false;
                }
            }
        } else if (dateRange) {
            // Quick date range
            const daysRange = parseInt(dateRange);
            const itemDate = new Date(item.date);
            const daysDiff = Math.floor((today - itemDate) / (1000 * 60 * 60 * 24));
            matchesDate = daysDiff <= daysRange;
        }

        return matchesSearch && matchesStatus && matchesCategory && matchesLocation && matchesDate;
    });

    displayFilteredResults(filteredItems);
}

function displayFilteredResults(filteredItems) {
    const grid = document.getElementById('searchResultsGrid');
    grid.innerHTML = '';

    const title = document.getElementById('resultsTitle');
    
    if (filteredItems.length === 0) {
        title.textContent = 'No Results';
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">
                <p style="font-size: 3rem; margin-bottom: 1rem;">🔍</p>
                <p style="color: #64748b; font-size: 1.1rem; margin-bottom: 1rem;">No items found matching your criteria</p>
                <p style="color: #94a3b8; font-size: 0.95rem;">Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }

    // Count by status
    const lostCount = filteredItems.filter(i => i.status === 'lost').length;
    const foundCount = filteredItems.filter(i => i.status === 'found').length;
    
    let resultText = `Found ${filteredItems.length} item${filteredItems.length > 1 ? 's' : ''}`;
    if (lostCount > 0 && foundCount > 0) {
        resultText += ` (${lostCount} lost, ${foundCount} found)`;
    }
    
    title.textContent = resultText;

    filteredItems.forEach(item => {
        const card = createItemCard(item);
        grid.appendChild(card);
    });
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterLocation').value = '';
    document.getElementById('filterDateRange').value = '';
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';
    document.getElementById('customDateRange').style.display = 'none';
    displayAllItems();
}

// ============================================
// Admin Dashboard
// ============================================

function updateAdminDashboard() {
    updateStats();
    updateAdminTable();
}

function updateStats() {
    const total = items.length;
    const lost = items.filter(item => item.status === 'lost').length;
    const found = items.filter(item => item.status === 'found').length;
    const resolved = items.filter(item => item.status === 'resolved').length;

    document.getElementById('totalItemsCount').textContent = total;
    document.getElementById('lostItemsCount').textContent = lost;
    document.getElementById('foundItemsCount').textContent = found;
    document.getElementById('resolvedItemsCount').textContent = resolved;
}

function updateAdminTable() {
    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = '';

    items.forEach(item => {
        const itemId = item._id || item.id;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${itemId.substring(0, 8)}</td>
            <td>${item.itemName}</td>
            <td>${item.category}</td>
            <td>
                <span class="item-badge ${item.status === 'lost' ? 'badge-lost' : item.status === 'found' ? 'badge-found' : 'badge-resolved'}">
                    ${item.status}
                </span>
            </td>
            <td>${item.location}</td>
            <td>${new Date(item.date).toLocaleDateString()}</td>
            <td>
                <div class="admin-table-actions">
                    <button class="btn btn-primary" onclick="openEditModal('${itemId}')">Edit</button>
                    <button class="btn btn-secondary" onclick="markAsResolved('${itemId}')">Resolve</button>
                    <button class="btn btn-danger" onclick="deleteItem('${itemId}')">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openEditModal(itemId) {
    const item = items.find(i => (i._id || i.id) === itemId);
    if (!item) return;

    document.getElementById('editItemId').value = itemId;
    document.getElementById('editItemName').value = item.itemName;
    document.getElementById('editDescription').value = item.description;
    document.getElementById('editStatus').value = item.status;

    const modal = document.getElementById('editModal');
    modal.classList.add('show');
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('show');
}

document.getElementById('editForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const itemId = document.getElementById('editItemId').value;
    const updates = {
        itemName: document.getElementById('editItemName').value,
        description: document.getElementById('editDescription').value,
        status: document.getElementById('editStatus').value
    };

    await updateItemInAPI(itemId, updates);
    showNotification('✓ Item updated successfully');
    closeEditModal();
});

function markAsResolved(itemId) {
    const item = items.find(i => i._id === itemId || i.id === itemId);
    if (item) {
        updateItemInAPI(itemId, { status: 'resolved' });
        showNotification('✓ Item marked as resolved');
    }
}

function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        deleteItemFromAPI(itemId);
        showNotification('✓ Item deleted successfully');
    }
}

function downloadReport() {
    // Summary section
    const totalItems = items.length;
    const lostItems = items.filter(i => i.status === 'lost').length;
    const foundItems = items.filter(i => i.status === 'found').length;
    const resolvedItems = items.filter(i => i.status === 'resolved').length;

    // Create CSV content
    let csvContent = 'University Lost & Found - Report\n';
    csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    // Summary
    csvContent += 'SUMMARY\n';
    csvContent += `Total Items,${totalItems}\n`;
    csvContent += `Lost Items,${lostItems}\n`;
    csvContent += `Found Items,${foundItems}\n`;
    csvContent += `Resolved Items,${resolvedItems}\n\n`;
    
    // Items table header
    csvContent += 'ITEMS DETAILS\n';
    csvContent += 'ID,Item Name,Category,Description,Location,Date,Status,Contact\n';
    
    // Items data
    items.forEach(item => {
        const itemId = (item._id || item.id).toString().substring(0, 8);
        const name = `"${item.itemName}"`;
        const category = item.category;
        const description = `"${item.description.replace(/"/g, '""')}"`;
        const location = item.location;
        const date = new Date(item.date).toLocaleDateString();
        const status = item.status;
        const contact = item.contact;
        
        csvContent += `${itemId},${name},${category},${description},${location},${date},${status},${contact}\n`;
    });

    // Create blob and download
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lost-found-report-${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showNotification('✓ CSV report downloaded successfully');
}

// ============================================
// Utility Functions
// ============================================

function getCategoryEmoji(category) {
    const emojis = {
        'electronics': '📱',
        'books': '📚',
        'clothing': '👕',
        'personal': '👜',
        'sports': '⚽',
        'other': '📦'
    };
    return emojis[category] || '📦';
}

function getCategoryIcon(category) {
    return getCategoryEmoji(category);
}

function shareItem(itemId) {
    const item = items.find(i => (i._id || i.id) === itemId);
    if (item) {
        const text = `${item.itemName} - ${item.status.toUpperCase()}\n${item.description}\nLocation: ${item.location}\nDate: ${item.date}`;
        if (navigator.share) {
            navigator.share({
                title: `University Lost & Found - ${item.itemName}`,
                text: text
            });
        } else {
            // Fallback
            const shareUrl = `Check this out: "${item.itemName}" posted on University Lost & Found - ${item.description}`;
            alert('Share this: ' + shareUrl);
        }
    }
}

function updateAllViews() {
    displayRecentlyAdded();
    displayAllItems();
    updateStats();
}

// ============================================
// Close Modal when clicking outside
// ============================================

window.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
});
