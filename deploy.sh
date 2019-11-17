#!/bin/sh

SERVER="peuh_adminSSH@peuh.ftp.infomaniak.com:ethernal/"


scp -r frontend/* $SERVER

echo "✅ DONE"
