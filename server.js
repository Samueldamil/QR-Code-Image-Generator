import express from "express";
import QRCode from "qrcode";
import path, {dirname} from "path";
import {fileURLToPath} from "url";

const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/generate', async (req, res) => {
  const link = req.body.link;
  
  if (!link) return res.send("No URL provided.");

  try {
    const qrImage = await QRCode.toDataURL(link);
	
    res.send(`
      <style>
        body {
	  margin: 0;
	  height: 100vh;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  font-family: Arail, sans-serif;
	  background-color: #f4f4f4;
	  flex-direction: column;
	  text-align: center;
	}

	a {
	  margin-bottom; 20px;
	  text-decoration: none;
	  color: #4CAF50;
	  font-weight: bold;
	}
      </style>
      <a href="/">Back</a>
      <h2>QR Code for ${link}</h2>
      <img src="${qrImage}" alt="QR Code" />
      </div>
      `);
   } catch (err) {
     res.send("Error generating QR Code.");
   }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
