import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Coffee, MapPin, User, Mail } from 'lucide-react';
import './App.css';

const CoffeeShop = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: ''
  });


  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const coffeeItems = [
    {
      id: 1,
      name: 'Espresso',
      price: 2.50,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=200&h=200&fit=crop&crop=center',
      description: 'Rich and bold espresso shot'
    },
    {
      id: 2,
      name: 'Cappuccino',
      price: 3.75,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=200&fit=crop&crop=center',
      description: 'Creamy cappuccino with foam art'
    },
    {
      id: 3,
      name: 'Latte',
      price: 4.25,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop&crop=center',
      description: 'Smooth latte with steamed milk'
    },
    {
      id: 4,
      name: 'Americano',
      price: 3.00,
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=200&h=200&fit=crop&crop=center',
      description: 'Classic black coffee'
    },
    {
      id: 5,
      name: 'Mocha',
      price: 4.75,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center',
      description: 'Rich chocolate coffee blend'
    },
    {
      id: 6,
      name: 'Cold Brew',
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=200&h=200&fit=crop&crop=center',
      description: 'Smooth cold brewed coffee'
    }
  ];

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      alert('Please fill in all customer information');
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    const orderData = {
      customer: customerInfo,
      items: cart,
      total: getTotalPrice()
    };
    
    try {
      
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(`Order placed successfully! Order ID: ${result.orderId}, Total: $${getTotalPrice()}`);
        console.log('Order response:', result);
        
        // Reset cart and form
        setCart([]);
        setCustomerInfo({ name: '', email: '', address: '' });
        setShowCart(false);
      } else {
        alert(`Error placing order: ${result.error}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error connecting to server. Please try again.');
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-title">
            <Coffee size={32} />
            <h1>Bean & Brew Café</h1>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="cart-button"
          >
            <ShoppingCart size={20} />
            <span>Cart ({getTotalItems()})</span>
          </button>
        </div>
      </header>

      <div className="main-container">
        {!showCart ? (
          // Coffee Menu
          <div>
            <h2 className="menu-title">
              Our Coffee Selection
            </h2>
            <div className="coffee-grid">
              {coffeeItems.map(item => (
                <div key={item.id} className="coffee-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="coffee-image"
                  />
                  <div className="coffee-info">
                    <h3 className="coffee-name">{item.name}</h3>
                    <p className="coffee-description">{item.description}</p>
                    <div className="coffee-footer">
                      <span className="coffee-price">${item.price}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="add-to-cart-btn"
                      >
                        <Plus size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Cart View
          <div className="cart-container">
            <div className="cart-header">
              <h2 className="cart-title">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="back-button"
              >
                ← Back to Menu
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              <>
                {/* Cart Items */}
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                      />
                      <div className="cart-item-info">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <p className="cart-item-price">${item.price}</p>
                      </div>
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="quantity-btn"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="quantity-btn"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="item-total">
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Information */}
                <div className="customer-section">
                  <h3 className="customer-title">
                    <User size={20} />
                    Customer Information
                  </h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>
                      <MapPin size={16} style={{display: 'inline', marginRight: '4px'}} />
                      Delivery Address
                    </label>
                    <textarea
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="form-textarea"
                      placeholder="Enter your delivery address"
                    />
                  </div>
                </div>

                {/* Order Total and Place Order Button */}
                <div className="order-total-section">
                  <div className="total-row">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">${getTotalPrice()}</span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    className="place-order-btn"
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoffeeShop;