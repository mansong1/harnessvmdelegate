#!/bin/bash -xe

sudo su
yum -y update
sudo yum -y install docker git
sudo systemctl enable docker.service
sudo systemctl start docker.service
sudo usermod -a -G docker ec2-user
docker info

sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
export PATH=$PATH:/usr/local/bin/docker-compose
docker-compose version

mkdir /runner