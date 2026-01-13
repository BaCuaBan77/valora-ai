import { Product } from '../data/mockData';

interface ProductSelectorProps {
  products: Product[];
  selectedProduct: string;
  onSelect: (productId: string) => void;
}

export default function ProductSelector({ products, selectedProduct, onSelect }: ProductSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#002366] mb-2">
        Product
      </label>
      <select
        value={selectedProduct}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white hover:border-yellow-300 transition-colors text-gray-900 font-medium shadow-sm"
      >
        <option value="">Select a product...</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      {selectedProduct && (
        <div className="mt-3 p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200 shadow-sm">
          {(() => {
            const product = products.find(p => p.id === selectedProduct)!;
            return (
              <div className="text-sm">
                <div className="font-bold text-[#002366] mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  {product.name}
                </div>
                <div className="text-xs text-gray-700 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#002366]">Base Cost:</span>
                    <span className="px-2 py-0.5 bg-[#002366] text-yellow-400 rounded-full font-bold">
                      ${product.baseCost.toLocaleString()}/unit
                    </span>
                  </div>
                  <div><span className="font-semibold text-[#002366]">Tier:</span> {product.tier}</div>
                  <div className="mt-2 pt-2 border-t border-yellow-300">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-bold text-[#002366]">In Stock:</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-bold border border-green-300">
                        2,000 units
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
