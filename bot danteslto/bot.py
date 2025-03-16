import os
import requests
import asyncio
from twitchio.ext import commands
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

TWITCH_CLIENT_ID = os.getenv("TWITCH_CLIENT_ID")
TWITCH_CLIENT_SECRET = os.getenv("TWITCH_CLIENT_SECRET")
BOT_USERNAME = os.getenv("BOT_USERNAME")
TWITCH_CHANNEL = os.getenv("TWITCH_CHANNEL")
KICK_CHANNELS = os.getenv("KICK_CHANNELS").split(",")

TWITCH_API_URL = "https://api.twitch.tv/helix/streams"
KICK_API_URL = "https://kick.com/api/v2/channels/"

class TwitchKickBot(commands.Bot):
    def __init__(self):
        super().__init__(token=None, prefix="!", initial_channels=[TWITCH_CHANNEL])
        self.twitch_access_token = None
        self.live_channels = set()

    async def event_ready(self):
        print(f"Bot conectado como {self.nick}")
        await self.refresh_twitch_token()
        asyncio.create_task(self.check_streams())

    async def refresh_twitch_token(self):
        """Obtiene un nuevo token de acceso para la API de Twitch."""
        url = "https://id.twitch.tv/oauth2/token"
        params = {
            "client_id": TWITCH_CLIENT_ID,
            "client_secret": TWITCH_CLIENT_SECRET,
            "grant_type": "client_credentials",
        }
        response = requests.post(url, params=params).json()
        self.twitch_access_token = response.get("access_token")
        print("Token de Twitch actualizado.")

    async def check_twitch_stream(self, streamer):
        """Verifica si un canal de Twitch está en vivo."""
        headers = {
            "Client-ID": TWITCH_CLIENT_ID,
            "Authorization": f"Bearer {self.twitch_access_token}",
        }
        params = {"user_login": streamer}
        response = requests.get(TWITCH_API_URL, headers=headers, params=params).json()
        
        if response.get("data"):
            return True
        return False

    async def check_kick_stream(self, streamer):
        """Verifica si un canal de Kick está en vivo."""
        response = requests.get(f"{KICK_API_URL}{streamer.strip()}").json()
        return response.get("livestream") is not None

    async def check_streams(self):
        """Verifica el estado de los streamers y notifica en el chat."""
        while True:
            twitch_live = await self.check_twitch_stream(TWITCH_CHANNEL)
            kick_live = {s: await self.check_kick_stream(s) for s in KICK_CHANNELS}

            for streamer, live in kick_live.items():
                if live and streamer not in self.live_channels:
                    await self.send_message(f"@{BOT_USERNAME} prendio {streamer} en Kick")
                    self.live_channels.add(streamer)

            if twitch_live and TWITCH_CHANNEL not in self.live_channels:
                await self.send_message(f"@{BOT_USERNAME} prendio {TWITCH_CHANNEL} en Twitch")
                self.live_channels.add(TWITCH_CHANNEL)

            # Eliminar canales que ya no están en vivo
            self.live_channels = {s for s in self.live_channels if s in kick_live and kick_live[s] or s == TWITCH_CHANNEL and twitch_live}

            await asyncio.sleep(30)  # Verificar cada 30 segundos

    async def send_message(self, message):
        """Envía un mensaje al chat de Twitch."""
        channel = self.get_channel(TWITCH_CHANNEL)
        if channel:
            await channel.send(message)
        print(f"Mensaje enviado: {message}")

bot = TwitchKickBot()
bot.run()
