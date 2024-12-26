class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="header d-flex">
                <ul>
                    <li><a href="#" data-page="Pages/Loan/index.html">Lån</a></li>
                    <li><a href="#" data-page="Pages/Investment/index.html">Investering</a></li>
                </ul>
                <img src="Misc/settings.svg" id="settings-icon" class="color-text-color cursor-pointer" />
            </nav>
        `;

        this.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const page = link.getAttribute('data-page');
                loadPage(page);
                this.highlightActiveLink(page);
            });
        });
    }

    highlightActiveLink(activePage) {
        this.querySelectorAll('a').forEach(link => {
            if (link.getAttribute('data-page') === activePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
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
    loadPage('Pages/Loan/index.html');
    const navBar = document.querySelector('nav-bar');
    navBar.highlightActiveLink('Pages/Loan/index.html');
});
