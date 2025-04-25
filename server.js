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

	.back {
	  margin-bottom; 20px;
	  text-decoration: none;
	  color: #4CAF50;
	  font-weight: bold;
	}

	button {
	  padding: 10px 20px;
	  font-size: 16px;
	  background-color: #4CAF50;
	  color: white;
	  border: none;
	  border-radius: 5px;
	  cursor: pointer;
	}
      </style>
      <a class="back" href="/">Back</a>
      <h2>QR Code for ${link}</h2>
      <a href="${qrImage}" download="qr-code.png">
        <img src="${qrImage}" alt="QR Code" />
      </a>
      <br>
      <a href="${qrImage}" download="qr-code.png">
        <button>Download QR Code</button>
      </a>
      `);
   } catch (err) {
     res.send("Error generating QR Code.");
   }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
