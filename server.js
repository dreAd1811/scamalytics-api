const express = require('express');
const axios = require('axios');
const path = require('path');
const { JSDOM } = require('jsdom');
const app = express();
const port = 3000;

// Fraud SCORE API :)

app.get('/scrape/:text', async (req, res) => {
  try {
    const text = req.params.text; // Extract the text parameter from the URL
    const url = `https://scamalytics.com/search?ip=${text}`;

    // Function to scrape the website and extract the text of the score div
    async function scrapeWebsite(url) {
      try {
        const response = await axios.get(url);

        if (response.status === 200) {
          const { document } = new JSDOM(response.data).window;
          const scoreDiv = document.querySelector('.score');
          const scoreText = scoreDiv ? scoreDiv.textContent.trim() : 'Score not found';
          return scoreText;
        } else {
          return 'Failed to retrieve the webpage. Status code: ' + response.status;
        }
      } catch (error) {
        return 'Error: ' + error.message;
      }
    }

    // Scrape the website and send a JSON response
    const data = await scrapeWebsite(url);
    res.json({ score: data });
  } catch (error) {
    res.status(500).json({ error: 'Error scraping website' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
