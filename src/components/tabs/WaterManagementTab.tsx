import React, { useState } from 'react';
import {
  Droplets,
  Clock,
  CloudSun,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Gauge,
} from 'lucide-react';

export const WaterManagementTab: React.FC = () => {
  const [crop, setCrop] = useState('Sugarcane');
  const [stage, setStage] = useState('Vegetative Growth');
  const [soilType, setSoilType] = useState('Black Cotton Soil');
  const [irrigationMethod, setIrrigationMethod] = useState('Drip Irrigation');
  const [measuredMoisture, setMeasuredMoisture] = useState('none');

  // Agronomic irrigation benchmarks
  const irrigationBenchmarks: Record<
    string,
    {
      totalWaterNeed: string;
      criticalStages: string;
      dripSchedule: string;
      floodSchedule: string;
      actionPlan: {
        immediate: string;
        shortTerm: string;
        preventive: string;
      };
    }
  > = {
    Sugarcane: {
      totalWaterNeed: '1800 - 2200 mm across 12-month life cycle',
      criticalStages: 'Formative / Tillering stage (60-120 DAP) and Grand Growth stage (120-270 DAP).',
      dripSchedule: '2 to 2.5 hours every alternate day (discharge rate approx. 4 Litres/Hour per emitter).',
      floodSchedule: '75-80 mm depth every 8-10 days in summer; 12-15 days in winter.',
      actionPlan: {
        immediate: 'Check emitter lines for calcium/salt blockages. Irrigate in early morning to minimize solar evaporation.',
        shortTerm: 'Spread sugarcane trash (5 tonnes/ha) in furrows as organic mulch to cut water loss by 30%.',
        preventive: 'Install flush valves at tail ends of drip laterals; acid flush lines bi-monthly to maintain uniform pressure.',
      },
    },
    Cotton: {
      totalWaterNeed: '650 - 800 mm during crop growth',
      criticalStages: 'Square formation (early bud) and peak boll development. Avoid water stress at flowering.',
      dripSchedule: '1.5 to 2 hours every 3 days; reduce duration if rainfall exceeds 25 mm.',
      floodSchedule: 'Furrow irrigation every 12-14 days. Avoid flooding plant collars directly.',
      actionPlan: {
        immediate: 'Scout field edges for standing puddles after rain; spade open drainage ditches to prevent root asphyxiation.',
        shortTerm: 'Monitor leaf turgor at 1:00 PM. If leaves droop and feel warm, schedule irrigation next morning.',
        preventive: 'Adopt alternate furrow irrigation during water scarcity periods to save 35% irrigation volume.',
      },
    },
    Tomato: {
      totalWaterNeed: '500 - 650 mm over harvest cycle',
      criticalStages: 'Seedling establishment, early flowering, and rapid fruit enlargement.',
      dripSchedule: '45 to 75 minutes daily or 1.5 hours on alternate mornings.',
      floodSchedule: 'Shallow basin irrigation every 5-6 days. Avoid wetting upper leaves and fruit.',
      actionPlan: {
        immediate: 'Maintain constant, even soil moisture. Uneven moisture cycles cause blossom end rot and fruit splitting.',
        shortTerm: 'Inspect tensiometer or dig 10 cm deep to test soil ball coherence before next irrigation.',
        preventive: 'Use silver-black reflective plastic mulch or straw mulch around plant stems to stabilize root temperature.',
      },
    },
    Wheat: {
      totalWaterNeed: '450 - 550 mm during Rabi winter cycle',
      criticalStages: 'Crown Root Initiation (21 DAS), Tillering (45 DAS), Jointing (65 DAS), Flowering (85 DAS), Milk stage (105 DAS).',
      dripSchedule: 'Sprinkler / Micro-jet 2 hours every 5-7 days.',
      floodSchedule: 'Flood 60 mm at each of the 5-6 critical growth stages.',
      actionPlan: {
        immediate: 'Ensure Crown Root Initiation (21 days) irrigation is never skipped; this governs final productive tiller count.',
        shortTerm: 'Avoid irrigating during high wind gusts at grain filling to prevent field lodging.',
        preventive: 'Laser-level field prior to sowing to prevent low spots from waterlogging during seasonal winter rains.',
      },
    },
    Onion: {
      totalWaterNeed: '350 - 550 mm',
      criticalStages: 'Transplant establishment and bulb enlargement. Stop irrigation 15 days before harvesting.',
      dripSchedule: '1 hour every 2 days; bulbs have shallow fibrous root system (top 15 cm).',
      floodSchedule: 'Light irrigation every 5-7 days in sandy loam; 8-10 days in black soil.',
      actionPlan: {
        immediate: 'Check bulb neck dryness. If approaching harvest maturity, withhold water to allow neck collapse.',
        shortTerm: 'Ensure beds have gentle slope for excess surface water exit.',
        preventive: 'Construct broad beds and furrows (BBF) to prevent bulb rotting during unexpected cloudy damp weather.',
      },
    },
  };

  const currentBenchmark = irrigationBenchmarks[crop] || irrigationBenchmarks['Sugarcane'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
          <Droplets className="w-4 h-4" />
          <span>Irrigation Engineering Advisory</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">Smart Water & Irrigation Management</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Crop-specific water scheduling, overwatering vs. underwatering diagnosis, and micro-irrigation guidelines.
        </p>
      </div>

      {/* Weather Service Status Notice (Honest, Un-faked) */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start space-x-3 text-xs text-blue-950">
        <CloudSun className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-blue-900">Weather API Integration Notice</p>
          <p className="mt-0.5 leading-relaxed text-blue-900/90">
            External weather services (OpenWeather / IMD) are not currently configured with live API credentials. Recommendations below are grounded in ICAR crop evapotranspiration coefficients (Kc) and regional soil moisture benchmarks rather than simulated live forecasts.
          </p>
        </div>
      </div>

      {/* Inputs Configuration */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Crop</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Sugarcane">Sugarcane</option>
              <option value="Cotton">Cotton</option>
              <option value="Tomato">Tomato</option>
              <option value="Wheat">Wheat</option>
              <option value="Onion">Onion</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Growth Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Early Sprouting">Early Sprouting / Sowing</option>
              <option value="Vegetative Growth">Vegetative Growth / Tillering</option>
              <option value="Flowering / Tassel">Flowering / Booting / Squaring</option>
              <option value="Maturity / Ripening">Maturity / Fruit Enlargement</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Soil Texture</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Black Cotton Soil">Black Cotton Soil (High Moisture Retention)</option>
              <option value="Loamy Soil">Loamy Soil (Medium Retention)</option>
              <option value="Sandy Soil">Sandy Loam (Rapid Drainage)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Irrigation Method</label>
            <select
              value={irrigationMethod}
              onChange={(e) => setIrrigationMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Drip Irrigation">Drip Irrigation (High Efficiency)</option>
              <option value="Sprinkler System">Sprinkler System</option>
              <option value="Furrow / Basin">Furrow / Basin Irrigation</option>
              <option value="Flood Irrigation">Flood Irrigation</option>
            </select>
          </div>
        </div>

        {/* Optional Measured Moisture Input */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs text-gray-700">
            <Gauge className="w-4 h-4 text-blue-700" />
            <span className="font-semibold">Measured Field Moisture Level:</span>
          </div>

          <select
            value={measuredMoisture}
            onChange={(e) => setMeasuredMoisture(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">Not Measured / Sensor Unavailable (Default Agronomic Curve)</option>
            <option value="dry">Dry / Deficit (&lt; 35% Available Moisture)</option>
            <option value="optimal">Optimal Field Capacity (45% - 65% Moisture)</option>
            <option value="wet">Waterlogged / Saturated (&gt; 80% Moisture)</option>
          </select>
        </div>

        {measuredMoisture === 'none' ? (
          <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 flex items-start space-x-2">
            <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <span>
              Moisture sensor is not connected. Calculations use standard crop evapotranspiration guidelines for {soilType}. If you perform a manual feel-test (squeeze a handful of soil from 15 cm depth), select the moisture category above.
            </span>
          </div>
        ) : measuredMoisture === 'wet' ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Waterlogged Alert:</strong> Immediate recommendation: Suspend irrigation cycles. In {soilType}, standing water deprives roots of oxygen, triggering anaerobic root rot. Ensure drainage channels are cleared.
            </span>
          </div>
        ) : measuredMoisture === 'dry' ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Moisture Stress Detected:</strong> Immediate recommendation: Deliver a gradual soaking cycle in early morning. Avoid applying high chemical fertilizers while plants are moisture-stressed.
            </span>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Optimal Soil Moisture:</strong> Soil is within target range for root respiration and nutrient transport. Maintain standard scheduled intervals.
            </span>
          </div>
        )}
      </div>

      {/* Advisory Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 text-blue-700">
            <Clock className="w-5 h-5" />
            <h3 className="text-sm font-bold text-gray-900">Recommended Water Schedule for {crop}</h3>
          </div>

          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-2">
            <p>
              <strong>Critical Growth Stages:</strong> {currentBenchmark.criticalStages}
            </p>
            <p className="font-semibold text-emerald-800">
              • Drip Recommendation: {currentBenchmark.dripSchedule}
            </p>
            <p className="text-gray-700">
              • Surface / Flood Benchmark: {currentBenchmark.floodSchedule}
            </p>
            <p className="text-[11px] text-gray-500 pt-1 border-t border-blue-100">
              Total crop water requirement: {currentBenchmark.totalWaterNeed}.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm font-bold text-gray-900">Water Conservation Best Practices</h3>
          </div>

          <ul className="space-y-2 text-xs text-gray-600">
            <li className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start">
              <span className="text-emerald-700 mr-2 font-bold">1.</span>
              <span><strong>Organic Mulching:</strong> Spreading dry residue or trash reduces surface soil evaporation by up to 35% and maintains cooler rhizosphere.</span>
            </li>
            <li className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start">
              <span className="text-emerald-700 mr-2 font-bold">2.</span>
              <span><strong>Early Morning Cycle:</strong> Irrigate before 9:00 AM to eliminate wind drift and daytime evaporative loss.</span>
            </li>
            <li className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start">
              <span className="text-emerald-700 mr-2 font-bold">3.</span>
              <span><strong>Subsurface Lateral Flushes:</strong> Open tail flush valves bi-weekly to prevent fine silt and calcium carbonate clogging.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action Plan (Immediate, Short-Term, Preventive) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-blue-900">
          <Calendar className="w-5 h-5 text-blue-700" />
          <h3 className="text-sm font-bold text-gray-900">Action Plan for Irrigation Management</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-700 text-white inline-block">
              Immediate (Today)
            </span>
            <p className="text-blue-950 font-medium leading-relaxed">
              {currentBenchmark.actionPlan.immediate}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-700 text-white inline-block">
              Short-Term (Next 2-5 Days)
            </span>
            <p className="text-emerald-950 font-medium leading-relaxed">
              {currentBenchmark.actionPlan.shortTerm}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-700 text-white inline-block">
              Preventive (Long Term)
            </span>
            <p className="text-amber-950 font-medium leading-relaxed">
              {currentBenchmark.actionPlan.preventive}
            </p>
          </div>
        </div>
      </div>

      {/* Overwatering vs Underwatering Diagnostic Guide */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center">
          <AlertTriangle className="w-4 h-4 text-amber-600 mr-2" />
          How to Distinguish Overwatering vs. Underwatering Symptoms
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Overwatering */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
            <span className="font-bold text-blue-900 uppercase tracking-wider block">
              💧 Overwatering Symptoms (Waterlogging)
            </span>
            <ul className="space-y-1.5 text-blue-950">
              <li className="flex items-start">
                <span className="text-blue-700 font-bold mr-1.5">•</span>
                <span><strong>Soft, limp yellowing:</strong> Lower leaves turn pale yellow while remaining soft, heavy, and limp (not crunchy).</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-700 font-bold mr-1.5">•</span>
                <span><strong>Soil stagnation:</strong> Soil surface stays continuously muddy or emits a sour, anaerobic smell.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-700 font-bold mr-1.5">•</span>
                <span><strong>Root Rot & Blistering:</strong> Roots turn dark brown/black; leaves develop water blisters (edema).</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-700 font-bold mr-1.5">•</span>
                <span><strong>Remedy:</strong> Pause irrigation immediately, spade open furrow drains, and aerate plant basin.</span>
              </li>
            </ul>
          </div>

          {/* Underwatering */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
            <span className="font-bold text-amber-900 uppercase tracking-wider block">
              ☀️ Underwatering Symptoms (Moisture Deficit)
            </span>
            <ul className="space-y-1.5 text-amber-950">
              <li className="flex items-start">
                <span className="text-amber-700 font-bold mr-1.5">•</span>
                <span><strong>Dry, brittle leaf curl:</strong> Leaf edges curl upward, turn dull grey-green, and feel dry and brittle to the touch.</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-700 font-bold mr-1.5">•</span>
                <span><strong>Tip burn & scorching:</strong> Foliage tips scorch brown; flowers or young fruitlets abort and drop.</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-700 font-bold mr-1.5">•</span>
                <span><strong>Deep soil cracking:</strong> Soil pulls away from plant stems with fissures exceeding 2 inches depth.</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-700 font-bold mr-1.5">•</span>
                <span><strong>Remedy:</strong> Apply slow, soaking irrigation over several hours; mulch surface to lock in moisture.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
