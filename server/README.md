# BidChain – Server Setup

This repo contains the **BidChain** NFT auction platform for SENG 513 (Group 30).

---

## 2. Install Dependencies

From the project root:

```bash
cd server
npm install

cd ../client
npm install

cd ..
```

## 3. Start Docker


```bash
docker compose up -d db
```

## 4. Apply migratations

```bash
npx prisma migrate dev --name init
npm run db:migrate:apply
npm run db:setup
```

### To confirm use prisma studio

```bash
npx prisma studio
```
