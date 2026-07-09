'use client';

import { useEffect, useMemo, useState } from 'react';
import { PencilSquareIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TechnicalSpecRow {
  label: string;
  value: string;
}

interface ProductFormState {
  _id?: string;
  brand: string;
  title: string;
  price: string;
  oldPrice: string;
  countInStock: string;
  category: string;
  images: string;
  productType: string;
  usageCategory: string;
  allInOneType: string;
  mainFunction: string;
  wirelessCapability: string;
  systemDomain: string;
  assetModelName: string;
  color: string;
  screenSize: string;
  width: string;
  height: string;
  depth: string;
  msrp: string;
  units: string;
  keywords: string;
  highlights: string;
  overview: string;
  technicalSpecification: string;
  technicalSpecificationRows: TechnicalSpecRow[];
}

const emptyForm: ProductFormState = {
  brand: '',
  title: '',
  price: '',
  oldPrice: '',
  countInStock: '',
  category: '',
  images: '',
  productType: '',
  usageCategory: '',
  allInOneType: '',
  mainFunction: '',
  wirelessCapability: '',
  systemDomain: '',
  assetModelName: '',
  color: '',
  screenSize: '',
  width: '',
  height: '',
  depth: '',
  msrp: '',
  units: '',
  keywords: '',
  highlights: '',
  overview: '',
  technicalSpecification: '',
  technicalSpecificationRows: [],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [displayLimit, setDisplayLimit] = useState(20);

  const parseHtmlToText = (html: string) => {
    if (!html) return '';
    let text = String(html);
    text = text.replace(/<\/(td|th)>\s*<(td|th)[^>]*>/gi, '\t');
    text = text.replace(/<\/?(br|p|div|tr|li|ul|table|tbody|thead|h[1-6])[^>]*>/gi, '\n');
    text = text.replace(/<[^>]*>?/gm, '');
    text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
    return text.replace(/\n\s*\n/g, '\n').trim();
  };

  const coerceStringArray = (value: unknown) => {
    if (Array.isArray(value)) {
      return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === 'string') {
      return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
    }

    return [];
  };

  const formatList = (value: unknown) => coerceStringArray(value).join(', ');

  const loadData = async () => {
    try {
      setLoading(true);
      const timestamp = Date.now();
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`/api/products?limit=all&_t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/categories?_t=${timestamp}`, { cache: 'no-store' }),
      ]);

      const productsPayload = await productsRes.json();
      const categoriesPayload = await categoriesRes.json();
      if (!productsRes.ok || !categoriesRes.ok) throw new Error('Failed to load admin products');

      setProducts(productsPayload.data?.products ?? productsPayload.products ?? []);
      setCategories(
        Array.isArray(categoriesPayload.data) 
          ? categoriesPayload.data 
          : (categoriesPayload.data?.categories ?? categoriesPayload.categories ?? [])
      );
    } catch (err: any) {
      setError(err.message || 'Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) => {
      const haystack = `${product.title || ''} ${product.brand || ''} ${product.category?.name || ''}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [products, search]);

  const getCategoryDefaults = (categoryName: string) => {
    const normalized = (categoryName || '').toLowerCase();

    if (normalized.includes('ink & toner') || normalized.includes('inkjet') || normalized.includes('laser')) {
      return {
        productTypeOptions: ['Inkjet', 'Laser', 'Laser (B/W)'],
        usageOptions: ['Home', 'Office', 'Mobile', 'Photo'],
        allInOneOptions: ['Multifunction', 'Single Function'],
        mainFunctionOptions: ['Print', 'Scan', 'Copy', 'Fax', 'Print Only'],
        wirelessOptions: ['Yes', 'No'],
      };
    }

    if (normalized.includes('all in one') || normalized.includes('multifunction')) {
      return {
        productTypeOptions: ['Multifunction', 'Single Function'],
        usageOptions: ['Home', 'Office', 'Mobile', 'Photo'],
        allInOneOptions: ['Multifunction', 'Single Function'],
        mainFunctionOptions: ['Print', 'Scan', 'Copy', 'Fax', 'Print Only'],
        wirelessOptions: ['Yes', 'No'],
      };
    }

    if (normalized.includes('large format')) {
      return {
        productTypeOptions: ['Large Format', 'Wide Format'],
        usageOptions: ['Home', 'Office', 'Mobile', 'Photo'],
        allInOneOptions: ['Multifunction', 'Single Function'],
        mainFunctionOptions: ['Print', 'Scan', 'Copy', 'Fax', 'Print Only'],
        wirelessOptions: ['Yes', 'No'],
      };
    }

    return {
      productTypeOptions: ['Inkjet', 'Laser', 'Laser (B/W)'],
      usageOptions: ['Home', 'Office', 'Mobile', 'Photo'],
      allInOneOptions: ['Multifunction', 'Single Function'],
      mainFunctionOptions: ['Print', 'Scan', 'Copy', 'Fax', 'Print Only'],
      wirelessOptions: ['Yes', 'No'],
    };
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImagePreviews([]);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setImagePreviews([]);
    setShowForm(true);
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find((category) => category._id === value || category.slug === value);
    const defaults = getCategoryDefaults(selectedCategory?.name || selectedCategory?.slug || '');

    setForm((prev) => ({
      ...prev,
      category: value,
      productType: prev.productType || defaults.productTypeOptions[0],
      usageCategory: prev.usageCategory || defaults.usageOptions[0],
      allInOneType: prev.allInOneType || defaults.allInOneOptions[0],
      mainFunction: prev.mainFunction || defaults.mainFunctionOptions[0],
      wirelessCapability: prev.wirelessCapability || defaults.wirelessOptions[0],
    }));
  };

  const updateTechSpecRow = (index: number, field: 'label' | 'value', value: string) => {
    setForm((prev) => {
      const nextRows = [...prev.technicalSpecificationRows];
      nextRows[index] = { ...nextRows[index], [field]: value };
      return { ...prev, technicalSpecificationRows: nextRows };
    });
  };

  const addTechSpecRow = () => {
    setForm((prev) => ({ ...prev, technicalSpecificationRows: [...prev.technicalSpecificationRows, { label: '', value: '' }] }));
  };

  const removeTechSpecRow = (index: number) => {
    setForm((prev) => ({ ...prev, technicalSpecificationRows: prev.technicalSpecificationRows.filter((_, rowIndex) => rowIndex !== index) }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      const previews = await Promise.all(
        files.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(file);
            }),
        ),
      );
      setImagePreviews((prev) => [...prev, ...previews]);
    } catch {
      setError('Unable to read the selected image files.');
    } finally {
      event.target.value = '';
    }
  };

  const removeImagePreview = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
  };

  const toScalar = (val: unknown): string => {
    if (Array.isArray(val)) return val[0] ? String(val[0]) : '';
    if (typeof val === 'object' && val !== null) return '';
    return val ? String(val) : '';
  };

  const openEditForm = (product: any) => {
    setForm({
      ...emptyForm,
      _id: product._id,
      brand: product.brand || '',
      title: product.title || '',
      price: String(product.price || ''),
      oldPrice: String(product.oldPrice || ''),
      countInStock: String(product.countInStock || ''),
      images: '',
      category: product.category?._id || (typeof product.category === 'string' ? product.category : ''),
      productType: toScalar(product.productType),
      usageCategory: toScalar(product.usageCategory),
      allInOneType: toScalar(product.allInOneType),
      mainFunction: toScalar(product.mainFunction),
      wirelessCapability: toScalar(product.wirelessCapability),
      systemDomain: product.systemDomain || '',
      assetModelName: product.assetModelName || '',
      color: product.color || product.specifications?.color || '',
      screenSize: product.screenSize || product.specifications?.screenSize || '',
      width: product.width || product.specifications?.width || '',
      height: product.height || product.specifications?.height || '',
      depth: product.depth || product.specifications?.depth || '',
      msrp: String(product.msrp || ''),
      units: String(product.units || ''),
      keywords: formatList(product.keywords),
      highlights: formatList(product.highlights),
      overview: parseHtmlToText(product.overview || product.description || ''),
      technicalSpecification: parseHtmlToText(product.technicalSpecification || ''),
      technicalSpecificationRows: Array.isArray(product.technicalSpecificationRows) && product.technicalSpecificationRows.length
        ? product.technicalSpecificationRows
        : (product.technicalSpecification ? parseHtmlToText(product.technicalSpecification).split('\n').filter(Boolean).map((row: string) => {
            let label = row;
            let value = '';
            if (row.includes('\t')) {
              const parts = row.split('\t');
              label = parts[0];
              value = parts.slice(1).join(' ');
            } else if (row.includes(':')) {
              const parts = row.split(':');
              label = parts[0];
              value = parts.slice(1).join(':');
            }
            return { label: label?.trim() || '', value: value?.trim() || '' };
          }) : []),
    });
    setImagePreviews(coerceStringArray(product.images));
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const manualImages = form.images
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        brand: form.brand,
        title: form.title,
        price: Number(form.price),
        oldPrice: Number(form.oldPrice || 0),
        countInStock: Number(form.countInStock || 0),
        category: form.category,
        images: [...manualImages, ...imagePreviews.filter(Boolean)],
        productType: form.productType,
        usageCategory: form.usageCategory,
        allInOneType: form.allInOneType,
        mainFunction: form.mainFunction,
        wirelessCapability: form.wirelessCapability,
        systemDomain: form.systemDomain,
        assetModelName: form.assetModelName,
        color: form.color,
        screenSize: form.screenSize,
        width: form.width,
        height: form.height,
        depth: form.depth,
        msrp: Number(form.msrp || 0),
        units: Number(form.units || 0),
        keywords: form.keywords.split(/\n|,/).map((item) => item.trim()).filter(Boolean),
        highlights: form.highlights.split(/\n|,/).map((item) => item.trim()).filter(Boolean),
        overview: form.overview,
        description: form.overview,
        technicalSpecification: form.technicalSpecificationRows.length
          ? form.technicalSpecificationRows.map((row) => `${row.label}: ${row.value}`).join('\n')
          : form.technicalSpecification,
        technicalSpecificationRows: form.technicalSpecificationRows,
        specifications: {
          color: form.color,
          screenSize: form.screenSize,
          width: form.width,
          height: form.height,
          depth: form.depth,
        },
      };

      const url = form._id ? `/api/products/${form._id}` : '/api/products';
      const res = await fetch(url, {
        method: form._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || body.message || 'Unable to save product');
      await loadData();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Unable to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Unable to delete product');
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (err: any) {
      setError(err.message || 'Unable to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Inventory</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Product Catalog</h2>
          <p className="mt-2 text-sm text-slate-500">Create, edit, and remove printer listings with the same workflow used in the Printscarts admin experience.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
            {products.length} products
          </div>
          <button onClick={openCreateForm} className="inline-flex items-center gap-2 rounded-2xl bg-[#ff2d46] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e6283e]">
            <PlusIcon className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">{error}</div> : null}

      {showForm ? (
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{form._id ? 'Edit Product' : 'Add New Product'}</h3>
              <p className="text-sm text-slate-500">Fill in the product details and save them to the catalog.</p>
            </div>
            <button type="button" onClick={resetForm} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5">
              <h4 className="text-lg font-semibold text-slate-900">Core Identity</h4>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
                <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3" placeholder="Product title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3" value={form.category} onChange={(e) => handleCategoryChange(e.target.value)} required>
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
                <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3" placeholder="Asset model name" value={form.assetModelName} onChange={(e) => setForm({ ...form, assetModelName: e.target.value })} />
                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3" value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value })}>
                  <option value="">Technology</option>
                  {getCategoryDefaults(categories.find((category) => category._id === form.category || category.slug === form.category)?.name || categories.find((category) => category._id === form.category || category.slug === form.category)?.slug || '').productTypeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3" value={form.usageCategory} onChange={(e) => setForm({ ...form, usageCategory: e.target.value })}>
                  <option value="">Usage category</option>
                  {getCategoryDefaults(categories.find((category) => category._id === form.category || category.slug === form.category)?.name || categories.find((category) => category._id === form.category || category.slug === form.category)?.slug || '').usageOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3" value={form.allInOneType} onChange={(e) => setForm({ ...form, allInOneType: e.target.value })}>
                  <option value="">All-in-one type</option>
                  {getCategoryDefaults(categories.find((category) => category._id === form.category || category.slug === form.category)?.name || categories.find((category) => category._id === form.category || category.slug === form.category)?.slug || '').allInOneOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3" value={form.mainFunction} onChange={(e) => setForm({ ...form, mainFunction: e.target.value })}>
                  <option value="">Main function</option>
                  {getCategoryDefaults(categories.find((category) => category._id === form.category || category.slug === form.category)?.name || categories.find((category) => category._id === form.category || category.slug === form.category)?.slug || '').mainFunctionOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3" value={form.wirelessCapability} onChange={(e) => setForm({ ...form, wirelessCapability: e.target.value })}>
                  <option value="">Wireless capability</option>
                  {getCategoryDefaults(categories.find((category) => category._id === form.category || category.slug === form.category)?.name || categories.find((category) => category._id === form.category || category.slug === form.category)?.slug || '').wirelessOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3" placeholder="System domain" value={form.systemDomain} onChange={(e) => setForm({ ...form, systemDomain: e.target.value })} />
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5">
              <h4 className="text-lg font-semibold text-slate-900">Physical Specs</h4>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Screen size" value={form.screenSize} onChange={(e) => setForm({ ...form, screenSize: e.target.value })} />
                <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Width" value={form.width} onChange={(e) => setForm({ ...form, width: e.target.value })} />
                <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Height" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
                <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Depth" value={form.depth} onChange={(e) => setForm({ ...form, depth: e.target.value })} />
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5">
              <h4 className="text-lg font-semibold text-slate-900">Valuation & Units</h4>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Price ($)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="MSRP ($)" type="number" value={form.msrp} onChange={(e) => setForm({ ...form, msrp: e.target.value })} />
                <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Original price" type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
                <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Stock" type="number" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} required />
                <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Units" type="number" value={form.units} onChange={(e) => setForm({ ...form, units: e.target.value })} />
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                    <PlusIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Visual Assets</h4>
                    <p className="text-sm text-slate-500">Upload image files or paste image URLs. The gallery preview will show your current product visuals.</p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Image URLs</label>
                    <textarea
                      className="mt-2 h-32 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:bg-white"
                      placeholder="Add URLs one per line or comma-separated"
                      value={form.images}
                      onChange={(e) => setForm({ ...form, images: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Upload Files</label>
                    <label className="flex h-full min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-600 transition hover:border-purple-500 hover:bg-white hover:text-purple-700">
                      <span className="text-2xl">+</span>
                      <span className="mt-2">Upload Images</span>
                      <span className="mt-1 text-xs text-slate-400">PNG, JPG, GIF</span>
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {imagePreviews.length > 0 ? (
                    imagePreviews.map((url, index) => (
                      <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 shadow-sm">
                        <img src={url} alt={`Preview ${index + 1}`} className="h-44 w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImagePreview(index)}
                          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-800 shadow-sm transition hover:bg-slate-100"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                      No visual assets yet. Upload image files or paste URLs to preview them here.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-slate-900">Keywords & Highlights</h4>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Keywords</label>
                  <textarea
                    className="h-28 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:bg-white"
                    placeholder="Comma-separated keywords"
                    value={form.keywords}
                    onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Highlights</label>
                  <textarea
                    className="h-28 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:bg-white"
                    placeholder="Short product highlights"
                    value={form.highlights}
                    onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-slate-900">Full Narrative Overview</h4>
              <textarea
                className="mt-5 h-40 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:bg-white"
                placeholder="Describe the product in normal text form"
                value={form.overview}
                onChange={(e) => setForm({ ...form, overview: e.target.value })}
              />
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5">
              <h4 className="text-lg font-semibold text-slate-900">Technical Specification</h4>
              <p className="mt-1 text-sm text-slate-500">Add tabular rows such as Yield Type, Supply Type, and Cartridge Yield Type.</p>
              <div className="mt-4 overflow-hidden rounded-[24px] border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Label</th>
                      <th className="px-4 py-3">Value</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.technicalSpecificationRows.map((row, index) => (
                      <tr key={`${row.label}-${index}`} className="border-t border-slate-100">
                        <td className="px-4 py-3">
                          <input value={row.label} onChange={(e) => updateTechSpecRow(index, 'label', e.target.value)} placeholder="Example: Yield Type" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
                        </td>
                        <td className="px-4 py-3">
                          <input value={row.value} onChange={(e) => updateTechSpecRow(index, 'value', e.target.value)} placeholder="Example: High Yield" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button type="button" onClick={() => removeTechSpecRow(index)} className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <button type="button" onClick={addTechSpecRow} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Add row</button>
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={saving} className="rounded-2xl bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70">
                {saving ? 'Saving...' : form._id ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Inventory list</h3>
            <p className="text-sm text-slate-500">Search, edit, or delete products from the storefront catalog.</p>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm sm:w-72"
          />
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">Loading products...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">No products found.</td></tr>
                ) : filteredProducts.slice(0, displayLimit).map((product) => (
                  <tr key={product._id} className="border-t border-slate-100">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{product.title}</div>
                      <div className="text-xs text-slate-500">{product.brand}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{product.category?.name || 'Uncategorized'}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-600">{product.countInStock}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button onClick={() => openEditForm(product)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-[#ff2d46] hover:text-[#ff2d46]">
                          <PencilSquareIcon className="h-4 w-4" /> Edit
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100">
                          <TrashIcon className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {displayLimit < filteredProducts.length && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setDisplayLimit((prev) => prev + 20)}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
