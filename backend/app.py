from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# Enable CORS to allow frontend (browser) to communicate with backend
CORS(app)

# -------------------------------
# Global Data Structures (Simulation State)
# -------------------------------

# Message queue for queue-based IPC
message_queue = []

# Shared memory (simulated using dictionary)
shared_memory = {"data": None}

# Semaphore value (used for synchronization)
semaphore_value = 1

# Buffer for producer-consumer problem
buffer = []

# -------------------------------
# Home Route (Health Check)
# -------------------------------
@app.route("/", methods=["GET"])
def home():
    """
    Basic route to check if backend is running
    """
    return jsonify({
        "project": "IPC Simulator and Visualizer",
        "status": "Backend running successfully"
    })

# -------------------------------
# PIPE SIMULATION (Unidirectional Communication)
# -------------------------------
@app.route("/api/pipe", methods=["POST"])
def pipe_simulation():
    """
    Simulates pipe communication between two processes
    Data flows from Process A to Process B (FIFO)
    """
    data = request.get_json()
    message = data.get("message", "").strip()

    # Validate input
    if not message:
        return jsonify({"status": "error", "message": "Message is required"}), 400

    # Return simulated pipe transmission response
    return jsonify({
        "ipc_type": "Pipe",
        "sender": "Process A",
        "receiver": "Process B",
        "message": message,
        "status": "Message transmitted successfully through pipe",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

# -------------------------------
# MESSAGE QUEUE SIMULATION
# -------------------------------
@app.route("/api/message-queue", methods=["POST"])
def message_queue_simulation():
    """
    Simulates message queue IPC:
    - Messages are stored in a queue
    - FIFO processing
    """
    data = request.get_json()
    message = data.get("message", "").strip()

    # Validate input
    if not message:
        return jsonify({"status": "error", "message": "Message is required"}), 400

    # Store current state before operation
    queue_before = message_queue.copy()

    # Add message to queue
    message_queue.append(message)

    # Process first message (FIFO)
    processed_message = message_queue.pop(0)

    # State after processing
    queue_after = message_queue.copy()

    return jsonify({
        "ipc_type": "Message Queue",
        "queue_before": queue_before,
        "processed_message": processed_message,
        "queue_after": queue_after,
        "status": "Message queued and processed successfully"
    })

# -------------------------------
# SHARED MEMORY SIMULATION
# -------------------------------
@app.route("/api/shared-memory", methods=["POST"])
def shared_memory_simulation():
    """
    Simulates shared memory:
    - Multiple processes access same memory location
    - Risk of overwrite (race condition)
    """
    data = request.get_json()
    value = data.get("data", "").strip()

    # Validate input
    if not value:
        return jsonify({"status": "error", "message": "Data is required"}), 400

    # Read previous value
    memory_before = shared_memory["data"]

    # Write new value
    shared_memory["data"] = value

    # Read updated value
    memory_after = shared_memory["data"]

    return jsonify({
        "ipc_type": "Shared Memory",
        "memory_before": memory_before,
        "memory_after": memory_after,
        "read_value": memory_after,
        "status": "Data written and read successfully from shared memory"
    })

# -------------------------------
# SEMAPHORE SIMULATION (Synchronization)
# -------------------------------
@app.route("/api/semaphore", methods=["POST"])
def semaphore_simulation():
    """
    Simulates semaphore mechanism:
    - Controls access to critical section
    - Implements wait() and signal() operations
    """
    global semaphore_value

    data = request.get_json()
    process_name = data.get("process_name", "").strip()

    # Validate input
    if not process_name:
        return jsonify({"status": "error", "message": "Process name is required"}), 400

    before = semaphore_value

    # If resource available → allow access
    if semaphore_value > 0:
        semaphore_value -= 1  # wait()
        action = f"{process_name} entered critical section (wait)"

        semaphore_value += 1  # signal()
        action += " and exited critical section (signal)"
    else:
        # Resource unavailable → process waits
        action = f"{process_name} is waiting for resource"

    after = semaphore_value

    return jsonify({
        "ipc_type": "Semaphore",
        "process_name": process_name,
        "semaphore_value_before": before,
        "semaphore_value_after": after,
        "action": action,
        "status": "Semaphore operation completed"
    })

# -------------------------------
# PRODUCER-CONSUMER SIMULATION
# -------------------------------
@app.route("/api/producer-consumer", methods=["POST"])
def producer_consumer_simulation():
    """
    Simulates producer-consumer problem:
    - Producer adds item to buffer
    - Consumer removes item from buffer
    """
    data = request.get_json()
    item = data.get("item", "").strip()

    # Validate input
    if not item:
        return jsonify({"status": "error", "message": "Item is required"}), 400

    # Producer adds item
    buffer.append(item)
    produced_item = item

    # Consumer consumes item (FIFO)
    consumed_item = buffer.pop(0)

    return jsonify({
        "ipc_type": "Producer-Consumer",
        "produced_item": produced_item,
        "consumed_item": consumed_item,
        "buffer_state": buffer,
        "status": "Item produced and consumed successfully"
    })

# -------------------------------
# Run Flask App
# -------------------------------
if __name__ == "__main__":
    # Debug mode enabled for development
    app.run(debug=True)