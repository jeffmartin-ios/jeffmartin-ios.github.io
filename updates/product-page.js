/* Shared render logic for per-product update pages at /updates/{tag}/ */
(async function () {
    var PRODUCT_NAMES = {
        'camerashelf':      'Camera Shelf',
        'camerapouch':      'Camera Pouch',
        'simulatedfilm':    'Simulated Film',
        'spent-today':      'Spent Today',
        'inventory':        'My Inventory Stack',
        'habit-habit':      'Habit Habit',
        'pattern-projects': 'Pattern Projects',
        'recipe-mini':      'Recipe Mini',
        'vocab-bento':      'Vocab Bento',
    };

    function formatDate(dateStr) {
        var d = new Date(dateStr + 'T12:00:00');
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function renderPosts(posts) {
        var container = document.getElementById('posts-container');
        var empty     = document.getElementById('posts-empty');
        container.innerHTML = '';
        if (posts.length === 0) {
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';
        posts.forEach(function (post) {
            var tagHTML = post.tags.map(function (t) {
                return '<span class="post-tag">' + (PRODUCT_NAMES[t] || t) + '</span>';
            }).join('');
            var card = document.createElement('a');
            card.href = '../post.html?slug=' + encodeURIComponent(post.slug);
            card.className = 'post-card card-style';
            card.innerHTML =
                '<div class="post-card-inner">' +
                    '<div>' +
                        '<div class="post-card-meta">' +
                            '<span class="post-date">' + formatDate(post.date) + '</span>' +
                            (tagHTML ? '<div class="post-tags">' + tagHTML + '</div>' : '') +
                        '</div>' +
                        '<h2 class="post-card-title">' + post.title + '</h2>' +
                        '<p class="post-card-excerpt">' + post.excerpt + '</p>' +
                    '</div>' +
                    '<span class="post-read-more">Read more \u2192</span>' +
                '</div>';
            container.appendChild(card);
        });
    }

    var allPosts = [];
    try {
        var res = await fetch('../posts.json');
        allPosts = await res.json();
    } catch (e) {
        document.getElementById('posts-empty').style.display = 'block';
        return;
    }

    var tag      = window.UPDATES_FILTER_TAG || '';
    var filtered = tag ? allPosts.filter(function (p) { return p.tags.includes(tag); }) : allPosts;
    renderPosts(filtered);
})();
