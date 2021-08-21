FROM debian:11

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install --yes \
 pulseaudio-utils \
 && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Set up the user
RUN groupadd -g 1000 pi && useradd pi -s /bin/bash -m -u 1000 -g 1000
USER pi

# Pulse config
COPY pulse-client.conf /etc/pulse/client.conf

# Volume
VOLUME /run/user/1000/pulse

# run
CMD ["pacat", "-vvvv", "/dev/urandom"]
