FROM debian:10.8

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install --yes \
 pulseaudio-utils \
 && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Set up the user
RUN groupadd -g 1000 pi && useradd pi -s /bin/bash -m -u 1000 -g 1000
USER pi

# Pulseaudio device.
# Needs to be mounted like:
# -v "/run/user/1000/pulse:/run/user/1000/pulse"
# Tested on a Raspberry PI OS, where the default
# user is UID=1000 and GID=1000
VOLUME /run/user/1000/pulse

# Pulse config
COPY docker/pulse-client.conf /etc/pulse/client.conf

# run
CMD ["pacat", "-vvvv", "/dev/urandom"]
