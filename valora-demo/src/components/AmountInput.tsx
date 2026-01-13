interface AmountInputProps {
  amount: number;
  onChange: (amount: number) => void;
}

export default function AmountInput({ amount, onChange }: AmountInputProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#002366] mb-2">
        Quantity
      </label>
      <div className="relative">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => onChange(parseInt(e.target.value) || 1)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-300 transition-colors text-gray-900 font-medium shadow-sm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-600 flex items-center gap-1">
        <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Enter the quantity (units/pieces)
      </p>
    </div>
  );
}
