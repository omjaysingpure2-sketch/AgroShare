import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Loader2,
  RefreshCw,
  Sprout,
  Paperclip,
  X,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ScanReport } from '../../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  attachedScanName?: string;
}

interface AiChatTabProps {
  savedScans?: ScanReport[];
}

export const AiChatTab: React.FC<AiChatTabProps> = ({ savedScans = [] }) => {
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'model',
      text: `Namaste ${user?.fullName || 'Farmer'}! I am your AgriShare AI Farming Advisor. How can I assist you with crop health, fertilizer scheduling, soil management, or equipment hire today? You can also attach any saved crop scan to discuss specific diagnosis details.`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedScan, setSelectedScan] = useState<ScanReport | null>(null);
  const [showScanPicker, setShowScanPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const promptSuggestions = selectedScan
    ? [
        `What organic treatment can cure this ${selectedScan.cropName} issue?`,
        `How often should I spray the recommended fungicide?`,
        `Can this ${selectedScan.diseaseDetected} infection spread to adjacent rows?`,
        `What dosage of 19:19:19 foliar spray is safest for recovery?`,
      ]
    : [
        'How do I treat yellow curling leaves in tomato?',
        'What is the ideal NPK fertilizer schedule for sugarcane?',
        'Should I hire a rotavator or cultivator for black cotton soil?',
        'How much water is needed per acre using drip irrigation for onions?',
        'Preventive measures against pink bollworm in cotton',
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText: string) => {
    const textToSend = messageText.trim();
    if (!textToSend || isSending) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: 'Just now',
      attachedScanName: selectedScan ? `${selectedScan.cropName} (${selectedScan.diseaseDetected})` : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: historyPayload,
          userContext: {
            fullName: user?.fullName,
            district: user?.district,
            state: user?.state,
            farmAreaAcres: user?.farmAreaAcres,
            role: user?.role,
          },
          attachedScanReport: selectedScan || undefined,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        text: data.reply || 'Here is the recommended agricultural guidance based on your query.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        text: 'I encountered a temporary connection issue. For immediate assistance, refer to the Fertilizer Guide or consult your local agricultural extension officer.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B462C] to-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900">AgriShare AI Farming Assistant</h1>
            <p className="text-xs text-gray-500">
              Powered by Gemini 3.8 Flash • Real-time crop diagnostics & equipment guidance
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setMessages([
              {
                id: 'm1',
                role: 'model',
                text: `Namaste ${user?.fullName || 'Farmer'}! How can I assist you with your crops, soil, or equipment scheduling today?`,
                timestamp: 'Just now',
              },
            ]);
            setSelectedScan(null);
          }}
          className="p-2 text-gray-400 hover:text-emerald-800 rounded-lg hover:bg-gray-100 transition-colors"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {promptSuggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => handleSend(suggestion)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold whitespace-nowrap shadow-2xs transition-colors flex items-center space-x-1"
          >
            <span>{suggestion}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4 sm:p-6 min-h-[460px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                    isUser ? 'bg-[#0B462C]' : 'bg-emerald-700'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#0B462C] text-white shadow-xs'
                      : 'bg-gray-50 border border-gray-200 text-gray-900'
                  }`}
                >
                  {msg.attachedScanName && (
                    <div className="mb-2 px-2.5 py-1 rounded-lg bg-emerald-800/60 border border-emerald-400/40 text-[11px] font-medium text-emerald-100 flex items-center space-x-1">
                      <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Referencing: {msg.attachedScanName}</span>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      isUser ? 'text-emerald-200 text-right' : 'text-gray-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs text-gray-500 flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                <span>Formulating agronomic advice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Scan Report Attachment */}
        <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
          {/* Attached Scan Banner if selected */}
          {selectedScan && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <div className="flex items-center space-x-2">
                <Sprout className="w-4 h-4 text-emerald-700" />
                <span>
                  <strong>Connected Scan:</strong> {selectedScan.cropName} • {selectedScan.diseaseDetected}
                </span>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="p-1 hover:bg-emerald-200 rounded-full"
                title="Remove attachment"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Scan Selection Dropdown Drawer */}
          {showScanPicker && (
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-gray-700">
                <span>Select a Saved Scan Report to discuss:</span>
                <button
                  onClick={() => setShowScanPicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {savedScans.length === 0 ? (
                <p className="text-gray-400 py-1">No saved crop scans available yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                  {savedScans.map((scan) => (
                    <button
                      key={scan.id}
                      onClick={() => {
                        setSelectedScan(scan);
                        setShowScanPicker(false);
                      }}
                      className="p-2 text-left bg-white rounded-xl border border-gray-200 hover:border-emerald-500 flex items-center space-x-2 transition-colors"
                    >
                      <Sprout className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-gray-900 block truncate">{scan.cropName}</span>
                        <span className="text-[10px] text-gray-500 block truncate">{scan.diseaseDetected}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            {savedScans.length > 0 && (
              <button
                type="button"
                onClick={() => setShowScanPicker(!showScanPicker)}
                className={`p-3 rounded-2xl border transition-colors flex items-center justify-center ${
                  selectedScan
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                }`}
                title="Attach saved crop scan report"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            )}

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                selectedScan
                  ? `Ask questions about this ${selectedScan.cropName} diagnosis...`
                  : 'Ask about crops, diseases, rotavators, fertilizers, or soil...'
              }
              className="flex-1 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="p-3 bg-[#0B462C] hover:bg-[#125838] text-white rounded-2xl shadow-md transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
