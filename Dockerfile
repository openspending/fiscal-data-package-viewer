FROM node:7-alpine

ENV OS_VIEWER_BASE_PATH=viewer/

ADD . /app/
RUN apk add --update git
RUN cd /app && npm install && npm run build
ADD docker/settings.json /app/settings.json

EXPOSE 8000

CMD API_URL="${OS_EXTERNAL_ADDRESS}" cd /app && npm start
