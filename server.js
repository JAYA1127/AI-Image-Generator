/*
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());  // ✅ Very important

const REPLICATE_API_TOKEN = "r8_e5VsRJ2Y3bMo0hH1lqE58WKexiLFwoZ0qQLcM"; // ✅ replace with new working one
const REPLICATE_MODEL_VERSION = "a9758cbf82f6e00e7d28db2dfbc5f8b6ad90fe65c9fdc51b0a3a2e3ed12d3d96"; // SD 1.5
                                
app.post("/generate-image", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
  console.log("❌ No prompt received in request body");
  return res.status(400).json({ error: "Prompt missing from request body" });
}

  console.log("🔹 Prompt received:", prompt);

  try {
    const triggerResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: REPLICATE_MODEL_VERSION,
        input: { prompt }
      }),
    });

    const triggerData = await triggerResponse.json();
            // ✅ After triggerData = await triggerResponse.json();
    if (!triggerResponse.ok) {
        console.log("❌ Replicate API error:", await triggerResponse.text());
        return res.status(500).json({ error: "Replicate API error" });
    }

    console.log("📤 Trigger response:", triggerData);

    if (!triggerResponse.ok || !triggerData.id) {
      console.log("❌ Trigger failed");
      return res.status(500).json({ error: "Trigger failed", details: triggerData });
    }

    const predictionId = triggerData.id;
    let imageUrl = "";

    while (!imageUrl) {
      console.log("⏳ Polling prediction:", predictionId);
      await new Promise(resolve => setTimeout(resolve, 2000));

      const poll = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` },
      });

      const pollData = await poll.json();

    if (!poll.ok) {
    console.log("❌ Polling error:", await poll.text());
    return res.status(500).json({ error: "Polling failed" });
    }

     // const pollData = await poll.json();
      //console.log("📊 Poll response:", pollData.status);

      if (pollData.status === "succeeded") {
        imageUrl = pollData.output[0];
        console.log("✅ Image URL:", imageUrl);
        return res.json({ imageUrl });
      } else if (pollData.status === "failed") {
        console.log("❌ Polling failed:", pollData);
        return res.status(500).json({ error: "Prediction failed", details: pollData });
      }
    }

  } catch (err) {
    console.error("❗ Server error:", err);
    res.status(500).json({ error: "Internal error", details: err.message });
  }
});


*/
