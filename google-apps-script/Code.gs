/**
 * GiveNear — Google Apps Script Backend API
 * Topic: Donation & Resource Matching for NGOs (CEP Project)
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Ensure Sheet 1 is renamed to: "Donations"
 * 3. Add a second tab named: "NgoNeeds"
 * 4. Go to Extensions > Apps Script.
 * 5. Replace everything with this code.
 * 6. Click 'Deploy' > 'New deployment'.
 * 7. Select type: 'Web app'.
 * 8. Configuration:
 *    - Description: "GiveNear API v1"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (Critical for browser API calls)
 * 9. Click Deploy and copy the Web App URL!
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

    return createJsonResponse({ status: "error", message: "Unknown action requested: " + action });
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

    // 1. Create a new donation post
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

      return createJsonResponse({ status: "success", message: "Donation listing recorded successfully!", id: newId });
    }

    // 2. NGO Claims an item for pickup
    if (action === "claimDonation") {
      var cSheet = ss.getSheetByName("Donations");
      var allRows = cSheet.getDataRange().getValues();
      var targetId = payload.id;
      var claimedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      var rowIndex = -1;

      for (var r = 1; r < allRows.length; r++) {
        if (allRows[r][0] == targetId) {
          rowIndex = r + 1; // 1-indexed for SpreadsheetApp
          break;
        }
      }

      if (rowIndex === -1) {
        return createJsonResponse({ status: "error", message: "Donation ID not found: " + targetId });
      }

      // Column indices (1-indexed):
      // 15: status, 16: claimedByNgo, 17: ngoRepresentative, 18: ngoPhone, 19: pickupDate, 20: claimedAt
      cSheet.getRange(rowIndex, 15).setValue("claimed");
      cSheet.getRange(rowIndex, 16).setValue(payload.ngoName || "");
      cSheet.getRange(rowIndex, 17).setValue(payload.ngoRepresentative || "");
      cSheet.getRange(rowIndex, 18).setValue(payload.ngoPhone || "");
      cSheet.getRange(rowIndex, 19).setValue(payload.pickupDate || "");
      cSheet.getRange(rowIndex, 20).setValue(claimedAt);

      return createJsonResponse({ 
        status: "success", 
        message: "Item marked as Claimed for pickup by " + (payload.ngoName || "NGO") + "!",
        id: targetId 
      });
    }

    // 3. NGO Posts a verified need
    if (action === "createNeed") {
      var nSheet = ss.getSheetByName("NgoNeeds");
      if (!nSheet) {
        setupHeaders();
        nSheet = ss.getSheetByName("NgoNeeds");
      }

      var nd = payload.data;
      var needId = nd.id || ("NEED-" + Math.floor(100 + Math.random() * 900));

      nSheet.appendRow([
        needId,
        nd.ngoName || "",
        nd.regNumber || "",
        nd.city || "",
        nd.location || "",
        nd.representative || "",
        nd.phone || "",
        nd.title || "",
        nd.category || "Other Essentials",
        nd.urgency || "High",
        nd.quantityNeeded || "",
        nd.reason || "",
        nd.targetDate || "",
        "Open",
        ""
      ]);

      return createJsonResponse({ status: "success", message: "NGO Requirement posted successfully!", id: needId });
    }

    return createJsonResponse({ status: "error", message: "Unsupported POST action: " + action });

  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
