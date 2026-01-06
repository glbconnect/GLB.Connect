import dotenv from "dotenv";

dotenv.config();

const HF_MODEL_URL = "https://api-inference.huggingface.co/models/unitary/toxic-bert";
const DEFAULT_THRESHOLD = 0.7;

export async function getToxicityScore(text) {
    const key = process.env.HUGGING_FACE_API_KEY || process.env.HF_API_KEY;
    if (!key) {
        return 0;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
        const res = await fetch(HF_MODEL_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ inputs: text }),
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (!res.ok) {
            return 0;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
            const scores = data.map(x => x.score).filter(s => typeof s === "number");
            if (scores.length > 0) {
                return Math.max(...scores);
            }
        }
        if (Array.isArray(data?.[0])) {
            const flat = data[0].map(x => x.score).filter(s => typeof s === "number");
            if (flat.length > 0) {
                return Math.max(...flat);
            }
        }
        return 0;
    } catch {
        clearTimeout(timeout);
        return 0;
    }
}

export async function isToxic(text, threshold = DEFAULT_THRESHOLD) {
    const score = await getToxicityScore(text);
    return score > threshold;
}

