/**
 * FoundIt - Client Store & Data Structures Simulation Coordinator
 * 
 * Provides responsive client-side state, local persistence, and
 * visual reflection of the C++ data structures (Hash Table, Linked List,
 * FIFO Queue, LIFO Stack, Array).
 */

class FoundItStore {
  constructor() {
    this.STORAGE_KEY = 'foundit_reports_v1';
    this.AUDIT_KEY = 'foundit_audit_log_v1';
    this.CLAIMS_KEY = 'foundit_claims_v1';
    this.STACK_KEY = 'foundit_undo_stack_v1';

    this.reports = [];
    this.hashTableBuckets = new Array(16).fill(null).map(() => []);
    this.reviewQueue = [];
    this.undoStack = [];
    this.auditLogs = [];
    this.claims = [];

    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.reports = JSON.parse(saved);
      } catch (e) {
        this.reports = [...window.FOUNDIT_DATA.SEED_REPORTS];
      }
    } else {
      this.reports = [...window.FOUNDIT_DATA.SEED_REPORTS];
      this.saveReports();
    }

    const savedLogs = localStorage.getItem(this.AUDIT_KEY);
    if (savedLogs) {
      try { this.auditLogs = JSON.parse(savedLogs); } catch (e) { this.auditLogs = []; }
    } else {
      this.seedAuditLogs();
    }

    const savedClaims = localStorage.getItem(this.CLAIMS_KEY);
    if (savedClaims) {
      try { this.claims = JSON.parse(savedClaims); } catch (e) { this.claims = []; }
    }

    const savedStack = localStorage.getItem(this.STACK_KEY);
    if (savedStack) {
      try { this.undoStack = JSON.parse(savedStack); } catch (e) { this.undoStack = []; }
    }

    this.rebuildDataStructures();
  }

  saveReports() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reports));
    localStorage.setItem(this.STACK_KEY, JSON.stringify(this.undoStack));
    localStorage.setItem(this.AUDIT_KEY, JSON.stringify(this.auditLogs));
    localStorage.setItem(this.CLAIMS_KEY, JSON.stringify(this.claims));
    this.rebuildDataStructures();
    window.dispatchEvent(new CustomEvent('foundit_store_updated'));
  }

  seedAuditLogs() {
    this.auditLogs = [
      { id: 'LOG-1', text: 'System initialized with 10 verified campus items', time: '2026-10-24 08:00', type: 'system' },
      { id: 'LOG-2', text: 'Staff Desk verified Sarah Jenkins ID Card (RPT-2026-001)', time: '2026-10-24 09:30', type: 'verify' },
      { id: 'LOG-3', text: 'New report queued: North Face Navy Backpack (RPT-2026-008)', time: '2026-10-24 10:15', type: 'queue' },
      { id: 'LOG-4', text: 'New report queued: Apple AirPods Pro (RPT-2026-009)', time: '2026-10-24 11:20', type: 'queue' }
    ];
    localStorage.setItem(this.AUDIT_KEY, JSON.stringify(this.auditLogs));
  }

  /**
   * Rebuilds simulated Hash Table buckets and FIFO Review Queue
   */
  rebuildDataStructures() {
    // 1. Hash Table Simulation (djb2 hash mod 16 buckets)
    this.hashTableBuckets = new Array(16).fill(null).map(() => []);
    this.reports.forEach(r => {
      let hash = 5381;
      for (let i = 0; i < r.id.length; i++) {
        hash = ((hash << 5) + hash) + r.id.charCodeAt(i);
      }
      const bucketIdx = Math.abs(hash) % 16;
      this.hashTableBuckets[bucketIdx].push({ key: r.id, value: r });
    });

    // 2. FIFO Review Queue (reports with status === 'under_review')
    this.reviewQueue = this.reports.filter(r => r.status === 'under_review');
  }

  // --- CRUD OPERATIONS ---

  getAllReports() {
    return [...this.reports];
  }

  getReportById(id) {
    // Fast O(1) bucket lookup
    let hash = 5381;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) + hash) + id.charCodeAt(i);
    }
    const bucketIdx = Math.abs(hash) % 16;
    const bucket = this.hashTableBuckets[bucketIdx];
    const match = bucket.find(entry => entry.key === id);
    return match ? match.value : null;
  }

  addReport(newReportData) {
    const id = 'RPT-2026-' + String(Math.floor(100 + Math.random() * 900));
    const now = new Date().toISOString();
    
    const newReport = {
      id,
      type: newReportData.type || 'lost',
      title: newReportData.title.trim(),
      category: newReportData.category,
      description: newReportData.description.trim(),
      date: newReportData.date,
      zone: newReportData.zone,
      locationDetail: newReportData.locationDetail || 'Main entrance / hallway',
      keywords: newReportData.keywords || newReportData.title.toLowerCase(),
      status: 'under_review', // Queued for admin moderation by default
      reporterRef: newReportData.reporterRef || 'student_web_' + id.slice(-3),
      reporterName: newReportData.reporterName || 'Campus Student',
      contactMethod: newReportData.contactMethod || 'safe_relay',
      image: newReportData.image || 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=600&q=80',
      createdAt: now,
      isSample: false
    };

    this.reports.unshift(newReport);

    // Push action to Undo Stack
    this.undoStack.push({
      action: 'ADD_REPORT',
      timestamp: new Date().toLocaleTimeString(),
      reportId: id,
      snapshot: JSON.parse(JSON.stringify(newReport))
    });

    // Add to audit log
    this.auditLogs.unshift({
      id: 'LOG-' + Date.now(),
      text: `Submitted new ${newReport.type.toUpperCase()} report: ${newReport.title} (${newReport.id})`,
      time: new Date().toLocaleString(),
      type: 'create'
    });

    this.saveReports();
    return newReport;
  }

  updateReport(id, patch) {
    const idx = this.reports.findIndex(r => r.id === id);
    if (idx === -1) return false;

    const previousSnapshot = JSON.parse(JSON.stringify(this.reports[idx]));
    this.reports[idx] = { ...this.reports[idx], ...patch };

    // Push action to Undo Stack
    this.undoStack.push({
      action: 'UPDATE_REPORT',
      timestamp: new Date().toLocaleTimeString(),
      reportId: id,
      previousSnapshot,
      newSnapshot: JSON.parse(JSON.stringify(this.reports[idx]))
    });

    this.auditLogs.unshift({
      id: 'LOG-' + Date.now(),
      text: `Updated report details for ${id} -> Status: ${this.reports[idx].status}`,
      time: new Date().toLocaleString(),
      type: 'update'
    });

    this.saveReports();
    return true;
  }

  deleteReport(id) {
    const idx = this.reports.findIndex(r => r.id === id);
    if (idx === -1) return false;

    const deletedReport = this.reports[idx];
    this.reports.splice(idx, 1);

    // Push action to Undo Stack (enables instant restoration)
    this.undoStack.push({
      action: 'DELETE_REPORT',
      timestamp: new Date().toLocaleTimeString(),
      reportId: id,
      deletedSnapshot: JSON.parse(JSON.stringify(deletedReport))
    });

    this.auditLogs.unshift({
      id: 'LOG-' + Date.now(),
      text: `Deleted report: ${deletedReport.title} (${id})`,
      time: new Date().toLocaleString(),
      type: 'delete'
    });

    this.saveReports();
    return true;
  }

  /**
   * Pops the last action from the LIFO Undo Stack and restores previous state
   */
  undoLastAction() {
    if (this.undoStack.length === 0) {
      return { success: false, message: 'Undo stack is empty.' };
    }

    const lastAction = this.undoStack.pop();

    if (lastAction.action === 'DELETE_REPORT') {
      // Reinsert the deleted report
      this.reports.unshift(lastAction.deletedSnapshot);
      this.auditLogs.unshift({
        id: 'LOG-' + Date.now(),
        text: `Stack Undo: Restored deleted report ${lastAction.reportId}`,
        time: new Date().toLocaleString(),
        type: 'undo'
      });
      this.saveReports();
      return { success: true, message: `Restored deleted report "${lastAction.deletedSnapshot.title}".` };
    }

    if (lastAction.action === 'ADD_REPORT') {
      // Remove newly added report
      const idx = this.reports.findIndex(r => r.id === lastAction.reportId);
      if (idx !== -1) {
        this.reports.splice(idx, 1);
        this.auditLogs.unshift({
          id: 'LOG-' + Date.now(),
          text: `Stack Undo: Reverted creation of report ${lastAction.reportId}`,
          time: new Date().toLocaleString(),
          type: 'undo'
        });
        this.saveReports();
        return { success: true, message: `Reverted creation of report ${lastAction.reportId}.` };
      }
    }

    if (lastAction.action === 'UPDATE_REPORT') {
      // Revert fields
      const idx = this.reports.findIndex(r => r.id === lastAction.reportId);
      if (idx !== -1) {
        this.reports[idx] = lastAction.previousSnapshot;
        this.auditLogs.unshift({
          id: 'LOG-' + Date.now(),
          text: `Stack Undo: Reverted modifications on report ${lastAction.reportId}`,
          time: new Date().toLocaleString(),
          type: 'undo'
        });
        this.saveReports();
        return { success: true, message: `Restored previous state of report ${lastAction.reportId}.` };
      }
    }

    return { success: false, message: 'Unrecognized action on stack.' };
  }

  /**
   * Dequeues the earliest report from FIFO Review Queue and sets status to 'open'
   */
  dequeueAndApprove() {
    if (this.reviewQueue.length === 0) return null;
    const target = this.reviewQueue[0];
    this.updateReport(target.id, { status: 'open' });
    return target;
  }

  /**
   * Submits a safe ownership claim
   */
  submitClaim(reportId, claimData) {
    const claim = {
      id: 'CLM-' + Date.now(),
      reportId,
      ...claimData,
      timestamp: new Date().toISOString(),
      status: 'pending_verification'
    };
    this.claims.push(claim);
    localStorage.setItem(this.CLAIMS_KEY, JSON.stringify(this.claims));

    this.auditLogs.unshift({
      id: 'LOG-' + Date.now(),
      text: `New claim verification submitted for item ${reportId}`,
      time: new Date().toLocaleString(),
      type: 'claim'
    });
    localStorage.setItem(this.AUDIT_KEY, JSON.stringify(this.auditLogs));
    return claim;
  }

  /**
   * Resets demo data to initial university records
   */
  resetToDemo() {
    this.reports = JSON.parse(JSON.stringify(window.FOUNDIT_DATA.SEED_REPORTS));
    this.undoStack = [];
    this.claims = [];
    this.seedAuditLogs();
    this.saveReports();
  }
}

window.foundItStore = new FoundItStore();
