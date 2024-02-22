ARG IMAGE_VERSION="latest"
FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/ci-node-runtime-20:${IMAGE_VERSION} 

WORKDIR /opt
COPY /app .
COPY docker_start.sh .

# Set environment variables for Oracle Instant Client installation
ENV ORACLE_HOME=/usr/lib/oracle/19.6/client64
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ORACLE_HOME/lib
ENV PATH=$PATH:$ORACLE_HOME/bin

# Install any required dependencies
RUN dnf update -y && \
    dnf install -y \
        wget \
        libaio && \
    dnf clean all

# Including Oracle Instant Client RPMs
RUN wget https://download.oracle.com/otn_software/linux/instantclient/oracle-instantclient-basic-linuxx64.rpm -P /tmp/
RUN rpm -ivh /tmp/oracle-instantclient-basic-linuxx64.rpm && \
rm -rf /tmp/*.rpm

CMD ["./docker_start.sh"]