# Deployment Guide untuk lockinapp.id

## Opsi Deployment

### 1. Vercel (Recommended untuk Next.js)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login ke Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Setup Custom Domain:**
   - Buka dashboard Vercel
   - Pilih project
   - Masuk ke Settings > Domains
   - Tambahkan `lockinapp.id` dan `www.lockinapp.id`
   - Setup DNS records sesuai instruksi Vercel

### 2. Netlify

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login ke Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod --dir=.next
   ```

4. **Setup Custom Domain:**
   - Buka dashboard Netlify
   - Pilih site
   - Masuk ke Domain settings
   - Tambahkan custom domain `lockinapp.id`

### 3. Docker (untuk VPS/Server)

1. **Build Docker image:**
   ```bash
   docker build -t lockin-landingpage .
   ```

2. **Run container:**
   ```bash
   docker run -p 3000:3000 lockin-landingpage
   ```

3. **Setup reverse proxy dengan Nginx:**
   ```nginx
   server {
       listen 80;
       server_name lockinapp.id www.lockinapp.id;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## DNS Configuration

Untuk domain `lockinapp.id`, setup DNS records berikut:

### Vercel:
- A record: `@` → `76.76.19.61`
- CNAME record: `www` → `cname.vercel-dns.com`

### Netlify:
- A record: `@` → `75.2.60.5`
- CNAME record: `www` → `lockin-landingpage.netlify.app`

## Environment Variables

Pastikan setup environment variables berikut di platform hosting:

- `NODE_ENV=production`
- `NEXT_TELEMETRY_DISABLED=1`

## Post-Deployment Checklist

- [ ] Website dapat diakses di lockinapp.id
- [ ] HTTPS certificate aktif
- [ ] Redirect www ke non-www (atau sebaliknya)
- [ ] Test semua halaman dan fitur
- [ ] Check performance dengan Lighthouse
- [ ] Setup monitoring dan analytics
- [ ] Backup konfigurasi

## Troubleshooting

### Build Error:
```bash
npm run build
```

### TypeScript Error:
```bash
npx tsc --noEmit
```

### Performance Check:
```bash
npm run performance:audit
```

