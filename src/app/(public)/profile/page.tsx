'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage = () => {
  const { user, logout, updateProfile, getOrders } = useAuth();
  const router = useRouter();

  const formatDateLabel = (value?: string | Date) => {
    if (!value) return '—';
    const date = new Date(value);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  };
  
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '',
    });

    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user, getOrders, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      setError(null);
      setMessage(null);
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password || undefined
      });
      setMessage('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <main style={{ paddingTop: '140px', paddingBottom: '160px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '48px', alignItems: 'flex-start' }} className="profile-layout">
          
          {/* LEFT: EXECUTIVE SIDEBAR */}
          <aside style={{ width: '300px', background: '#ffffff', borderRadius: '32px', border: '1px solid #f1f5f9', padding: '48px 32px', position: 'sticky', top: '120px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#ff2d46', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '900', margin: '0 auto 24px' }}>
                {user.firstName?.charAt(0).toUpperCase()}
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px' }}>{user.firstName} {user.lastName}</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>{user.email}</p>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'orders', label: 'My Orders', icon: '📋' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%', padding: '16px 20px', borderRadius: '16px', background: activeTab === tab.id ? '#fff1f2' : 'transparent',
                    color: activeTab === tab.id ? '#ff2d46' : '#64748b', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em',
                    textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.3s ease',
                    border: activeTab === tab.id ? '1.5px solid #ff2d46' : '1.5px solid transparent'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{tab.icon}</span> {tab.label}
                </button>
              ))}
              <button onClick={handleSignOut} style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: 'none', background: 'transparent', color: '#1e1e1e', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', marginTop: '24px' }}>
                <span>🚪</span> Logout
              </button>
            </nav>
          </aside>

          {/* RIGHT: MAIN TERMINAL CONTENT */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {activeTab === 'profile' && (
              <div style={{ background: '#ffffff', borderRadius: '32px', padding: '60px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Authentication Node</span>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '4px 0 0' }}>User Profile</h2>
                  </div>
                  <button 
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    style={{ padding: '14px 28px', background: isEditing ? '#ff2d46' : '#f8fafc', color: isEditing ? '#ffffff' : '#1e1e1e', border: 'none', borderRadius: '14px', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease' }}
                  >
                    {isEditing ? 'Confirm Updates' : 'Edit Profile'}
                  </button>
                </div>

                {message && <div style={{ background: '#ecfdf5', color: '#10b981', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: '600' }}>{message}</div>}
                {error && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: '600' }}>{error}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>First Name</label>
                    {isEditing ? (
                      <input name="firstName" value={formData.firstName} onChange={handleInputChange} style={{ padding: '18px 24px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '16px', fontSize: '15px', fontWeight: '600', outline: 'none' }} />
                    ) : (
                      <div style={{ padding: '18px 24px', background: '#f8fafc', borderRadius: '16px', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{user.firstName}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Last Name</label>
                    {isEditing ? (
                      <input name="lastName" value={formData.lastName} onChange={handleInputChange} style={{ padding: '18px 24px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '16px', fontSize: '15px', fontWeight: '600', outline: 'none' }} />
                    ) : (
                      <div style={{ padding: '18px 24px', background: '#f8fafc', borderRadius: '16px', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{user.lastName}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Email</label>
                    <div style={{ padding: '18px 24px', background: '#f8fafc', borderRadius: '16px', fontSize: '16px', fontWeight: '800', color: '#0f172a', opacity: 0.7 }}>{user.email}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Member Since</label>
                    <div style={{ padding: '18px 24px', background: '#f8fafc', borderRadius: '16px', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{new Date().getUTCFullYear()} Registry</div>
                  </div>
                  {isEditing && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>New Password (Optional)</label>
                      <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Leave blank to keep current" style={{ padding: '18px 24px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '16px', fontSize: '15px', fontWeight: '600', outline: 'none' }} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div style={{ background: '#ffffff', borderRadius: '32px', padding: '60px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Procurement Logs</span>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '4px 0 0' }}>Orders</h2>
                  </div>
                  <div style={{ color: '#1e1e1e', fontSize: '12px', fontWeight: '900', background: '#f8fafc', padding: '8px 16px', borderRadius: '100px' }}>Total Records: {orders?.length || 0}</div>
                </div>

                {loadingOrders ? (
                  <div style={{ padding: '80px 0', textAlign: 'center' }}>
                    <div className="hq-loader" style={{ width: '40px', height: '40px', border: '4px solid #f1f5f9', borderTop: '4px solid #ff2d46', borderRadius: '50%', margin: '0 auto' }}></div>
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div style={{ padding: '60px', textAlign: 'center', background: '#f8fafc', borderRadius: '24px' }}>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#94a3b8' }}>No recorded asset procurements in this cycle.</p>
                    <Link href="/shop" style={{ color: '#ff2d46', fontWeight: '900', textDecoration: 'none', textTransform: 'uppercase', fontSize: '12px', marginTop: '16px', display: 'block' }}>Search Asset hub →</Link>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                          <th style={{ padding: '16px 0', fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Order ID</th>
                          <th style={{ padding: '16px 0', fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Placed Date</th>
                          <th style={{ padding: '16px 0', fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Total</th>
                          <th style={{ padding: '16px 0', fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                          <th style={{ padding: '16px 0', fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Action Hub</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '24px 0', fontSize: '13px', fontWeight: '800', color: '#1e1e1e', fontFamily: 'monospace' }}>#{(order._id || '').slice(-8).toUpperCase()}</td>
                            <td style={{ padding: '24px 0', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>{formatDateLabel(order.createdAt)}</td>
                            <td style={{ padding: '24px 0', fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>${order.totalPrice.toFixed(2)}</td>
                            <td style={{ padding: '24px 0' }}>
                              <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '100px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', background: (order.status || '').toLowerCase().includes('failed') ? '#fff1f2' : (order.isPaid || order.isDelivered ? '#f0fdf4' : '#fffbeb'), color: (order.status || '').toLowerCase().includes('failed') ? '#be123c' : (order.isPaid || order.isDelivered ? '#16a34a' : '#c2410c') }}>
                                {order.status || (order.isDelivered ? 'Delivered' : (order.isPaid ? 'Processing' : 'Unverified'))}
                              </span>
                            </td>
                            <td style={{ padding: '24px 0', textAlign: 'right' }}>
                              <Link href={`/order-details/${order._id}`} style={{ padding: '10px 20px', background: '#1e1e1e', color: '#ffffff', borderRadius: '12px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s ease' }} className="view-details-btn">View Details</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .hq-loader { animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .profile-layout { flex-direction: column; }
          aside { width: 100% !important; position: static !important; }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;