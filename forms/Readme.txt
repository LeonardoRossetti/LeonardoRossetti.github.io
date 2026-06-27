Contact form
============

GitHub Pages and local development (localhost)
----------------------------------------------
GitHub Pages and local static servers cannot run PHP. In those environments the
form uses FormSubmit (assets/js/contact-form.js) to deliver messages to
leoo.rossetti@gmail.com.

The first submission triggers a confirmation email from FormSubmit — click the
link in that email to activate the form.

PHP hosting
-----------
To save submissions to forms/data/submissions.json instead, host the site on a
PHP server and add data-backend="php" to the contact form element in index.html.
Ensure forms/data/ is writable by the web server.

Security
--------
- forms/data/.htaccess blocks direct browser access to the JSON file on Apache.
- submissions.json is listed in .gitignore so contact messages are not committed.
