FROM mysql

EXPOSE 3306

ADD ./my.cnf /etc/mysql/conf.d/my.cnf
COPY ./init.sql /docker-entrypoint-initdb.d/

CMD ["mysqld"]