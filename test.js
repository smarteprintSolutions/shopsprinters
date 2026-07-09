const html = \<table class='w-full text-left border-collapse'><tbody><tr class='border-b border-slate-100'>\r\n                    <td class='py-3 pr-4 font-bold text-slate-900 uppercase text-xs w-1/3'>Yield Type 1</td>\r\n                    <td class='py-3 text-slate-600 text-sm'>High Yield</td>\r\n                </tr><tr class='border-b border-slate-100'>\r\n                    <td class='py-3 pr-4 font-bold text-slate-900 uppercase text-xs w-1/3'>Supply Type</td>\r\n                    <td class='py-3 t'>Toner</td>\r\n                </tr></tbody></table>\;
let text = html.replace(/<\/?(br|p|div|tr|li|ul|table|tbody|h[1-6])[^>]*>/gi, '\n');
text = text.replace(/<\/td>\s*<td[^>]*>/gi, '\t');
text = text.replace(/<[^>]*>?/gm, '');
text = text.replace(/&nbsp;/g, ' ');
text = text.replace(/\n\s*\n/g, '\n').trim();
console.log(JSON.stringify(text));
