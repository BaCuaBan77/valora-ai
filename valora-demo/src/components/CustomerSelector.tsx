import { Customer } from '../data/mockData';

interface CustomerSelectorProps {
  customers: Customer[];
  selectedCustomer: string;
  onSelect: (customerId: string) => void;
}

export default function CustomerSelector({ customers, selectedCustomer, onSelect }: CustomerSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#002366] mb-2">
        Customer
      </label>
      <select
        value={selectedCustomer}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white hover:border-yellow-300 transition-colors text-gray-900 font-medium shadow-sm"
      >
        <option value="">Select a customer...</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>
      {selectedCustomer && (
        <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm">
          {(() => {
            const customer = customers.find(c => c.id === selectedCustomer)!;
            return (
              <div className="text-sm">
                <div className="font-bold text-[#002366] mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  {customer.name}
                </div>
                <div className="space-y-1.5 text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#002366]">Relationship:</span>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                      {(customer.relationshipStrength * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div><span className="font-semibold text-[#002366]">Past Deals:</span> {customer.pastDeals.length}</div>
                  {customer.discountAgreement && (
                    <div><span className="font-semibold text-[#002366]">Discount:</span> {customer.discountAgreement.percentage}% ({customer.discountAgreement.type})</div>
                  )}
                  {customer.liquidityStatus && (
                    <div><span className="font-semibold text-[#002366]">Liquidity:</span> <span className="capitalize">{customer.liquidityStatus}</span></div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
