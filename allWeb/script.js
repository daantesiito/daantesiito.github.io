document.getElementById('searchButton').addEventListener('click', function() {
    const searchQuery = document.getElementById('searchInput').value;
    
    if (!searchQuery) {
        alert('Por favor, ingresa un nombre de componente.');
        return;
    }
    
    fetchPrices(searchQuery);
});

async function fetchPrices(query) {
    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('resultsTable').style.display = 'none';
    
    try {
        // Simulando una solicitud al servidor (scraping o API).
        const response = await fetch('/fetchPrices', { // Debe ser ajustado para conectarse con el backend.
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error al buscar precios:', error);
    } finally {
        document.getElementById('loadingMessage').style.display = 'none';
    }
}

function displayResults(results) {
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';

    results.forEach(result => {
        const row = document.createElement('tr');

        const storeCell = document.createElement('td');
        storeCell.textContent = result.store;
        row.appendChild(storeCell);

        const productCell = document.createElement('td');
        productCell.textContent = result.product;
        row.appendChild(productCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = `$${result.price}`;
        row.appendChild(priceCell);

        const linkCell = document.createElement('td');
        const link = document.createElement('a');
        link.href = result.link;
        link.textContent = 'Ver';
        link.target = '_blank';
        linkCell.appendChild(link);
        row.appendChild(linkCell);

        resultsBody.appendChild(row);
    });

    document.getElementById('resultsTable').style.display = 'table';
}
