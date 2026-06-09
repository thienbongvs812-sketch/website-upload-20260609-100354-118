(function () {
    const params = new URLSearchParams(window.location.search);
    const query = (params.get("q") || "").trim();
    const input = document.getElementById("search-input");
    const title = document.getElementById("search-title");
    const subtitle = document.getElementById("search-subtitle");
    const results = document.getElementById("search-results");
    const movies = window.SEARCH_INDEX || [];

    if (input) {
        input.value = query;
    }

    const buildCard = function (movie) {
        const tags = Array.isArray(movie.tags) ? movie.tags.join(" ") : "";
        return [
            '<article class="movie-card" data-title="' + escapeHtml(movie.title) + '" data-year="' + movie.year + '" data-region="' + escapeHtml(movie.region) + '" data-tags="' + escapeHtml(tags) + '">',
            '    <a class="movie-cover" href="' + movie.file + '">',
            '        <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '        <span class="movie-duration">' + escapeHtml(movie.duration) + '</span>',
            '    </a>',
            '    <div class="movie-card-content">',
            '        <a class="movie-card-title" href="' + movie.file + '">' + escapeHtml(movie.title) + '</a>',
            '        <p>' + escapeHtml(movie.oneLine) + '</p>',
            '        <div class="movie-meta">',
            '            <span>' + escapeHtml(movie.category) + '</span>',
            '            <span>' + movie.year + '</span>',
            '        </div>',
            '    </div>',
            '</article>'
        ].join("\n");
    };

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const render = function () {
        if (!results) {
            return;
        }

        const normalized = query.toLowerCase();
        const matched = normalized
            ? movies.filter(function (movie) {
                const haystack = [
                    movie.title,
                    movie.year,
                    movie.region,
                    movie.type,
                    movie.category,
                    Array.isArray(movie.tags) ? movie.tags.join(" ") : "",
                    movie.oneLine
                ].join(" ").toLowerCase();
                return haystack.indexOf(normalized) !== -1;
            })
            : movies.slice(0, 48);

        if (title) {
            title.textContent = query ? "搜索结果：" + query : "热门影片";
        }

        if (subtitle) {
            subtitle.textContent = matched.length ? "已为你匹配相关影片。" : "未找到相关影片。";
        }

        results.innerHTML = matched.slice(0, 120).map(buildCard).join("\n");
    };

    render();
})();
