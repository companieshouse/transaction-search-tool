FROM 169942020521.dkr.ecr.eu-west-2.amazonaws.com/base/node:14-alpine-builder

FROM 169942020521.dkr.ecr.eu-west-2.amazonaws.com/base/node:14-alpine-runtime

CMD ["/app/dist/app/app.js", "--", "18580"]

EXPOSE 18580