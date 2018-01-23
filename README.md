# fengyi-table

Setting up Mongodb:
in terminal:
mkdir data
echo 'mongod --bind\_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
chmod a+x mongod
./mongod

FROM https://community.c9.io/t/setting-up-mongodb/1717
You Know how to set up mongod and install it
