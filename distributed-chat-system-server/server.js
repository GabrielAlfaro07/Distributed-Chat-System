const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const { setTimeout } = require("timers");

// Configuración del servidor
const app = express();
const port = 5174;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta del archivo donde se guardarán los recordatorios
const filePath = "recordatorios.json";

// Función para cargar los recordatorios desde un archivo JSON
function cargarRecordatorios() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data).map((item) => ({
      usuario_id: item.usuario_id,
      fecha_hora: new Date(item.fecha_hora),
      mensaje: item.mensaje,
    }));
  } catch (err) {
    return [];
  }
}

// Función para guardar los recordatorios en un archivo JSON
function guardarRecordatorios(recordatorios) {
  fs.writeFileSync(filePath, JSON.stringify(recordatorios, null, 2));
}

// Función para obtener un anime aleatorio de los mejores animes en MyAnimeList
async function obtenerAnimeBueno() {
  const url = "https://api.jikan.moe/v4/top/anime";

  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const animes = response.data.data;
      if (animes.length > 0) {
        const randomIndex = Math.floor(Math.random() * animes.length);
        const anime = animes[randomIndex];
        const anilistUrl = `https://anilist.co/anime/${anime.mal_id}`;
        return {
          title: anime.title,
          type: anime.type,
          genres: anime.genres.map((g) => g.name).join(", "),
          episodes: anime.episodes,
          synopsis: anime.synopsis || "No hay descripción disponible.",
          anilistUrl,
        };
      }
      return { error: "No se encontraron animes." };
    }
    return {
      error: `Error al obtener datos de la API. Código: ${response.status}`,
    };
  } catch (error) {
    return { error: `Error al hacer la solicitud: ${error.message}` };
  }
}

// Función para obtener el clima
async function obtenerClima(location) {
  const apiKey = "b5476bbc5abee03946cedc2f1fe4e2b8";
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=es`;

  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const data = response.data;
      const clima = data.weather[0].description;
      const temperatura = data.main.temp;
      return `🌦 **${
        clima.charAt(0).toUpperCase() + clima.slice(1)
      }** con una temperatura de **${temperatura}°C**`;
    }
    return "⚠️ No se pudo obtener el clima.";
  } catch (error) {
    return `❌ Error al obtener el clima: ${error.message}`;
  }
}

// Comando para crear un recordatorio con fecha y hora específicas
async function crearRecordatorio(req, res, tipo) {
  const { usuario_id, dia, hora, mensaje, cantidad, unidad } = req.body;

  let fechaHora;
  if (tipo === "especifico") {
    fechaHora = new Date(`${dia}T${hora}:00`);

    // Verificar si la fecha y hora son futuras
    if (fechaHora <= new Date()) {
      return res
        .status(400)
        .json({ error: "La fecha y hora deben ser en el futuro." });
    }
  } else if (tipo === "relativo") {
    // Calcular la fecha/hora en función de la unidad y cantidad
    if (unidad === "minutos") {
      fechaHora = new Date(Date.now() + cantidad * 60000);
    } else if (unidad === "horas") {
      fechaHora = new Date(Date.now() + cantidad * 3600000);
    } else if (unidad === "días") {
      fechaHora = new Date(Date.now() + cantidad * 86400000);
    } else {
      return res.status(400).json({ error: "Unidad de tiempo no válida." });
    }
  }

  let recordatorios = cargarRecordatorios();
  recordatorios.push({ usuario_id, fecha_hora: fechaHora, mensaje });
  guardarRecordatorios(recordatorios);

  // Configurar un temporizador
  const delay = fechaHora - new Date();
  setTimeout(() => {
    res.send(`⏰ ¡Recordatorio! ${mensaje}`);
  }, delay);

  res.status(200).json({ message: "Recordatorio creado correctamente." });
}

// Ruta para mostrar ayuda de los comandos
app.post("/helpme", (req, res) => {
  const ayuda = `
      <strong>Bot Commands</strong><br>
      <br>
      1. <strong>!ranime</strong> - Recommends a top anime.<br>
         Example: <code>!ranime</code> - Replies with a random anime.<br>
      2. <strong>!clima</strong> - Shows the weather for a city.<br>
         Example: <code>!clima San José</code> - Shows the weather in San José.<br>
      3. <strong>!helpme</strong> - Shows this help.<br>
         Example: <code>!helpme</code> - Shows available commands and examples.<br>
      4. <strong>!crear-recordatorio</strong> - Creates a reminder at a specific date/time.<br>
         Example: <code>!crear-recordatorio</code> - Sets a reminder for a specific day/time.<br>
      5. <strong>!crear-recordatorio-relativo</strong> - Creates a reminder for a relative time (minutes, hours, days).<br>
         Example: <code>!crear-recordatorio-relativo</code> - Sets a reminder for a relative time.<br>
    `;
  res.status(200).json({ reply: ayuda.replace(/\n/g, "<br>") });
});

// Comando para obtener un anime aleatorio
app.post("/receive-message", async (req, res) => {
  const { message } = req.body;

  // Comando "!ranime" para obtener un anime aleatorio
  if (message === "!ranime") {
    const anime = await obtenerAnimeBueno();

    if (anime.error) {
      res.status(200).json({ reply: anime.error });
    } else {
      res.status(200).json({
        reply:
          `🌸 <strong>${anime.title}</strong><br> 🌸` +
          `🎞️ <strong>Format:</strong> ${anime.type}<br>` +
          `🎭 <strong>Genres:</strong> ${anime.genres}<br>` +
          `🎬 <strong>Episodes:</strong> ${anime.episodes}<br>` +
          `📖 <strong>Synopsis:</strong> ${anime.synopsis}<br>` +
          `🔗 <a href="${anime.anilistUrl}">Watch on AniList</a>`,
      });
    }
  }
  // Comando "!clima" para obtener el clima de una ciudad
  else if (message.startsWith("!clima")) {
    const location = message.replace("!clima ", "");
    const clima = await obtenerClima(location);
    res.status(200).json({ reply: clima.replace(/\n/g, "<br>") });
  }
  // Comando "!helpme" para mostrar los comandos disponibles con ejemplos
  else if (message === "!helpme") {
    const ayuda = `
      <strong>Bot Commands</strong><br>
      <br>
      1. <strong>!ranime</strong> - Recommends a top anime.<br>
         Example: <code>!ranime</code> - Replies with a random anime.<br>
      2. <strong>!clima</strong> - Shows the weather for a city.<br>
         Example: <code>!clima San José</code> - Shows the weather in San José.<br>
      3. <strong>!helpme</strong> - Shows this help.<br>
         Example: <code>!helpme</code> - Shows available commands and examples.<br>
      4. <strong>!crear-recordatorio</strong> - Creates a reminder at a specific date/time.<br>
         Example: <code>!crear-recordatorio</code> - Sets a reminder for a specific day/time.<br>
      5. <strong>!crear-recordatorio-relativo</strong> - Creates a reminder for a relative time (minutes, hours, days).<br>
         Example: <code>!crear-recordatorio-relativo</code> - Sets a reminder for a relative time.<br>
    `;
    res.status(200).json({ reply: ayuda.replace(/\n/g, "<br>") });
  }
  // Comando "!crear-recordatorio" para crear un recordatorio
  else if (message.startsWith("!crear-recordatorio")) {
    const params = message.split(" ");
    if (params.length === 4) {
      // Llamar a la función para crear un recordatorio específico
      await crearRecordatorio(req, res, "especifico");
    } else {
      res.status(200).json({
        reply:
          "Incorrect command format. Use <strong>!crear-recordatorio</strong> with the necessary parameters.",
      });
    }
  }
  // Comando "!crear-recordatorio-relativo" para crear un recordatorio relativo
  else if (message.startsWith("!crear-recordatorio-relativo")) {
    const params = message.split(" ");
    if (params.length === 4) {
      // Llamar a la función para crear un recordatorio relativo
      await crearRecordatorio(req, res, "relativo");
    } else {
      res.status(200).json({
        reply:
          "Incorrect command format. Use <strong>!crear-recordatorio-relativo</strong> with the necessary parameters.",
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
