// Bar chart of adoptions per day
fetch(`${window.origin}/statistics/per-day`)
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error de la respuesta de la red.');
        }

        return response.json();
    })
    .then((data) => {
        // {# Verify Data intergrity # }
        if (!data || data.status != 'ok' || !Array.isArray(data.data)) {
            throw new Error('Formato de datos inválido.');
        }

        // {# Extract data # }
        const rows = [...data.data].sort((a, b) => a.day.localeCompare(b.day));
        const labels = rows.map(r => r.day);
        const counts = rows.map(r => r.count);

        // {# Canvas context and chart # }
        const ctx = document.getElementById('chart-bar-daily').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Avisos',
                    data: counts,
                    borderColor: '#3e95cd',
                    backgroundColor: 'rgba(62,149,205,0.3)',
                    tension: 0.25,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                scales: {
                    x: { title: { display: true, text: 'Fecha' } },
                    y: { beginAtZero: true, title: { display: true, text: 'Cantidad de avisos' } }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { intersect: false, mode: 'index' }
                }
            }
        });
    })
    .catch((error) => {
        console.error('Error al hacer fetch de datos para gráfico de adopciones por día.', error);
    });

// Pie chart: listings by pet type (cats/dogs)
fetch(`${window.origin}/statistics/per-type`)
    .then((response) => {
        if (!response.ok) throw new Error('Error de la respuesta de la red.');
        return response.json();
    })
    .then((payload) => {
        if (!payload || payload.status !== 'ok' || typeof payload.data !== 'object') {
            throw new Error('Formato de datos inválido.');
        }

        const gatos = Number(payload.data.gato || 0);
        const perros = Number(payload.data.perro || 0);
        const ctx = document.getElementById('chart-pie-types').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Gato', 'Perro'],
                datasets: [
                    {
                        data: [gatos, perros],
                        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 159, 64, 0.6)'],
                        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.4,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const val = context.parsed;
                                const pct = total ? ((val / total) * 100).toFixed(1) : 0;
                                return `${context.label}: ${val} (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    })
    .catch((err) => {
        console.error('Error al cargar gráfico por tipo:', err);
    });

// Double Bar chart: listings by month (cats and dogs)
fetch(`${window.origin}/statistics/per-month`)
    .then((response) => {
        if (!response.ok) throw new Error('Error de la respuesta de la red.');
        return response.json();
    })
    .then((payload) => {
        if (
            !payload || payload.status !== 'ok' || !payload.data ||
            !Array.isArray(payload.data.labels) ||
            !Array.isArray(payload.data.gatos) ||
            !Array.isArray(payload.data.perros)
        ) {
            throw new Error('Formato de datos inválido.');
        }

        const { labels, gatos, perros } = payload.data;
        if (!(labels.length === gatos.length && labels.length === perros.length)) {
            throw new Error('Inconsistencia en la cantidad de puntos.');
        }

        const ctx = document.getElementById('chart-column-per-type').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Gatos',
                        data: gatos,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        categoryPercentage: 0.6,
                        barPercentage: 0.9
                    },
                    {
                        label: 'Perros',
                        data: perros,
                        backgroundColor: 'rgba(255, 159, 64, 0.6)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1,
                        categoryPercentage: 0.6,
                        barPercentage: 0.9
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                scales: {
                    x: {
                        stacked: false,
                        title: { display: true, text: 'Mes' }
                    },
                    y: {
                        beginAtZero: true,
                        stacked: false,
                        title: { display: true, text: 'Cantidad de avisos' },
                        ticks: { precision: 0 }
                    }
                },
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        });
    })
    .catch((err) => {
        console.error('Error al cargar gráfico mensual por tipo:', err);
    });
