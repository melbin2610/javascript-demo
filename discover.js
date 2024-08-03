window.addEventListener('load', function() {
    const HideSidebar = document.getElementById('hideSidebar');
    const showSidebarButton = document.getElementById('ShowSidebar');
    const showCtgButton = document.getElementById('show_ctgDiv');

    function showSidebar() {
        const sidebar = document.querySelector('.menu');
        sidebar.style.display = 'flex';
    }

    showSidebarButton.addEventListener('click', showSidebar);

    function hideSidebar() {
        const sidebar = document.querySelector('.menu');
        sidebar.style.display = 'none';
    }

    HideSidebar.addEventListener('click', hideSidebar);

    let allData = [];
    let currentFilteredData = [];
    const contentdiv = document.querySelector(".right-datas");
    const paginationDiv = document.getElementById('pagination');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('searchButton');

    const itemsPerPage = 5;
    let currentPage = 1;

    function fetchData() {
        fetch("../data/data.json")
        .then(response => response.json())
        .then(responseData => {
            allData = responseData;
            currentFilteredData = allData;
            renderPage(currentFilteredData, currentPage);
            updateCounts();
            updateHeader('all');
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function updateCounts() {
        const categories = [
            { id: "gaming", category: "game" },
            { id: "entertainment", category: "entertainment" },
            { id: "education", category: "education" },
            { id: "science", category: "science" },
            { id: "music", category: "Music" }
        ];

        categories.forEach(({ id, category }) => {
            const count = allData.filter(dataItem => dataItem.category === category).length;
            document.getElementById(id).querySelector(".numbers").textContent = count;
        });

        const allCount = allData.length;
        document.getElementById("all").querySelector(".numbers").textContent = allCount;
    }

    function updateHeader(selectedCategory) {
        let count;
        if (selectedCategory === 'all') {
            count = allData.length;
        } else {
            count = currentFilteredData.length;
        }

        let headerElement = document.getElementById('total-results-header');
        // if (selectedCategory=="a"){

        // }
        headerElement.textContent = ` ${count} Results Found ${selectedCategory=="all"?"": `in ${selectedCategory}`}`;
    
    }

    document.getElementById("all").addEventListener("click", function () {
        currentFilteredData = allData;
        currentPage = 1;
        renderPage(currentFilteredData, currentPage);
        updateHeader('all');
    });

    document.getElementById("music").addEventListener("click", function () {
        currentFilteredData = allData.filter(dataItem => dataItem.category === "Music");
        currentPage = 1;
        renderPage(currentFilteredData, currentPage);
        updateHeader('music');
    });

    document.getElementById("gaming").addEventListener("click", function () {
        currentFilteredData = allData.filter(dataItem => dataItem.category === "game");
        currentPage = 1;
        renderPage(currentFilteredData, currentPage);
        updateHeader('gaming');
    });

    document.getElementById("entertainment").addEventListener("click", function () {
        currentFilteredData = allData.filter(dataItem => dataItem.category === "entertainment");
        currentPage = 1;
        renderPage(currentFilteredData, currentPage);
        updateHeader('entertainment');
    });

    document.getElementById("education").addEventListener("click", function () {
        currentFilteredData = allData.filter(dataItem => dataItem.category === "education");
        currentPage = 1;
        renderPage(currentFilteredData, currentPage);
        updateHeader('education');
    });

    document.getElementById("science").addEventListener("click", function () {
        currentFilteredData = allData.filter(dataItem => dataItem.category === "science");
        currentPage = 1;
        renderPage(currentFilteredData, currentPage);
        updateHeader('science');
    });

    function renderPage(data, page) {
        const start = (page - 1) * itemsPerPage;
        const end = page * itemsPerPage;
        const paginatedData = data.slice(start, end);

        contentdiv.innerHTML = "";
        paginatedData.forEach((dataItem) => {
            const newchild = document.createElement("div");
            newchild.className = "DataContents";
            const innerHTML = `
                <a href="#" class="button">
                    <div class="element">
                        <div class="image"><img src="${dataItem.image}" alt="profile-image"></div>
                        <div class="contents">
                            <div class="head">
                                <span class="icon"><img src="${dataItem.head_icon}" alt="element-icon"></span>
                                <h3>${dataItem.heading}</h3>
                            </div>
                            <div class="info">
                                <p>${dataItem.info}</p>
                            </div>
                            <div class="subcribers">
                                <div class="online">${dataItem.online_count} online</div>
                                <span class="dot"></span>
                                <div class="members">${dataItem.members} members</div>
                            </div>
                            <div class="verified" style="${dataItem.Verify === 'not Verified' ? 'display: none;' : 'flex'}">
                                <span class="icon"><img src="${dataItem.verified_icon}" alt="verified-icon"></span>
                                <span class="text">${dataItem.Verify}</span>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            newchild.innerHTML = innerHTML;
            contentdiv.appendChild(newchild);
        });

        renderPagination(data.length, page);
    }

    function renderPagination(totalItems, currentPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        paginationDiv.innerHTML = "";

        if (totalPages <= 1) return;

        const backButton = document.createElement("button");
        backButton.textContent = "Back";
        backButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentFilteredData, currentPage);
            }
        });
        paginationDiv.appendChild(backButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.className = i === currentPage ? "active" : "";
            pageButton.addEventListener("click", () => {
                currentPage = i;
                renderPage(currentFilteredData, currentPage);
            });
            paginationDiv.appendChild(pageButton);
        }

        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentFilteredData, currentPage);
            }
        });
        paginationDiv.appendChild(nextButton);
    }

    function filterData(data, searchTerm) {
        return data.filter(dataItem => dataItem.heading.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value;
        currentFilteredData = filterData(allData, searchTerm);
        currentPage = 1;
        renderPage(currentFilteredData, currentPage);
        updateHeader(searchTerm, true);
    });

    searchInput.addEventListener('keypress', function(event) {
        if (event.key === "Enter") {
            const searchTerm = searchInput.value;
            currentFilteredData = filterData(allData, searchTerm);
            currentPage = 1;
            renderPage(currentFilteredData, currentPage);
            updateHeader(searchTerm, true);
        }
    });

    fetchData();
});
