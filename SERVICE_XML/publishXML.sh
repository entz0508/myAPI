#!/bin/sh

# QA 서버
################## SINGAPORE ################
#rsync -avz --delete --progress /data/www/ bluedora@54.169.243.65:/data/www/


################## TOKYO #####################
rsync -avz --delete --progress /data/www/SERVICE_XML/ bluedora@10.140.0.3:/data/www/SERVICE_XML/

