interface MarginInputProps {
  margin: number | null;
  onChange: (margin: number | null) => void;
}

export default function MarginInput({ margin, onChange }: MarginInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Desired Margin (%)
        <span className="text-xs text-gray-500 ml-1">(Optional)</span>
      </label>
      <input
        type="number"
        min="0"
        max="100"
        step="0.1"
        value={margin ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          onChange(value === '' ? null : parseFloat(value));
        }}
        placeholder="e.g., 25"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      <p className="mt-1 text-xs text-gray-500">
        Target profit margin percentage. Leave empty for AI-recommended margin.
      </p>
    </div>
  );
}
