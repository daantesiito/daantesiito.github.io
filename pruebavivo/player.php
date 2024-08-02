<?php
$id = $_GET['id'] ?? '';

$streams = [
    'DAZN_LA_LIGA' => 'https://live.ll.ww.aiv-cdn.net/OTTB/dub-nitro/live/clients/dash/enc/wjgklbtvhh/out/v1/659736a1e24c40e4865a80ffd75e7de7/cenc.mpd',
    'FORMULA_1' => 'https://example.com/formula1.m3u8',
    // Agrega más transmisiones según sea necesario
];

$streamUrl = $streams[$id] ?? '';

if ($streamUrl == '') {
    die('Transmisión no encontrada.');
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reproductor de Transmisiones</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Reproductor de Transmisiones</h1>
    </header>
    <main>
        <section id="player-section">
            <div id="player"></div>
        </section>
    </main>
    <script src="https://cdn.jsdelivr.net/npm/clappr@latest/dist/clappr.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const player = new Clappr.Player({
                source: '<?php echo $streamUrl; ?>',
                parentId: '#player',
                width: '100%',
                height: '100%',
                mimeType: '<?php echo strpos($streamUrl, '.mpd') !== false ? 'application/dash+xml' : 'application/x-mpegURL'; ?>'
            });
        });
    </script>
</body>
</html>
