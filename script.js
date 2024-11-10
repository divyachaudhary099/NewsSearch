const apiKey = '54de5fd7efa64d1b90dd11b0420985fc';

const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

async function fetchRandomNews() {
    try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${apiKey}`;
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        return data.articles || []; 
    } catch (error) {
        console.error("Error fetching random news", error);
        return [];
    }
}

// Fetch news based on search query
async function fetchNewsQuery(query) {
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apiKey=${apiKey}`;
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        return data.articles || [];
    } catch (error) {
        console.error("Error fetching news by query", error);
        return [];
    }
}

function displayBlogs(articles) {
    if (!articles || !Array.isArray(articles)) {
        console.error("Invalid articles data:", articles);
        return;
    }
    
    blogContainer.innerHTML = "";
    articles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        const img = document.createElement("img");
        img.src = article.urlToImage || 'placeholder-image-url.jpg'; // Add placeholder image if urlToImage is missing
        img.alt = article.title || 'No title available';

        const title = document.createElement("h2");
        const truncatedTitle = article.title && article.title.length > 40 ? article.title.slice(0, 40) + "..." : article.title;
        title.textContent = truncatedTitle || "No title available";

        const description = document.createElement("p");
        const truncatedDes = article.description && article.description.length > 100 ? article.description.slice(0, 100) + "..." : article.description;
        description.textContent = truncatedDes || "No description available";
        
        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);
        blogContainer.appendChild(blogCard);

        blogCard.addEventListener('click', () => {
            if (article.url) {
                window.open(article.url, "_blank");
            }
        });
    });
}

searchButton.addEventListener("click", async () => {
    const query = searchField.value.trim();
    if (query !== "") {
        try {
            const articles = await fetchNewsQuery(query);
            displayBlogs(articles);
        } catch (error) {
            console.log("Error fetching news by query", error);
        }
    }
});

(async () => {
    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch (error) {
        console.error("Error fetching random news", error);
    }
})();
