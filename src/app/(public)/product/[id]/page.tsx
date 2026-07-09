'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, CreditCard, ChevronLeft, Lock } from 'lucide-react';

const ProductDetailsPage = () => {
  const { id: productId } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("overview");

  const [isHovered, setIsHovered] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
        setLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    setActiveImageIndex(0);
    setQty(1);
  }, [product]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-[#ff2d46] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium text-sm">Loading Product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 px-6 text-center">
        <h2 className="text-3xl font-medium text-dark mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-xs font-medium">Sorry, we couldn't find the printer you're looking for. It might have been removed or the link is incorrect.</p>
        <Link href="/shop" className="bg-dark text-white px-10 py-4 rounded-full font-medium hover:bg-[#ff2d46] transition-all block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const name = product.title || product.name || 'Untitled Printer';
  const price = Number(product.price || product.salePrice || 0);
  const images = product.images?.length > 0 ? product.images : (product.image ? [product.image] : ['/placeholder-printer.png']);
  const activeImgSrc = images[activeImageIndex];

  const handleAddToCart = () => {
    addToCart(product, qty);
    router.push('/cart');
  };

  const buyNowHandler = () => {
    addToCart(product, qty);
    router.push('/checkout');
  };

  return (
    <>
      <style>{`
        .pd-wrapper { padding: 40px 0; background: #fff; padding-top: 100px; min-height: 100vh;}
        .pd-layout { max-width: 1300px; margin: 0 auto; padding: 0 40px; display: grid; grid-template-columns: 1fr 480px; gap: 60px; align-items: start; }
        
        .pd-gallery { display: flex; flex-direction: column; gap: 24px; }
        .pd-main-image-container { position: relative; border: 1px solid #f1f5f9; border-radius: 8px; aspect-ratio: 1/1; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #fff; }
        .pd-main-image-wrapper { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; cursor: crosshair; }
        .pd-main-image-wrapper img { max-width: 80%; max-height: 80%; object-fit: contain; transition: transform 0.2s ease-out; }
        
        .stock-badge-red { position: absolute; top: 20px; left: 20px; background: #ff2d46; color: #fff; font-size: 9px; font-weight: 900; padding: 6px 12px; border-radius: 4px; display: flex; align-items: center; gap: 6px; z-index: 10; letter-spacing: 0.05em; }
        
        .slider-arrow-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; background: #fff; border: 1px solid #f1f5f9; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 24px; cursor: pointer; transition: all 0.2s; z-index: 10; }
        .slider-arrow-nav:hover { color: #ff2d46; border-color: #ff2d46; }
        .slider-arrow-nav.prev { left: 20px; }
        .slider-arrow-nav.next { right: 20px; }

        .pd-thumbnails-strip { position: relative; padding-bottom: 12px; }
        .pd-thumbnails-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: thin; scrollbar-color: #f1f5f9 transparent; }
        .pd-thumbnails-scroll::-webkit-scrollbar { height: 4px; }
        .pd-thumbnails-scroll::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        
        .thumb-box { min-width: 85px; height: 85px; border: 1px solid #f1f5f9; border-radius: 4px; padding: 8px; cursor: pointer; background: #fff; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .thumb-box.active { border-color: #ff2d46; border-width: 1.5px; }
        .thumb-box img { max-width: 100%; max-height: 100%; object-fit: contain; }

        .pd-content { display: flex; flex-direction: column; gap: 28px; }
        .tag-group { display: flex; gap: 10px; }
        .badge-tag { font-size: 9px; font-weight: 900; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.05em; }
        .brand-tag { background: #1e1e1e; color: #fff; }
        .category-tag { background: #f8fafc; color: #94a3b8; }

        .pd-title-main { font-size: 32px; font-weight: 800; color: #1e293b; margin: 0; line-height: 1.2; letter-spacing: -0.01em; }
        .pd-price-main { font-size: 32px; font-weight: 800; color: #1e293b; margin: 0; }
        
        .attr-badge-group { display: flex; gap: 16px; flex-wrap: wrap;}
        .mini-attr { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #f1f5f9; padding: 8px 16px; border-radius: 6px; }
        .mini-label { font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
        .mini-val { font-size: 11px; font-weight: 900; color: #1e293b; text-transform: uppercase; }

        .qty-picker-row { display: flex; flex-direction: column; gap: 12px; }
        .qty-title { font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        .qty-flex { display: flex; align-items: center; gap: 20px; }
        .qty-stepper { display: flex; align-items: center; border: 1px solid #f1f5f9; border-radius: 4px; overflow: hidden; height: 44px; background: #fff; }
        .qty-stepper button { width: 44px; height: 100%; border: none; background: transparent; font-size: 18px; cursor: pointer; color: #1e293b; }
        .qty-stepper input { width: 44px; height: 100%; border: none; border-left: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; text-align: center; font-size: 13px; font-weight: 800; outline: none; color: #1e293b; }
        .qty-avail { font-size: 12px; color: #cbd5e1; font-weight: 700; }

        .action-button-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 10px; }
        .action-btn { height: 56px; border-radius: 6px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.2s; border: none; }
        .btn-cart-black { background: #fff; color: #1e1e1e; border: 2px solid #e2e8f0; }
        .btn-cart-black:hover { border-color: #1e1e1e; }
        .btn-buy-red { background: #1e1e1e; color: #fff; }
        .btn-buy-red:hover { background: #ff2d46; }

        .trust-grid-simple { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding-top: 32px; border-top: 1px solid #f1f5f9; margin-top: 12px; }
        .trust-cell { display: flex; align-items: center; gap: 16px; }
        .trust-icon-red { color: #ff2d46; opacity: 0.8; }
        .trust-info { display: flex; flex-direction: column; }
        .trust-head { font-size: 12px; font-weight: 800; color: #1e293b; }
        .trust-desc { font-size: 10px; color: #94a3b8; font-weight: 600; }

        .pd-tabs-wrapper { margin-top: 80px; border-top: 1px solid #f1f5f9; }
        .tabs-header { max-width: 1300px; margin: 0 auto; padding: 0 40px; display: flex; gap: 40px; }
        .tab-trigger { padding: 24px 0; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8; border: none; background: none; cursor: pointer; position: relative; transition: all 0.2s;}
        .tab-trigger.active { color: #ff2d46; }
        .tab-trigger.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #ff2d46; }
        .tab-content-container { max-width: 1300px; margin: 0 auto; padding: 40px 40px 100px; overflow: hidden; }

        .product-overview-content, .highlights-content, .short-specs-content { overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; max-width: 100%; }

        @media (max-width: 1100px) {
            .pd-layout { grid-template-columns: 1fr; gap: 48px; padding: 0 24px; }
            .pd-content { gap: 24px; }
            .pd-title-main { font-size: 26px; }
            .tabs-header { padding: 0 24px; }
            .tab-content-container { padding: 40px 24px; }
        }
      `}</style>

      <div className="pd-wrapper">
        <div className="pd-layout">
          <div className="pd-top-nav" style={{ gridColumn: '1 / -1', marginBottom: '10px' }}>
            <div className="pd-breadcrumbs" style={{ display: 'flex', gap: '8px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8' }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
                <span style={{ opacity: 0.5 }}>/</span>
                <Link href="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>Shop</Link>
                <span style={{ opacity: 0.5 }}>/</span>
                <span style={{ color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{name}</span>
            </div>
          </div>

          <div className="pd-gallery">
            <div className="pd-main-image-container">
              {product.countInStock !== 0 && (
                <div className="stock-badge-red">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   IN STOCK
                </div>
              )}
              <div className="pd-main-image-wrapper" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onMouseMove={handleMouseMove}>
                <img src={activeImgSrc} alt={name} style={{ transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: isHovered ? "scale(1.5)" : "scale(1)" }} />
              </div>
              {images.length > 1 && (
                <>
                  <button className="slider-arrow-nav prev" onClick={() => setActiveImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}>‹</button>
                  <button className="slider-arrow-nav next" onClick={() => setActiveImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}>›</button>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="pd-thumbnails-strip">
                <div className="pd-thumbnails-scroll">
                  {images.map((img: string, i: number) => (
                    <div key={i} className={`thumb-box ${i === activeImageIndex ? 'active' : ''}`} onClick={() => setActiveImageIndex(i)}>
                      <img src={img} alt={`${name} view ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pd-content">
            <div className="tag-group">
                {product.brand && <span className="badge-tag brand-tag">{product.brand}</span>}
                <span className="badge-tag category-tag">{typeof product.category === 'object' ? product.category?.name : (product.category || 'All-in-One')}</span>
            </div>
            <h1 className="pd-title-main">{name}</h1>
            <h2 className="pd-price-main">${price.toFixed(2)}</h2>
            
            <div className="attr-badge-group">
                {product.technology && product.technology.length > 0 && (
                    <div className="mini-attr">
                        <span className="mini-label">Technology:</span>
                        <span className="mini-val">{Array.isArray(product.technology) ? product.technology[0] : product.technology}</span>
                    </div>
                )}
                {product.usageCategory && product.usageCategory.length > 0 && (
                    <div className="mini-attr">
                        <span className="mini-label">Use:</span>
                        <span className="mini-val">{Array.isArray(product.usageCategory) ? product.usageCategory[0] : product.usageCategory}</span>
                    </div>
                )}
            </div>
            
            {product.countInStock !== 0 && (
                <div className="qty-picker-row">
                    <span className="qty-title">Quantity</span>
                    <div className="qty-flex">
                        <div className="qty-stepper">
                            <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1}>−</button>
                            <input type="text" readOnly value={qty} />
                            <button onClick={() => setQty(Math.min(product.countInStock || 99, qty + 1))} disabled={product.countInStock ? qty >= product.countInStock : false}>+</button>
                        </div>
                        {product.countInStock && <span className="qty-avail">{product.countInStock} available</span>}
                    </div>
                </div>
            )}
            
            <div className="action-button-grid">
                <button className="action-btn btn-cart-black" onClick={handleAddToCart} disabled={product.countInStock === 0}>
                    <ShoppingCart size={16} strokeWidth={2.5} /> Add to Cart
                </button>
                <button className="action-btn btn-buy-red" onClick={buyNowHandler} disabled={product.countInStock === 0}>
                    <CreditCard size={16} strokeWidth={2.5} /> Buy Now
                </button>
            </div>
            
            <div className="trust-grid-simple">
                <div className="trust-cell">
                    <div className="trust-icon-red"><ShoppingCart size={20} /></div>
                    <div className="trust-info"><span className="trust-head">Free Shipping</span><span className="trust-desc">Orders over $249</span></div>
                </div>
                <div className="trust-cell">
                    <div className="trust-icon-red"><ChevronLeft size={20} /></div>
                    <div className="trust-info"><span className="trust-head">Easy Returns</span><span className="trust-desc">30-day window</span></div>
                </div>
                <div className="trust-cell">
                    <div className="trust-icon-red"><Lock size={20} /></div>
                    <div className="trust-info"><span className="trust-head">Warranty</span><span className="trust-desc">Manufacturer covered</span></div>
                </div>
                <div className="trust-cell">
                    <div className="trust-icon-red"><ShoppingCart size={20} /></div>
                    <div className="trust-info"><span className="trust-head">Authentic</span><span className="trust-desc">Product authorized</span></div>
                </div>
            </div>
          </div>
        </div>

        <div className="pd-tabs-wrapper">
            <div className="tabs-header">
                {['overview', 'specifications', 'reviews'].map((t) => (
                    <button key={t} className={`tab-trigger ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
                ))}
            </div>
            <div className="tab-content-container">
                {tab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div className="product-overview-content" dangerouslySetInnerHTML={{ __html: product.overview || product.description || '<p>Detailed overview not available for this product.</p>' }} style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.8 }} />
                        {product.shortDetails && (
                            <div>
                              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '20px' }}>Features</h3>
                              <div className="highlights-content" dangerouslySetInnerHTML={{ __html: product.shortDetails }} style={{ fontSize: '15px', lineHeight: 1.7, color: '#4b5563' }} />
                            </div>
                        )}
                    </div>
                )}
                {tab === 'specifications' && (
                    <div style={{ maxWidth: '1000px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '32px' }}>Specifications</h2>
                        {(() => {
                            try {
                                if (!product.technicalSpecification) return <p className="text-gray-400">Specifications not provided.</p>;
                                const parsedSpecs = JSON.parse(product.technicalSpecification);
                                if (Array.isArray(parsedSpecs)) {
                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #f1f5f9' }}>
                                            {parsedSpecs.map((row: any, i: number) => (
                                                <div key={i} style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', minHeight: '64px' }}>
                                                    <div style={{ width: '35%', padding: '20px 32px', background: '#f8fafc', fontSize: '11px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center' }}>{row.name || row.key}</div>
                                                    <div style={{ flex: 1, padding: '20px 32px', fontSize: '14px', fontWeight: '600', color: '#1e293b', lineHeight: 1.6, display: 'flex', alignItems: 'center', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{row.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }
                            } catch (e) {
                                return <div className="technical-specs-content prose max-w-none text-gray-600 [&>table]:w-full [&>table]:border-collapse [&>table>tbody>tr]:border-b [&>table>tbody>tr]:border-gray-50 [&>table>tbody>tr>td]:py-4 [&>table>tbody>tr>td:first-child]:font-medium [&>table>tbody>tr>td:first-child]:text-dark [&>table>tbody>tr>td:first-child]:w-2/5" dangerouslySetInnerHTML={{ __html: product.technicalSpecification }} style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.8 }} />;
                            }
                        })()}
                    </div>
                )}
                {tab === 'reviews' && (
                    <div style={{ maxWidth: '800px' }}>
                        <div className="flex items-center justify-between mb-8">
                           <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Customer Reviews</h3>
                           <div className="flex items-center gap-2">
                             <div className="flex text-[#ffcc00]">
                               {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-xl">★</span>)}
                             </div>
                             <span className="font-medium text-dark text-sm">({product.numReviews || 0})</span>
                           </div>
                        </div>
                        <button style={{ padding: '16px 32px', background: '#1e1e1e', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', cursor: 'pointer' }}>Write a Review</button>
                        <div style={{ marginTop: '40px' }}>
                            {product.reviews && product.reviews.length > 0 ? product.reviews.map((rev: any, index: number) => (
                                <div key={rev._id || `review-${index}`} style={{ padding: '32px 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center font-bold text-[11px] text-gray-500 uppercase">
                                            {rev.name?.charAt(0) || 'C'}
                                          </div>
                                          <span style={{ fontWeight: '800', fontSize: '15px' }}>{rev.name}</span>
                                        </div>
                                        <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 'bold' }}>{rev.createdAt?.substring(0, 10)}</span>
                                    </div>
                                    <div style={{ color: '#fbbf24', fontSize: '14px', marginBottom: '12px', paddingLeft: '44px' }}>{"★".repeat(rev.rating)}</div>
                                    <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: 1.7, paddingLeft: '44px', fontWeight: '500' }}>{rev.comment}</p>
                                </div>
                            )) : <p style={{ color: '#6b7280', fontWeight: '500' }}>No reviews yet. Be the first to share your experience!</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;