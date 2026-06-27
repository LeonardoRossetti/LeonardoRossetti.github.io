Contact form
============

The contact form posts to forms/contact.php, which saves each submission to
forms/data/submissions.json.

Requirements
------------
- PHP 7.4+ with the web server configured to run PHP
- The forms/data/ directory must be writable by PHP

GitHub Pages does not run PHP. To use this form, host the site on a server
that supports PHP (shared hosting, VPS, etc.) or deploy only the static
files elsewhere and point the form action to your PHP endpoint.

Security
--------
- forms/data/.htaccess blocks direct browser access to the JSON file on Apache.
- submissions.json is listed in .gitignore so contact messages are not committed.
