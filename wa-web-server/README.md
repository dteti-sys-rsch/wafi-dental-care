# README

# Docker Deployment

1. Build

```
docker build -t wafi-dental-care-wa:latest .
```

2. Run

```
sudo docker run --name wdc-wa -d -p 5001:5001 --env-file .env --network wdc wafi-dental-care-wa
```
