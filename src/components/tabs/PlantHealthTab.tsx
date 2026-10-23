import React, { useState } from 'react';
import {
  Sprout,
  AlertCircle,
  CheckCircle2,
  Droplets,
  ShoppingBag,
  ShieldCheck,
  Search,
  ArrowRight,
  MessageSquare,
  Plus,
  Calendar,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ScanReport } from '../../types';

interface PlantHealthTabProps {
  scans: ScanReport[];
  onOpenScanner: () => void;
  onAddObservation?: (scanId: string, note: string) => Promise<boolean>;
}

export const PlantHealthTab: React.FC<PlantHealthTabProps> = ({
  scans,
  onOpenScanner,
  onAddObservation,
}) => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [newObservationNote, setNewObservationNote] = useState('');
  const [isSavingObs, setIsSavingObs] = useState(false);

  const selectedScan = scans.find((s) => s.id === selectedScanId) || (scans.length > 0 ? scans[0] : null);

  const handleSaveObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObservationNote.trim() || !selectedScan?.id || !onAddObservation) return;

    setIsSavingObs(true);
    const success = await onAddObservation(selectedScan.id, newObservationNote.trim());
    setIsSavingObs(false);
    if (success) {
      setNewObservationNote('');
    }
  };

  const cropKnowledgeBase: Record<string, any> = {
    Tomato: {
      commonDiseases: ['Early Blight (Alternaria solani)', 'Late Blight (Phytophthora infestans)', 'Leaf Curl Virus', 'Blossom End Rot'],
      healthyIndicators: ['Lush dark-green foliage', 'Sturdy stems without dark cankers', 'Even fruit development without brown sunken bottom'],
      fertilizerGuide: 'NPK 19:19:19 foliar spray every 14 days; calcium nitrate spray at fruit set.',
      wateringGuide: 'Drip irrigation 2 to 3 litres/plant every alternate morning. Avoid wetting leaves to prevent fungal spores.',
      preventiveMeasures: 'Stake plants off soil contact; use mulching; spray neem oil (10,000 ppm) at first sign of whiteflies.',
    },
    Sugarcane: {
      commonDiseases: ['Red Rot (Colletotrichum falcatum)', 'Smut (Sporisorium scitamineum)', 'Grassy Shoot Disease'],
      healthyIndicators: ['Thick erect green leaves', 'Firm cane joints without internal red discoloration or sour smell'],
      fertilizerGuide: 'Basal application: 50 kg Urea + 100 kg SSP + 50 kg MOP per acre. Top dress with Urea at 45 & 90 days.',
      wateringGuide: 'Irrigate every 8-10 days in summer, 12-15 days in winter. Ensure drainage during monsoon.',
      preventiveMeasures: 'Use certified disease-free setts; dip setts in carbendazim solution before planting.',
    },
    Cotton: {
      commonDiseases: ['Bacterial Blight', 'Fusarium Wilt', 'Pink Bollworm infestation'],
      healthyIndicators: ['Broad leaves without angular water-soaked spots', 'Square formation without early drop'],
      fertilizerGuide: 'Apply 120:60:60 NPK kg/ha in 3 split doses. Boron foliar spray at peak squaring.',
      wateringGuide: 'Critical irrigation at squaring and boll formation stages. Avoid water logging.',
      preventiveMeasures: 'Install pheromone traps @ 5 per acre for monitoring bollworm moths.',
    },
    Wheat: {
      commonDiseases: ['Yellow Rust (Puccinia striiformis)', 'Loose Smut', 'Powdery Mildew'],
      healthyIndicators: ['Bright green tillers without yellow powdery pustules', 'Uniform head emergence'],
      fertilizerGuide: '120 kg Nitrogen + 60 kg P2O5 + 40 kg K2O per hectare. Apply zinc sulphate in deficient soils.',
      wateringGuide: '5-6 irrigations at Crown Root Initiation (21 days), tillering, flowering, and grain filling stages.',
      preventiveMeasures: 'Grow rust-resistant varieties like HD-2967, DBW-187; treat seeds with Thiram before sowing.',
    },
    Soybean: {
      commonDiseases: ['Yellow Mosaic Virus', 'Charcoal Rot', 'Rust'],
      healthyIndicators: ['Vigorous trifoliate leaves without yellow netting', 'Active root nodules (pink inside)'],
      fertilizerGuide: '20 kg N + 60 kg P2O5 + 40 kg K2O + 20 kg Sulphur per hectare. Inoculate with Rhizobium culture.',
      wateringGuide: 'Requires adequate moisture at flowering and pod development stages.',
      preventiveMeasures: 'Destroy volunteer crop host plants; spray thiomethoxam for whitefly vector control.',
    },
  };

  const cropData = cropKnowledgeBase[selectedCrop] || cropKnowledgeBase['Tomato'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Sprout className="w-4 h-4" />
            <span>Crop Health & Pathology Center</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Plant Health & Field Observation Tracker</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Track diagnostic scan results, record farmer field observations, and follow structured recovery plans.
          </p>
        </div>
        <button
          onClick={onOpenScanner}
          className="px-4 py-2.5 bg-[#0B462C] hover:bg-[#125838] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
        >
          <span>Open AI Scanner</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Crop Selector Pills */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Select Crop to Inspect</label>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {Object.keys(cropKnowledgeBase).map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCrop === crop
                  ? 'bg-[#0B462C] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Disease & Health Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center">
            <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
            Common Diseases in {selectedCrop}
          </h3>
          <ul className="space-y-2 text-xs text-gray-600">
            {cropData.commonDiseases.map((dis: string, i: number) => (
              <li key={i} className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 font-medium">
                ⚠️ {dis}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
            Healthy Crop Indicators
          </h3>
          <ul className="space-y-2 text-xs text-gray-600">
            {cropData.healthyIndicators.map((ind: string, i: number) => (
              <li key={i} className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 font-medium text-emerald-950">
                🌱 {ind}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <h3 className="text-sm font-bold text-gray-900 flex items-center">
            <ShoppingBag className="w-4 h-4 text-orange-600 mr-2" />
            Nutrient & Fertilizer Management
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed bg-orange-50/50 p-3 rounded-xl border border-orange-100">
            {cropData.fertilizerGuide}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <h3 className="text-sm font-bold text-gray-900 flex items-center">
            <Droplets className="w-4 h-4 text-blue-600 mr-2" />
            Irrigation & Water Schedule
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            {cropData.wateringGuide}
          </p>
        </div>
      </div>

      {/* Saved Diagnostic Records & Follow-Up Observation Center */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900">Crop Health Diagnostic History & Follow-Up</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Select a previous scan to inspect pathology details, enter field observations, or track recovery progress.
          </p>
        </div>

        {scans.length === 0 ? (
          <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-2xl text-xs text-gray-400">
            <Sprout className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-bold text-gray-700">No plant scans recorded yet.</p>
            <p className="mt-1">Use the Plant Scanner tab to photograph your crops and generate initial AI diagnostic records.</p>
            <button
              onClick={onOpenScanner}
              className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
            >
              Scan a Plant Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Scan Selector Pills / Row */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {scans.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScanId(s.id || null)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-2 border ${
                    (selectedScan?.id === s.id)
                      ? 'bg-[#0B462C] text-white border-[#0B462C] shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-bold">{s.cropName}</span>
                  <span className="text-[10px] opacity-80">({s.diseaseDetected})</span>
                </button>
              ))}
            </div>

            {selectedScan && (
              <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-5">
                {/* Scan Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-200">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-black text-gray-900">{selectedScan.cropName}</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          selectedScan.healthStatus === 'Healthy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {selectedScan.healthStatus}
                      </span>
                      {selectedScan.severity && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-800">
                          Severity: {selectedScan.severity}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 font-medium">
                      Condition Assessment: <strong className="text-gray-900">{selectedScan.diseaseDetected}</strong>
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    Scanned on {new Date(selectedScan.scannedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Positive Findings & Observed Symptoms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-1.5">
                    <span className="font-bold text-emerald-800 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Positive Findings (Healthy Plant Parts)
                    </span>
                    <ul className="space-y-1 text-gray-600 pl-5 list-disc">
                      {(selectedScan.positiveFindings || ['Main foliage and stem tissue show viable vigor']).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-1.5">
                    <span className="font-bold text-amber-800 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1.5" />
                      Observed Foliar Symptoms
                    </span>
                    <ul className="space-y-1 text-gray-600 pl-5 list-disc">
                      {(selectedScan.symptoms || ['Visible foliar stress']).map((sym, i) => (
                        <li key={i}>{sym}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Suggested Treatment & Prevention */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 text-xs space-y-2">
                  <span className="font-bold text-gray-900 block">Suggested Treatment & Cultural Prevention:</span>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Treatment:</strong> {(selectedScan.treatment || selectedScan.recommendations || []).join('; ') || 'Maintain regular scouting and balanced moisture.'}
                  </p>
                  {selectedScan.prevention && (
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Prevention:</strong> {selectedScan.prevention.join('; ')}
                    </p>
                  )}
                </div>

                {/* Uncertainty & Medical/Lab Disclaimer */}
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Diagnostic Uncertainty & Expert Follow-Up Notice:</span>
                    <p className="mt-0.5 text-[11px] leading-relaxed">
                      {selectedScan.uncertaintyNotes || 'Visual inspection provides rapid symptomatic guidance. It does not replace microscopic laboratory testing.'}
                      {' '}If symptoms persist or worsen over the next 48-72 hours, a follow-up scan or examination by your local Krishi Vigyan Kendra (KVK) is strongly advised.
                    </p>
                  </div>
                </div>

                {/* Actionable Farming Recommendations (3-Tier Plan) */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center">
                    <Calendar className="w-4 h-4 text-emerald-700 mr-1.5" />
                    Recommended Recovery Action Plan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-white rounded-xl border border-gray-200">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 inline-block mb-1">
                        Immediate (Day 0-1)
                      </span>
                      <p className="text-gray-700">
                        {selectedScan.recommendations?.[0] || 'Prune severely infected lower leaves and safely dispose off-field.'}
                      </p>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-gray-200">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-800 inline-block mb-1">
                        Short-Term (Day 2-5)
                      </span>
                      <p className="text-gray-700">
                        {selectedScan.recommendations?.[1] || 'Apply targeted foliar spray in early morning; avoid evening sprinkler wetness.'}
                      </p>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-gray-200">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800 inline-block mb-1">
                        Preventive (Future)
                      </span>
                      <p className="text-gray-700">
                        {selectedScan.prevention?.[0] || 'Enforce crop rotation and clean drip line sanitation to stop fungal spores.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Farmer Field Observations & Follow-Up Tracker */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 flex items-center">
                      <MessageSquare className="w-4 h-4 text-emerald-700 mr-1.5" />
                      Farmer Field Follow-Up Observations
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {selectedScan.userObservations?.length || 0} note(s) logged
                    </span>
                  </div>

                  {/* Existing Observations Log */}
                  {selectedScan.userObservations && selectedScan.userObservations.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedScan.userObservations.map((obs) => (
                        <div key={obs.id} className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                            <span className="font-bold text-gray-700">Field Note</span>
                            <span>{new Date(obs.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-800">{obs.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      No field follow-up observations logged yet. Add your post-treatment observations below.
                    </p>
                  )}

                  {/* Add New Observation Input */}
                  <form onSubmit={handleSaveObservation} className="flex gap-2 pt-2 border-t border-gray-100">
                    <input
                      type="text"
                      value={newObservationNote}
                      onChange={(e) => setNewObservationNote(e.target.value)}
                      placeholder="e.g. Sprayed bio-fungicide on Tuesday; top leaves look greener, lesions halted."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={!newObservationNote.trim() || isSavingObs}
                      className="px-4 py-2 bg-[#0B462C] hover:bg-[#125838] text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-40 flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isSavingObs ? 'Saving...' : 'Add Note'}</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
