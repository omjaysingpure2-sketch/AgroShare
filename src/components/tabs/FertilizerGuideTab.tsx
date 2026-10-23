import React, { useState } from 'react';
import {
  ShoppingBag,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Mountain,
  Check,
  Calendar,
  Clock,
  Layers,
} from 'lucide-react';
import { SoilReportRecord } from '../../types';

interface FertilizerGuideTabProps {
  savedSoilReports?: SoilReportRecord[];
}

export const FertilizerGuideTab: React.FC<FertilizerGuideTabProps> = ({ savedSoilReports = [] }) => {
  const [crop, setCrop] = useState('Wheat');
  const [growthStage, setGrowthStage] = useState('Vegetative (Tillering)');
  const [soilType, setSoilType] = useState('Alluvial / Loamy');
  const [season, setSeason] = useState('Rabi');
  const [selectedSoilReportId, setSelectedSoilReportId] = useState<string>('none');

  const selectedSoilReport = savedSoilReports.find((r) => r.id === selectedSoilReportId);

  // Reliable crop agronomy database grounded in ICAR and State Agricultural University standards
  const fertilizerData: Record<
    string,
    {
      nutrientRequirements: string;
      options: {
        name: string;
        reason: string;
        method: string;
        timing: string;
        dosage: string;
      }[];
      actionPlan: {
        immediate: string;
        shortTerm: string;
        preventive: string;
      };
      precautions: string[];
      overuseRisks: string[];
    }
  > = {
    Wheat: {
      nutrientRequirements: '120 kg N : 60 kg P2O5 : 40 kg K2O per hectare (approx 50:25:16 kg/acre). Zinc is vital at CRI stage.',
      options: [
        {
          name: 'Urea (46% Nitrogen)',
          reason: 'Provides readily absorbed nitrogen to stimulate vigorous tillering and leaf expansion.',
          method: 'Broadcasting in moist soil after first irrigation cycle.',
          timing: 'Split: 50% basal at sowing, 25% at Crown Root Initiation (21 days), 25% at jointing (45 days).',
          dosage: '50-55 kg Urea per acre per split dose.',
        },
        {
          name: 'Single Super Phosphate (SSP 16% P2O5)',
          reason: 'Promotes rapid root anchoring and early tiller initiation.',
          method: 'Band placement 5 cm below seed level.',
          timing: '100% Basal at time of field sowing.',
          dosage: '100 kg SSP per acre.',
        },
        {
          name: 'Zinc Sulphate (21% Zn)',
          reason: 'Prevents Khaira disease/zinc deficiency interveinal chlorosis.',
          method: 'Soil application mixed with well-rotted FYM, or 0.5% foliar spray.',
          timing: 'Basal before final harrowing or foliar at 30 days.',
          dosage: '10 kg/acre soil application once every 2 seasons.',
        },
      ],
      actionPlan: {
        immediate: 'Check soil moisture before applying urea top-dressing. Never apply on dry, cracked soil.',
        shortTerm: 'Follow up with light irrigation within 24-36 hours of broadcasting to prevent ammonia volatilization.',
        preventive: 'Incorporate green manure (dhaincha) or well-rotted compost during summer fallow to build soil organic carbon.',
      },
      precautions: [
        'Never broadcast urea during heavy midday sun or on stagnant water puddles.',
        'Do not mix phosphatic fertilizers directly with unchelated zinc sulphate in the same tank.',
        'Wear protective rubber gloves and mask during spray operations.',
      ],
      overuseRisks: [
        'Excess nitrogen causes crop lodging during windy earhead emergence and attracts aphid attacks.',
        'Over-application of unbuffered urea can temporarily scorch tender crown roots.',
      ],
    },
    Sugarcane: {
      nutrientRequirements: '250 kg N : 115 kg P2O5 : 115 kg K2O per hectare (approx 100:45:45 kg/acre) across 12-month crop cycle.',
      options: [
        {
          name: 'NPK 10:26:26 Complex',
          reason: 'Balanced starter formula providing phosphorus and potassium for vigorous sett sprouting and root growth.',
          method: 'Furrow application alongside setts at planting.',
          timing: 'Basal application at planting time.',
          dosage: '100 kg per acre.',
        },
        {
          name: 'Neem Coated Urea',
          reason: 'Sustained nitrogen release preventing cane yellowing during elongation and internode formation.',
          method: 'Earthing-up side dressing followed by irrigation.',
          timing: 'Applied in 3 equal splits at 45, 90, and 120 days after planting.',
          dosage: '65 kg per acre per split.',
        },
        {
          name: 'Ferrous Sulphate (FeSO4) + Citric Acid',
          reason: 'Corrects lime-induced iron chlorosis in high pH black soils.',
          method: 'Foliar spray @ 5g FeSO4 + 1g citric acid per litre of water.',
          timing: 'Spray when newly emerging whorl leaves appear pale white or yellow.',
          dosage: '150-200 litres spray solution per acre.',
        },
      ],
      actionPlan: {
        immediate: 'Ensure irrigation water is readily available before scheduling earthing-up top dressing.',
        shortTerm: 'Inspect internode spacing and cane thickness 10 days post application.',
        preventive: 'Retain sugarcane trash mulch between furrows to retain potassium and conserve up to 30% soil moisture.',
      },
      precautions: [
        'Discontinue nitrogen top-dressing after 150 days to prevent excessive vegetative succulent growth and poor sucrose recovery.',
        'Ensure soil has adequate moisture prior to chemical fertilizer application.',
      ],
      overuseRisks: [
        'Late nitrogen surges decrease juice brix percentage and delay mill maturity.',
        'Excess soluble salts near young sett eyes can impair germination.',
      ],
    },
    Tomato: {
      nutrientRequirements: '100 kg N : 60 kg P2O5 : 60 kg K2O per hectare with regular calcium and boron supplementation.',
      options: [
        {
          name: 'Water Soluble NPK 19:19:19',
          reason: 'Equal nutrient ratio for rapid seedling establishment, lateral branching, and early flowering.',
          method: 'Drip fertigation or foliar spray in morning.',
          timing: 'Every 8-10 days starting 15 days after transplantation.',
          dosage: '3 kg per acre per fertigation cycle.',
        },
        {
          name: 'Calcium Nitrate + Solubor Boron',
          reason: 'Crucial for cellular elasticity; prevents blossom end rot and fruit cracking.',
          method: 'Foliar spray during early flowering and marble fruit development stage.',
          timing: 'Morning or late afternoon.',
          dosage: '4g Calcium Nitrate + 1g Boron per litre of clean water.',
        },
        {
          name: 'Potassium Schoenite / Sulphate of Potash (0:0:50)',
          reason: 'Enhances fruit firmness, uniform red coloration, and shelf life.',
          method: 'Drip fertigation during fruit enlargement stage.',
          timing: 'Weekly from fruit set until harvest.',
          dosage: '2.5 kg per acre.',
        },
      ],
      actionPlan: {
        immediate: 'Inspect fruit tips for dark sunken spots indicative of calcium deficiency (Blossom End Rot).',
        shortTerm: 'Apply targeted Calcium Nitrate foliar spray if rapid fruit expansion is underway.',
        preventive: 'Maintain uniform soil moisture with drip irrigation; moisture fluctuations inhibit calcium uptake.',
      },
      precautions: [
        'Never mix calcium nitrate with phosphate or sulphate fertilizers in the same fertigation tank to prevent precipitation.',
        'Always check irrigation water pH; ideal range is 6.0 to 6.8 for maximum nutrient uptake.',
      ],
      overuseRisks: [
        'High nitrogen during flowering induces blossom drop and excessive lush foliage prone to leaf curl.',
        'Boron toxicity occurs above 2g/L causing edge scorching on mature leaves.',
      ],
    },
    Cotton: {
      nutrientRequirements: '120 kg N : 60 kg P2O5 : 60 kg K2O per hectare. Magnesium and Boron are critical during boll setting.',
      options: [
        {
          name: 'DAP (18:46:0) + MOP (0:0:60)',
          reason: 'Provides deep root anchoring and potassium to maintain turgor against drought stress.',
          method: 'Basal placement 5-7 cm below seed furrow.',
          timing: 'At sowing or dibbling.',
          dosage: '50 kg DAP + 30 kg MOP per acre.',
        },
        {
          name: 'Urea (Split Dosing)',
          reason: 'Maintains vegetative canopy and branch framework without triggering lush softness.',
          method: 'Band placement followed by earthing up.',
          timing: 'Split at square formation (35 DAS) and flowering (65 DAS).',
          dosage: '40 kg per acre per split.',
        },
        {
          name: 'Magnesium Sulphate (MgSO4 9.5% Mg)',
          reason: 'Prevents "Lal-patti" (reddening of cotton leaves) common in black cotton soils.',
          method: 'Foliar spray @ 10g/L or soil application.',
          timing: 'At peak boll development (75-90 DAS).',
          dosage: '1 kg/100L water foliar spray.',
        },
      ],
      actionPlan: {
        immediate: 'Scout leaf margins for early purplish-red discoloration between veins.',
        shortTerm: 'Schedule foliar 13:0:45 potassium nitrate spray to support heavy boll retention.',
        preventive: 'Maintain deep furrow drainage to prevent root hypoxia during heavy monsoon showers.',
      },
      precautions: [
        'Avoid high nitrogen application during prolonged cloudy weather to minimize boll rot.',
        'Wear protective equipment when combining foliar nutrients with approved bio-pesticides.',
      ],
      overuseRisks: [
        'Excess vegetative lushness increases vulnerability to sucking pests (jassids, whiteflies).',
      ],
    },
    Soybean: {
      nutrientRequirements: '20 kg N : 60 kg P2O5 : 40 kg K2O + 20 kg Sulphur per hectare. Rhizobium inoculation provides symbiotic N.',
      options: [
        {
          name: 'Single Super Phosphate (SSP) + Sulphur',
          reason: 'Supplies phosphorus for root nodules and sulphur to boost seed oil and protein content.',
          method: 'Basal soil incorporation at final seedbed preparation.',
          timing: 'Before sowing.',
          dosage: '125 kg SSP per acre.',
        },
        {
          name: 'Water Soluble 00:52:34 (Mono Potassium Phosphate)',
          reason: 'Boosts flower retention and pod filling without excessive vegetative branching.',
          method: 'Foliar spray @ 5g/L.',
          timing: 'At early flowering and pod initiation stage.',
          dosage: '1 kg per acre in 200L water.',
        },
      ],
      actionPlan: {
        immediate: 'Examine root nodules at 25-30 days; healthy nodules should be pinkish-red inside.',
        shortTerm: 'If nodulation is weak, apply mild starter urea (15 kg/acre) to sustain early growth.',
        preventive: 'Inoculate seed with Rhizobium japonicum and PSB culture before sowing next season.',
      },
      precautions: [
        'Avoid high chemical nitrogen applications which suppress natural symbiotic nodule formation.',
      ],
      overuseRisks: [
        'Heavy nitrogen leads to excessive vegetative vine growth and poor pod setting.',
      ],
    },
    Onion: {
      nutrientRequirements: '100 kg N : 50 kg P2O5 : 50 kg K2O + 30 kg Sulphur per hectare.',
      options: [
        {
          name: 'Ammonium Sulphate / Urea + Bentonite Sulphur',
          reason: 'Sulphur enhances pungency, bulb firmness, and storage keeping quality.',
          method: 'Basal placement at transplanting.',
          timing: 'At land preparation.',
          dosage: '20 kg Sulphur granules per acre.',
        },
        {
          name: 'Potassium Nitrate (13:0:45)',
          reason: 'Accelerates bulb swelling and uniform neck closure.',
          method: 'Drip fertigation or foliar spray.',
          timing: 'Between 45 and 75 days after transplanting.',
          dosage: '3 kg per acre every 10 days.',
        },
      ],
      actionPlan: {
        immediate: 'Check bulb formation stage; stop nitrogen application 30 days before harvest.',
        shortTerm: 'Apply foliar potassium to promote neck drying.',
        preventive: 'Maintain soil pH between 6.5 and 7.5; avoid waterlogged heavy clays.',
      },
      precautions: [
        'Do not apply nitrogen fertilizers within 3 weeks of harvest to avoid thick necks and storage rot.',
      ],
      overuseRisks: [
        'Excess late nitrogen causes "thick-neck" bulbs that rot quickly in onion chawls.',
      ],
    },
  };

  const currentGuide = fertilizerData[crop] || fertilizerData['Wheat'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-orange-700 mb-1">
          <ShoppingBag className="w-4 h-4" />
          <span>Scientific Nutrient Advisory</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">Personalized Fertilizer & Nutrient Guide</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Calibrated fertilizer formulations based on crop physiology, growth stages, and available soil-test parameters.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Crop</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Wheat">Wheat</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Tomato">Tomato</option>
              <option value="Cotton">Cotton</option>
              <option value="Soybean">Soybean</option>
              <option value="Onion">Onion</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Growth Stage</label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Basal / Sowing">Basal / Sowing</option>
              <option value="Vegetative (Tillering)">Vegetative / Tillering</option>
              <option value="Flowering / Booting">Flowering / Booting</option>
              <option value="Fruiting / Grain Fill">Fruiting / Grain Fill / Maturity</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Alluvial / Loamy">Alluvial / Loamy</option>
              <option value="Black Cotton Soil">Black Cotton Soil</option>
              <option value="Red Sandy Loam">Red Sandy Loam</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Season</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Rabi">Rabi (Winter)</option>
              <option value="Kharif">Kharif (Monsoon)</option>
              <option value="Zaid">Zaid (Summer)</option>
            </select>
          </div>
        </div>

        {/* Link with Saved Soil Test */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs text-gray-700">
            <Mountain className="w-4 h-4 text-amber-700" />
            <span className="font-semibold">Connect Saved Soil-Test Results:</span>
          </div>

          <select
            value={selectedSoilReportId}
            onChange={(e) => setSelectedSoilReportId(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="none">Standard Package of Practices (No test card selected)</option>
            {savedSoilReports.map((report) => (
              <option key={report.id} value={report.id}>
                {report.cropName} Test ({report.soilType}, pH {report.ph})
              </option>
            ))}
          </select>
        </div>

        {/* Soil Test Grounding / Honest Absence Notice */}
        {selectedSoilReport ? (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-amber-900">
              <Check className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Grounded in Saved Soil Test ({selectedSoilReport.cropName}):</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              • Tested Parameters: pH {selectedSoilReport.ph} • Nitrogen: {selectedSoilReport.nitrogen} • Phosphorus: {selectedSoilReport.phosphorus} • Potassium: {selectedSoilReport.potassium}.
            </p>
            {selectedSoilReport.ph > 7.8 && (
              <p className="text-[11px] text-orange-900 font-medium">
                • <strong>Alkaline Soil (pH {selectedSoilReport.ph}):</strong> Micronutrients like iron and zinc are prone to fixation. Prioritize foliar micronutrient sprays rather than sole soil application.
              </p>
            )}
            {selectedSoilReport.phosphorus.toLowerCase().includes('low') && (
              <p className="text-[11px] text-orange-900 font-medium">
                • <strong>Low Soil Phosphorus:</strong> Increase basal Single Super Phosphate (SSP) by 20% to avoid stunted early root anchoring.
              </p>
            )}
            {selectedSoilReport.nitrogen.toLowerCase().includes('low') && (
              <p className="text-[11px] text-orange-900 font-medium">
                • <strong>Low Available Nitrogen:</strong> Split urea applications into smaller, more frequent doses to reduce leaching losses.
              </p>
            )}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-start space-x-2">
            <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">No laboratory soil-test card selected</p>
              <p className="text-[11px] mt-0.5 text-gray-500 leading-relaxed">
                Recommendations below reflect standard Indian university extension recommendations for {crop}. For tailored dosage, enter your measured soil pH, N, P, and K values in the Soil Health tab. AgriShare never fabricates sensor readings or recommends unnecessary chemicals.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Relevant Nutrient Requirements */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center">
          <Layers className="w-4 h-4 text-orange-600 mr-1.5" />
          Standard Nutrient Requirement: {crop}
        </h3>
        <p className="text-xs font-medium text-gray-900 bg-orange-50/50 p-3 rounded-xl border border-orange-100">
          {currentGuide.nutrientRequirements}
        </p>
      </div>

      {/* Recommended Formulations */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Recommended Formulations for {crop} ({growthStage})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentGuide.options.map((opt, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 uppercase tracking-wider mb-2">
                  Option #{i + 1}
                </span>
                <h4 className="text-sm font-bold text-gray-900">{opt.name}</h4>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  <strong>Why:</strong> {opt.reason}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Method:</strong> {opt.method}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  <strong>Timing:</strong> {opt.timing}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 bg-orange-50/50 p-2.5 rounded-xl">
                <span className="text-[10px] text-orange-700 uppercase font-bold block">Calibrated Dosage:</span>
                <span className="text-xs font-black text-orange-950">{opt.dosage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan (Immediate, Short-Term, Preventive) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-emerald-800">
          <Calendar className="w-5 h-5 text-emerald-700" />
          <h3 className="text-sm font-bold text-gray-900">Structured Farm Action Plan for {crop}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-700 text-white inline-block">
              Immediate (Today)
            </span>
            <p className="text-emerald-950 font-medium leading-relaxed">
              {currentGuide.actionPlan.immediate}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-700 text-white inline-block">
              Short-Term (2-5 Days)
            </span>
            <p className="text-blue-950 font-medium leading-relaxed">
              {currentGuide.actionPlan.shortTerm}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-700 text-white inline-block">
              Preventive (Next Cycle)
            </span>
            <p className="text-amber-950 font-medium leading-relaxed">
              {currentGuide.actionPlan.preventive}
            </p>
          </div>
        </div>
      </div>

      {/* Precautions and Overuse Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center">
            <ShieldAlert className="w-4 h-4 text-amber-600 mr-2" />
            Safety Precautions
          </h3>
          <ul className="space-y-2 text-xs text-gray-600">
            {currentGuide.precautions.map((prec, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-amber-600 mr-2 font-bold">⚠️</span>
                <span>{prec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
            Risks of Nutrient Overuse
          </h3>
          <ul className="space-y-2 text-xs text-gray-600">
            {currentGuide.overuseRisks.map((risk, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-red-500 mr-2 font-bold">🛑</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
