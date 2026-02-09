# Ugreen NAS Deployment Guide

This project is configured to be deployed on your Ugreen NAS 4300 Plus using Portainer.

## Prerequisites

1.  **Git Repository**: This code must be hosted on a Git repository (e.g., GitHub).
2.  **Portainer**: Installed and running on your Ugreen NAS (usually at `http://192.168.0.122:9000`).

## Deployment Steps

1.  **Push Code to GitHub**:
    Ensure all your latest changes are pushed to your GitHub repository.

2.  **Open Portainer**:
    Navigate to `http://192.168.0.122:9000` in your browser.

3.  **Create a New Stack**:
    *   Go to **Stacks** > **Add stack**.
    *   Name your stack (e.g., `ugreen-web`).
    *   Select **Repository** as the build method.
    *   **Repository URL**: Enter the URL of your GitHub repository (e.g., `https://github.com/yourusername/advance_unitopms.git`).
    *   **Repository Reference**: `refs/heads/main` (or `master`).
    *   **Compose path**: `docker-compose.yml`.
    *   **Automatic Updates**: Enable this to allow Portainer to poll for changes.
        *   **Fetch interval**: `5m` (or as desired).

4.  **Deploy**:
    Click **Deploy the stack**.

## Automatic Updates

Once set up, any change you push to the `main` branch on GitHub will be automatically detected by Portainer (within the fetch interval), and your application on the NAS will be updated.

## Accessing the App

After deployment, your app should be available at:
`http://192.168.0.122:8080`
