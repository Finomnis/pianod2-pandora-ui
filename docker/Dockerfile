ARG pianod2_version="380"
ARG user_id="1000"
ARG group_id="1000"
ARG user_name="pi"
ARG group_name="pi"

###################################
# Build pianod2
FROM debian:10.8 as pianod2
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install --yes \
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
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
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
        --disable-debug \
        --with-libao \
        --with-pandora \
        --with-tls=gnutls \
        --without-libsdl \
        --without-libavdevice \
        --without-filesystem \
        --without-tonegenerator
RUN make

###################################
# Build webui
FROM --platform=$BUILDPLATFORM node:16.7 as webui
COPY . /webui
WORKDIR /webui
RUN npm ci \
    && npm run build \
    && rm -rf node_modules


###################################
# Build final system
FROM debian:10.8
ARG user_id
ARG group_id
ARG user_name
ARG group_name

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install --yes \
    pulseaudio-utils \
    libcurl3-gnutls \
    libavfilter7 \
    libao4 \
    nginx \
    sudo \
    vim \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Pulseaudio device.
# Needs to be mounted like:
# -v "/run/user/1000/pulse:/run/user/1000/pulse"
# Tested on a Raspberry PI OS, where the default
# user is UID=1000 and GID=1000
VOLUME /run/user/${user_id}/pulse

# Pulse config
COPY docker/pulse-client.conf /etc/pulse/client.conf
RUN sed -i s/%USERID%/${user_id}/g /etc/pulse/client.conf

# Install pianod2
COPY --from=pianod2 /pianod2/src/pianod /usr/local/bin/pianod2
RUN mkdir -p /usr/local/share/pianod/html

# Install web ui
COPY --from=webui /webui/build /var/www/html

# Set up the user
RUN groupadd -g ${group_id} ${group_name} && useradd ${user_name} -s /bin/bash -m -u ${user_id} -g ${group_id}
COPY docker/sudoers /etc/sudoers.d/${user_name}
RUN sed -i s/%USERNAME%/${user_name}/g /etc/sudoers.d/${user_name}
USER ${user_name}

# Persist pianod2 config
RUN mkdir -p /home/${user_name}/.config/pianod2
VOLUME /home/${user_name}/.config/pianod2

# Test if pianod2 works, to make sure all dependencies
# are installed correctly
RUN pianod2 -vv

# Expose webui port
EXPOSE 80

# Expose pianod2 websocket port
EXPOSE 4446

# Start nginx and pianod2
CMD sudo service nginx start && pianod2
