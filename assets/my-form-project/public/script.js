document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const responseMessage = document.getElementById('responseMessage');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/.netlify/functions/submitForm', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.text();
                responseMessage.innerHTML = `<p style="color: green;">${result}</p>`;
                form.reset(); // Optional: clear the form fields after submission
            } else {
                responseMessage.innerHTML = `<p style="color: red;">Error submitting form.</p>`;
            }
        } catch (error) {
            responseMessage.innerHTML = `<p style="color: red;">Error submitting form: ${error.message}</p>`;
        }
    });
});
