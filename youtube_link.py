from pathlib import Path
import whisper
from yt_dlp import YoutubeDL

# ---- Config ----
URL = "https://www.youtube.com/watch?v=j0fj4CqvKS0"
OUT_DIR = Path(r"C:/Users/SyedB/Documents/AI Projects/Transcription Tool")
MODEL_NAME = "small"   # tiny | base | small | medium | large

def download_mp3(url: str, out_dir: Path) -> Path:
    """
    Downloads the YouTube audio as MP3 using yt-dlp and returns the file path.
    """
    out_dir.mkdir(parents=True, exist_ok=True)

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": str(out_dir / "%(title)s.%(ext)s"),
        "postprocessors": [
            {   # convert to mp3 using ffmpeg
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }
        ],
        "quiet": False,
    }

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        filename = Path(ydl.prepare_filename(info)).with_suffix(".mp3")
        return filename

def main():
    print("⬇️  Downloading audio as MP3...")
    mp3_path = download_mp3(URL, OUT_DIR)
    print(f"✅ Saved MP3:\n{mp3_path}")

    print("🧠 Loading Whisper model...")
    model = whisper.load_model(MODEL_NAME)

    print("📝 Transcribing (this can take a while on CPU)...")
    result = model.transcribe(str(mp3_path))

    txt_path = OUT_DIR / (mp3_path.stem + ".txt")
    txt_path.write_text(result["text"], encoding="utf-8")

    print(f"✅ Transcript saved to:\n{txt_path}")
    print("\n--- Transcript Preview ---\n")
    print(result["text"][:2000])

if __name__ == "__main__":
    main()
