from flask import Flask, request, jsonify, send_file
import os
import subprocess

app = Flask(__name__)
MEDIA_FOLDER = "media"
os.makedirs(MEDIA_FOLDER, exist_ok=True)

@app.route("/api/upload", methods=["POST"])
def upload_file():
    file = request.files["file"]
    file_path = os.path.join(MEDIA_FOLDER, file.filename)
    file.save(file_path)
    return jsonify({"message": "File uploaded successfully", "filename": file.filename})

@app.route("/api/crop", methods=["POST"])
def crop_media():
    data = request.json
    filename = data["filename"]
    start = data["start"]
    duration = data["duration"]

    input_path = os.path.join(MEDIA_FOLDER, filename)
    output_path = os.path.join(MEDIA_FOLDER, f"cropped_{filename}")

    command = ["ffmpeg", "-i", input_path, "-ss", start, "-t", str(duration), "-c", "copy", output_path]
    subprocess.run(command, capture_output=True, text=True)

    return jsonify({"message": "Cropping complete", "filename": f"cropped_{filename}"})

@app.route("/api/adjust_volume", methods=["POST"])
def adjust_volume():
    data = request.json
    filename = data["filename"]
    volume = data["volume"]

    input_path = os.path.join(MEDIA_FOLDER, filename)
    output_path = os.path.join(MEDIA_FOLDER, f"volume_adjusted_{filename}")

    command = ["ffmpeg", "-i", input_path, "-filter:a", f"volume={volume}", output_path]
    subprocess.run(command, capture_output=True, text=True)

    return jsonify({"message": "Volume adjustment complete", "filename": f"volume_adjusted_{filename}"})

@app.route("/api/download/<filename>", methods=["GET"])
def get_file(filename):
    filepath = os.path.join(MEDIA_FOLDER, filename)
    if os.path.exists(filepath):
        return send_file(filepath, as_attachment=True)
    return jsonify({"error": "File not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
