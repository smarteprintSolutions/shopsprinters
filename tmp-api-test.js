const url = 'http://127.0.0.1:3002/api/products?limit=all';
(async () => {
  try {
    const res = await fetch(url);
    console.log('status', res.status);
    console.log('content-type', res.headers.get('content-type'));
    const text = await res.text();
    console.log('body starts with:');
    console.log(text.slice(0, 300));
  } catch (err) {
    console.error('fetch failed', err);
    process.exit(1);
  }
})();
