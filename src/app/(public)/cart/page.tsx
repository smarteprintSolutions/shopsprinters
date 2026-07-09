'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 300);
  };

  const taxRate = 0.08;
  const taxAmount = cartTotal * taxRate;
  const totalPayment = cartTotal + taxAmount;

  if (cart.length === 0) {
    return (
      <main style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '180px 24px 80px', textAlign: 'center' }}>
          {/* Empty Cart Icon */}
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8ea 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 40px', boxShadow: '0 8px 32px rgba(255,45,70,0.08)'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff2d46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Your cart is empty
          </h2>
          <p style={{ fontSize: '15px', color: '#94a3b8', margin: '0 0 40px', lineHeight: '1.7', fontWeight: '500' }}>
            Looks like you haven&apos;t added anything yet. Browse our collection to find the perfect printer or supplies for your needs.
          </p>
          <Link
            href="/shop"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: '#0f172a', color: '#ffffff', padding: '16px 36px',
              borderRadius: '14px', fontSize: '14px', fontWeight: '700',
              textDecoration: 'none', transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(15,23,42,0.15)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '140px 24px 100px' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Link href="/shop" style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }} className="cart-breadcrumb">Home</Link>
            <span style={{ color: '#cbd5e1', fontSize: '13px' }}>/</span>
            <Link href="/shop" style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'none', fontWeight: '500' }} className="cart-breadcrumb">Shop</Link>
            <span style={{ color: '#cbd5e1', fontSize: '13px' }}>/</span>
            <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>Cart</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
              Shopping Cart
            </h1>
            <span style={{
              background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 18px',
              borderRadius: '100px', fontSize: '13px', fontWeight: '700', color: '#64748b'
            }}>
              {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }} className="cart-layout">

          {/* LEFT — Cart Items */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Table Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px',
              padding: '0 28px 16px', gap: '16px', borderBottom: '1px solid #e2e8f0'
            }} className="cart-table-header">
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Product</span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Quantity</span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Total</span>
              <span></span>
            </div>

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {cart.map((item, index) => {
                const imageSrc = item.images?.[0] || item.image || '/placeholder-printer.png';
                const itemTitle = item.title || 'Printer';
                const isRemoving = removingId === item._id;

                return (
                  <div
                    key={item._id}
                    style={{
                      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px',
                      gap: '16px', alignItems: 'center',
                      padding: '24px 28px',
                      background: '#ffffff',
                      borderBottom: index < cart.length - 1 ? '1px solid #f1f5f9' : 'none',
                      borderRadius: index === 0 ? '20px 20px 0 0' : index === cart.length - 1 ? '0 0 20px 20px' : '0',
                      opacity: isRemoving ? 0 : 1,
                      transform: isRemoving ? 'translateX(-20px)' : 'translateX(0)',
                      transition: 'all 0.3s ease',
                    }}
                    className="cart-item-row"
                  >
                    {/* Product Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0 }}>
                      <div style={{
                        width: '90px', height: '90px', borderRadius: '16px',
                        background: '#f8f9fb', border: '1px solid #f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '10px', flexShrink: 0
                      }}>
                        <Image
                          src={imageSrc}
                          alt={itemTitle}
                          width={80}
                          height={80}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontSize: '11px', fontWeight: '700', color: '#ff2d46',
                          textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px'
                        }}>
                          {item.brand || 'Brand'}
                        </p>
                        <h3 style={{
                          fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: '0 0 6px',
                          lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                        }}>
                          {itemTitle}
                        </h3>
                        <p style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center',
                        background: '#f8f9fb', borderRadius: '12px', border: '1px solid #e2e8f0',
                        overflow: 'hidden'
                      }}>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          style={{
                            width: '38px', height: '38px', border: 'none', background: 'transparent',
                            cursor: 'pointer', fontSize: '18px', color: '#64748b',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          className="qty-btn"
                        >
                          −
                        </button>
                        <span style={{
                          width: '40px', textAlign: 'center', fontSize: '14px',
                          fontWeight: '700', color: '#0f172a',
                          borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0',
                          lineHeight: '38px'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          style={{
                            width: '38px', height: '38px', border: 'none', background: 'transparent',
                            cursor: 'pointer', fontSize: '18px', color: '#64748b',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleRemove(item._id)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          border: '1px solid #f1f5f9', background: '#ffffff',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s', color: '#cbd5e1'
                        }}
                        className="remove-btn"
                        title="Remove item"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '24px 4px', flexWrap: 'wrap', gap: '16px', marginTop: '8px'
            }}>
              <Link
                href="/shop"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  fontSize: '13px', fontWeight: '600', color: '#64748b',
                  textDecoration: 'none', padding: '10px 20px',
                  borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff',
                  transition: 'all 0.2s'
                }}
                className="continue-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                style={{
                  fontSize: '13px', fontWeight: '600', color: '#94a3b8',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '10px 20px', borderRadius: '12px',
                  transition: 'all 0.2s'
                }}
                className="clear-cart-btn"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* RIGHT — Order Summary */}
          <div style={{ width: '380px', flexShrink: 0 }} className="cart-summary-col">
            <div style={{
              background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0',
              padding: '32px', position: 'sticky', top: '120px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.03)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 28px', letterSpacing: '-0.02em' }}>
                Order Summary
              </h2>

              {/* Summary Items Preview */}
              <div style={{ marginBottom: '24px', padding: '16px', background: '#f8f9fb', borderRadius: '14px' }}>
                {cart.map((item, i) => (
                  <div key={item._id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '6px 0', borderBottom: i < cart.length - 1 ? '1px solid #eef0f4' : 'none',
                    gap: '12px'
                  }}>
                    <span style={{
                      fontSize: '12px', color: '#64748b', fontWeight: '500',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1
                    }}>
                      {item.title || 'Product'} × {item.quantity}
                    </span>
                    <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: '700', flexShrink: 0 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Subtotal</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Shipping</span>
                  <span style={{
                    fontSize: '12px', fontWeight: '700', color: '#10b981',
                    background: '#ecfdf5', padding: '3px 10px', borderRadius: '100px'
                  }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Estimated Tax</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>${taxAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)', margin: '0 0 24px' }}></div>

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Total</span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.03em' }}>
                  ${totalPayment.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  width: '100%', padding: '18px 24px', background: '#0f172a',
                  color: '#ffffff', borderRadius: '16px', fontSize: '15px', fontWeight: '700',
                  textDecoration: 'none', transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(15,23,42,0.2)',
                  letterSpacing: '-0.01em'
                }}
                className="checkout-btn"
              >
                Proceed to Checkout
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>

              {/* Trust Badges */}
              <div style={{ marginTop: '28px', textAlign: 'center' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  marginBottom: '16px'
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.06em' }}>
                    SECURE 256-BIT SSL ENCRYPTED
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', opacity: 0.5 }}>
                  <Image src="/pay/payments.svg" alt="Payment methods" width={180} height={28} style={{ height: '28px', width: 'auto' }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .cart-breadcrumb:hover { color: #0f172a !important; }
        .qty-btn:hover { background: #eef0f4 !important; color: #0f172a !important; }
        .remove-btn:hover { border-color: #fecdd3 !important; background: #fff1f2 !important; color: #ef4444 !important; }
        .checkout-btn:hover { background: #ff2d46 !important; box-shadow: 0 8px 24px rgba(255,45,70,0.3) !important; transform: translateY(-2px); }
        .continue-btn:hover { border-color: #0f172a !important; color: #0f172a !important; }
        .clear-cart-btn:hover { color: #ef4444 !important; }

        @media (max-width: 1024px) {
          .cart-layout { flex-direction: column !important; }
          .cart-summary-col { width: 100% !important; }
        }
        @media (max-width: 768px) {
          .cart-table-header { display: none !important; }
          .cart-item-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 20px !important;
          }
        }
      `}</style>
    </main>
  );
};

export default CartPage;