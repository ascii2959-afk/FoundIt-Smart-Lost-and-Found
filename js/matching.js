/**
 * FoundIt - Smart Heuristic Matching Engine
 * Multi-Factor Scoring & Transparency Explainer
 */

class SmartMatchingEngine {
  /**
   * Tokenizes text into lowercase normalized alphanumeric keywords, removing stop words.
   */
  static tokenize(text) {
    if (!text) return [];
    const stopWords = new Set(['the', 'and', 'with', 'for', 'was', 'left', 'found', 'this', 'that', 'near', 'from', 'room', 'desk', 'have', 'floor']);
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));
  }

  /**
   * Evaluates match score between two reports (A and B).
   * Report A and Report B must have complementary types (Lost vs Found).
   */
  static evaluate(a, b) {
    if (!a || !b) return null;

    // Both reports must have complementary types
    if (a.type === b.type) {
      return {
        candidateId: b.id,
        candidateReport: b,
        totalScore: 0,
        categoryScore: 0,
        keywordScore: 0,
        locationScore: 0,
        dateScore: 0,
        confidenceLabel: 'Incompatible',
        reasons: ['Both reports have identical report types (' + a.type.toUpperCase() + '). Only Lost-to-Found pairs can be matched.'],
        reasonsAr: ['كلا البلاغين لهما نفس النوع. لا يمكن مطابقة إلا بين مفقود ومعثور عليه.']
      };
    }

    const reasons = [];
    const reasonsAr = [];

    // 1. Category Parity (Max 35)
    let categoryScore = 0;
    if (a.category === b.category) {
      categoryScore = 35;
      reasons.push('Identical category match (+35)');
      reasonsAr.push('تطابق تام في التصنيف (+35)');
    } else {
      reasons.push('Different categories (0)');
      reasonsAr.push('تصنيفات مختلفة (0)');
    }

    // 2. Keyword & Title Overlap (Max 30)
    const tokensA = new Set([...this.tokenize(a.title), ...this.tokenize(a.keywords), ...this.tokenize(a.description)]);
    const tokensB = new Set([...this.tokenize(b.title), ...this.tokenize(b.keywords), ...this.tokenize(b.description)]);
    
    let sharedTokensCount = 0;
    const sharedTokensList = [];
    tokensA.forEach(token => {
      if (tokensB.has(token)) {
        sharedTokensCount++;
        sharedTokensList.push(token);
      }
    });

    const keywordScore = Math.min(30, sharedTokensCount * 8);
    if (sharedTokensCount > 0) {
      reasons.push(`Shared ${sharedTokensCount} keywords: "${sharedTokensList.slice(0, 3).join(', ')}" (+${keywordScore})`);
      reasonsAr.push(`تشابه في ${sharedTokensCount} كلمات دلالية: "${sharedTokensList.slice(0, 3).join(', ')}" (+${keywordScore})`);
    } else {
      reasons.push('No significant keyword overlap (0)');
      reasonsAr.push('لا يوجد تشابه ملحوظ في الكلمات الدلالية (0)');
    }

    // 3. Campus Location Proximity (Max 20)
    let locationScore = 0;
    if (a.zone === b.zone) {
      locationScore = 20;
      reasons.push('Reported in identical campus building/zone (+20)');
      reasonsAr.push('تم الإبلاغ في نفس مبنى الحرم الجامعي (+20)');
    } else {
      locationScore = 5;
      reasons.push('Reported in different campus buildings (+5)');
      reasonsAr.push('تم الإبلاغ في مبانٍ مختلفة (+5)');
    }

    // 4. Date Proximity (Max 15)
    let dateScore = 0;
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const diffDays = Math.abs((dateA - dateB) / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      dateScore = 15;
      reasons.push('Dates within 24-48 hours (+15)');
      reasonsAr.push('التواريخ متطابقة خلال ٢٤ إلى ٤٨ ساعة (+15)');
    } else if (diffDays <= 3) {
      dateScore = 12;
      reasons.push('Dates within 3 days (+12)');
      reasonsAr.push('التواريخ متقاربة خلال ٣ أيام (+12)');
    } else if (diffDays <= 7) {
      dateScore = 8;
      reasons.push('Dates within 1 week (+8)');
      reasonsAr.push('التواريخ متقاربة خلال أسبوع (+8)');
    } else if (diffDays <= 14) {
      dateScore = 4;
      reasons.push('Dates within 2 weeks (+4)');
      reasonsAr.push('التواريخ متقاربة خلال أسبوعين (+4)');
    } else {
      dateScore = 0;
      reasons.push('Dates more than 2 weeks apart (0)');
      reasonsAr.push('فارق التاريخ أكثر من أسبوعين (0)');
    }

    const totalScore = Math.min(100, categoryScore + keywordScore + locationScore + dateScore);

    let confidenceLabel = 'Low Match';
    let confidenceLabelAr = 'تطابق ضعيف';
    let badgeClass = 'badge-low';

    if (totalScore >= 75) {
      confidenceLabel = 'Strong Match';
      confidenceLabelAr = 'تطابق قوي جداً';
      badgeClass = 'badge-strong';
    } else if (totalScore >= 45) {
      confidenceLabel = 'Possible Match';
      confidenceLabelAr = 'تطابق محتمل';
      badgeClass = 'badge-possible';
    }

    return {
      candidateId: b.id,
      candidateReport: b,
      totalScore,
      categoryScore,
      keywordScore,
      locationScore,
      dateScore,
      confidenceLabel,
      confidenceLabelAr,
      badgeClass,
      reasons,
      reasonsAr,
      sharedTokens: sharedTokensList
    };
  }

  /**
   * Ranks all candidate reports against a target report
   */
  static findMatchesFor(targetReport, allReports) {
    if (!targetReport || !Array.isArray(allReports)) return [];
    
    const candidateType = (targetReport.type === 'lost') ? 'found' : 'lost';
    const candidates = allReports.filter(r => r.id !== targetReport.id && r.type === candidateType);

    const scored = candidates.map(c => this.evaluate(targetReport, c));
    scored.sort((x, y) => y.totalScore - x.totalScore);
    return scored;
  }

  /**
   * Pre-configured academic test scenarios
   */
  static getAcademicTestScenarios() {
    return [
      {
        id: 'scenario_strong',
        title: 'Scenario 1: High Confidence Match (Sony Headphones)',
        titleAr: 'الحالة ١: تطابق عالي الثقة (سماعات سوني)',
        desc: 'Lost Sony WH-1000XM4 in Engineering Hall vs Found Sony headphones in Engineering Hall within 24h.',
        expectedLabel: 'Strong Match',
        expectedScoreRange: '80% - 95%',
        reportAId: 'RPT-2026-002',
        reportBId: 'RPT-2026-003'
      },
      {
        id: 'scenario_unrelated',
        title: 'Scenario 2: Completely Unrelated Items',
        titleAr: 'الحالة ٢: غرضان مختلفان تماماً',
        desc: 'Lost Advanced Calculus Spiral Notebook vs Found Brass Dorm Keys in Student Center.',
        expectedLabel: 'Low Match',
        expectedScoreRange: '0% - 15%',
        reportAId: 'RPT-2026-004',
        reportBId: 'RPT-2026-005'
      },
      {
        id: 'scenario_partial',
        title: 'Scenario 3: Same Category, Different Location',
        titleAr: 'الحالة ٣: نفس التصنيف مع اختلاف الموقع',
        desc: 'Lost TI-84 Calculator in Math Labs vs Found MacBook USB-C Charger in Design Studios.',
        expectedLabel: 'Possible / Low Match',
        expectedScoreRange: '35% - 45%',
        reportAId: 'RPT-2026-007',
        reportBId: 'RPT-2026-010'
      },
      {
        id: 'scenario_same_type',
        title: 'Scenario 4: Incompatible Same-Type Pair',
        titleAr: 'الحالة ٤: إدخال غرضين من نفس النوع (مفقود مع مفقود)',
        desc: 'Comparing Lost Backpack vs Lost Calculator. Engine rejects matching pairs of the same type.',
        expectedLabel: 'Incompatible',
        expectedScoreRange: '0%',
        reportAId: 'RPT-2026-008',
        reportBId: 'RPT-2026-007'
      }
    ];
  }
}

window.SmartMatchingEngine = SmartMatchingEngine;
