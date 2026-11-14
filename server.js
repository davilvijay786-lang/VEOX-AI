import express from "express";
import multer from "multer";
import { fal } from "@fal-ai/client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    cb(ok ? null : new Error("Please upload a JPG, PNG or WEBP image."), ok);
  }
});

if (!process.env.FAL_KEY) {
  console.warn("FAL_KEY is missing. Add it as a server environment variable before generating videos.");
} else {
  fal.config({ credentials: process.env.FAL_KEY });
}

app.use(express.static(path.join(__dirname, "public")));
app.get("/api/health", (_req, res) => res.json({ ok: true, providerConfigured: Boolean(process.env.FAL_KEY) }));

app.post("/api/generate", upload.single("image"), async (req, res) => {
  try {
    if (!process.env.FAL_KEY) return res.status(503).json({ error: "Server owner must add the FAL_KEY environment variable first." });
    const { prompt, mode, style, aspect_ratio, resolution, generate_audio } = req.body;
    if (!prompt || prompt.trim().length < 4) return res.status(400).json({ error: "Please enter a more detailed prompt." });
    if (!["text", "photo"].includes(mode)) return res.status(400).json({ error: "Invalid generation mode." });
    if (mode === "photo" && !req.file) return res.status(400).json({ error: "Please upload a photo." });

    const fullPrompt = `${prompt.trim()}. Visual style: ${style || "Realistic"}.`;
    const audio = generate_audio === "true";
    const resChoice = ["720p", "1080p", "4k"].includes(resolution) ? resolution : "720p";
    // Veo 3.1 standard supports 4K; Lite is used for lower-cost 720p/1080p.
    const model = resChoice === "4k" ? "fal-ai/veo3.1" : "fal-ai/veo3.1/lite";
    const input = { prompt: fullPrompt, aspect_ratio: aspect_ratio || "9:16", resolution: resChoice, generate_audio: audio };

    if (mode === "photo") {
      const imageFile = new File([req.file.buffer], req.file.originalname, { type: req.file.mimetype });
      const imageUrl = await fal.storage.upload(imageFile);
      input.image_url = imageUrl;
    }

    const result = await fal.subscribe(
      mode === "photo" ? `${model}/image-to-video` : model,
      { input, logs: false }
    );
    const videoUrl = result?.data?.video?.url;
    if (!videoUrl) return res.status(502).json({ error: "The provider did not return a video URL. Please try again." });
    res.json({ videoUrl, requestId: result.requestId || null });
  } catch (err) {
    console.error("Generation error:", err?.message || err);
    res.status(500).json({ error: "Video generation failed. Check the server logs, provider API key, model settings and account credits." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`VEOX AI running on port ${port}`));
