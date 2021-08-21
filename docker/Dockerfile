ARG pianod2_version="380"

###################################
# Build pianod2
FROM debian:10.8 as pianod2
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes \
    automake \
    autoconf-archive \
    build-essential \
    pkg-config \
    subversion \
    libcurl4-gnutls-dev \
    libgnutls28-dev \
    zlib1g-dev \
    libavfilter-dev \
    libao-dev \
    curl
ARG pianod2_version
RUN mkdir /pianod2
WORKDIR /pianod2
RUN curl -S -L http://deviousfish.com/Downloads/pianod2/Devel/pianod2-${pianod2_version}.tar.gz \
    | tar --strip-components=1 -xzf -
RUN aclocal \
    && autoheader \
    && automake --add-missing #--force-missing
RUN autoconf \
    && ./configure \
        --with-libao \
        --with-pandora \
        --with-tls=gnutls \
        --without-libsdl \
        --without-libavdevice \
        --without-filesystem \
        --without-tonegenerator
RUN make


###################################
# Build final system
FROM debian:10.8

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install --yes \
    pulseaudio-utils \
    libcurl3-gnutls \
    libavfilter7 \
    libao4 \
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

# Copy externally built steps (ui + pianod2)
COPY --from=pianod2 /pianod2/src/pianod /usr/local/bin/pianod2

# Test if the command works
RUN pianod2 -vv

# run
#CMD ["pacat", "-vvvv", "/dev/urandom"]
