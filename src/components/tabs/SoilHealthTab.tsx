import React, { useState } from 'react';
import { Mountain, CheckCircle2, AlertCircle, FileText, Upload, Sparkles, Info, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SoilReportRecord } from '../../types';

interface SoilHealthTabProps {
  onSaveSoilReport: (report: SoilReportRecord) => void;
  savedSoilReports: SoilReportRecord[];
}

export const SoilHealthTab: React.FC<SoilHealthTabProps> = ({
  onSaveSoilReport,
  savedSoilReports,
}) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    cropName: 'Sugarcane',
    soilType: 'Medium Black Soil (Vertisol)',
    ph: '7.2',
    nitrogen: 'Medium (280 kg/ha)',
    phosphorus: 'Low (14 kg/ha)',
    potassium: 'High (340 kg/ha)',
    moisture: '28% (Optimal)',
    season: 'Kharif',
  });

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  const handleAnalyzeSoil = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const phNum = parseFloat(formData.ph) || 7.0;
      let phStatus = 'Neutral (Optimal)';
      if (phNum < 6.0) phStatus = 'Acidic';
      else if (phNum > 7.8) phStatus = 'Alkaline';

      const report: SoilReportRecord = {
        id: `soil_${Date.now()}`,
        userId: user?.id || 'farmer',
        cropName: formData.cropName,
        soilType: formData.soilType,
        ph: phNum,
        nitrogen: formData.nitrogen,
        phosphorus: formData.phosphorus,
        potassium: formData.potassium,
        moisture: formData.moisture,
        summary: `Soil analysis for ${formData.cropName} on ${formData.soilType}: Measured pH is ${phNum} (${phStatus}). Nitrogen is ${formData.nitrogen}, phosphorus is ${formData.phosphorus}, and potassium is ${formData.potassium}.`,
        recommendations: [
          phNum > 7.8
            ? 'Apply Gypsum @ 500 kg/acre to reduce soil salinity and improve calcium permeability.'
            : phNum < 6.0
            ? 'Apply agricultural lime @ 300 kg/acre to neutralize acidity.'
            : 'Soil pH is well-balanced for nutrient uptake.',
          formData.phosphorus.toLowerCase().includes('low')
            ? 'Phosphorus deficit detected: Band-place Single Super Phosphate (SSP) @ 50 kg/acre at root zone during sowing.'
            : 'Maintain standard phosphorus maintenance application.',
          'Incorporate 2-3 tonnes of decomposed Farm Yard Manure (FYM) per acre to enhance organic carbon.',
        ],
        createdAt: new Date().toISOString(),
      };

      setAnalysisResult(report);
      onSaveSoilReport(report);
      setIsAnalyzing(false);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
          <Mountain className="w-4 h-4" />
          <span>Soil Agronomy & Lab Test Guidance</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">Soil Health & Nutrient Profiling</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Input your certified laboratory soil test parameters or test card values to receive calibrated fertilizer and amendment recommendations.
        </p>
      </div>

      {/* Critical Scientific Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Accurate Soil Science Notice</p>
          <p className="mt-0.5 leading-relaxed">
            Ordinary camera photographs cannot determine chemical soil pH, nitrogen, phosphorus, or potassium values. Please enter laboratory-measured test values from your Soil Health Card (SHC) or upload your lab report PDF/slip.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Form Column (7 cols) */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Enter Soil Test Card Values</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Crop</label>
              <input
                type="text"
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Soil Type</label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
              >
                <option value="Medium Black Soil (Vertisol)">Medium Black Soil</option>
                <option value="Deep Black Cotton Soil">Deep Black Cotton Soil</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
                <option value="Red Sandy Loam">Red Sandy Loam</option>
                <option value="Clay Loam">Clay Loam</option>
                <option value="Laterite Soil">Laterite Soil</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Measured Soil pH (0-14)</label>
              <input
                type="number"
                step="0.1"
                min="3"
                max="11"
                value={formData.ph}
                onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Soil Moisture</label>
              <input
                type="text"
                value={formData.moisture}
                onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
                placeholder="e.g. 28% Optimal"
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Nitrogen (N)</label>
              <select
                value={formData.nitrogen}
                onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                className="w-full px-2 py-1.5 text-xs rounded-xl border border-gray-300 bg-white"
              >
                <option value="Low (<280 kg/ha)">Low</option>
                <option value="Medium (280 kg/ha)">Medium</option>
                <option value="High (>560 kg/ha)">High</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Phosphorus (P)</label>
              <select
                value={formData.phosphorus}
                onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                className="w-full px-2 py-1.5 text-xs rounded-xl border border-gray-300 bg-white"
              >
                <option value="Low (14 kg/ha)">Low</option>
                <option value="Medium (25 kg/ha)">Medium</option>
                <option value="High (>50 kg/ha)">High</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Potassium (K)</label>
              <select
                value={formData.potassium}
                onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                className="w-full px-2 py-1.5 text-xs rounded-xl border border-gray-300 bg-white"
              >
                <option value="Low (<120 kg/ha)">Low</option>
                <option value="Medium (220 kg/ha)">Medium</option>
                <option value="High (340 kg/ha)">High</option>
              </select>
            </div>
          </div>

          {/* Upload Soil Report Slip */}
          <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
            <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-600 font-medium">
              {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Attach Soil Health Card / Lab Test Slip'}
            </p>
            <label className="mt-2 inline-block px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg text-xs font-semibold cursor-pointer">
              Choose File
              <input type="file" accept=".pdf,image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <button
            onClick={handleAnalyzeSoil}
            disabled={isAnalyzing}
            className="w-full py-2.5 bg-[#0B462C] hover:bg-[#125838] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Computing Agronomic Assessment...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Soil Health Assessment</span>
              </>
            )}
          </button>
        </div>

        {/* Results Column (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Soil Health Summary</h3>

            {analysisResult ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium leading-relaxed">
                  {analysisResult.summary}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase mb-1.5">Actionable Recommendations:</h4>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {analysisResult.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="text-emerald-700 mr-1.5 font-bold">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-400 border border-dashed border-gray-100 rounded-xl">
                Enter your soil test parameters on the left and click Generate Assessment to view crop-specific soil amendments.
              </div>
            )}
          </div>

          {/* Past Soil Tests */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Previous Soil Tests</h4>
            {savedSoilReports.length === 0 ? (
              <p className="text-xs text-gray-400">No previous reports recorded.</p>
            ) : (
              <div className="space-y-2">
                {savedSoilReports.slice(0, 3).map((r) => (
                  <div key={r.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <span className="font-bold text-gray-900">{r.cropName}</span> ({r.soilType}) • pH {r.ph}
                    <span className="block text-[10px] text-gray-400 mt-0.5">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
