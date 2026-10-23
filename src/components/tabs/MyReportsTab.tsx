import React, { useState } from 'react';
import { FileText, Trash2, Printer, Sprout, Mountain, CheckCircle2, AlertTriangle, Eye, X, MessageSquare } from 'lucide-react';
import { ScanReport, SoilReportRecord } from '../../types';

interface MyReportsTabProps {
  scans: ScanReport[];
  soilReports: SoilReportRecord[];
  onDeleteScan: (scanId: string) => void;
  onDiscussWithAi?: (scan: ScanReport) => void;
}

export const MyReportsTab: React.FC<MyReportsTabProps> = ({
  scans,
  soilReports,
  onDeleteScan,
  onDiscussWithAi,
}) => {
  const [selectedScan, setSelectedScan] = useState<ScanReport | null>(null);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
            <FileText className="w-4 h-4" />
            <span>Diagnostic Archive</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">My Reports & Farm Records</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review your saved plant pathology diagnoses, soil health analyses, and agronomic recommendations.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Archive</span>
        </button>
      </div>

      {/* Plant Scan Reports Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center">
          <Sprout className="w-5 h-5 text-emerald-700 mr-2" />
          Plant Health & Disease Scan Reports ({scans.length})
        </h2>

        {scans.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
            No plant scans saved yet. Run the Plant Scanner to generate diagnostic reports.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {scans.map((scan) => (
              <div key={scan.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  {scan.imageUrl ? (
                    <img src={scan.imageUrl} alt={scan.cropName} className="w-14 h-14 rounded-xl object-cover border border-gray-200" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      {scan.cropName.substring(0, 2)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-gray-900">{scan.cropName}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          scan.healthStatus === 'Healthy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {scan.healthStatus}
                      </span>
                      <span className="text-xs text-gray-500 font-semibold">• {scan.diseaseDetected}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Scanned: {new Date(scan.scannedAt).toLocaleDateString()} at{' '}
                      {new Date(scan.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Confidence: {scan.confidenceScore}%</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  {onDiscussWithAi && (
                    <button
                      onClick={() => onDiscussWithAi(scan)}
                      className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-lg border border-teal-200 flex items-center space-x-1"
                      title="Discuss this diagnostic report with AgriShare AI"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask AI</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedScan(scan)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => setReportToDelete(scan.id || null)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Soil Health Reports Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center">
          <Mountain className="w-5 h-5 text-amber-800 mr-2" />
          Soil Condition & Chemistry Reports ({soilReports.length})
        </h2>

        {soilReports.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
            No soil health assessments recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {soilReports.map((soil) => (
              <div key={soil.id} className="py-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900">{soil.cropName} Soil Assessment</h4>
                  <span className="text-xs text-gray-400">
                    {new Date(soil.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Soil: <strong>{soil.soilType}</strong> • Measured pH: <strong>{soil.ph}</strong>
                </p>
                <p className="text-xs text-emerald-900 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 mt-2">
                  {soil.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Modal for Plant Scan Report */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase">{selectedScan.cropName}</span>
                <h3 className="text-xl font-black text-gray-900 mt-0.5">{selectedScan.diseaseDetected}</h3>
                <p className="text-xs text-gray-500">
                  Scanned on {new Date(selectedScan.scannedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {selectedScan.imageUrl && (
                <img
                  src={selectedScan.imageUrl}
                  alt={selectedScan.cropName}
                  className="w-full h-48 object-cover rounded-2xl border border-gray-200"
                />
              )}

              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-gray-700">Health Status:</span>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                  {selectedScan.healthStatus}
                </span>
                {selectedScan.severity && selectedScan.severity !== 'None' && (
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-900">
                    Severity: {selectedScan.severity}
                  </span>
                )}
                <span className="text-gray-400">• Confidence: {selectedScan.confidenceScore}%</span>
              </div>

              {selectedScan.positiveFindings && selectedScan.positiveFindings.length > 0 && (
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase mb-1">Positive Findings</h4>
                  <ul className="text-xs text-emerald-950 space-y-1">
                    {selectedScan.positiveFindings.map((p: string, i: number) => (
                      <li key={i}>✓ {p}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <h4 className="text-xs font-bold text-gray-800 uppercase mb-1">Observed Symptoms</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {selectedScan.symptoms?.map((s: string, i: number) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              {selectedScan.possibleCauses && selectedScan.possibleCauses.length > 0 && (
                <div className="bg-orange-50/50 p-3.5 rounded-xl border border-orange-200">
                  <h4 className="text-xs font-bold text-orange-900 uppercase mb-1">Possible Causes</h4>
                  <ul className="text-xs text-orange-950 space-y-1">
                    {selectedScan.possibleCauses.map((c: string, i: number) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedScan.treatment && selectedScan.treatment.length > 0 && (
                <div className="bg-red-50/50 p-3.5 rounded-xl border border-red-200">
                  <h4 className="text-xs font-bold text-red-900 uppercase mb-1">Curative Treatment</h4>
                  <ul className="text-xs text-red-950 space-y-1">
                    {selectedScan.treatment.map((t: string, i: number) => (
                      <li key={i}>▶ {t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedScan.prevention && selectedScan.prevention.length > 0 && (
                <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-200">
                  <h4 className="text-xs font-bold text-teal-900 uppercase mb-1">Preventive Practices</h4>
                  <ul className="text-xs text-teal-950 space-y-1">
                    {selectedScan.prevention.map((pv: string, i: number) => (
                      <li key={i}>✓ {pv}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                <h4 className="text-xs font-bold text-emerald-900 uppercase mb-1">Recommended Next Steps</h4>
                <ul className="text-xs text-emerald-950 space-y-1">
                  {selectedScan.recommendations?.map((r: string, i: number) => (
                    <li key={i}>✓ {r}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200">
                <h4 className="text-xs font-bold text-amber-900 uppercase mb-1">Fertilizer Advice</h4>
                <ul className="text-xs text-amber-950 space-y-1">
                  {selectedScan.fertilizerAdvice?.map((f: string, i: number) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>

              {selectedScan.uncertaintyNotes && (
                <p className="text-[11px] text-gray-500 italic p-2 bg-gray-50 rounded-lg">
                  Note: {selectedScan.uncertaintyNotes}
                </p>
              )}

              <button
                onClick={() => setSelectedScan(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl mt-2"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Delete Scan Report?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              This action cannot be undone. The diagnostic history record will be permanently removed.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setReportToDelete(null)}
                className="w-1/2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteScan(reportToDelete);
                  setReportToDelete(null);
                }}
                className="w-1/2 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
