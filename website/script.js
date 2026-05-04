
async function loadGallery() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const grid = document.getElementById('galleryGrid');
        
        data.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card';
            card.onclick = () => window.location.href = post.url;
            
            card.innerHTML = `
                <img src="${post.cover_image}" alt="${post.cover_title}" loading="lazy">
                <div class="card-title">${post.cover_title}</div>
            `;
            grid.appendChild(card);
        });
    } catch (e) {
        console.error("Failed to load data.json", e);
    }
}

function jumpToPaper() {
    const num = document.getElementById('postNumber').value;
    if (!num) return;
    
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            // ID format is post_00000X, so we pad the number
            const targetId = 'post_' + num.padStart(6, '0');
            const post = data.find(p => p.id === targetId);
            if (post) {
                window.location.href = post.url;
            } else {
                alert('找不到編號 ' + num + ' 的論文 🥔');
            }
        })
        .catch(err => alert('發生錯誤，請稍後再試'));
}

window.onload = loadGallery;
