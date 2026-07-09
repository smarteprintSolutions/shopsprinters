'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

const ShopPage = () => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Default sorting');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart(product, 1);
    router.push('/cart');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const url = '/api/products?limit=all';
      const attemptFetch = async () => {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Products API error ${response.status}: ${text}`);
        }
        return response;
      };

      try {
        let response = await attemptFetch();
        const data = await response.json();
        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : Array.isArray(data.data?.products)
              ? data.data.products
              : Array.isArray(data.data)
                ? data.data
                : [];

        // Sort products: Printers first, then Ink/Toners
        const sortedProducts = [...productList].sort((a: any, b: any) => {
          const getCategoryName = (product: any) => {
            if (typeof product.category === 'object' && product.category?.name) {
              return product.category.name.toLowerCase();
            }
            return (typeof product.category === 'string' ? product.category : '').toLowerCase();
          };

          const aCategory = getCategoryName(a);
          const bCategory = getCategoryName(b);

          // Printers: categories like "laser", "inkjet", or anything with "printer"
          const aIsPrinter = aCategory.includes('laser') || aCategory.includes('inkjet') || aCategory.includes('printer');
          const bIsPrinter = bCategory.includes('laser') || bCategory.includes('inkjet') || bCategory.includes('printer');
          // Ink & Toner
          const aIsInkOrToner = aCategory.includes('ink') || aCategory.includes('toner');
          const bIsInkOrToner = bCategory.includes('ink') || bCategory.includes('toner');

          // Printers first
          if (aIsPrinter && !bIsPrinter) return -1;
          if (!aIsPrinter && bIsPrinter) return 1;

          // Then ink/toners
          if (aIsInkOrToner && !bIsInkOrToner) return -1;
          if (!aIsInkOrToner && bIsInkOrToner) return 1;

          return 0;
        });

        setProducts(sortedProducts);
        setLoading(false);
      } catch (error) {
        console.warn('Products API fetch failed, retrying once...', error);
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const response = await attemptFetch();
          const data = await response.json();
          const productList = Array.isArray(data)
            ? data
            : Array.isArray(data.products)
              ? data.products
              : Array.isArray(data.data?.products)
                ? data.data.products
                : Array.isArray(data.data)
                  ? data.data
                  : [];

          const sortedProducts = [...productList].sort((a: any, b: any) => {
            const getCategoryName = (product: any) => {
              if (typeof product.category === 'object' && product.category?.name) {
                return product.category.name.toLowerCase();
              }
              return (typeof product.category === 'string' ? product.category : '').toLowerCase();
            };

            const aCategory = getCategoryName(a);
            const bCategory = getCategoryName(b);

            const aIsPrinter = aCategory.includes('laser') || aCategory.includes('inkjet') || aCategory.includes('printer');
            const bIsPrinter = bCategory.includes('laser') || bCategory.includes('inkjet') || bCategory.includes('printer');
            const aIsInkOrToner = aCategory.includes('ink') || aCategory.includes('toner');
            const bIsInkOrToner = bCategory.includes('ink') || bCategory.includes('toner');

            if (aIsPrinter && !bIsPrinter) return -1;
            if (!aIsPrinter && bIsPrinter) return 1;
            if (aIsInkOrToner && !bIsInkOrToner) return -1;
            if (!aIsInkOrToner && bIsInkOrToner) return 1;
            return 0;
          });

          setProducts(sortedProducts);
        } catch (retryError) {
          console.error('Retry failed for products fetch:', retryError);
        }
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getSortedProducts = () => {
    let sorted = Array.isArray(products) ? [...products] : [];
    if (sortBy === 'Sort by price: low to high') sorted.sort((a, b) => (a.salePrice || a.price || 0) - (b.salePrice || b.price || 0));
    if (sortBy === 'Sort by price: high to low') sorted.sort((a, b) => (b.salePrice || b.price || 0) - (a.salePrice || a.price || 0));
    if (sortBy === 'Sort by latest') sorted.reverse();
    return sorted;
  };

  const allFilteredProducts = getSortedProducts();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = allFilteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allFilteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="pt-40 flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-12 h-12 border-4 border-[#ff2d46] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium">Loading Shop...</p>
    </div>
  );

  return (
    <main className="pt-10 md:pt-16 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Page Title */}
        <h1 className="text-[30px] font-medium text-dark mb-10 tracking-tight text-center md:text-left">Shop</h1>

        {/* Results Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-t border-gray-100 pt-8 gap-4">
          <p className="text-[#6b6b6b] text-[15px] font-medium">
            Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, allFilteredProducts.length)} of {allFilteredProducts.length} results
          </p>

          <div className="relative group">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-white border border-gray-200 px-6 py-3 pr-10 text-[15px] text-[#333] font-medium outline-none cursor-pointer hover:border-gray-300 transition-colors rounded-lg"
            >
              <option>Default sorting</option>
              <option>Sort by latest</option>
              <option>Sort by price: low to high</option>
              <option>Sort by price: high to low</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 7.95a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 mb-24">
          {currentProducts.map((product) => {
            const name = product.title || product.name || 'Untitled Printer';
            const price = Number(product.price || product.salePrice || 0);
            const oldPrice = Number(product.oldPrice || product.originalPrice || 0);
            const type = typeof product.category === 'object' ? product.category?.name : (product.category || 'Laser Printers');

            return (
              <div
                key={product._id}
                className="group flex flex-col h-full cursor-pointer text-left"
                onClick={() => router.push(`/product/${product._id}`)}
              >
                <div className="relative aspect-square mb-6 flex items-center justify-center p-8 transition-all duration-300 bg-[#fcfcfc] rounded-3xl border border-gray-100">
                  {oldPrice > price && (
                    <div className="absolute top-4 left-4 bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm z-10 transition-transform group-hover:scale-105">
                      <span className="text-[10px] font-medium text-black opacity-60">Sale!</span>
                    </div>
                  )}

                  <div
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20 hover:bg-[#ff2d46] hover:text-white text-dark"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>

                  <Image
                    src={product.images?.[0] || '/placeholder-printer.png'}
                    alt={name}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="flex flex-col flex-1 px-1">
                  <h3 className="text-[15px] font-medium text-[#111] leading-[1.3] mb-1.5 line-clamp-2 min-h-[40px] group-hover:text-[#ff2d46] transition-colors">
                    {name}
                  </h3>
                  <p className="text-[#9e9e9e] text-[13px] font-medium mb-3">
                    {product.brand ? `${product.brand} | ` : ''}{type}
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    {oldPrice > price && (
                      <span className="text-[14px] text-[#ccc] line-through decoration-1">${oldPrice.toFixed(2)}</span>
                    )}
                    <span className="text-[14px] font-medium text-black">${price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mb-10 pb-10">
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center text-[13px] font-medium border transition-all ${currentPage === pageNum
                    ? 'bg-dark text-white border-dark'
                    : 'border-gray-200 text-dark hover:border-black'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-10 h-10 flex items-center justify-center border border-gray-200 text-dark font-medium text-[13px] hover:border-black transition-all"
              >
                →
              </button>
            )}
          </div>
        )}

      </div>
    </main>
  );
};

export default ShopPage;