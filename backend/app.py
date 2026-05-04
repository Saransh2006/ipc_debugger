from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

message_queue = []
shared_memory = {"data": None}
semaphore_value = 1
buffer = []

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "project": "IPC Simulator and Visualizer",
        "status": "Backend running successfully"
    })

@app.route("/api/pipe", methods=["POST"])
def pipe_simulation():
    data = request.get_json()
    message = data.get("message", "").strip()

    if not message:
        return jsonify({"status": "error", "message": "Message is required"}), 400

    return jsonify({
        "ipc_type": "Pipe",
        "sender": "Process A",
        "receiver": "Process B",
        "message": message,
        "status": "Message transmitted successfully through pipe",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

@app.route("/api/message-queue", methods=["POST"])
def message_queue_simulation():
    data = request.get_json()
    message = data.get("message", "").strip()

    if not message:
        return jsonify({"status": "error", "message": "Message is required"}), 400

    queue_before = message_queue.copy()
    message_queue.append(message)
    processed_message = message_queue.pop(0)
    queue_after = message_queue.copy()

    return jsonify({
        "ipc_type": "Message Queue",
        "queue_before": queue_before,
        "processed_message": processed_message,
        "queue_after": queue_after,
        "status": "Message queued and processed successfully"
    })

@app.route("/api/shared-memory", methods=["POST"])
def shared_memory_simulation():
    data = request.get_json()
    value = data.get("data", "").strip()

    if not value:
        return jsonify({"status": "error", "message": "Data is required"}), 400

    memory_before = shared_memory["data"]
    shared_memory["data"] = value
    memory_after = shared_memory["data"]

    return jsonify({
        "ipc_type": "Shared Memory",
        "memory_before": memory_before,
        "memory_after": memory_after,
        "read_value": memory_after,
        "status": "Data written and read successfully from shared memory"
    })

@app.route("/api/semaphore", methods=["POST"])
def semaphore_simulation():
    global semaphore_value

    data = request.get_json()
    process_name = data.get("process_name", "").strip()

    if not process_name:
        return jsonify({"status": "error", "message": "Process name is required"}), 400

    before = semaphore_value

    if semaphore_value > 0:
        semaphore_value -= 1
        action = f"{process_name} entered critical section (wait)"
        semaphore_value += 1
        action += " and exited critical section (signal)"
    else:
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

@app.route("/api/producer-consumer", methods=["POST"])
def producer_consumer_simulation():
    data = request.get_json()
    item = data.get("item", "").strip()

    if not item:
        return jsonify({"status": "error", "message": "Item is required"}), 400

    buffer.append(item)
    produced_item = item
    consumed_item = buffer.pop(0)

    return jsonify({
        "ipc_type": "Producer-Consumer",
        "produced_item": produced_item,
        "consumed_item": consumed_item,
        "buffer_state": buffer,
        "status": "Item produced and consumed successfully"
    })

if __name__ == "__main__":
    app.run(debug=True)