import { OverallPerformanceIndex, PriceEstimate } from '../types';
import {
  VictoryChart,
  VictoryScatter,
  VictoryLine,
  VictoryAxis,
  VictoryLabel,
  VictoryContainer,
  VictoryTooltip,
} from 'victory';

interface FairValueScatterPlotProps {
  currentPerformanceIndex: OverallPerformanceIndex;
  currentPrice: number;
  fairPrice: number;
  productCategory: string;
  productBaseCost: number;
  orderQuantity: number;
  factors: PriceEstimate['factors'];
}

export default function FairValueScatterPlot({ 
  currentPrice,
}: FairValueScatterPlotProps) {
  // Hardcoded values (no calculations)
  const currentPerformanceScore = 86.5;
  
  // Use the actual current price from props
  const staticCurrentPrice = currentPrice;
  
  // Hardcoded competitor scatter data (no calculations)
  const competitorScatterData = [
    { x: 75, y: 10250, label: 'Avnet' },
    { x: 92, y: 11000, label: 'Arrow Electronics' },
    { x: 10, y: 8700, label: 'Mouser Electronics' },
    { x: 25, y: 9250, label: 'Future Electronics' },
    { x: 40, y: 9500, label: 'Digi-Key' },
    { x: 55, y: 9900, label: 'Allied Electronics' },
    { x: 70, y: 10300, label: 'TTI Inc.' },
    { x: 82, y: 10450, label: 'Ingram Micro' },
    { x: 90, y: 10950, label: 'Wesco Distribution' },
    { x: 95, y: 11150, label: 'Richardson Electronics' },
  ];
  
  // Hardcoded price ranges (no calculations)
  // Adjusted to ensure all scatter points are visible
  const minPrice = 8000;
  const maxPrice = 11500;
  
  // Hardcoded fair-value line data points (no calculations)
  const fairValueLineData = [
    { x: 0, y: 8500 },
    { x: 100, y: 11000 },
  ];
  
  // Hardcoded price band data (no calculations)
  const upperBandData = [
    { x: 0, y: 9000 },
    { x: 100, y: 12100 },
  ];
  
  const lowerBandData = [
    { x: 0, y: 8000 },
    { x: 100, y: 9900 },
  ];
  
  // Current product data (always the same)
  const currentProductData = [{
    x: currentPerformanceScore,
    y: staticCurrentPrice,
    label: 'Suggested Price',
  }];
  

  return (
    <div className="mt-6 pt-4 border-t-2 border-yellow-500/30">
      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl p-6 shadow-2xl border-2 border-yellow-500/30">
        {/* Chart Title and Legend */}
        <div className="mb-4 pb-4 border-b-2 border-yellow-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#002366] to-blue-900 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#002366]">Competitive Price Positioning</h3>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-lg border border-emerald-300">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm"></div>
              <span className="text-[#002366] font-semibold">Your Price</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300">
              <div className="w-3 h-3 rounded-full bg-slate-400 shadow-sm"></div>
              <span className="text-[#002366] font-semibold">Competitors</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-lg border border-blue-300">
              <div className="w-8 h-0.5 bg-gradient-to-r from-[#002366] to-blue-900"></div>
              <span className="text-[#002366] font-semibold">Fair Price</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-lg border border-amber-300">
              <div className="w-8 h-0.5 bg-amber-400 opacity-60" style={{ borderTop: '2px dashed' }}></div>
              <span className="text-[#002366] font-semibold">Reasonable Price Range</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-white rounded-xl p-4 shadow-inner border border-gray-200" style={{ minHeight: '500px' }}>
          <div style={{ width: '100%', maxWidth: '800px', height: '500px', margin: '0 auto' }}>
            <VictoryChart
              width={800}
              height={500}
              padding={{ left: 80, right: 40, top: 40, bottom: 60 }}
              domain={{
                x: [0, 100],
                y: [minPrice, maxPrice],
              }}
              containerComponent={
                <VictoryContainer 
                  responsive={true}
                  style={{ 
                    width: '100%',
                    height: '100%'
                  }}
                />
              }
            >
          {/* Grid */}
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: '#cbd5e1', strokeWidth: 2 },
              grid: { stroke: '#e2e8f0', strokeDasharray: '3,3', strokeWidth: 1 },
              ticks: { stroke: '#64748b', strokeWidth: 1.5 },
              tickLabels: { fill: '#475569', fontSize: 13, fontWeight: '500' },
            }}
            tickFormat={(t: number) => `$${(t/1000).toFixed(1)}k`}
            label="Price ($)"
            axisLabelComponent={
              <VictoryLabel 
                dy={-20} 
                x={30}
                style={{ 
                  fill: '#1e293b', 
                  fontSize: 16, 
                  fontWeight: 'bold',
                  textAnchor: 'middle'
                }} 
              />
            }
          />
          
          <VictoryAxis
            style={{
              axis: { stroke: '#64748b', strokeWidth: 2 },
              grid: { stroke: '#e2e8f0', strokeDasharray: '3,3', strokeWidth: 1 },
              ticks: { stroke: '#64748b', strokeWidth: 1.5 },
              tickLabels: { fill: '#475569', fontSize: 13, fontWeight: '500' },
            }}
            tickFormat={(t: number) => Math.round(t)}
            tickValues={[0, 20, 40, 60, 80, 100]}
            label="Pricing Factors Index"
            axisLabelComponent={
              <VictoryLabel 
                dy={30} 
                style={{ 
                  fill: '#1e293b', 
                  fontSize: 16, 
                  fontWeight: 'bold',
                  height: '30px'
                }} 
              />
            }
          />
          
          {/* Price band (upper) */}
          <VictoryLine
            data={upperBandData}
            style={{
              data: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '6,4', opacity: 0.6 },
            }}
          />
          
          {/* Price band (lower) */}
          <VictoryLine
            data={lowerBandData}
            style={{
              data: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '6,4', opacity: 0.6 },
            }}
          />
          
          {/* Fair-value line - gradient effect */}
          <VictoryLine
            data={fairValueLineData}
            style={{
              data: { 
                stroke: 'url(#gradient)', 
                strokeWidth: 4,
                strokeLinecap: 'round'
              },
            }}
          />
          
          {/* SVG Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#002366" />
              <stop offset="50%" stopColor="#003a8c" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
          
          {/* Competitor scatter points */}
          <VictoryScatter
            data={competitorScatterData}
            size={7}
            style={{
              data: { 
                fill: '#94a3b8', 
                stroke: '#475569', 
                strokeWidth: 2,
                opacity: 0.85
              },
            }}
            labels={({ datum }) => [
              datum.label,
              `Performance: ${datum.x.toFixed(1)}`,
              `Price: $${datum.y.toLocaleString()}`
            ]}
            labelComponent={
              <VictoryTooltip
                style={[
                  { 
                    fontSize: 14, 
                    fill: '#1e293b',
                    fontWeight: '700',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  },
                  { 
                    fontSize: 12, 
                    fill: '#64748b',
                    fontWeight: '600',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  },
                  { 
                    fontSize: 12, 
                    fill: '#64748b',
                    fontWeight: '600',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }
                ]}
                flyoutStyle={{ 
                  fill: '#ffffff', 
                  stroke: '#475569', 
                  strokeWidth: 2.5,
                  filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))',
                  rx: 10
                }}
                flyoutPadding={{ top: 14, bottom: 14, left: 18, right: 18 }}
                cornerRadius={10}
                pointerLength={12}
                pointerWidth={16}
                centerOffset={{ x: 0, y: -10 }}
              />
            }
          />
          
          {/* Current product point - with glow effect */}
          <VictoryScatter
            data={currentProductData}
            size={11}
            style={{
              data: { 
                fill: '#10b981', 
                stroke: '#ffffff', 
                strokeWidth: 3,
                filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))'
              },
            }}
            labels={({ datum }) => [
              datum.label,
              `Performance: ${datum.x.toFixed(1)}`,
              `Price: $${datum.y.toLocaleString()}`
            ]}
            labelComponent={
              <VictoryTooltip
                style={[
                  { 
                    fontSize: 16, 
                    fill: '#065f46',
                    fontWeight: '800',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    letterSpacing: '0.3px'
                  },
                  { 
                    fontSize: 13, 
                    fill: '#047857',
                    fontWeight: '600',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  },
                  { 
                    fontSize: 13, 
                    fill: '#047857',
                    fontWeight: '600',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }
                ]}
                flyoutStyle={{ 
                  fill: '#ecfdf5', 
                  stroke: '#10b981', 
                  strokeWidth: 3,
                  filter: 'drop-shadow(0 12px 24px rgba(16, 185, 129, 0.35))',
                  rx: 12
                }}
                flyoutPadding={{ top: 16, bottom: 16, left: 20, right: 20 }}
                cornerRadius={12}
                pointerLength={14}
                pointerWidth={18}
                centerOffset={{ x: 0, y: -12 }}
              />
            }
          />
        </VictoryChart>
          </div>
        </div>
        
        {/* Pricing Reasoning Section */}
        <div className="mt-6 pt-6 border-t-2 border-yellow-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-[#002366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#002366]">Why This Price?</h3>
          </div>
          
          <div className="space-y-5">
            {/* Main explanation */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-md border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#002366] to-blue-900 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-base leading-relaxed text-gray-800">
                    Our AI pricing model processes multiple data sources through feature engineering to recommend{' '}
                    <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#002366] font-bold rounded-md border border-yellow-600 shadow-sm">
                      ${staticCurrentPrice.toLocaleString()}
                    </span>
                    . The model analyzes <span className="font-bold text-[#002366]">customer preferences</span>,{' '}
                    <span className="font-bold text-[#002366]">market dynamics</span>,{' '}
                    <span className="font-bold text-[#002366]">relationship factors</span>, and{' '}
                    <span className="font-bold text-[#002366]">strategic objectives</span>{' '}
                    to find the optimal balance between competitiveness and profitability.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Key factors grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-900 text-sm mb-1">Customer Intelligence</h4>
                    <ul className="text-xs text-purple-800 space-y-0.5">
                      <li>• Values fast delivery & reliability</li>
                      <li>• Strong financial position (expanding)</li>
                      <li>• Prefers established supplier relationships</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">Strategic Positioning</h4>
                    <ul className="text-xs text-blue-800 space-y-0.5">
                      <li>• Strategy: Win deal while maintaining margin</li>
                      <li>• Target: Value-conscious enterprise segment</li>
                      <li>• Competitive gap vs premium suppliers</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-emerald-900 text-sm mb-1">Value Alignment</h4>
                    <ul className="text-xs text-emerald-800 space-y-0.5">
                      <li>• Strong delivery track record</li>
                      <li>• Competitive product quality</li>
                      <li>• Building brand reputation</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-900 text-sm mb-1">Market Context</h4>
                    <ul className="text-xs text-orange-800 space-y-0.5">
                      <li>• Competitor pricing: $8.7K - $11.2K</li>
                      <li>• Market trend: Growing demand (+15% YoY)</li>
                      <li>• Seasonal factors & economic indicators</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Model explanation */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-lg p-5 border-2 border-indigo-200 shadow-md">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h4 className="font-bold text-indigo-900 text-base flex-1">How the Model Works</h4>
              </div>
              
              <div className="ml-12 space-y-3">
                <div className="bg-white/70 backdrop-blur-sm rounded-md p-3 border border-indigo-100">
                  <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-2">Feature Engineering Pipeline</p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    Transforms raw business data into intelligent model features that capture the nuances of your deal context.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-white/60 rounded-md p-2.5 border border-purple-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-purple-900">Customer-Value Matching</span>
                    </div>
                    <p className="text-xs text-gray-700 ml-3.5">Do your strengths align with what they value?</p>
                  </div>
                  
                  <div className="bg-white/60 rounded-md p-2.5 border border-indigo-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-indigo-900">Relationship Depth</span>
                    </div>
                    <p className="text-xs text-gray-700 ml-3.5">Transaction history & loyalty indicators</p>
                  </div>
                  
                  <div className="bg-white/60 rounded-md p-2.5 border border-pink-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-pink-900">Competitive Position</span>
                    </div>
                    <p className="text-xs text-gray-700 ml-3.5">Your pricing relative to alternatives</p>
                  </div>
                  
                  <div className="bg-white/60 rounded-md p-2.5 border border-violet-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-violet-900">Strategic Objectives</span>
                    </div>
                    <p className="text-xs text-gray-700 ml-3.5">Win rate vs. margin optimization goals</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-md p-3 border border-indigo-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-sm text-indigo-900 font-medium">
                      The model then predicts the price point that maximizes your defined success metric.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom recommendation */}
            <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-xl p-6 border-l-[6px] border-yellow-500 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md border-2 border-yellow-600">
                  <svg className="w-6 h-6 text-[#002366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#002366] text-base mb-2 flex items-center gap-2">
                    <span>Recommendation Summary</span>
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </h4>
                  <p className="text-[15px] text-gray-800 leading-relaxed font-medium">
                    This price <span className="font-bold text-[#002366]">balances customer budget sensitivity</span> with your{' '}
                    <span className="font-bold text-[#002366]">delivery strengths</span>. While premium suppliers command higher 
                    prices through brand reputation, your <span className="font-bold text-[#002366]">competitive delivery performance</span>{' '}
                    and <span className="font-bold text-[#002366]">growing market presence</span> support this price point.
                  </p>
                  <div className="mt-3 pt-3 border-t border-yellow-300">
                    <p className="text-sm text-[#002366] font-bold flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Optimal position to win the deal while maintaining strategic margins
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
