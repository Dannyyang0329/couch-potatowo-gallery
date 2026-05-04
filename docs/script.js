async function loadGallery() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        const carouselWrapper = document.getElementById('carouselWrapper');
        
        // Show the latest 10 papers in the Carousel
        const topN = 10;
        let recentPosts = data.slice(0, topN);
        
        // Hack for Swiper coverflow with few slides: duplicate them so rotation is seamless and infinite
        if (recentPosts.length > 0 && recentPosts.length < 6) {
            let original = [...recentPosts];
            while (recentPosts.length < 6) {
                recentPosts = recentPosts.concat(original);
            }
        }
        
        recentPosts.forEach(post => {
            const numLabel = parseInt(post.id.split('_')[1], 10);
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.onclick = () => window.location.href = post.url;
            
            slide.innerHTML = `
                <div class="card-inner">
                    <div class="post-number">#${numLabel}</div>
                    <img src="${post.cover_image}" alt="${post.cover_title}" loading="lazy">
                    <div class="card-overlay">
                        <div class="card-title">${post.cover_title}</div>
                    </div>
                </div>
            `;
            carouselWrapper.appendChild(slide);
        });

        // Initialize Swiper
        new Swiper(".mySwiper", {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            loopedSlides: recentPosts.length, // helps maintain order when duplicating
            coverflowEffect: {
                rotate: 15,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: true,
            },
            loop: true,
            speed: 800, // smooth transition
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            }
        });

            } catch (e) {
        console.error("Failed to load data.json", e);
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        jumpToPaper();
    }
}

function jumpToPaper() {
    const numStr = document.getElementById('postNumber').value;
    if (!numStr) return;
    
    // allow parsing even if user types "#1" or "1"
    const num = numStr.replace(/[^0-9]/g, '');
    if (!num) return;

    fetch('data.json')
        .then(res => res.json())
        .then(data => {
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
