# FoundIt — Academic C++ Data Structures Core

This directory contains the required university data structures core for **FoundIt — Smart University Lost & Found System**.

> **Academic Statement**: The web interface is an interactive client prototype designed for demonstration, visualization, and user experience evaluation. The fundamental data structures, memory management, algorithmic complexity, and test scenarios are authored in clean, modular, modern **C++ (C++17)** without reliance on third-party libraries or standard container frameworks (`std::vector`, `std::map`, etc. are omitted in favor of manual implementations).

---

## 1. Required Data Structures Implementation Mapping

| Data Structure | Implementation File | Role in FoundIt Architecture | Time Complexity (Avg) | Space Complexity |
|---|---|---|---|---|
| **Hash Table** | `FoundItCore.hpp` (`HashTable<T>`) | Fast $O(1)$ lookup by report ID; dynamic polynomial rolling hash (djb2) with separate chaining for collision resolution and dynamic load factor auto-rehashing. | Search: $O(1)$<br>Insert: $O(1)$<br>Delete: $O(1)$ | $O(N + M)$ |
| **Singly Linked List** | `FoundItCore.hpp` (`LinkedList<T>`) | Dynamic sequential storage of active reports, collision buckets, and match candidate lists without pre-allocation overhead. | Append: $O(1)$<br>Search: $O(N)$<br>Delete: $O(N)$ | $O(N)$ |
| **Queue (FIFO)** | `FoundItCore.hpp` (`Queue<T>`) | Enforces first-in, first-out moderation queue for newly submitted reports awaiting university staff approval. | Enqueue: $O(1)$<br>Dequeue: $O(1)$<br>Peek: $O(1)$ | $O(Q)$ |
| **Stack (LIFO)** | `FoundItCore.hpp` (`Stack<T>`) | Action reversal log supporting instant Undo for accidental deletions, edits, or status transitions. | Push: $O(1)$<br>Pop: $O(1)$<br>Peek: $O(1)$ | $O(U)$ |
| **Fixed Array** | `FoundItCore.hpp` (`CustomArray<T, N>`) | Fixed campus taxonomy categorization and campus zone coordinates with constant-time indexed access and bounds validation. | Lookup: $O(1)$<br>Push: $O(1)$ | $O(K)$ |

---

## 2. Compilation & Execution Instructions

The project requires any C++17 compliant compiler (`g++`, `clang++`, or MSVC `cl.exe`).

### Using GCC / G++ (Linux / macOS / MinGW / WSL)
```bash
# Navigate to cpp folder
cd cpp

# Compile with C++17 standard and optimizations
g++ -std=c++17 -Wall -Wextra -O2 FoundItCore.cpp -o foundit_core

# Execute the test suite
./foundit_core
```

### Using Clang++
```bash
clang++ -std=c++17 -Wall -Wextra -O2 FoundItCore.cpp -o foundit_core
./foundit_core
```

### Using Microsoft Visual C++ (MSVC)
```cmd
cl /EHsc /std:c++17 FoundItCore.cpp /Fe:foundit_core.exe
foundit_core.exe
```

---

## 3. Automated Test Scenarios Included in `FoundItCore.cpp`

1. **Seeding Realistic Campus Data**: Tests initial loading of student IDs, electronics, notebooks, keys, and bottles.
2. **Hash Table Lookup**: Verifies instant $O(1)$ lookup for existing keys and `nullptr` handling for missing keys.
3. **Exact / Strong Match**: Evaluates complementary Lost/Found items (Sony WH-1000XM4 headphones in Engineering Hall) yielding 80%+ score.
4. **Unrelated Items**: Tests Calculus Notebook vs Dorm Keys to ensure low score (<30%).
5. **Edge Cases**:
   - Same report types (LOST vs LOST) rejected.
   - Out-of-bounds dates rejected (e.g., month > 12).
   - Empty title or empty ID rejected.
   - Safe deletion handling when ID does not exist.
6. **Queue FIFO Moderation**: Verifies that the earliest submitted report is dequeued first by administrative review.
7. **Stack LIFO Undo**: Validates deletion of a water bottle report followed by an instant undo that restores the exact record state.
8. **Hash Collision & Distribution Benchmark**: Measures bucket chain lengths and verifies load factor < 0.75.
