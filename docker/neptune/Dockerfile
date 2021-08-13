# our base image
FROM amazonlinux:2

# specify the port number the container should expose
EXPOSE 8182

WORKDIR /root/

ENTRYPOINT ["/opt/gremlin-server/conf/entrypoint.sh"]

# Update YUM packages
RUN yum update -y
RUN yum install wget unzip java-1.8.0-openjdk net-tools procps-ng -y
RUN yum install initscripts -y

# Install Gremlin
RUN cd \
    && wget https://archive.apache.org/dist/tinkerpop/3.5.0/apache-tinkerpop-gremlin-server-3.5.0-bin.zip \
    && unzip apache-tinkerpop-gremlin-server-3.5.0-bin.zip \
    && rm apache-tinkerpop-gremlin-server-3.5.0-bin.zip
RUN mv /root/apache-tinkerpop-gremlin-server-3.5.0 /opt/gremlin-server
#RUN /opt/gremlin-server/bin/gremlin-server.sh install
RUN rm -rf /opt/gremlin-server/conf
COPY environment/development/neptune/config /opt/gremlin-server/conf

STOPSIGNAL SIGINT

