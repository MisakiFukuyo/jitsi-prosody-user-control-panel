FROM node:16

## install docker
RUN wget -O /tmp/docker.tgz https://download.docker.com/linux/static/stable/x86_64/docker-20.10.8.tgz
RUN tar -xzf /tmp/docker.tgz -C /tmp
RUN mv /tmp/docker/* /usr/bin/

## grant docker
## replace ### to host docker group id
ENV DOCKER_GROUP_GID ###
RUN groupadd -o -g $DOCKER_GROUP_GID docker
RUN mkdir /ctlpanel
COPY . .
RUN cd /ctlpanel

RUN yarn install

WORKDIR /ctlpanel

CMD [ "node", "index.js" ]
