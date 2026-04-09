const { GoogleGenAI } = require("@google/genai");
const { marked } = require("marked");

module.exports.renderForm = (req, res) => {
  res.render("itinerary/create.ejs", { itinerary: null, place: "", days: "" });
};

module.exports.generateItinerary = async (req, res) => {
  const { place, days } = req.body;

  if (!place || !days) {
    req.flash("error", "Please provide both place and number of days");
    return res.redirect("/itinerary");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `Create a detailed ${days}-day travel itinerary for ${place}, including sightseeing, food recommendations, local tips, and cultural experiences.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const itinerary = marked.parse(response.text);

    res.render("itinerary/create.ejs", { itinerary, place, days });

  } catch (err) {
    console.error("Gemini API Error:", err.message);
    req.flash("error", "Failed to generate itinerary. Please try again later.");
    res.redirect("/itinerary");
  }
};
