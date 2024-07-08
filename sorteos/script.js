function chooseWinner() {
    const participantsText = document.getElementById('participants').value;
    const participants = participantsText.split('\n').map(p => p.trim()).filter(p => p);

    if (participants.length === 0) {
        alert('Por favor, ingrese al menos un participante.');
        return;
    }

    const winner = participants[Math.floor(Math.random() * participants.length)];
    document.getElementById('winner').textContent = winner;
}
