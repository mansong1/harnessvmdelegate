#!/bin/bash -xe

# Install Docker
sudo su
yum -y update
sudo yum -y install docker
sudo systemctl enable docker.service
sudo systemctl start docker.service
sudo usermod -a -G docker ec2-user
docker info

# Install Docker Compose
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
export PATH=$PATH:/usr/local/bin/docker-compose
docker-compose version

# Run the Docker Compose command
cd /runner
docker-compose -f docker-compose.yml up -d