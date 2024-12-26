class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="header d-flex">
                <ul>
                    <li><a href="#" data-page="Loan/index.html">Home</a></li>
                    <li><a href="#" data-page="Investment/index.html">About</a></li>
                </ul>
                <img src="Misc/settings.svg" id="settings-icon" class="color-text-color cursor-pointer" />
            </nav>
        `;

        this.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const page = link.getAttribute('data-page');
                loadPage(page);
            });
        });
    }
}

function loadPage(page) {
    const contentArea = document.getElementById('content');
    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not load ${page}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            contentArea.innerHTML = data;
            const scripts = contentArea.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                if (script.src) {
                    newScript.src = script.src;
                    newScript.async = false;
                }
                document.body.appendChild(newScript);
                script.remove();
            });
        })
        .catch(error => {
            contentArea.innerHTML = `<p>Error loading page: ${error.message}</p>`;
        });
}


customElements.define('nav-bar', NavBar);

document.addEventListener('DOMContentLoaded', () => {
    loadPage('Loan/index.html');
});
