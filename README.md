# FoundIt — Smart University Lost & Found System

> **Tagline**: *"Lost something? Let's bring it home."*  
> **Course Capstone**: University Data Structures & Algorithms  
> **Core Implementation**: C++17 with Zero-STL Manual Data Structures  
> **Presentation Prototype**: Modern Responsive Client with Arabic RTL Support & Local Storage

---

## 1. Executive Summary & Separation of Concerns

**FoundIt** is an enterprise-grade university Lost & Found software solution designed to solve the common campus problem of lost student possessions (IDs, laptops, headphones, keys, notebooks, and water bottles).

### Academic Requirement Alignment
1. **Core Data Structures Implementation (`/cpp`)**:
   - The algorithmic heart and memory management are **authored in pure C++17** without using `std::vector`, `std::map`, or other high-level STL containers.
   - All 5 required structures are **manually built** using dynamic node allocation, memory pointers, and bounds-checked arrays:
     1. **Hash Table** with separate chaining & djb2 rolling polynomial hash for $O(1)$ item lookup.
     2. **Singly Linked List** for dynamic sequential report storage and candidate chains.
     3. **Queue (FIFO)** to enforce fairness in administrative moderation of incoming reports.
     4. **Stack (LIFO)** to enable instant, lossless action undo for accidental edits or deletions.
     5. **Fixed Array** for static campus zone categorization and constant-time indexing.
2. **Web Application Prototype (`index.html`)**:
   - A self-contained, responsive, multi-page frontend prototype for student and staff interaction.
   - Built with Tailwind CSS, semantic HTML5, Lucide icons, Inter + Cairo fonts, and complete English & Arabic RTL support.
   - Client persistence via browser `localStorage` under `foundit_reports_v1`.
   - **Explicit Disclosure**: Frontend JavaScript is used for human UI presentation and prototype testing; it does not replace the required C++ core data structures.

---

## 2. Information Architecture & Key Pages

| Page / Route | Purpose & Key Features |
|---|---|
| **Landing (`#landing`)** | Hero search bar, primary "Report Lost" & secondary "Report Found" CTA buttons, campus recovery stats (142+ reunited), category shortcuts, how-it-works workflow, trust highlights, and recent catalog preview. |
| **Browse Items (`#browse`)** | Full searchable, filterable, sortable catalog. Filters by Type (Lost/Found), Category, Campus Building, Status, and Date. Grid & List views, real-time result counts, filter chips, and empty states. |
| **Item Details Modal** | Deep item inspection with realistic photo previews, category & status badges, building location, lifecycle progress tracker (Submitted $\rightarrow$ Reviewed $\rightarrow$ Matched $\rightarrow$ Returned), and top heuristic candidate suggestions. |
| **Safe Claim Flow** | Privacy-first claim verification modal. Protects student contact info by asking identifying questions (serial number, scratches, stickers, exact time) forwarded exclusively to university handover desks. |
| **Report Wizard (`#report`)** | 4-step wizard with real-time field validation, date constraints (cannot be in the future), title length checks, campus zone dropdowns, preset photo selection, and instant persistence. |
| **Smart Matching (`#matching`)** | Transparent multi-factor heuristic matching engine: Category Parity (35%), Keyword Overlap (30%), Building Proximity (20%), and Date Delta (15%). Includes interactive academic test case sandboxes. |
| **My Reports (`#my-reports`)** | Student listing management. Edit, delete with confirmation, jump to candidate matches, and **Stack-powered Undo** to instantly restore deleted records in $O(1)$ time. |
| **Admin Dashboard (`#admin`)** | Staff moderation console with FIFO review queue, one-click approvals/rejections, duplicate alert scanner, system audit event logs, and role switcher. |
| **Academic Core (`#about`)** | Dedicated showcase featuring a live interactive visualizer for Hash Table buckets, FIFO Queue, and LIFO Stack; in-browser C++ source code viewer; Big-O complexity tables; and verified test suites. |

---

## 3. Data Structures & Algorithmic Complexity

| Structure | C++ Class / File | Algorithmic Role in System | Time Complexity (Avg) | Time Complexity (Worst) | Space Complexity |
|---|---|---|---|---|---|
| **Hash Table** | `FoundIt::HashTable<V>` (`cpp/FoundItCore.hpp`) | Instant lookup of reports by `id` key. djb2 rolling hash function with separate chaining collision resolution and load factor auto-rehashing at $> 0.75$. | **$O(1)$** | $O(N)$ (all keys collide) | $O(N + M)$ |
| **Singly Linked List** | `FoundIt::LinkedList<T>` (`cpp/FoundItCore.hpp`) | Dynamic linear sequence of active reports, collision chains, and match candidate lists. Node pointers `Node* next`. | **$O(1)$** append | $O(N)$ search | $O(N)$ |
| **FIFO Queue** | `FoundIt::Queue<T>` (`cpp/FoundItCore.hpp`) | Admin moderation queue. Newly reported items with status `under_review` are enqueued at rear and dequeued from front. | **$O(1)$** enqueue / dequeue | $O(1)$ | $O(Q)$ |
| **LIFO Stack** | `FoundIt::Stack<T>` (`cpp/FoundItCore.hpp`) | Action undo log. Every deletion, update, or addition is pushed onto the stack. Popping restores the previous snapshot. | **$O(1)$** push / pop | $O(1)$ | $O(U)$ |
| **Fixed Array** | `FoundIt::CustomArray<T, N>` (`cpp/FoundItCore.hpp`) | Fixed-capacity campus zones and category taxonomy with compile-time allocation and runtime bounds checking. | **$O(1)$** lookup | $O(1)$ | $O(K)$ |

---

## 4. Heuristic Matching Engine Formula

The smart matching score (0–100%) correlates complementary pairs (one **Lost** item and one **Found** item):

$$\text{MatchScore} = S_{\text{category}} + S_{\text{keywords}} + S_{\text{location}} + S_{\text{date}}$$

1. **Category Compatibility ($S_{\text{category}} \le 35$)**:
   - Exact category parity = $+35$ points.
   - Different category = $0$ points.
2. **Keyword & Token Overlap ($S_{\text{keywords}} \le 30$)**:
   - Normalized text tokenization, removing stop words.
   - $+8$ points per shared keyword (capped at 30).
3. **Campus Location Proximity ($S_{\text{location}} \le 20$)**:
   - Same campus zone / building = $+20$ points.
   - Different campus zone = $+5$ points.
4. **Date Proximity ($S_{\text{date}} \le 15$)**:
   - Within $\le 1$ day: $+15$ points.
   - Within $\le 3$ days: $+12$ points.
   - Within $\le 7$ days: $+8$ points.
   - Within $\le 14$ days: $+4$ points.
   - $> 14$ days: $0$ points.

### Confidence Thresholds:
- **Strong Match**: $\ge 75\%$
- **Possible Match**: $45\% - 74\%$
- **Low Match**: $< 45\%$
- **Incompatible**: Same report types (e.g., Lost vs Lost $\rightarrow 0\%$)

---

## 5. Seed Campus Data (10 Realistic University Records)

The platform is seeded with 10 realistic university records:
1. `RPT-2026-001` (Found): Blue University Student ID Card (Sarah Jenkins) — Main Library
2. `RPT-2026-002` (Lost): Sony WH-1000XM4 Black Wireless Headphones — Engineering Hall
3. `RPT-2026-003` (Found): Matte Black Sony Noise-Canceling Headphones — Engineering Hall
4. `RPT-2026-004` (Lost): Advanced Calculus MTH201 Spiral Notebook — Science Lecture Halls
5. `RPT-2026-005` (Found): Set of Brass Dorm Keys with Red Campus Lanyard — Student Center
6. `RPT-2026-006` (Lost): Hydro Flask 32oz Teal Insulated Water Bottle — Campus Gymnasium
7. `RPT-2026-007` (Lost): TI-84 Plus CE Graphing Calculator (Rose Gold) — Mathematics Labs
8. `RPT-2026-008` (Lost): North Face Borealis Navy Backpack with 15" Laptop — Bus Terminal
9. `RPT-2026-009` (Found): Apple AirPods Pro (2nd Gen) with White Case — Student Center
10. `RPT-2026-010` (Found): Silver 67W USB-C Power Adapter for MacBook — Design Studios

---

## 6. Running the C++ Implementation

### Prerequisites
- Any C++17 compliant compiler (`g++`, `clang++`, or MSVC `cl.exe`).

### Compilation & Test Execution
```bash
# Navigate to cpp directory
cd cpp

# Compile with C++17 standard and optimizations
g++ -std=c++17 -Wall -Wextra -O2 FoundItCore.cpp -o foundit_core

# Execute the automated test suite
./foundit_core
```

### Verified Automated Test Cases:
1. Seeding realistic campus records.
2. Hash Table $O(1)$ key lookup and `nullptr` handling.
3. Exact / Strong Match evaluation ($>80\%$).
4. Unrelated items evaluation ($<20\%$).
5. Edge cases: same-type rejection, empty title/ID rejection.
6. Invalid date rejection (e.g., month > 12).
7. FIFO Queue moderation enqueue and dequeue sequence.
8. LIFO Stack deletion reversal & state restoration.
9. Safe non-existent ID deletion handling.
10. Hash Table bucket distribution and load factor verification.

---

## 7. How to Launch the Web Prototype

The web application is self-contained and zero-dependency:
1. Simply double-click `index.html` or open it in any modern browser (Chrome, Edge, Firefox, Safari).
2. Or serve it via any static web server:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
3. Use the top navigation bar to explore the 8 views, test the Arabic RTL toggle, simulate moderation queues, inspect Hash Table buckets, or submit new item reports.
