# PostgreSQL Volume Backup with Docker and GitHub

This project automates the process of backing up a PostgreSQL Docker volume and pushing it to a GitHub repository. A Docker container is configured to create regular backups of the volume, compress them, and commit and push the backups to your GitHub repository.

## Requirements

- Docker
- GitHub repository (public or private)
- PostgreSQL running in Docker
- Personal Access Token (PAT) for GitHub (for authentication)

## Docker Image Overview

This Docker image:
- Uses Alpine Linux to minimize the size of the container.
- Installs required dependencies: Git, PostgreSQL client, tar, curl, and cron.
- Backs up a PostgreSQL Docker volume by copying its contents into a tarball.
- Commits and pushes the backup to a GitHub repository.
- Uses cron to schedule regular backups.

## Steps

### 1. **Create Dockerfile**

Create the `Dockerfile` in your project directory:

```dockerfile
# Use an Alpine image for minimal size
FROM alpine:latest

# Install required tools
RUN apk add --no-cache git bash postgresql-client tar curl

# Set environment variables (replace with actual values)
ENV VOLUME_NAME=your_postgres_volume
ENV GIT_REPO_URL=https://github.com/yourusername/yourrepo.git
ENV BACKUP_DIR=/backups
ENV GIT_REPO_PATH=/git-repo
ENV GIT_USERNAME=yourusername
ENV GIT_EMAIL=youremail@example.com
ENV GIT_PAT=your_personal_access_token

# Create necessary directories
RUN mkdir -p $BACKUP_DIR $GIT_REPO_PATH

# Clone the GitHub repository
RUN git clone $GIT_REPO_URL $GIT_REPO_PATH

# Copy the backup script
COPY backup_volume.sh /backup_volume.sh
RUN chmod +x /backup_volume.sh

# Set up Git credentials
RUN git config --global user.name "$GIT_USERNAME" && \
    git config --global user.email "$GIT_EMAIL" && \
    git config --global credential.helper store && \
    echo "https://$GIT_USERNAME:$GIT_PAT@github.com" > ~/.git-credentials

# Schedule the backup script to run periodically using cron
RUN echo "0 0 * * * /backup_volume.sh >> /var/log/cron.log 2>&1" > /etc/crontabs/root

# Start cron and keep container running
CMD ["crond", "-f"]
```

### 2. **Create the Backup Script (`backup_volume.sh`)**

Create the backup script that will be used to back up the PostgreSQL Docker volume:

```bash
#!/bin/bash

# Set variables
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
BACKUP_FILE="$BACKUP_DIR/postgres_volume_backup_$TIMESTAMP.tar.gz"

# Create a temporary container to access the volume and back it up
docker run --rm -v $VOLUME_NAME:/var/lib/postgresql/data -v $BACKUP_DIR:/backup alpine \
    tar -czf /backup/postgres_volume_backup_$TIMESTAMP.tar.gz -C /var/lib/postgresql/data .

# Navigate to the GitHub repo directory
cd $GIT_REPO_PATH

# Copy backup to the repository
cp $BACKUP_FILE $GIT_REPO_PATH

# Add, commit, and push to GitHub
git add .
git commit -m "PostgreSQL volume backup on $TIMESTAMP"
git push origin main  # Change branch if needed
```

### 3. **Build the Docker Image**

Build the Docker image using the `Dockerfile`:

```bash
docker build -t postgres-backup .
```

### 4. **Run the Docker Container**

Run the container, mounting the necessary volumes and paths:

```bash
docker run -d \
  --name postgres_backup_container \
  -v your_postgres_volume:/var/lib/postgresql/data \
  -v /path/to/local/backup:/backups \
  postgres-backup
```

Make sure to replace `your_postgres_volume` with your PostgreSQL volume name and `/path/to/local/backup` with the desired location to store backups.

### 5. **Test Backup Script (Optional)**

You can manually trigger the backup script to test the process:

```bash
docker exec -it postgres_backup_container /bin/bash
/backup_volume.sh
```

### 6. **Verify on GitHub**

Check your GitHub repository to verify that the backup files are being committed and pushed. Each backup file will be timestamped (e.g., `postgres_volume_backup_20250304.tar.gz`).

### 7. **Automated Backups via Cron**

The backup script is scheduled to run every day at midnight by cron. You can check cron logs to verify the task is running:

```bash
docker logs postgres_backup_container
```

The log file will be available at `/var/log/cron.log` within the container.

---

## Additional Notes

- **Volume Name**: Make sure that `your_postgres_volume` refers to the correct PostgreSQL Docker volume. You can list your volumes with the command:
  ```bash
  docker volume ls
  ```

- **GitHub Authentication**: Ensure that your GitHub repository is accessible with the configured personal access token (PAT). For private repositories, the PAT must have `repo` permissions.

- **Repository Permissions**: The GitHub repository must be configured correctly to allow pushing changes.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
