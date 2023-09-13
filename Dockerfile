FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/ci-node-runtime-18

WORKDIR /opt
COPY dist ./package.json ./package-lock.json ./

# Set environment variables for Oracle Instant Client installation
ENV ORACLE_HOME=/usr/lib/oracle/19.6/client64
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ORACLE_HOME/lib
ENV PATH=$PATH:$ORACLE_HOME/bin

# Install required dependencies
RUN dnf update -y && \
    dnf install -y \
        wget \
        libaio && \
    dnf clean all

# Download and Install Oracle Instant Client RPMs
RUN wget https://download.oracle.com/otn_software/linux/instantclient/oracle-instantclient-basic-linuxx64.rpm -P /tmp/
RUN rpm -ivh /tmp/oracle-instantclient-basic-linuxx64.rpm && \
rm -rf /tmp/*.rpm

RUN npm i && chmod +x "/opt/app/app.js"
CMD ["node", "/opt/app/app.js", "--", "18580"]

EXPOSE 18580