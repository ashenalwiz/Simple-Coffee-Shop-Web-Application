// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for orders (in production, use a database)
let orders = [];
let orderIdCounter = 1;

// Coffee items data
const coffeeItems = [
  {
    id: 1,
    name: 'Espresso',
    price: 2.50,
    description: 'Rich and bold espresso shot'
  },
  {
    id: 2,
    name: 'Cappuccino',
    price: 3.75,
    description: 'Creamy cappuccino with foam art'
  },
  {
    id: 3,
    name: 'Latte',
    price: 4.25,
    description: 'Smooth latte with steamed milk'
  },
  {
    id: 4,
    name: 'Americano',
    price: 3.00,
    description: 'Classic black coffee'
  },
  {
    id: 5,
    name: 'Mocha',
    price: 4.75,
    description: 'Rich chocolate coffee blend'
  },
  {
    id: 6,
    name: 'Cold Brew',
    price: 3.50,
    description: 'Smooth cold brewed coffee'
  }
];

// Routes

// Get all coffee items
app.get('/api/coffee', (req, res) => {
  res.json(coffeeItems);
});

// Get a specific coffee item
app.get('/api/coffee/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = coffeeItems.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({ error: 'Coffee item not found' });
  }
  
  res.json(item);
});

// Place an order
app.post('/api/orders', (req, res) => {
  try {
    const { customer, items, total } = req.body;
    
    // Validate required fields
    if (!customer || !customer.name || !customer.email || !customer.address) {
      return res.status(400).json({ 
        error: 'Missing required customer information (name, email, address)' 
      });
    }
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }
    
    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Invalid order total' });
    }
    
    // Create new order
    const newOrder = {
      id: orderIdCounter++,
      customer,
      items,
      total: parseFloat(total),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    console.log(`New order received - Order #${newOrder.id}:`, newOrder);
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: newOrder.id,
      order: newOrder
    });
    
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all orders (for admin purposes)
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Get a specific order
app.get('/api/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(order => order.id === id);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json(order);
});

// Update order status
app.put('/api/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  
  const orderIndex = orders.findIndex(order => order.id === id);
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  if (!['pending', 'preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  orders[orderIndex].status = status;
  orders[orderIndex].updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Order status updated',
    order: orders[orderIndex]
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Coffee Shop API server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;