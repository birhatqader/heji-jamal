// Sample initial inventory data
        let inventory = [
            { id: 1, name: "Wooden Chairs", quantity: 24, image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { id: 2, name: "Office Desks", quantity: 15, image: "https://images.unsplash.com/photo-1505842381624-c6b0579625a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { id: 3, name: "Storage Boxes", quantity: 42, image: "https://images.unsplash.com/photo-1581101767113-167f2b6dcc55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { id: 4, name: "LED Lamps", quantity: 37, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { id: 5, name: "Bookshelves", quantity: 8, image: "https://images.unsplash.com/photo-1593085260707-5377ba37f868?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { id: 6, name: "Filing Cabinets", quantity: 12, image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" }
        ];

        // Sales data
        let sales = [];

        // DOM elements
        const inventoryContainer = document.getElementById('inventory-container');
        const totalItemsElement = document.getElementById('total-items');
        const totalQuantityElement = document.getElementById('total-quantity');
        const lowStockElement = document.getElementById('low-stock');
        const totalSalesElement = document.getElementById('total-sales');
        const currentDateElement = document.getElementById('current-date');
        const recentSalesElement = document.getElementById('recent-sales');
        const salesHistoryElement = document.getElementById('sales-history');
        const notificationElement = document.getElementById('notification');
        const printSection = document.getElementById('print-section');

        // Initialize the application
        function initApp() {
            // Load inventory from localStorage if available
            const savedInventory = localStorage.getItem('inventory');
            if (savedInventory) {
                inventory = JSON.parse(savedInventory);
            }
            
            // Load sales from localStorage if available
            const savedSales = localStorage.getItem('sales');
            if (savedSales) {
                sales = JSON.parse(savedSales);
            }
            
            // Display current date
            const now = new Date();
            currentDateElement.textContent = now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            // Set up image upload options
            setupImageUploadOptions();
            
            // Render inventory and update stats
            renderInventory();
            updateStats();
            renderRecentSales();
        }

        // Set up image upload options
        function setupImageUploadOptions() {
            const optionButtons = document.querySelectorAll('.image-option-btn');
            const urlPanel = document.getElementById('url-panel');
            const uploadPanel = document.getElementById('upload-panel');
            const urlInput = document.getElementById('itemImage');
            const uploadInput = document.getElementById('itemImageUpload');
            const preview = document.getElementById('imagePreview');
            
            // Handle option button clicks
            optionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const option = button.getAttribute('data-option');
                    
                    // Toggle active class
                    optionButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Show appropriate panel
                    urlPanel.classList.remove('active');
                    uploadPanel.classList.remove('active');
                    
                    if (option === 'url') {
                        urlPanel.classList.add('active');
                        urlInput.setAttribute('required', 'true');
                        uploadInput.removeAttribute('required');
                    } else {
                        uploadPanel.classList.add('active');
                        uploadInput.setAttribute('required', 'true');
                        urlInput.removeAttribute('required');
                    }
                });
            });
            
            // Handle URL input changes
            urlInput.addEventListener('input', () => {
                if (urlInput.value) {
                    preview.src = urlInput.value;
                    preview.classList.add('visible');
                } else {
                    preview.classList.remove('visible');
                }
            });
            
            // Handle file upload changes
            uploadInput.addEventListener('change', () => {
                const file = uploadInput.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.src = e.target.result;
                        preview.classList.add('visible');
                    };
                    reader.readAsDataURL(file);
                } else {
                    preview.classList.remove('visible');
                }
            });
        }

        // Render inventory items
        function renderInventory() {
            inventoryContainer.innerHTML = '';
            
            inventory.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = 'item-card';
                
                itemCard.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3 class="item-name">${item.name}</h3>
                        <div class="item-quantity">In stock: <span class="quantity-number">${item.quantity}</span></div>
                        <div class="item-actions">
                            <div class="sell-form">
                                <input type="number" class="sell-input" id="sell-${item.id}" min="1" max="${item.quantity}" value="1">
                                <button type="button" class="btn-success no-print" onclick="openSellItemModal(${item.id})">
                                    <i class="fas fa-cash-register"></i> Sell
                                </button>
                            </div>
                            <button type="button" class="btn-danger no-print" onclick="removeItem(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                inventoryContainer.appendChild(itemCard);
            });
        }

        // Update statistics
        function updateStats() {
            const totalItems = inventory.length;
            const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
            const lowStock = inventory.filter(item => item.quantity < 10).length;
            const totalSalesCount = sales.reduce((sum, sale) => sum + sale.quantity, 0);
            
            totalItemsElement.textContent = totalItems;
            totalQuantityElement.textContent = totalQuantity;
            lowStockElement.textContent = lowStock;
            totalSalesElement.textContent = totalSalesCount;
        }

        // Show notification
        function showNotification(message, isSuccess = true) {
            notificationElement.textContent = message;
            notificationElement.style.backgroundColor = isSuccess ? '#2ecc71' : '#e74c3c';
            notificationElement.classList.add('show');
            
            setTimeout(() => {
                notificationElement.classList.remove('show');
            }, 3000);
        }

        // Open sell item modal
        function openSellItemModal(itemId) {
            const item = inventory.find(item => item.id === itemId);
            if (item) {
                document.getElementById('sellItemId').value = itemId;
                document.getElementById('sellItemName').value = item.name;
                document.getElementById('sellItemQuantity').value = item.quantity;
                document.getElementById('sellQuantity').value = 1;
                document.getElementById('sellQuantity').max = item.quantity;
                document.getElementById('sellNotes').value = '';
                document.getElementById('sellItemModal').style.display = 'flex';
            }
        }

        // Close sell item modal
        function closeSellItemModal() {
            document.getElementById('sellItemModal').style.display = 'none';
        }

        // Process sale
        function processSale(event) {
            event.preventDefault();
            
            const itemId = parseInt(document.getElementById('sellItemId').value);
            const sellQuantity = parseInt(document.getElementById('sellQuantity').value);
            const notes = document.getElementById('sellNotes').value;
            
            if (isNaN(sellQuantity) || sellQuantity <= 0) {
                alert('Please enter a valid quantity to sell');
                return;
            }
            
            const itemIndex = inventory.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                if (inventory[itemIndex].quantity < sellQuantity) {
                    alert('Not enough stock! Only ' + inventory[itemIndex].quantity + ' available.');
                    return;
                }
                
                // Record the sale
                const sale = {
                    id: sales.length + 1,
                    itemId: itemId,
                    itemName: inventory[itemIndex].name,
                    quantity: sellQuantity,
                    notes: notes,
                    date: new Date().toLocaleString()
                };
                
                sales.unshift(sale); // Add to beginning of array
                
                // Update inventory
                inventory[itemIndex].quantity -= sellQuantity;
                
                // Show notification
                showNotification('Sold ' + sellQuantity + ' of ' + inventory[itemIndex].name);
                
                // If quantity becomes 0, remove the item
                if (inventory[itemIndex].quantity === 0) {
                    inventory.splice(itemIndex, 1);
                }
                
                // Update UI and save to localStorage
                renderInventory();
                updateStats();
                renderRecentSales();
                saveToLocalStorage();
                
                // Close the modal
                closeSellItemModal();
            }
        }

        // Render recent sales
        function renderRecentSales() {
            recentSalesElement.innerHTML = '';
            const recentSales = sales.slice(0, 5); // Get last 5 sales
            
            if (recentSales.length === 0) {
                recentSalesElement.innerHTML = '<tr><td colspan="4" style="text-align: center;">No sales recorded yet</td></tr>';
                return;
            }
            
            recentSales.forEach(sale => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sale.date}</td>
                    <td>${sale.itemName}</td>
                    <td>${sale.quantity}</td>
                    <td class="note-cell" title="${sale.notes || 'No notes'}">${sale.notes || '-'}</td>
                `;
                recentSalesElement.appendChild(row);
            });
        }

        // Render sales history
        function renderSalesHistory() {
            salesHistoryElement.innerHTML = '';
            
            if (sales.length === 0) {
                salesHistoryElement.innerHTML = '<tr><td colspan="4" style="text-align: center;">No sales history</td></tr>';
                return;
            }
            
            sales.forEach(sale => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sale.date}</td>
                    <td>${sale.itemName}</td>
                    <td>${sale.quantity}</td>
                    <td class="note-cell" title="${sale.notes || 'No notes'}">${sale.notes || '-'}</td>
                `;
                salesHistoryElement.appendChild(row);
            });
        }

        // Remove an item
        function removeItem(itemId) {
            if (confirm('Are you sure you want to remove this item from inventory?')) {
                inventory = inventory.filter(item => item.id !== itemId);
                renderInventory();
                updateStats();
                saveToLocalStorage();
                showNotification('Item removed from inventory');
            }
        }

        // Open add item modal
        function openAddItemModal() {
            document.getElementById('addItemModal').style.display = 'flex';
        }

        // Close add item modal
        function closeAddItemModal() {
            document.getElementById('addItemModal').style.display = 'none';
            document.getElementById('addItemForm').reset();
            document.getElementById('imagePreview').classList.remove('visible');
            
            // Reset to URL option
            document.querySelectorAll('.image-option-btn').forEach(btn => {
                if (btn.getAttribute('data-option') === 'url') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            document.getElementById('url-panel').classList.add('active');
            document.getElementById('upload-panel').classList.remove('active');
            
            document.getElementById('itemImage').setAttribute('required', 'true');
            document.getElementById('itemImageUpload').removeAttribute('required');
        }

        // View sales history
        function viewSalesHistory() {
            renderSalesHistory();
            document.getElementById('salesHistoryModal').style.display = 'flex';
        }

        // Close sales history modal
        function closeSalesHistoryModal() {
            document.getElementById('salesHistoryModal').style.display = 'none';
        }

        // Clear sales history
        function clearSalesHistory() {
            if (confirm('Are you sure you want to clear all sales history? This cannot be undone.')) {
                sales = [];
                renderSalesHistory();
                renderRecentSales();
                updateStats();
                localStorage.setItem('sales', JSON.stringify(sales));
                showNotification('Sales history cleared');
            }
        }

        // Add new item
        function addNewItem(event) {
            event.preventDefault();
            
            const name = document.getElementById('itemName').value;
            const quantity = parseInt(document.getElementById('itemQuantity').value);
            
            // Get image based on selected option
            const isUrlOption = document.querySelector('.image-option-btn.active').getAttribute('data-option') === 'url';
            let image;
            
            if (isUrlOption) {
                image = document.getElementById('itemImage').value;
            } else {
                const fileInput = document.getElementById('itemImageUpload');
                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        image = e.target.result;
                        completeAddItem(name, quantity, image);
                    };
                    
                    reader.readAsDataURL(file);
                    return; // Exit early, the rest will be handled in the onload function
                } else {
                    alert('Please select an image to upload');
                    return;
                }
            }
            
            completeAddItem(name, quantity, image);
        }
        
        // Complete adding item (called after image processing)
        function completeAddItem(name, quantity, image) {
            // Generate a unique ID
            const id = inventory.length > 0 ? Math.max(...inventory.map(item => item.id)) + 1 : 1;
            
            // Add to inventory
            inventory.push({ id, name, quantity, image });
            
            // Update UI and close modal
            renderInventory();
            updateStats();
            saveToLocalStorage();
            closeAddItemModal();
            
            showNotification('Added ' + name + ' to inventory');
        }

        // Save inventory to localStorage
        function saveToLocalStorage() {
            localStorage.setItem('inventory', JSON.stringify(inventory));
            localStorage.setItem('sales', JSON.stringify(sales));
        }

        // Save inventory data to file
        function saveInventoryData() {
            const data = {
                inventory: inventory,
                sales: sales,
                exportedAt: new Date().toLocaleString()
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = 'inventory_data_' + new Date().toISOString().slice(0, 10) + '.json';
            link.click();
            
            showNotification('Inventory data saved to file');
        }

        // Reset inventory
        function resetInventory() {
            if (confirm('Are you sure you want to reset the inventory? This will remove all items and sales history.')) {
                inventory = [];
                sales = [];
                renderInventory();
                renderRecentSales();
                updateStats();
                saveToLocalStorage();
                showNotification('Inventory has been reset');
            }
        }

        // Print sales report
        function printSalesReport() {
            let printContent = `
                <div style="padding: 20px; font-family: Arial, sans-serif;">
                    <h1 style="text-align: center; margin-bottom: 20px;">Inventory Sales Report</h1>
                    <p style="margin-bottom: 20px;"><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                    
                    <h2 style="margin-bottom: 10px;">Current Inventory Summary</h2>
                    <table class="print-table">
                        <thead>
                            <tr>
                                <th>Total Items</th>
                                <th>Total Quantity</th>
                                <th>Low Stock Items</th>
                                <th>Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${inventory.length}</td>
                                <td>${inventory.reduce((sum, item) => sum + item.quantity, 0)}</td>
                                <td>${inventory.filter(item => item.quantity < 10).length}</td>
                                <td>${sales.reduce((sum, sale) => sum + sale.quantity, 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <h2 style="margin-bottom: 10px; margin-top: 30px;">Current Inventory</h2>
                    <table class="print-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            inventory.forEach(item => {
                const status = item.quantity < 10 ? 'Low Stock' : 'In Stock';
                printContent += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${status}</td>
                    </tr>
                `;
            });
            
            printContent += `
                        </tbody>
                    </table>
                    
                    <h2 style="margin-bottom: 10px; margin-top: 30px;">Recent Sales (Last 10)</h2>
                    <table class="print-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Item</th>
                                <th>Quantity Sold</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            const recentSales = sales.slice(0, 10);
            if (recentSales.length === 0) {
                printContent += `
                    <tr>
                        <td colspan="4" style="text-align: center;">No sales recorded</td>
                    </tr>
                `;
            } else {
                recentSales.forEach(sale => {
                    printContent += `
                        <tr>
                            <td>${sale.date}</td>
                            <td>${sale.itemName}</td>
                            <td>${sale.quantity}</td>
                            <td>${sale.notes || '-'}</td>
                        </tr>
                    `;
                });
            }
            
            printContent += `
                        </tbody>
                    </table>
                </div>
            `;
            
            printSection.innerHTML = printContent;
            
            // Trigger print after a small delay to ensure content is rendered
            setTimeout(() => {
                window.print();
            }, 100);
        }

        // Print sales history
        function printSalesHistory() {
            let printContent = `
                <div style="padding: 20px; font-family: Arial, sans-serif;">
                    <h1 style="text-align: center; margin-bottom: 20px;">Complete Sales History</h1>
                    <p style="margin-bottom: 20px;"><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                    <p style="margin-bottom: 20px;"><strong>Total Sales Records:</strong> ${sales.length}</p>
                    
                    <table class="print-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Item</th>
                                <th>Quantity Sold</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            if (sales.length === 0) {
                printContent += `
                    <tr>
                        <td colspan="4" style="text-align: center;">No sales history</td>
                    </tr>
                `;
            } else {
                sales.forEach(sale => {
                    printContent += `
                        <tr>
                            <td>${sale.date}</td>
                            <td>${sale.itemName}</td>
                            <td>${sale.quantity}</td>
                            <td>${sale.notes || '-'}</td>
                        </tr>
                    `;
                });
            }
            
            printContent += `
                        </tbody>
                    </table>
                </div>
            `;
            
            printSection.innerHTML = printContent;
            
            // Close the modal before printing
            closeSalesHistoryModal();
            
            // Trigger print after a small delay to ensure content is rendered
            setTimeout(() => {
                window.print();
            }, 100);
        }

        // Initialize the app when the page loads
        window.onload = initApp;