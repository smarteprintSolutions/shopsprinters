'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, Lock } from 'lucide-react';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [clover, setClover] = useState<any>(null);
  
  const [shippingData, setShippingData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
  });

  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [selectedRate, setSelectedRate] = useState<any>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  useEffect(() => {
    setShippingData(prev => ({
      ...prev,
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    }));
  }, [user]);

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  useEffect(() => {
    const loadCloverScript = () => {
      if ((window as any).Clover) return;
      const script = document.createElement('script');
      script.src = "https://checkout.clover.com/sdk.js";
      script.async = true;
      document.body.appendChild(script);
    };
    loadCloverScript();
  }, []);

  useEffect(() => {
    if (step === 2) {
      const initCloverInterval = setInterval(() => {
        if ((window as any).Clover) {
          clearInterval(initCloverInterval);
          const numberEl = document.querySelector('#card-number');
          if (numberEl && !numberEl.hasChildNodes()) {
            try {
              const cloverInstance = new (window as any).Clover(process.env.NEXT_PUBLIC_CLOVER_PUBLIC_KEY);
              const elements = cloverInstance.elements();
              const styles = { body: { fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#1e293b' } };
              elements.create('CARD_NUMBER', { styles }).mount('#card-number');
              elements.create('CARD_DATE', { styles }).mount('#card-date');
              elements.create('CARD_CVV', { styles }).mount('#card-cvv');
              elements.create('CARD_POSTAL_CODE', { styles, defaultValue: shippingData.zip }).mount('#card-postal-code');
              setClover(cloverInstance);
            } catch (err) { console.error(err); }
          }
        }
      }, 300);
      return () => clearInterval(initCloverInterval);
    }
  }, [step, shippingData.zip]);

  const subtotal = cartTotal;
  const taxPrice = Number((0.08 * subtotal).toFixed(2));
  const shippingPrice = selectedRate ? Number(selectedRate.rate) : 0;
  const totalPrice = subtotal + taxPrice + shippingPrice;

  const calculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingShipping(true);
    setShippingError(null);
    setShippingRates([]);
    setSelectedRate(null);
    try {
      const response = await fetch(`/api/shipping/rates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: {
            name: `${shippingData.firstName} ${shippingData.lastName}`,
            address: shippingData.address,
            city: shippingData.city,
            state: shippingData.state,
            postalCode: shippingData.zip,
            country: shippingData.country,
            phone: shippingData.phone,
          },
          cartItems: cart.map(item => ({ ...item, qty: item.quantity }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate secure shipping.');
      }

      const data = await response.json();
      const rates = Array.isArray(data?.data?.rates)
        ? data.data.rates
        : Array.isArray(data?.rates)
          ? data.rates
          : [];
      const filteredRates = rates.filter((rate: any) => rate && typeof rate.rate !== 'undefined');
      setShippingRates(filteredRates);
      
      if (filteredRates.length > 0) {
        const sortedRates = [...filteredRates].sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate));
        setSelectedRate(sortedRates[0]);
      } else {
        setShippingError("No logistics matches found for this address.");
      }
    } catch (error) {
      setShippingError("Failed to calculate secure shipping.");
    } finally {
      setLoadingShipping(false);
    }
  };

  const submitShippingHandler = () => {
    if (!selectedRate) {
      alert("Please select a shipping method.");
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const initPayment = async () => {
    try {
      setLoading(true);
      if (!clover) {
        alert('Gateway authenticating... Please wait.');
        setLoading(false);
        return;
      }
      const result = await clover.createToken();
      if (result.errors) {
        alert('Fiscal Error: ' + Object.values(result.errors).join(', '));
        setLoading(false);
        return;
      }
      
      const orderData = {
        orderItems: cart.map(item => ({ ...item, qty: item.quantity })),
        shippingAddress: shippingData,
        paymentMethod: 'Clover',
        itemsPrice: subtotal,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const response = await fetch(`/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Payment failed');

      const createdOrderPayload = await response.json();
      const createdOrder = createdOrderPayload?.data || createdOrderPayload;
      const orderId = createdOrder?._id;

      if (!orderId) {
        throw new Error('Order could not be created');
      }

      const paymentResponse = await fetch(`/api/orders/clover/pay`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          amount: totalPrice,
          orderId,
          source: result.token
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Payment processing failed');
      }

      clearCart();
      router.push('/order-details/' + orderId);
    } catch (error) {
      alert('Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isAuthenticated) return null;

  const inputClass = "w-full p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl outline-none text-[15px] font-medium text-[#1e293b] focus:border-[#ff2d46] transition-colors";
  const labelClass = "block uppercase text-[10px] font-black text-[#94a3b8] tracking-widest mb-2";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow pt-20 pb-32">
        <div className="max-w-3xl mx-auto px-6">
          
          {/* Centered Executive Header */}
          <div className="text-center mb-16">
            <h1 className="text-[42px] font-black text-dark mb-4 uppercase">Checkout</h1>
            <div className="w-20 h-1 bg-dark mx-auto mb-6 rounded-full"></div>
            
            <div className="flex justify-center items-center gap-8">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black ${step >= 1 ? 'bg-dark text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${step >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>Shipping</span>
              </div>
              <div className="w-10 h-0.5 bg-slate-100"></div>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black ${step >= 2 ? 'bg-dark text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${step >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>Payment</span>
              </div>
            </div>
          </div>

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-14 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.03)]">
              <h2 className="text-xl font-black text-slate-800 mb-10 uppercase text-center">Shipping Address</h2>
              
              <form onSubmit={calculateShipping} className="grid gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input name="firstName" value={shippingData.firstName} readOnly className={`${inputClass} opacity-60 cursor-not-allowed`} />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input name="lastName" value={shippingData.lastName} readOnly className={`${inputClass} opacity-60 cursor-not-allowed`} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Address</label>
                  <input name="address" value={shippingData.address} onChange={handleInputChange} required placeholder="Street address or PO Box" className={inputClass} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>City</label>
                    <input name="city" value={shippingData.city} onChange={handleInputChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>State / Province</label>
                    <input name="state" value={shippingData.state} onChange={handleInputChange} required className={inputClass} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Postal Code</label>
                    <input name="zip" value={shippingData.zip} onChange={handleInputChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input name="country" value={shippingData.country} onChange={handleInputChange} required className={inputClass} />
                  </div>
                </div>
                
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input name="phone" value={shippingData.phone} onChange={handleInputChange} required placeholder="+1 (555) 000-0000" className={inputClass} />
                </div>

                {shippingRates.length === 0 ? (
                  <button type="submit" disabled={loadingShipping} className="w-full p-6 bg-dark hover:bg-[#ff2d46] text-white border-none rounded-[20px] text-[14px] font-black uppercase tracking-widest cursor-pointer shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-colors mt-4">
                    {loadingShipping ? "Calculating..." : "Calculate Shipping"}
                  </button>
                ) : (
                  <div className="mt-5 grid gap-5">
                    <p className={labelClass}>Shipping Methods</p>
                    {shippingRates.map((rate) => (
                      <div 
                        key={rate.id} 
                        onClick={() => setSelectedRate(rate)} 
                        className={`p-6 rounded-[20px] cursor-pointer flex justify-between items-center border-2 transition-all ${selectedRate?.id === rate.id ? 'border-[#ff2d46] bg-red-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-5 h-5 rounded-full border-4 ${selectedRate?.id === rate.id ? 'border-[#ff2d46] bg-white' : 'border-slate-200 bg-white'}`}></div>
                          <div>
                            <p className="font-black text-[16px] text-slate-800 mb-1">{rate.service || rate.carrier}</p>
                            <p className="text-[12px] font-bold text-slate-400 m-0">{rate.carrier} shipping</p>
                          </div>
                        </div>
                        <span className="font-black text-[#ff2d46]">${parseFloat(rate.rate).toFixed(2)}</span>
                      </div>
                    ))}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                      <button type="button" onClick={() => setShippingRates([])} className="p-5 bg-white border border-slate-200 rounded-[20px] font-black text-slate-500 hover:bg-slate-50 transition-colors">Change Address</button>
                      <button type="button" onClick={submitShippingHandler} className="md:col-span-2 p-5 bg-dark hover:bg-[#ff2d46] border-none rounded-[20px] font-black text-white uppercase tracking-widest transition-colors">Next to Payment</button>
                    </div>
                  </div>
                )}
                {shippingError && <p className="text-center text-red-500 font-extrabold text-[13px]">{shippingError}</p>}
              </form>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-14 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.03)] animate-fade-in">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 bg-transparent border-none text-slate-500 font-extrabold uppercase text-[11px] mb-10 cursor-pointer hover:text-[#ff2d46] transition-colors">
                <ChevronLeft size={16} /> Back to Shipping
              </button>
              
              <h2 className="text-xl font-black text-slate-800 mb-10 uppercase text-center">Confirm Order</h2>
              
              <div className="grid gap-8">
                <div className="bg-[#f8fafc] p-8 rounded-[24px] border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className={labelClass}>Total Amount</span>
                    <span className="text-4xl font-black text-[#ff2d46]">${totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-[12px] font-semibold text-slate-400 m-0">
                    Includes tax and {selectedRate?.carrier} {selectedRate?.service} shipping.
                  </p>
                </div>

                <div className="grid gap-6 mt-4">
                  <div>
                    <label className={labelClass}>Card Number</label>
                    <div className="p-4 bg-white border border-[#e2e8f0] rounded-xl"><div id="card-number" className="h-6"></div></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Expiry Date</label>
                      <div className="p-4 bg-white border border-[#e2e8f0] rounded-xl"><div id="card-date" className="h-6"></div></div>
                    </div>
                    <div>
                      <label className={labelClass}>CVV</label>
                      <div className="p-4 bg-white border border-[#e2e8f0] rounded-xl"><div id="card-cvv" className="h-6"></div></div>
                    </div>
                  </div>
                  
                  <button onClick={initPayment} disabled={loading} className="w-full p-6 bg-dark hover:bg-[#ff2d46] text-white border-none rounded-[24px] text-[14px] font-black uppercase tracking-widest cursor-pointer shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] mt-6 transition-colors disabled:opacity-50">
                    {loading ? "Processing..." : "Confirm & Pay"}
                  </button>
                  
                  <div className="flex justify-center items-center gap-2 text-slate-300 mt-2">
                    <Lock size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;