# 🔧 IPC Debugger & Visualizer

A web-based tool to **simulate, visualize, and debug Inter-Process Communication (IPC)** mechanisms including **Pipes, Message Queues, and Shared Memory**.

This project helps developers and students understand how processes communicate and identify issues such as **deadlocks, synchronization problems, and data conflicts**.

---

## 🚀 Project Overview

Inter-Process Communication (IPC) is a fundamental concept in Operating Systems that allows multiple processes to exchange data. Debugging IPC can be complex due to synchronization issues and hidden bottlenecks.

This project provides a **visual and interactive simulation environment** where users can:

* Simulate IPC mechanisms
* Observe real-time data flow between processes
* Analyze system behavior through logs and animations

---

## ✨ Features

* 🎯 Simulation of IPC mechanisms:

  * Pipes (FIFO communication)
  * Message Queues (buffered messaging)
  * Shared Memory (common data space)

* 📊 Real-time visualization:

  * Processes represented as nodes
  * Data transfer shown via animated channels
  * Color-coded states:

    * 🟢 Running
    * 🟡 Waiting
    * 🔴 Error / Conflict

* 🧠 Debugging insights:

  * Detect potential deadlocks
  * Identify bottlenecks (slow processes)
  * Highlight synchronization issues

* 📜 Terminal-style logs:

  * Message sending & receiving
  * Process states
  * API responses

---

## 🏗️ Project Structure

```
IPC_DEBUGGER/
│
├── backend/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── README.md
```

---

## ⚙️ Technologies Used

### Backend

* Python (Flask)
* Flask-CORS

### Frontend

* HTML5
* CSS3 (Custom styling)
* JavaScript (Vanilla JS)

### Communication

* REST API (HTTP requests)

---

## 🔁 How It Works

1. User selects an IPC mechanism (Pipe / Message Queue / Shared Memory)
2. Inputs data via the UI
3. Frontend sends request to Flask backend
4. Backend simulates IPC behavior
5. Response is returned and displayed in:

   * Terminal logs
   * Visual animation

---

## 🧪 IPC Mechanisms Explained

### 🔹 Pipe

* Unidirectional communication
* Data flows from Process A → Process B
* Follows FIFO (First In First Out)

### 🔹 Message Queue

* Messages stored in queue
* Supports asynchronous communication
* Ensures ordered delivery

### 🔹 Shared Memory

* Common memory space accessed by multiple processes
* Fast communication
* Risk of race conditions

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/yourusername/ipc-debugger.git
cd ipc-debugger
```

### 2. Setup Backend

```
cd backend
pip install -r requirements.txt
python app.py
```

### 3. Run Frontend

Option 1:

* Open `frontend/index.html` directly in browser

Option 2 (recommended):

```
cd frontend
python -m http.server 5500
```

Then open:

```
http://localhost:5500
```

---

## 🌐 API Endpoints

| Endpoint             | Description                  |
| -------------------- | ---------------------------- |
| `/api/pipe`          | Simulates pipe communication |
| `/api/message-queue` | Simulates message queue      |
| `/api/shared-memory` | Simulates shared memory      |
| `/api/semaphore`     | Simulates semaphore          |

---

## ⚠️ Limitations

* This is a **simulation**, not real OS-level IPC
* Supports limited number of processes
* Deadlock detection is simplified

---

## 🔮 Future Improvements

* Add real-time WebSocket updates
* Implement advanced deadlock detection algorithms
* Support multiple concurrent processes
* Add performance analytics dashboard
* Convert into desktop app

---

## 👨‍💻 Author

**Saransh Mangal**

---

## 📌 Conclusion

This project simplifies complex IPC concepts through **visualization and simulation**, making it easier to understand communication between processes and identify potential issues in system design.

---

⭐ If you found this project useful, consider giving it a star!
