import React, { useState } from 'react';
import type { SyncConfig } from '../types';
import { testSheetConnection } from '../services/api';
import { 
  FileSpreadsheet, Copy, Check, 
  Terminal, CheckCircle2, AlertCircle, RefreshCw 
} from 'lucide-react';

interface GoogleSheetSetupProps {
  config: SyncConfig;
  onSaveConfig: (newConfig: SyncConfig) => void;
  onRefreshData?: () => Promise<void>;
}

const APPS_SCRIPT_CODE = `/**
 * GiveNear — Google Apps Script Backend API
 * Topic: Donation & Resource Matching for NGOs (CEP Project)
 *
 * Setup:
 * 1. Open your Google Sheet.
 * 2. Ensure Sheet 1 is named: "Donations"
 * 3. Add second sheet tab named: "NgoNeeds"
 * 4. Go to Extensions > Apps Script, paste this entire file.
 * 5. Deploy > New Deployment > Web app.
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (Required!)
 * 6. Copy Web App URL & paste into GiveNear.
 */

function setupHeaders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Sheet 1: Donations
  var donationSheet = ss.getSheetByName("Donations");
  if (!donationSheet) {
    donationSheet = ss.insertSheet("Donations");
  }
  if (donationSheet.getLastRow() === 0) {
    donationSheet.appendRow([
      "id", "timestamp", "title", "category", "quantity", "condition", 
      "location", "city", "lat", "lng", "donorName", "donorPhone", 
      "pickupTimes", "notes", "status", "claimedByNgo", "ngoRepresentative", 
      "ngoPhone", "pickupDate", "claimedAt"
    ]);
    donationSheet.getRange(1, 1, 1, 20).setFontWeight("bold").setBackground("#EBF2EE");
  }

  // Sheet 2: NgoNeeds
  var needSheet = ss.getSheetByName("NgoNeeds");
  if (!needSheet) {
    needSheet = ss.insertSheet("NgoNeeds");
  }
  if (needSheet.getLastRow() === 0) {
    needSheet.appendRow([
      "id", "ngoName", "regNumber", "city", "location", "representative", 
      "phone", "title", "category", "urgency", "quantityNeeded", 
      "reason", "targetDate", "status", "fulfilledBy"
    ]);
    needSheet.getRange(1, 1, 1, 15).setFontWeight("bold").setBackground("#FDF4E5");
  }
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getDonations";
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    if (action === "test") {
      return createJsonResponse({
        status: "success",
        message: "GiveNear Google Apps Script API is online and responding!",
        timestamp: new Date().toISOString()
      });
    }

    if (action === "getDonations") {
      var sheet = ss.getSheetByName("Donations");
      if (!sheet) {
        setupHeaders();
        sheet = ss.getSheetByName("Donations");
      }
      var rows = sheet.getDataRange().getValues();
      var data = [];
      if (rows.length > 1) {
        var headers = rows[0];
        for (var i = 1; i < rows.length; i++) {
          var item = {};
          for (var j = 0; j < headers.length; j++) {
            item[headers[j]] = rows[i][j];
          }
          data.push(item);
        }
      }
      return createJsonResponse({ status: "success", count: data.length, donations: data });
    }

    if (action === "getNeeds") {
      var needSheet = ss.getSheetByName("NgoNeeds");
      if (!needSheet) {
        setupHeaders();
        needSheet = ss.getSheetByName("NgoNeeds");
      }
      var needRows = needSheet.getDataRange().getValues();
      var needs = [];
      if (needRows.length > 1) {
        var nHeaders = needRows[0];
        for (var k = 1; k < needRows.length; k++) {
          var nItem = {};
          for (var m = 0; m < nHeaders.length; m++) {
            nItem[nHeaders[m]] = needRows[k][m];
          }
          needs.push(nItem);
        }
      }
      return createJsonResponse({ status: "success", count: needs.length, needs: needs });
    }

    return createJsonResponse({ status: "error", message: "Unknown action: " + action });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);
    var action = payload.action;

    if (action === "createDonation") {
      var sheet = ss.getSheetByName("Donations");
      if (!sheet) {
        setupHeaders();
        sheet = ss.getSheetByName("Donations");
      }

      var d = payload.data;
      var newId = d.id || ("DON-" + Math.floor(100 + Math.random() * 900));
      var timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

      sheet.appendRow([
        newId,
        timestamp,
        d.title || "",
        d.category || "Other Essentials",
        d.quantity || "1 unit",
        d.condition || "Good Working Condition",
        d.location || "",
        d.city || "",
        Number(d.lat) || 0,
        Number(d.lng) || 0,
        d.donorName || "Anonymous Donor",
        d.donorPhone || "",
        d.pickupTimes || "",
        d.notes || "",
        "available",
        "", "", "", "", ""
      ]);

      return createJsonResponse({ status: "success", message: "Donation listing recorded!", id: newId });
    }

    if (action === "claimDonation") {
      var cSheet = ss.getSheetByName("Donations");
      var allRows = cSheet.getDataRange().getValues();
      var targetId = payload.id;
      var claimedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      var rowIndex = -1;

      for (var r = 1; r < allRows.length; r++) {
        if (allRows[r][0] == targetId) {
          rowIndex = r + 1;
          break;
        }
      }

      if (rowIndex === -1) {
        return createJsonResponse({ status: "error", message: "Donation ID not found: " + targetId });
      }

      cSheet.getRange(rowIndex, 15).setValue("claimed");
      cSheet.getRange(rowIndex, 16).setValue(payload.ngoName || "");
      cSheet.getRange(rowIndex, 17).setValue(payload.ngoRepresentative || "");
      cSheet.getRange(rowIndex, 18).setValue(payload.ngoPhone || "");
      cSheet.getRange(rowIndex, 19).setValue(payload.pickupDate || "");
      cSheet.getRange(rowIndex, 20).setValue(claimedAt);

      return createJsonResponse({ status: "success", message: "Marked as Claimed!", id: targetId });
    }

    return createJsonResponse({ status: "error", message: "Unsupported POST action: " + action });

  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;

export const GoogleSheetSetup: React.FC<GoogleSheetSetupProps> = ({ 
  config, 
  onSaveConfig
}) => {
  const [urlInput, setUrlInput] = useState(config.webAppUrl);
  const [useLive, setUseLive] = useState(config.useLiveSheet);
  const [copiedCode, setCopiedCode] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleTestConnection = async () => {
    if (!urlInput.trim()) {
      setTestResult({ success: false, message: 'Please enter a Web App URL first.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSheetConnection(urlInput.trim());
      setTestResult(res);
      if (res.success) {
        setUseLive(true);
        onSaveConfig({
          ...config,
          webAppUrl: urlInput.trim(),
          useLiveSheet: true,
          lastSynced: new Date().toLocaleTimeString()
        });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Connection test failed' });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveToggle = (enabled: boolean) => {
    setUseLive(enabled);
    onSaveConfig({
      ...config,
      webAppUrl: urlInput.trim(),
      useLiveSheet: enabled,
      lastSynced: new Date().toLocaleTimeString()
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FFFFFF] border border-[#D9DCD2] p-6 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1F4D3D] uppercase tracking-wider mb-1">
          <FileSpreadsheet className="w-4 h-4 text-[#E8A33D]" />
          Zero-Cost Serverless Backend Integration
        </div>
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1A211E]">
          Google Sheets &amp; Apps Script Architecture
        </h2>
        <p className="text-sm text-[#58655E] mt-1 max-w-2xl">
          Connect your personal Google Sheet to act as a free real-time database. When donors post items or NGOs claim pickups, rows are created and updated instantly in your spreadsheet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Connection & Test */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-[#FFFFFF] border border-[#D9DCD2] p-6 rounded-2xl shadow-2xs space-y-5">
            <h3 className="font-serif-heading text-lg font-bold text-[#1A211E] flex items-center justify-between">
              <span>Connect Your Deployed Web App</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                useLive && config.webAppUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {useLive && config.webAppUrl ? 'Live Sheet Active' : 'Local Demo Mode'}
              </span>
            </h3>

            {/* Mode switch */}
            <div className="bg-[#F3F4EE] border border-[#D9DCD2] p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1A211E]">Database Storage Mode</div>
                  <div className="text-[11px] text-[#58655E]">
                    {useLive 
                      ? 'Reading & writing to live Google Sheet via Apps Script API' 
                      : 'Storing data in browser localStorage (Offline / Demo)'}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useLive}
                    onChange={(e) => handleSaveToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1F4D3D]"></div>
                </label>
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider">
                Google Apps Script Web App URL
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl text-xs text-[#1A211E] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="bg-[#1F4D3D] hover:bg-[#173B2E] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  {testing ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
              <p className="text-[11px] text-[#828F87]">
                Must end with <code>/exec</code>. Make sure "Who has access" was set to "Anyone" when deploying.
              </p>
            </div>

            {/* Test Feedback */}
            {testResult && (
              <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in ${
                testResult.success 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50 border border-rose-200 text-rose-900'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{testResult.success ? 'Success!' : 'Connection Warning'}</div>
                  <div className="text-[11px] mt-0.5">{testResult.message}</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Guide Accordion */}
          <div className="bg-[#FFFFFF] border border-[#D9DCD2] p-6 rounded-2xl shadow-2xs space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#1A211E]">
              4-Step Quick Deployment Guide
            </h3>

            <div className="space-y-3 text-xs">
              <div 
                onClick={() => setActiveStep(1)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeStep === 1 ? 'bg-[#EBF2EE] border-[#1F4D3D]/30' : 'bg-[#F3F4EE] border-[#D9DCD2]'
                }`}
              >
                <div className="font-bold text-[#1F4D3D] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1F4D3D] text-white flex items-center justify-center text-[10px]">1</span>
                  Create Sheet with Two Tabs
                </div>
                {activeStep === 1 && (
                  <div className="mt-2 text-[#58655E] space-y-1 pl-7">
                    Create a new Google Sheet. Name Tab 1: <strong>Donations</strong> and Tab 2: <strong>NgoNeeds</strong>. The script will automatically format and bold the header rows on first run!
                  </div>
                )}
              </div>

              <div 
                onClick={() => setActiveStep(2)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeStep === 2 ? 'bg-[#EBF2EE] border-[#1F4D3D]/30' : 'bg-[#F3F4EE] border-[#D9DCD2]'
                }`}
              >
                <div className="font-bold text-[#1F4D3D] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1F4D3D] text-white flex items-center justify-center text-[10px]">2</span>
                  Open Extensions &gt; Apps Script
                </div>
                {activeStep === 2 && (
                  <div className="mt-2 text-[#58655E] space-y-1 pl-7">
                    In your Google Sheet top menu, click <strong>Extensions</strong> &rarr; <strong>Apps Script</strong>. Delete any default code in <code>Code.gs</code>.
                  </div>
                )}
              </div>

              <div 
                onClick={() => setActiveStep(3)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeStep === 3 ? 'bg-[#EBF2EE] border-[#1F4D3D]/30' : 'bg-[#F3F4EE] border-[#D9DCD2]'
                }`}
              >
                <div className="font-bold text-[#1F4D3D] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1F4D3D] text-white flex items-center justify-center text-[10px]">3</span>
                  Paste Script &amp; Click Save
                </div>
                {activeStep === 3 && (
                  <div className="mt-2 text-[#58655E] space-y-1 pl-7">
                    Copy the complete code from the right panel and paste it into <code>Code.gs</code>, then press <strong>Ctrl+S</strong> to save.
                  </div>
                )}
              </div>

              <div 
                onClick={() => setActiveStep(4)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeStep === 4 ? 'bg-[#EBF2EE] border-[#1F4D3D]/30' : 'bg-[#F3F4EE] border-[#D9DCD2]'
                }`}
              >
                <div className="font-bold text-[#1F4D3D] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1F4D3D] text-white flex items-center justify-center text-[10px]">4</span>
                  Deploy as Web App
                </div>
                {activeStep === 4 && (
                  <div className="mt-2 text-[#58655E] space-y-1 pl-7">
                    Click <strong>Deploy</strong> &rarr; <strong>New deployment</strong> &rarr; select <strong>Web app</strong>.<br />
                    • Execute as: <strong>Me</strong><br />
                    • Who has access: <strong>Anyone</strong> (crucial so frontend can fetch without Google OAuth prompts).<br />
                    Copy the resulting URL into the box above!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Box */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#D9DCD2] rounded-2xl shadow-2xs overflow-hidden flex flex-col">
          <div className="bg-[#1A211E] text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Terminal className="w-4 h-4 text-[#E8A33D]" />
              <span>google-apps-script/Code.gs</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="bg-[#1F4D3D] hover:bg-[#173B2E] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Entire Code'}</span>
            </button>
          </div>

          <div className="p-4 bg-[#141816] text-zinc-300 font-mono text-xs overflow-x-auto max-h-[580px] scrollbar-thin">
            <pre><code>{APPS_SCRIPT_CODE}</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
};
