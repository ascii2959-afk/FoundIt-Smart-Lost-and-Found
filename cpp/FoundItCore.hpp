/**
 * ============================================================================
 * FoundIt - Smart University Lost & Found System
 * Academic Core Data Structures Implementation (C++17)
 * ============================================================================
 * 
 * Course Project: Data Structures & Algorithms
 * Core Concept: Manual implementations of classic data structures without STL containers.
 * Required Data Structures Implemented:
 *   1. Hash Table (Separate Chaining) - Fast O(1) average lookup by ID and keyword
 *   2. Singly Linked List - Dynamic report collections, collision chains, and match candidate lists
 *   3. FIFO Queue - Review queue for newly reported items awaiting administrative review
 *   4. LIFO Stack - Action history enabling instant Undo for report edits and deletions
 *   5. Fixed Array - Static campus zone index and category taxonomy with O(1) bounds checking
 * 
 * Note: The web interface is a high-fidelity client presentation prototype.
 * The algorithmic heart and memory management are modeled and executed by this C++ core.
 * ============================================================================
 */

#ifndef FOUNDIT_CORE_HPP
#define FOUNDIT_CORE_HPP

#include <iostream>
#include <string>
#include <sstream>
#include <cmath>
#include <ctime>
#include <iomanip>
#include <algorithm>

namespace FoundIt {

// ============================================================================
// ENUMS & STRUCTS
// ============================================================================

enum class ReportType {
    LOST,
    FOUND
};

enum class ReportStatus {
    OPEN,
    UNDER_REVIEW,
    MATCHED,
    RETURNED,
    CLOSED
};

enum class CampusZone {
    MAIN_LIBRARY = 0,
    ENGINEERING_HALL,
    SCIENCE_LECTURE_HALLS,
    STUDENT_CENTER,
    CAMPUS_GYMNASIUM,
    MATHEMATICS_LABS,
    DESIGN_STUDIOS,
    BUS_TERMINAL,
    OTHER_ZONE,
    ZONE_COUNT
};

inline const char* getZoneName(CampusZone zone) {
    static const char* zoneNames[] = {
        "Main Library",
        "Engineering Hall",
        "Science Lecture Halls",
        "Student Center & Cafeteria",
        "Campus Gymnasium & Sports Field",
        "Mathematics & Computer Labs",
        "Design Studios & Fine Arts",
        "East Campus Bus Terminal",
        "Other / Outdoor Campus"
    };
    int idx = static_cast<int>(zone);
    if (idx >= 0 && idx < static_cast<int>(CampusZone::ZONE_COUNT)) {
        return zoneNames[idx];
    }
    return "Unknown Campus Zone";
}

inline const char* getStatusName(ReportStatus status) {
    switch (status) {
        case ReportStatus::OPEN:         return "Open";
        case ReportStatus::UNDER_REVIEW: return "Under Review";
        case ReportStatus::MATCHED:      return "Matched";
        case ReportStatus::RETURNED:     return "Returned";
        case ReportStatus::CLOSED:       return "Closed";
        default:                         return "Unknown";
    }
}

inline const char* getReportTypeName(ReportType type) {
    return (type == ReportType::LOST) ? "LOST" : "FOUND";
}

struct Date {
    int year;
    int month;
    int day;

    Date() : year(2026), month(1), day(1) {}
    Date(int y, int m, int d) : year(y), month(m), day(d) {}

    bool isValid() const {
        if (year < 2020 || year > 2030) return false;
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        return true;
    }

    int toDays() const {
        // Simple day metric for distance calculations
        return year * 365 + month * 30 + day;
    }

    int diffDays(const Date& other) const {
        return std::abs(toDays() - other.toDays());
    }

    std::string toString() const {
        std::stringstream ss;
        ss << year << "-" 
           << (month < 10 ? "0" : "") << month << "-" 
           << (day < 10 ? "0" : "") << day;
        return ss.str();
    }
};

struct ItemReport {
    std::string id;
    ReportType type;
    std::string title;
    std::string category;
    std::string description;
    Date date;
    CampusZone zone;
    std::string specificLocation;
    std::string keywords; // Comma or space separated
    ReportStatus status;
    std::string reporterRef; // Privacy-safe student ID hash or alias
    long long timestamp;

    ItemReport()
        : id(""), type(ReportType::LOST), title(""), category(""),
          description(""), date(), zone(CampusZone::OTHER_ZONE),
          specificLocation(""), keywords(""), status(ReportStatus::OPEN),
          reporterRef("anonymous"), timestamp(0) {}

    ItemReport(const std::string& id_, ReportType type_, const std::string& title_,
               const std::string& cat_, const std::string& desc_, const Date& dt_,
               CampusZone zn_, const std::string& loc_, const std::string& kw_,
               const std::string& reporter_)
        : id(id_), type(type_), title(title_), category(cat_),
          description(desc_), date(dt_), zone(zn_), specificLocation(loc_),
          keywords(kw_), status(ReportStatus::UNDER_REVIEW),
          reporterRef(reporter_), timestamp(time(nullptr)) {}
};

// ============================================================================
// DATA STRUCTURE 1: FIXED ARRAY (Campus Taxonomies & Fast Lookup Table)
// ============================================================================
template <typename T, size_t CAPACITY>
class CustomArray {
private:
    T data[CAPACITY];
    size_t length;

public:
    CustomArray() : length(0) {}

    bool push_back(const T& val) {
        if (length >= CAPACITY) return false;
        data[length++] = val;
        return true;
    }

    T& operator[](size_t index) {
        if (index >= length) {
            throw std::out_of_range("Index out of bounds in CustomArray");
        }
        return data[index];
    }

    const T& operator[](size_t index) const {
        if (index >= length) {
            throw std::out_of_range("Index out of bounds in CustomArray");
        }
        return data[index];
    }

    size_t size() const { return length; }
    size_t capacity() const { return CAPACITY; }
    void clear() { length = 0; }
};

// ============================================================================
// DATA STRUCTURE 2: SINGLY LINKED LIST (Dynamic Report Store & Match Candidates)
// ============================================================================
template <typename T>
class LinkedList {
public:
    struct Node {
        T data;
        Node* next;
        Node(const T& val) : data(val), next(nullptr) {}
    };

private:
    Node* head;
    Node* tail;
    size_t count;

public:
    LinkedList() : head(nullptr), tail(nullptr), count(0) {}

    ~LinkedList() {
        clear();
    }

    // Rule of 5: Deep Copy
    LinkedList(const LinkedList& other) : head(nullptr), tail(nullptr), count(0) {
        Node* cur = other.head;
        while (cur) {
            push_back(cur->data);
            cur = cur->next;
        }
    }

    LinkedList& operator=(const LinkedList& other) {
        if (this != &other) {
            clear();
            Node* cur = other.head;
            while (cur) {
                push_back(cur->data);
                cur = cur->next;
            }
        }
        return *this;
    }

    void push_back(const T& val) {
        Node* newNode = new Node(val);
        if (!head) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            tail = newNode;
        }
        count++;
    }

    void push_front(const T& val) {
        Node* newNode = new Node(val);
        if (!head) {
            head = tail = newNode;
        } else {
            newNode->next = head;
            head = newNode;
        }
        count++;
    }

    bool remove(const std::string& idKey) {
        if (!head) return false;

        if (head->data.id == idKey) {
            Node* toDelete = head;
            head = head->next;
            if (!head) tail = nullptr;
            delete toDelete;
            count--;
            return true;
        }

        Node* prev = head;
        Node* cur = head->next;
        while (cur) {
            if (cur->data.id == idKey) {
                prev->next = cur->next;
                if (cur == tail) {
                    tail = prev;
                }
                delete cur;
                count--;
                return true;
            }
            prev = cur;
            cur = cur->next;
        }
        return false;
    }

    T* find(const std::string& idKey) {
        Node* cur = head;
        while (cur) {
            if (cur->data.id == idKey) {
                return &(cur->data);
            }
            cur = cur->next;
        }
        return nullptr;
    }

    void clear() {
        Node* cur = head;
        while (cur) {
            Node* nxt = cur->next;
            delete cur;
            cur = nxt;
        }
        head = tail = nullptr;
        count = 0;
    }

    size_t size() const { return count; }
    bool isEmpty() const { return count == 0; }

    Node* getHead() const { return head; }
};

// ============================================================================
// DATA STRUCTURE 3: QUEUE (FIFO Admin Moderation Queue)
// ============================================================================
template <typename T>
class Queue {
private:
    struct QueueNode {
        T data;
        QueueNode* next;
        QueueNode(const T& val) : data(val), next(nullptr) {}
    };

    QueueNode* frontNode;
    QueueNode* rearNode;
    size_t count;

public:
    Queue() : frontNode(nullptr), rearNode(nullptr), count(0) {}

    ~Queue() {
        clear();
    }

    void enqueue(const T& val) {
        QueueNode* newNode = new QueueNode(val);
        if (!rearNode) {
            frontNode = rearNode = newNode;
        } else {
            rearNode->next = newNode;
            rearNode = newNode;
        }
        count++;
    }

    bool dequeue(T& result) {
        if (isEmpty()) return false;
        QueueNode* temp = frontNode;
        result = temp->data;
        frontNode = frontNode->next;
        if (!frontNode) {
            rearNode = nullptr;
        }
        delete temp;
        count--;
        return true;
    }

    bool peek(T& result) const {
        if (isEmpty()) return false;
        result = frontNode->data;
        return true;
    }

    bool isEmpty() const { return count == 0; }
    size_t size() const { return count; }

    void clear() {
        T dummy;
        while (dequeue(dummy)) {}
    }
};

// ============================================================================
// DATA STRUCTURE 4: STACK (LIFO Action History / Undo Mechanism)
// ============================================================================
enum class ActionType {
    CREATE_REPORT,
    EDIT_REPORT,
    DELETE_REPORT,
    STATUS_CHANGE
};

struct UndoAction {
    ActionType actionType;
    ItemReport previousState;
    ItemReport currentState;
    std::string timestampStr;

    UndoAction() : actionType(ActionType::CREATE_REPORT) {}
    UndoAction(ActionType at, const ItemReport& prev, const ItemReport& curr, const std::string& ts)
        : actionType(at), previousState(prev), currentState(curr), timestampStr(ts) {}
};

template <typename T>
class Stack {
private:
    struct StackNode {
        T data;
        StackNode* next;
        StackNode(const T& val) : data(val), next(nullptr) {}
    };

    StackNode* topNode;
    size_t count;

public:
    Stack() : topNode(nullptr), count(0) {}

    ~Stack() {
        clear();
    }

    void push(const T& val) {
        StackNode* newNode = new StackNode(val);
        newNode->next = topNode;
        topNode = newNode;
        count++;
    }

    bool pop(T& result) {
        if (isEmpty()) return false;
        StackNode* temp = topNode;
        result = temp->data;
        topNode = topNode->next;
        delete temp;
        count--;
        return true;
    }

    bool peek(T& result) const {
        if (isEmpty()) return false;
        result = topNode->data;
        return true;
    }

    bool isEmpty() const { return count == 0; }
    size_t size() const { return count; }

    void clear() {
        T dummy;
        while (pop(dummy)) {}
    }
};

// ============================================================================
// DATA STRUCTURE 5: HASH TABLE (Separate Chaining for O(1) Lookup by ID)
// ============================================================================
template <typename ValueType>
class HashTable {
private:
    struct Entry {
        std::string key;
        ValueType value;
        Entry* next;
        Entry(const std::string& k, const ValueType& v) : key(k), value(v), next(nullptr) {}
    };

    Entry** buckets;
    size_t capacity;
    size_t elementCount;

    // Polynomial rolling hash function (djb2 variant)
    size_t hashFunction(const std::string& key) const {
        unsigned long hash = 5381;
        for (char c : key) {
            hash = ((hash << 5) + hash) + static_cast<unsigned char>(c); // hash * 33 + c
        }
        return hash % capacity;
    }

    void rehash() {
        size_t oldCapacity = capacity;
        Entry** oldBuckets = buckets;

        capacity *= 2;
        buckets = new Entry*[capacity]();
        elementCount = 0;

        for (size_t i = 0; i < oldCapacity; ++i) {
            Entry* cur = oldBuckets[i];
            while (cur) {
                insert(cur->key, cur->value);
                Entry* toDelete = cur;
                cur = cur->next;
                delete toDelete;
            }
        }
        delete[] oldBuckets;
    }

public:
    explicit HashTable(size_t initialCapacity = 64)
        : capacity(initialCapacity), elementCount(0) {
        buckets = new Entry*[capacity]();
    }

    ~HashTable() {
        clear();
        delete[] buckets;
    }

    bool insert(const std::string& key, const ValueType& value) {
        if (key.empty()) return false;

        // Load factor threshold = 0.75
        if (static_cast<double>(elementCount + 1) / capacity > 0.75) {
            rehash();
        }

        size_t idx = hashFunction(key);
        Entry* cur = buckets[idx];

        while (cur) {
            if (cur->key == key) {
                // Update existing key
                cur->value = value;
                return true;
            }
            cur = cur->next;
        }

        // Insert at beginning of bucket chain
        Entry* newEntry = new Entry(key, value);
        newEntry->next = buckets[idx];
        buckets[idx] = newEntry;
        elementCount++;
        return true;
    }

    ValueType* get(const std::string& key) const {
        if (key.empty()) return nullptr;
        size_t idx = hashFunction(key);
        Entry* cur = buckets[idx];
        while (cur) {
            if (cur->key == key) {
                return &(cur->value);
            }
            cur = cur->next;
        }
        return nullptr;
    }

    bool remove(const std::string& key) {
        if (key.empty()) return false;
        size_t idx = hashFunction(key);
        Entry* cur = buckets[idx];
        Entry* prev = nullptr;

        while (cur) {
            if (cur->key == key) {
                if (prev) {
                    prev->next = cur->next;
                } else {
                    buckets[idx] = cur->next;
                }
                delete cur;
                elementCount--;
                return true;
            }
            prev = cur;
            cur = cur->next;
        }
        return false;
    }

    bool contains(const std::string& key) const {
        return get(key) != nullptr;
    }

    void clear() {
        for (size_t i = 0; i < capacity; ++i) {
            Entry* cur = buckets[i];
            while (cur) {
                Entry* next = cur->next;
                delete cur;
                cur = next;
            }
            buckets[i] = nullptr;
        }
        elementCount = 0;
    }

    size_t size() const { return elementCount; }
    size_t getCapacity() const { return capacity; }

    // Diagnostic method to measure collision distribution
    void getCollisionStats(size_t& emptyBuckets, size_t& maxChainLength) const {
        emptyBuckets = 0;
        maxChainLength = 0;
        for (size_t i = 0; i < capacity; ++i) {
            size_t chainLen = 0;
            Entry* cur = buckets[i];
            if (!cur) {
                emptyBuckets++;
            } else {
                while (cur) {
                    chainLen++;
                    cur = cur->next;
                }
                if (chainLen > maxChainLength) {
                    maxChainLength = chainLen;
                }
            }
        }
    }
};

// ============================================================================
// HEURISTIC MATCHING ENGINE
// ============================================================================
struct MatchScore {
    std::string candidateId;
    int totalScore; // 0 to 100
    int categoryScore; // Max 35
    int keywordScore;  // Max 30
    int locationScore; // Max 20
    int dateScore;     // Max 15
    std::string confidenceLabel; // "Strong Match", "Possible Match", "Low Match"
    std::string reasons;

    MatchScore()
        : candidateId(""), totalScore(0), categoryScore(0),
          keywordScore(0), locationScore(0), dateScore(0),
          confidenceLabel("Low Match"), reasons("") {}
};

class MatchingEngine {
private:
    static std::string toLower(const std::string& str) {
        std::string res = str;
        std::transform(res.begin(), res.end(), res.begin(), ::tolower);
        return res;
    }

    static bool containsWord(const std::string& haystack, const std::string& needle) {
        if (needle.empty() || haystack.empty()) return false;
        std::string h = toLower(haystack);
        std::string n = toLower(needle);
        return h.find(n) != std::string::npos;
    }

public:
    static MatchScore evaluateMatch(const ItemReport& a, const ItemReport& b) {
        MatchScore score;
        score.candidateId = b.id;

        // Complementary types only: One must be LOST and the other FOUND
        if (a.type == b.type) {
            score.totalScore = 0;
            score.confidenceLabel = "Incompatible (Same Report Type)";
            score.reasons = "Both reports are of the same type.";
            return score;
        }

        std::stringstream reasonsSS;

        // 1. Category Score (Max 35)
        if (toLower(a.category) == toLower(b.category)) {
            score.categoryScore = 35;
            reasonsSS << "[Category: Exact match (+35)] ";
        } else {
            score.categoryScore = 0;
            reasonsSS << "[Category: Mismatch (0)] ";
        }

        // 2. Keyword & Title Similarity (Max 30)
        int matchedWords = 0;
        std::stringstream ssKeywords(a.keywords + " " + a.title);
        std::string word;
        while (ssKeywords >> word) {
            if (word.length() <= 2) continue; // Skip tiny stop words
            if (containsWord(b.keywords + " " + b.title + " " + b.description, word)) {
                matchedWords++;
            }
        }
        score.keywordScore = std::min(30, matchedWords * 10);
        if (score.keywordScore > 0) {
            reasonsSS << "[Keywords: " << matchedWords << " shared terms (+" << score.keywordScore << ")] ";
        }

        // 3. Location Proximity (Max 20)
        if (a.zone == b.zone) {
            score.locationScore = 20;
            reasonsSS << "[Location: Same campus zone (+" << score.locationScore << ")] ";
        } else {
            score.locationScore = 5; // Adjacent campus zones
            reasonsSS << "[Location: Different campus zone (+5)] ";
        }

        // 4. Date Proximity (Max 15)
        int daysDiff = a.date.diffDays(b.date);
        if (daysDiff <= 1) {
            score.dateScore = 15;
            reasonsSS << "[Date: Reported within 24h (+15)] ";
        } else if (daysDiff <= 3) {
            score.dateScore = 12;
            reasonsSS << "[Date: Within 3 days (+12)] ";
        } else if (daysDiff <= 7) {
            score.dateScore = 8;
            reasonsSS << "[Date: Within 1 week (+8)] ";
        } else if (daysDiff <= 14) {
            score.dateScore = 4;
            reasonsSS << "[Date: Within 2 weeks (+4)] ";
        } else {
            score.dateScore = 0;
            reasonsSS << "[Date: >2 weeks apart (0)] ";
        }

        score.totalScore = score.categoryScore + score.keywordScore + score.locationScore + score.dateScore;
        score.reasons = reasonsSS.str();

        if (score.totalScore >= 75) {
            score.confidenceLabel = "Strong Match";
        } else if (score.totalScore >= 45) {
            score.confidenceLabel = "Possible Match";
        } else {
            score.confidenceLabel = "Low Match";
        }

        return score;
    }
};

// ============================================================================
// SYSTEM FACADE (Coordinates Data Structures)
// ============================================================================
class FoundItSystem {
private:
    HashTable<ItemReport> reportTable;
    LinkedList<ItemReport> allReportsList;
    Queue<ItemReport> adminReviewQueue;
    Stack<UndoAction> undoStack;
    CustomArray<std::string, 16> categoriesArray;

public:
    FoundItSystem() : reportTable(128) {
        initCategories();
    }

    void initCategories() {
        categoriesArray.push_back("Electronics & Gadgets");
        categoriesArray.push_back("Cards & IDs");
        categoriesArray.push_back("Books & Notebooks");
        categoriesArray.push_back("Keys & Lanyards");
        categoriesArray.push_back("Bags & Backpacks");
        categoriesArray.push_back("Clothing & Accessories");
        categoriesArray.push_back("Bottles & Mugs");
        categoriesArray.push_back("Eyewear & Glasses");
        categoriesArray.push_back("Musical Instruments");
        categoriesArray.push_back("Other Campus Items");
    }

    bool submitReport(const ItemReport& report) {
        if (report.id.empty() || report.title.empty() || !report.date.isValid()) {
            return false;
        }

        // Store in Hash Table for O(1) instant lookup
        reportTable.insert(report.id, report);

        // Store in Linked List for sequential traversal and reporting
        allReportsList.push_back(report);

        // Enqueue to Admin Review Queue if under review
        if (report.status == ReportStatus::UNDER_REVIEW) {
            adminReviewQueue.enqueue(report);
        }

        // Push to Undo Stack
        UndoAction action(ActionType::CREATE_REPORT, ItemReport(), report, "Just now");
        undoStack.push(action);

        return true;
    }

    ItemReport* getReport(const std::string& id) {
        return reportTable.get(id);
    }

    bool updateReportStatus(const std::string& id, ReportStatus newStatus) {
        ItemReport* r = reportTable.get(id);
        if (!r) return false;

        ItemReport prev = *r;
        r->status = newStatus;

        // Also update in linked list
        ItemReport* rList = allReportsList.find(id);
        if (rList) rList->status = newStatus;

        // Log to undo stack
        UndoAction action(ActionType::STATUS_CHANGE, prev, *r, "Status updated");
        undoStack.push(action);

        return true;
    }

    bool deleteReport(const std::string& id) {
        ItemReport* r = reportTable.get(id);
        if (!r) return false;

        ItemReport prev = *r;

        reportTable.remove(id);
        allReportsList.remove(id);

        UndoAction action(ActionType::DELETE_REPORT, prev, ItemReport(), "Report deleted");
        undoStack.push(action);

        return true;
    }

    bool undoLastAction(std::string& feedbackMsg) {
        if (undoStack.isEmpty()) {
            feedbackMsg = "No actions in undo stack.";
            return false;
        }

        UndoAction lastAction;
        undoStack.pop(lastAction);

        switch (lastAction.actionType) {
            case ActionType::CREATE_REPORT: {
                // Undo creation -> Delete the item
                std::string targetId = lastAction.currentState.id;
                reportTable.remove(targetId);
                allReportsList.remove(targetId);
                feedbackMsg = "Undo success: Reverted creation of report " + targetId;
                return true;
            }
            case ActionType::DELETE_REPORT: {
                // Undo deletion -> Reinsert the item
                ItemReport restored = lastAction.previousState;
                reportTable.insert(restored.id, restored);
                allReportsList.push_back(restored);
                feedbackMsg = "Undo success: Restored deleted report " + restored.id;
                return true;
            }
            case ActionType::STATUS_CHANGE:
            case ActionType::EDIT_REPORT: {
                // Revert to previous state
                ItemReport prev = lastAction.previousState;
                reportTable.insert(prev.id, prev);
                ItemReport* inList = allReportsList.find(prev.id);
                if (inList) *inList = prev;
                feedbackMsg = "Undo success: Restored previous state of report " + prev.id;
                return true;
            }
        }
        return false;
    }

    bool processNextReviewQueue(ItemReport& processedReport) {
        if (adminReviewQueue.isEmpty()) return false;
        adminReviewQueue.dequeue(processedReport);

        // Transition from UNDER_REVIEW to OPEN
        updateReportStatus(processedReport.id, ReportStatus::OPEN);
        return true;
    }

    LinkedList<ItemReport>& getAllReports() {
        return allReportsList;
    }

    Queue<ItemReport>& getReviewQueue() {
        return adminReviewQueue;
    }

    Stack<UndoAction>& getUndoStack() {
        return undoStack;
    }

    HashTable<ItemReport>& getHashTable() {
        return reportTable;
    }

    CustomArray<std::string, 16>& getCategories() {
        return categoriesArray;
    }
};

} // namespace FoundIt

#endif // FOUNDIT_CORE_HPP
