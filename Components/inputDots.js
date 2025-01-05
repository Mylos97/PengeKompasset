class InputDots extends HTMLElement {
    connectedCallback() {
        const initialValue = this.getAttribute("value") || "0";
        this.innerHTML = `
            <input type="text" value=${initialValue} class="input-dots">
        `;

        const inputElement = this.querySelector(".input-dots");

        if (initialValue) {
            inputElement.value = new Intl.NumberFormat("de-DE").format(initialValue.replace(/\D/g, ""));
        }

        inputElement.addEventListener("focus", (e) => {
            const inputLength = e.target.value.length;
            e.target.setSelectionRange(inputLength, inputLength);
        });

        inputElement.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            value = new Intl.NumberFormat("de-DE").format(value);
            e.target.value = value;
        });

        inputElement.addEventListener("change", (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            const formattedValue = e.target.value.replace(/\D/g, "");
            const customEvent = new CustomEvent("change", {
                detail: {
                    value: formattedValue,
                }
            });

            this.dispatchEvent(customEvent);
        });

    }
}

customElements.define("input-dots", InputDots);