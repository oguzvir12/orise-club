// app/admin/page.tsx içinde siparişler tablosunun gösterildiği bölümü bununla güncelleyebilirsin:
<div className="space-y-6">
  <h2 className="text-base font-bold flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-primary" /><span>Mağaza Siparişleri ({orders.length})</span></h2>
  <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-mono">
        <thead className="border-b border-white/10 bg-black/60 text-zinc-500 uppercase">
          <tr>
            <th className="p-4">Müşteri / TCKN</th>
            <th className="p-4">Ürünler</th>
            <th className="p-4">Adresler & Kargo</th>
            <th className="p-4">Tutar</th>
            <th className="p-4">Durum</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-zinc-300">
          {orders.length === 0 ? (
            <tr><td colSpan={5} className="p-6 text-center text-zinc-500">Sipariş bulunmuyor.</td></tr>
          ) : (
            orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-zinc-900/40 align-top">
                <td className="p-4 font-bold text-white">
                  {ord.customer_name}
                  <div className="text-[10px] text-zinc-400 font-normal">{ord.phone}</div>
                  <div className="text-[10px] text-zinc-500 font-normal">TC: {ord.tc_no || 'Belirtilmemiş'}</div>
                </td>
                <td className="p-4">
                  {ord.items?.map((i: any, idx: number) => (
                    <div key={idx}>• {i.name} (x{i.quantity})</div>
                  ))}
                </td>
                <td className="p-4 text-[11px] space-y-1">
                  <div><strong className="text-zinc-500">Teslimat:</strong> {ord.address}</div>
                  <div><strong className="text-zinc-500">Fatura:</strong> {ord.billing_address || ord.address}</div>
                  <div className="text-primary font-bold">Kargo: {ord.shipping_fee === 0 ? 'Ücretsiz (2000 TL+)' : `₺${ord.shipping_fee}`}</div>
                </td>
                <td className="p-4 font-bold text-primary">₺{ord.total_price}</td>
                <td className="p-4"><span className="px-2.5 py-1 rounded-full text-[10px] bg-zinc-800 text-zinc-300">{ord.status}</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>
