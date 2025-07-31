# Dockerized MySQL + Node.js/Express Setup for NTLP Conference

This guide provides step-by-step commands and instructions to set up a Node.js/Express backend with a MySQL database using Docker, tailored for your NTLP Conference project. The web server and database server are both at `172.27.0.9`.

---

## 1. Create Project Directories and Files

```sh
# On your web server (172.27.0.9):
mkdir -p ~/ntlp/backend/src
cd ~/ntlp/backend
npm init -y
npm install express mysql2 cors body-parser

# Create main backend files
cd ~/ntlp/backend
cat > src/index.js <<'EOF'
// ... (your Express server code here, see below for template)
EOF

touch Dockerfile
cd ~/ntlp
cat > docker-compose.yml <<'EOF'
# ... (see below for template)
EOF
```

---

## 2. Example Express Server Code (`src/index.js`)

```js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const pool = mysql.createPool({
  host: '172.27.0.9',
  user: 'ntlp_user',
  password: 'secure_password_here',
  database: 'ntlp_conference_2025',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors());
app.use(bodyParser.json());

// Example route
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ status: 'ok', db: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log('Backend server running on port 5000');
});
```

---

## 3. Dockerfile for Backend

```Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "src/index.js"]
```

---

## 4. Docker Compose File (`docker-compose.yml`)

```yaml
version: "3"
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: ntlp_conference_2025
      MYSQL_USER: ntlp_user
      MYSQL_PASSWORD: secure_password_here
    ports:
      - "3306:3306"
      DB_USER: ntlp_user
```sh
# On your Linux web server (172.27.0.9):
mkdir -p ~/ntlp/backend/src
cd ~/ntlp/backend
npm init -y
npm install express mysql2 cors body-parser

# Create main backend file (multi-line, use heredoc)
cat <<'EOF' > src/index.js
      - mysql
    networks:

# Create Dockerfile (single-line, will fill in later)
touch Dockerfile

# Create docker-compose.yml (multi-line, use heredoc)
cd ~/ntlp
cat <<'EOF' > docker-compose.yml
      - ntlpnet

```
volumes:
  mysqldata:

networks:
  ntlpnet:
    driver: bridge
    ipam:
      config:
        - subnet: 172.27.0.0/24
```

---

## 5. Start the Services

```sh
cd ~/ntlp
# Build and start containers
docker-compose up -d
```

---

## 6. Import Your MySQL Schema

```sh
# Copy your schema file to the server, e.g. as MYSQL_SETUP.sql
# Then run:
docker exec -i $(docker-compose ps -q mysql) mysql -u ntlp_user -psecure_password_here ntlp_conference_2025 < MYSQL_SETUP.sql
```

---

## 7. Next.js App (Frontend)

- Run your Next.js app as usual on the web server:

```sh
cd ~/ntlp
npm install
npm run dev
```

- Connect to MySQL using the same credentials as above in your `.env.local`.

---

## Notes
- All commands are to be run on the web server (172.27.0.9).
- Adjust usernames, passwords, and database names as per your `MYSQL_SETUP.md`.
- If you want to run Next.js in Docker, add a service for it in `docker-compose.yml`.

---

**This guide provides a full workflow for setting up a Dockerized MySQL and Node.js backend for your NTLP Conference project.**
