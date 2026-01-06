Sales Management System
=======================

Quick start — clone and run
---------------------------

Clone the repo and start the app:

```bash
git clone https://github.com/<your-username>/<repo>.git
cd diane
npm install
# import DB (mysqldump file) via:
mysql -u root -p < diane.sql
# or import with phpMyAdmin
# adjust DB credentials in server.js if needed (host/user/password/database)
node server.js
```

Notes:
- The project expects a MySQL database named `diane`. Export your database with `mysqldump` or phpMyAdmin and import it on the target machine.
- Do not commit real credentials. Consider using a `.env` file and `dotenv` for configuration.
