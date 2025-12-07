# README

# Docker Deployment

1. Build

```
docker build -t wafi-dental-care-be:latest .
```

2. Run

```
docker run --name wdc-backend -d -p 5000:5000 --network wdc --env-file .env wafi-dental-care-be
```
